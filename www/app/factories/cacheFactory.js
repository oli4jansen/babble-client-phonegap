app.factory('cacheFactory', function($location, $window, $sce, $q, $http) {

	// Deze factory is een object
	var factory = {};

	factory.get = function(url) {
		var deferred = $q.defer();

		$http.get(url).success(function(data) {
			deferred.resolve(data);
		}).error(function(data){
			deferred.reject(data);
		});

		return deferred.promise;
	};

	return factory;
});