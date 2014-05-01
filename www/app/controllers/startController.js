app.controller("startController", function($scope, $location, $http, $rootScope, loginFactory, $sce){

	$scope.init = function() {
		var accessTokenFound = false;

		if(localStorage.getItem('babbleAccessToken') !== undefined && localStorage.getItem('babbleAccessToken') !== null && localStorage.getItem('babbleAccessToken') !== 'null') {
			alert('Cookie gevonden');
			alert(localStorage.getItem('babbleAccessToken'));

			accessTokenFound = true;
		}

		if(!accessTokenFound) $location.path('/login');
	};

});
