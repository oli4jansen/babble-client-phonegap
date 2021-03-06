app.factory('cacheFactory', function($location, $window, $sce, $q, $http) {

	// Deze factory is een object
	var factory = {};

	// Replace functie voor $http.get()
	factory.get = function(url, success, error) {
		// Als er data te vinden is in cache > success functie aanroepen
		if(factory.getFromCache(url)) {
			success(factory.getFromCache(url));
		}

		// Altijd weer nieuwe data ophalen
		$http.get(url).success(function(data) {
			if(factory.dataChanged(url, data)) {
				success(data);
				factory.putInCache(url, data);
			}
		}).error(function(data){
			error(data);
		});
	};

	factory.getFromCache = function(key) {
		if(localStorage.getItem(key) !== undefined && localStorage.getItem(key) !== null && localStorage.getItem(key) !== 'null') {
			return JSON.parse(localStorage.getItem(key)).data;
		}else{
			return false;
		}
	};

	factory.dataChanged = function(key, newData) {
		var oldData = factory.getFromCache(key);
		if(oldData && oldData == newData) {
			return false;
		}else{
			return true;
		}
	};

	factory.putInCache = function(key, data) {
		var now = new Date().getTime();

		localStorage.setItem(key, JSON.stringify({ data: data, timestamp: now }));
	};

	return factory;
});