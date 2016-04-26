// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express    = require('express');		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser'); 	// get body-parser
var morgan     = require('morgan'); 		// used to see requests
var mongoose   = require('./app/mongoose');
var config 	   = require('./config');
var path 	   = require('path');
var passport         = require( 'passport' );
var GoogleStrategy   = require( 'passport-google-oauth2' ).Strategy;
var User        	 = require('./app/models/user');
var request    = require('request');

// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console 
app.use(morgan('dev'));

// connect to the database (locally hosted for now - details in config.js file)

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

//-------------------------------------------------------------------------------
//  Ask passport to get the end user's calender information
//-------------------------------------------------------------------------------
var GOOGLE_CLIENT_ID      = "926065482898-jd0js7uv8id54fgsro4qht1os8udbjra.apps.googleusercontent.com"
	, GOOGLE_CLIENT_SECRET  = "-jflG2_7rG27B-1dAHT4W2Ul"
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});
passport.use(new GoogleStrategy({
		clientID:     GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: "/api/oauth",
		passReqToCallback   : true
	},
	function(request, accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			return done(null, profile);
		});
	}
));
app.use( passport.initialize());

app.post('/auth/google/req', passport.authenticate('google', {session: true, scope: [
	'https://www.googleapis.com/auth/plus.login',
	'https://www.googleapis.com/auth/calendar']
}));

// EVENTBRITE  ROUTES (Not needed I think) ------------------------
// app.get('/api/eventbrite', apiController.getEventBright);
// app.post('/api/eventbrite', apiController.postEventBright);
/*
*/
// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Server live on port ' + config.port);