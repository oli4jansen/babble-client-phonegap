app.factory('cacheFactory', function($location, $window, $sce, $q, $http) {

	// Deze factory is een object
	var factory = {};

	factory.get = function(url, success, error) {
		var now = new Date().getTime();

		// Als er data te vinden is in cache > success functie aanroepen
		if(localStorage.getItem(url) !== undefined && localStorage.getItem(url) !== null) {
			success(JSON.parse(localStorage.getItem(url)).data);
		}

		// Altijd weer nieuwe data ophalen
		$http.get(url).success(function(data) {

			if(JSON.parse(localStorage.getItem(url)) !== data || now - JSON.parse(localStorage.getItem(url)).timestamp < 3600000) {
				success(data);
			}
			localStorage.setItem(url, JSON.stringify({ data: data, timestamp: now }));

		}).error(function(data){
			error(data);
		});
	};

	return factory;
});