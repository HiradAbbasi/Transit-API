const mapBoxAPI_KEY = 'pk.eyJ1IjoiaGlyYWRhYmJhc2kiLCJhIjoiY2ttbWJjNzJqMDh3aDJ3bzQ4eXp6cWJjZCJ9.PB8mTgztoMbR3VCzuKUYfQ';
const mapBoxBaseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const winnipegTransitAPI_KEY = '&api-key=ZPFv2Zx6ny1KrlPKnfe';
const winnipegTransitBaseURL = 'https://api.winnipegtransit.com/v3/trip-planner.json?';
const orginForm = document.querySelector('.origin-form');
const destinationForm = document.querySelector('.destination-form');
const originContainer = document.querySelector('.origin-container');
const destinationContainer = document.querySelector('.destination-container');

orginForm.onsubmit = function(e) {
	e.preventDefault();
	testone(orginForm.querySelector('input').value, origin);
}

destinationForm.onsubmit = function(e) {
	e.preventDefault();
	testone(destinationForm.querySelector('input').value, destination);
}

async function testone(location, container) {
	const response = await fetch(`${mapBoxBaseURL}${location}.json?access_token=${mapBoxAPI_KEY}&limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275`);
	const JSON = await response.json();
	JSON.features.forEach(element => {
		console.log(element);
	});
}

// async function testtwo() {
// 	const response = await fetch(`${winnipegTransitBaseURL}origin=geo/49.8795,-97.1444${winnipegTransitAPI_KEY}&destination=geo/49.8196,-97.203907`);
// 	const JSON = await response.json();
// 	console.log(JSON);
// }
// testtwo();


// `${winnipegTransitBaseURL}origin=geo/49.8795,-97.1444${winnipegTransitAPI_KEY}&destination=geo/49.8196,-97.203907`;
// `${mapBoxAPI_KEY}CIneplex.json${mapBoxAPI_KEY}&limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275`;

// `${mapBoxBaseURL}River.json${mapBoxAPI_KEY}&limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275`;
// `${mapBoxBaseURL}CIneplex.json${mapBoxAPI_KEY}&limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275`;