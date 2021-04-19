const mapBoxAPI_KEY = 'pk.eyJ1IjoiaGlyYWRhYmJhc2kiLCJhIjoiY2ttbWJjNzJqMDh3aDJ3bzQ4eXp6cWJjZCJ9.PB8mTgztoMbR3VCzuKUYfQ';
const mapBoxBaseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const winnipegTransitAPI_KEY = '&api-key=ZPFv2Zx6ny1KrlPKnfe';
const winnipegTransitBaseURL = 'https://api.winnipegtransit.com/v3/trip-planner.json?';
const orginForm = document.querySelector('.origin-form');
const destinationForm = document.querySelector('.destination-form');
const originUL = document.querySelector('.origins');
const destinationUL = document.querySelector('.destinations');

let address = '';
let allPOI = '';
let destinationLocationLAT = '';
let destinationLocationLNG = '';
let originLocationLAT = '';
let originLocationLNG = '';


orginForm.onsubmit = function(e) {
	e.preventDefault();
	testone(orginForm.querySelector('input').value, 'origin');
}

destinationForm.onsubmit = function(e) {
	e.preventDefault();
	testone(destinationForm.querySelector('input').value, 'destination');
}

async function testone(location, container) {
	const response = await fetch(`${mapBoxBaseURL}${location}.json?access_token=${mapBoxAPI_KEY}&limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275`);
	const JSON = await response.json();

	if(container === "origin") {
		originUL.textContent = '';
	} else if(container === "destination") {
		destinationUL.textContent = '';
	}	
	
	JSON.features.forEach(element => {
		let address = element.properties.address;
		if(element.properties.address === undefined) {
			address = element.context[1].text;
		}

		if(container === "origin") {
			originUL.insertAdjacentHTML('beforeend', `
				<li data-long="${element.center[0]}" data-lat="${element.center[1]}">
					<div class="name">${element.text}</div>
					<div>${address}</div>
				</li>
			`);
		} else if(container === "destination") {
				destinationUL.insertAdjacentHTML('beforeend', `
					<li data-long="${element.center[0]}" data-lat="${element.center[1]}">
						<div class="name">${element.text}</div>
						<div>${address}</div>
					</li>
				`);
			}
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
	console.log(JSON['query-time']);
	console.log(JSON.plans);	
}
