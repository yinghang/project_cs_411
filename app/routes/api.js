var User       = require('../models/user');
var Event      = require('../models/event');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var mongodb    = require('mongodb').MongoClient;
var request    = require('request');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {
		console.log(req.body.username);

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({ 
	      	success: false, 
	      	message: 'Authentication failed. User not found.' 
	  		});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({ 
	        	success: false, 
	        	message: 'Authentication failed. Wrong password.' 
	    		});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      
	      if (err)
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      else
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;    
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	return res.status(403).send({ 
   	 		success: false, 
   	 		message: 'No token provided.' 
   	 	});
	    
	  }

	  next(); // make sure we go to the next routes and don't stop here
	});

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {
			User.find(function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

    // api endpoint to get user information
    apiRouter.get('/me', function(req, res) {
	    res.send(req.decoded);
    });

    // eventbrite GET endpoint to get events - ** FOR TESTING PURPOSES ONLY ** - ** NOT INTENDED FOR DEPLOYMENT USE **
    /*
    apiRouter.get('/eventbrite', function(req, res, next){
        request = require('request');

        var query = {
            'location.address': 'Boston',
            'sort_by':'best',
            'token': config.eventbrite_key
        };

        request.get({ url: 'https://www.eventbriteapi.com/v3/events/search', qs: query }, function(err, request, body) {
            
            if (request.statusCode === 403) {
                return next(new Error('BAD API CALL'));
            }

            var obj = JSON.parse(body);

            res.send(obj);

            //res.render('/eventbrite', {
            //    my_title: 'Event Bright API',
            //    events: ret.events
            //});

        });
    });
    */

    // eventbrite POST endpoint to get events
    apiRouter.post('/eventbrite', function(req, res) {
    	// req.assert('name', 'Name cannot be blank').notEmpty();

    	// var errors = req.validationErrors();

    	// if (errors) {
    	//	req.flash('errors', errors);
    	//	res.render('account/signup', {
    	//		title: 'Create Account'
    	//	});
    	//	return res;
    	//}

    	var location = req.body.location;

    	var query = {
    		'location.address': location,
    		'sort_by':'best',
    		'token': config.eventbrite_key,
    		'popular': true
    	};

    	request.get({ url: 'https://www.eventbriteapi.com/v3/events/search', qs: query }, function(err, request, body) {
    		
    		if (request.statusCode === 403) {
    			return next(new Error('BAD API CALL'));
    		}

    		var obj = JSON.parse(body);

    		// Top 10 events only for now;

    		for (i = 0; i < 10; i++) { 

    			var name_e = obj.events[i].name.text;
    			var location_e = req.body.location;
    			var id_e = obj.events[i].id;
    			var start_e = obj.events[i].start.local;

    			var event = new Event();		// create a new instance of the Event model
    			event.name = name_e;  
    			event.location = location_e;  
    			event.id = id_e; 
    			event.start = start_e;

    			event.save(function(err) {
    			
    				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'An event with that id already exists. '});
					else 
						return res.send(err);
				}

					
			});	
    		
    		

    	};
    		
    		
    		
    		
    		//req.flash('success', {msg: 'I have recieved the query!'});
    		//res.render('api/eventb', {
    		//	my_title: 'Event Bright API',
    		//	events: ret.events
    		//});

    		// return a message
			res.json({ message: 'Events saved!' });
    	})
    });

    	apiRouter.route('/events')

		// create a user (accessed at POST http://localhost:8080/events)
		.post(function(req, res) {
			
			

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		//.get(function(req, res) {
		//	User.find(function(err, users) {
		//		if (err) res.send(err);

				// return the users
		//		res.json(users);
		//	});
		//});

	return apiRouter;
};