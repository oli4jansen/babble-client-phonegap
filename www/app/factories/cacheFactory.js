app.factory('cacheFactory', function($location, $window, $sce, $q) {

	// Deze factory is een object
	var factory = {};

	factory.get = function(url) {
		var deferred = $q.defer();

		deferred.notify('About to greet Olivier.');
		deferred.resolve('Hello, Olivier!');

		return deferred.promise;
	};

	return factory;
});