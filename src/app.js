const mapBoxAPI_KEY = '?access_token= pk.eyJ1Ijoiam9obmF0aGFubml6aW9sIiwiYSI6ImNqcG5oZjR0cDAzMnEzeHBrZGUyYmF2aGcifQ.7vAuGZ0z6CY0kXYDkcaOBg';
const mapBoxBaseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const winnipegTransitAPI_KEY = '&api-key=ZPFv2Zx6ny1KrlPKnfe';
const winnipegTransitBaseURL = 'https://api.winnipegtransit.com/v3/trip-planner.json?';

							
async function addTrailers() {
	const response = await fetch(`${moviedbBaseURL}movie/${user.imbdId}/videos?api_key=${moviedbAPI_KEY}&type="trailer"&language=en-US`);
	const JSON = await response.json();
}

async function addTrailers() {
	const response = await fetch(`${moviedbBaseURL}movie/${user.imbdId}/videos?api_key=${moviedbAPI_KEY}&type="trailer"&language=en-US`);
	const JSON = await response.json();
}


`${winnipegTransitBaseURL}origin=geo/49.8795,-97.1444${winnipegTransitAPI_KEY}&destination=geo/49.8196,-97.203907`;
`${mapBoxAPI_KEY}CIneplex.json${mapBoxAPI_KEY}&limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275`;


// `${mapBoxBaseURL}River.json${mapBoxAPI_KEY}&limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275`;
// `${mapBoxBaseURL}CIneplex.json${mapBoxAPI_KEY}&limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275`;