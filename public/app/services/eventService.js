angular.module('eventService', [])

.factory('Event', function($http) {

	// create a new object
	var eventFactory = {};

	// get all events for a location
	eventFactory.get = function(location) {
		return $http.post('/api/eventbritesearch/', {location: location});
	};

	// return our entire userFactory object
	return eventFactory;
});