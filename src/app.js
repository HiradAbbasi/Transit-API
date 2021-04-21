const mapBoxAPI_KEY = 'pk.eyJ1IjoiaGlyYWRhYmJhc2kiLCJhIjoiY2ttbWJjNzJqMDh3aDJ3bzQ4eXp6cWJjZCJ9.PB8mTgztoMbR3VCzuKUYfQ';
const mapBoxBaseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const winnipegTransitAPI_KEY = '&api-key=ZPFv2Zx6ny1KrlPKnfe';
const winnipegTransitBaseURL = 'https://api.winnipegtransit.com/v3/trip-planner.json?';
const bbox = 'bbox=-97.325875,49.766204,-96.953987,49.99275';

const orginForm = document.querySelector('.origin-form');
const destinationForm = document.querySelector('.destination-form');
const originUL = document.querySelector('.origins');
const destinationUL = document.querySelector('.destinations');
const myTripContainer = document.querySelector('.my-trip');

let address = '';
let allPOI = '';
let destinationLocationLAT = '';
let destinationLocationLNG = '';
let originLocationLAT = '';
let originLocationLNG = '';

orginForm.onsubmit = function(e) {
  e.preventDefault();
  originUL.textContent = '';
  searchForMatchingLocations(orginForm.querySelector('input').value, 'origins');
}

destinationForm.onsubmit = function(e) {
  e.preventDefault();
  destinationUL.textContent = '';
  searchForMatchingLocations(destinationForm.querySelector('input').value, 'destinations');
}

async function searchForMatchingLocations(location, container) {
  const response = await fetch(`${mapBoxBaseURL}${location}.json?access_token=${mapBoxAPI_KEY}&limit=10&${bbox}`);
  const JSON = await response.json();

  JSON.features.forEach(element => {
    address = (element.properties.address === undefined ? address = element.context[1].text : element.properties.address);

    document.querySelector(`.${container}`).insertAdjacentHTML('beforeend', `
      <li data-long="${element.center[0]}" data-lat="${element.center[1]}">
        <div class="name">${element.text}</div>
        <div>${address}</div>
      </li>
    `);
  });
}

originUL.onclick = function(e) {
  const originItem = e.target.closest('.origins li');

  allPOI = document.querySelectorAll('.origins li');
  allPOI.forEach(element => {
    element.classList.remove('selected');
  });

  originItem.classList.toggle('selected');
  originLocationLAT = originItem.dataset.lat;
  originLocationLNG = originItem.dataset.long;
}

destinationUL.onclick = function(e) {
  const destinationItem = e.target.closest('.destinations li');

  allPOI = document.querySelectorAll('.destinations li');
  allPOI.forEach(element => {
    element.classList.remove('selected');
  });

  destinationItem.classList.toggle('selected');
  destinationLocationLAT = destinationItem.dataset.lat;
  destinationLocationLNG = destinationItem.dataset.long;
}

document.querySelector('.plan-trip').onclick = function(e) {
  //Add a method that checks to see if the long and lat actualy have values
  testtwo();
}

async function testtwo() {
  const response = await fetch(`${winnipegTransitBaseURL}origin=geo/${originLocationLAT},${originLocationLNG}${winnipegTransitAPI_KEY}&destination=geo/${destinationLocationLAT},${destinationLocationLNG}`);
  const JSON = await response.json();

  const resultOne = JSON.plans.sort(function(a, b) {
    return new Date(a.times.end) - new Date(b.times.end);
  });

  let filtered = resultOne.filter(doesItOccurMultipleTimes)

  function doesItOccurMultipleTimes(value) {
    if (value.times.end === resultOne[0].times.end) {
      return value;
    }
  }

  let shortestDuration = filtered.reduce((prev, current) => (prev.times.end < current.times.end) ? prev : current);
  myTripContainer.insertAdjacentHTML('beforeend', `
    <li><span class="material-icons">exit_to_app</span> Depart at ${(new Date(shortestDuration.segments[0].times.start).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: true, second:'2-digit'})).replace(/^(?:00:)?0?/, '')}</li>
  `);

  shortestDuration.segments.forEach(element => {
    if (element.type === 'walk') {
      if (element.to === undefined || element.to.destination !== undefined) {
        myTripContainer.insertAdjacentHTML('beforeend', `
          <li><span class="material-icons">directions_walk</span>Walk for ${element.times.durations.total} minutes to your destination, arriving at ${(new Date(element.times.end).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: true, second:'2-digit'})).replace(/^(?:00:)?0?/, '')}</li>
        `);
      } else {
        myTripContainer.insertAdjacentHTML('beforeend', `
          <li><span class="material-icons">directions_walk</span>Walk for ${element.times.durations.total} minutes to stop #${element.to.stop.key} - ${element.to.stop.name}</li>
        `);
      }
    } else if (element.type === 'ride') {
      let name;
      if (element.route['badge-label'] === "B") {
        name = "BLUE";
      } else {
        name = element.route.name;
      }
      myTripContainer.insertAdjacentHTML('beforeend', `
        <li><span class="material-icons">directions_bus</span>Ride the ${name} for ${element.times.durations.total} minutes.</li>
      `);
    } else if (element.type === 'transfer') {
      myTripContainer.insertAdjacentHTML('beforeend', `
        <li><span class="material-icons">transfer_within_a_station</span>Transfer from stop #${element.from.stop.key} - ${element.from.stop.name} to stop #${element.to.stop.key} - ${element.to.stop.name}</li>
      `);
    }
  });
}