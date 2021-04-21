const mapBoxAPI_KEY = 'pk.eyJ1IjoiaGlyYWRhYmJhc2kiLCJhIjoiY2ttbWJjNzJqMDh3aDJ3bzQ4eXp6cWJjZCJ9.PB8mTgztoMbR3VCzuKUYfQ';
const mapBoxBaseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const winnipegTransitAPI_KEY = '&api-key=ZPFv2Zx6ny1KrlPKnfe';
const winnipegTransitBaseURL = 'https://api.winnipegtransit.com/v3/trip-planner.json?';
const bbox = 'bbox=-97.325875,49.766204,-96.953987,49.99275';

const originForm = document.querySelector('.origin-form');
const destinationForm = document.querySelector('.destination-form');
const originUL = document.querySelector('.origins');
const destinationUL = document.querySelector('.destinations');
const tripContainer = document.querySelector('.my-trip');

let destinationLocation = [];
let originLocation = [];
let address;
let allLocations;
let sortedPlans;
let shortestDuration;

async function searchForMatchingLocations(location, container) {
  const response = await fetch(`${mapBoxBaseURL}${location}.json?access_token=${mapBoxAPI_KEY}&limit=10&${bbox}`);
  const JSON = await response.json();

  JSON.features.forEach(features => {
    address = (features.properties.address === undefined ? address = features.context[1].text : features.properties.address);
    document.querySelector(`.${container}`).insertAdjacentHTML('beforeend', `
      <li data-long="${features.center[0]}" data-lat="${features.center[1]}">
        <div class="name">${features.text}</div>
        <div>${address}</div>
      </li>
    `);
  });
}

async function planTripDirections() {
  const response = await fetch(`${winnipegTransitBaseURL}origin=geo/${originLocation[0]},${originLocation[1]}${winnipegTransitAPI_KEY}&destination=geo/${destinationLocation[0]},${destinationLocation[1]}`);
  const JSON = await response.json();
  sortedPlans = JSON.plans.filter(value => value.times.end === JSON.plans[0].times.end);
  shortestDuration = sortedPlans.reduce((prev, current) => (prev.times.durations.total < current.times.durations.total) ? prev : current);

  tripContainer.insertAdjacentHTML('beforeend', `
    <li><span class="material-icons">exit_to_app</span> Depart at ${timeFormatted(new Date(shortestDuration.times.start))}</li>
  `);

  shortestDuration.segments.forEach(segment => {
    if (segment.type === 'walk') {
      if (segment.to === undefined || segment.to.destination !== undefined) {
        tripContainer.insertAdjacentHTML('beforeend', `
          <li><span class="material-icons">directions_walk</span>Walk for ${segment.times.durations.total} minutes to your destination, arriving at ${timeFormatted(new Date(segment.times.end))}</li>
        `);
      } else {
        tripContainer.insertAdjacentHTML('beforeend', `
          <li><span class="material-icons">directions_walk</span>Walk for ${segment.times.durations.total} minutes to stop #${segment.to.stop.key} - ${segment.to.stop.name}</li>
        `);
      }
    } else if (segment.type === 'ride') {
      let typeOfBus;

      if (segment.route['badge-label'] === "B") {
        typeOfBus = "BLUE";
      } else {
        typeOfBus = segment.route.name;
      }

      tripContainer.insertAdjacentHTML('beforeend', `
        <li><span class="material-icons">directions_bus</span>Ride the ${typeOfBus} for ${segment.times.durations.total} minutes.</li>
      `);
    } else if (segment.type === 'transfer') {
      tripContainer.insertAdjacentHTML('beforeend', `
        <li><span class="material-icons">transfer_within_a_station</span>Transfer from stop #${segment.from.stop.key} - ${segment.from.stop.name} to stop #${segment.to.stop.key} - ${segment.to.stop.name}</li>
      `);
    }
  });
}

function timeFormatted(originalFormat) {
  return originalFormat.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function cleanDOM(container) {
  allLocations = document.querySelectorAll(`.${container} li`);
  allLocations.forEach(location => {
    location.classList.remove('selected');
  });
}

originForm.onsubmit = function(e) {
  e.preventDefault();
  originUL.textContent = '';
  searchForMatchingLocations(originForm.querySelector('input').value, 'origins');
}

destinationForm.onsubmit = function(e) {
  e.preventDefault();
  destinationUL.textContent = '';
  searchForMatchingLocations(destinationForm.querySelector('input').value, 'destinations');
}

document.querySelector('.plan-trip').onclick = function() {
  if (originLocation.length > 0 && destinationLocation.length > 0) {
    tripContainer.textContent = '';
    planTripDirections();
  }
}

originUL.onclick = function(e) {
  const originItem = e.target.closest('.origins li');
  cleanDOM('origins');
  originItem.classList.toggle('selected');
  originLocation = [originItem.dataset.lat, originItem.dataset.long];
}

destinationUL.onclick = function(e) {
  const destinationItem = e.target.closest('.destinations li');
  cleanDOM('destinations');
  destinationItem.classList.toggle('selected');
  destinationLocation = [destinationItem.dataset.lat, destinationItem.dataset.long];
}