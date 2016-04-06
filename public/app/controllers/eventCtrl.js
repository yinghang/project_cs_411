angular.module('eventCtrl', ['eventService'])

.controller('eventController', function(Event) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the events at page load
	Event.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.events = data;
	});
})