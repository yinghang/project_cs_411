angular.module('eventCtrl', ['eventService'])

.controller('eventController', function(Event) {

	var vm = this;
	vm.search = function() {
	vm.processing = true;

	Event.get(vm.location)
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.events = data;
		});
			
	};	
})