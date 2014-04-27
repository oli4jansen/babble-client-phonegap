app.factory('cacheFactory', function($location, $window, $sce, $q, $http) {

	// Deze factory is een object
	var factory = {};

	factory.get = function(url, success, error) {
		// Als er data te vinden is in cache > success functie aanroepen
		if(localStorage.getItem(url)) {
			success(localStorage.getItem(url));
		}

		// Altijd weer nieuwe data ophalen
		$http.get(url).success(function(data) {

			localStorage.setItem(url, data);

			if(localStorage.getItem(url) !== data) success(data);

		}).error(function(data){
			error(data);
		});
	};

	return factory;
});