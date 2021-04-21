const mapBoxAPI_KEY = 'pk.eyJ1IjoiaGlyYWRhYmJhc2kiLCJhIjoiY2ttbWJjNzJqMDh3aDJ3bzQ4eXp6cWJjZCJ9.PB8mTgztoMbR3VCzuKUYfQ';
const mapBoxBaseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const winnipegTransitAPI_KEY = '&api-key=ZPFv2Zx6ny1KrlPKnfe';
const winnipegTransitBaseURL = 'https://api.winnipegtransit.com/v3/trip-planner.json?';
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
let testArr = [];

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
		
	const resultOne = JSON.plans.sort(function(a,b){
		return new Date(a.times.end) - new Date(b.times.end);
	});
	
	let filtered = resultOne.filter(doesItOccurMultipleTimes)
	
	function doesItOccurMultipleTimes(value) {
		if(value.times.end === resultOne[0].times.end){
			return value;
		}
	}
	
	let shortestDuration = filtered.reduce((prev, current) => (prev.times.end < current.times.end) ? prev : current);
	console.log(shortestDuration.segments);

	shortestDuration.segments.forEach(element => {
		myTripContainer.insertAdjacentHTML('afterbegin', `
			<li><span class="material-icons">exit_to_app</span> Depart at ${shortestDuration}</li>
		`);
		
		if(element.type === 'walk') {
			myTripContainer.insertAdjacentHTML('afterbegin', `
				<li><span class="material-icons">directions_walk</span> Walk for ${element.times.durations.total} minutes to stop #${element.to.stop.key} - ${element.to.stop.name}</li>
			`);
		} else if (element.type === 'ride'){
			myTripContainer.insertAdjacentHTML('afterbegin', `
				<li><span class="material-icons">exit_to_app</span> Depart at 9:55:00 AM.</li>
			`);
		}	
		// } else if (element.type === 'transfer'){ 
		// 	myTripContainer.insertAdjacentHTML('afterbegin', `
		// 		<li><span class="material-icons">exit_to_app</span> Depart at 9:55:00 AM.</li>
		// 	`)	
		// }
	});
}


{/* <li><span class="material-icons">directions_walk</span>Walk for 6 minutes to stop #50577 - Northbound St Mary's at Avalon</li>
<li><span class="material-icons">directions_bus</span>Ride the Route 14 Ellice-St. Mary's for 23 minutes.</li>
<li><span class="material-icons">transfer_within_a_station</span>Transfer from stop #10643 - Northbound Fort at Graham to stop #10611 - Eastbound Graham at Fort (Wpg Square)</li>
<li><span class="material-icons">directions_bus</span>Ride the Route 16 Selkirk-Osborne for 16 minutes.</li>
<li><span class="material-icons">transfer_within_a_station</span>Transfer from stop #30296 - Westbound Selkirk at Arlington to stop #30295 - Northbound Arlington at Selkirk</li>
<li><span class="material-icons">directions_bus</span>Ride the Route 71 Arlington for 13 minutes.</li>
<li><span class="material-icons">directions_walk</span>Walk for 3 minutes to your destination, arriving at 11:00:00 AM</li> */}


// exit_to_app
// directions_walk
// directions_bus
// transfer_within_a_station