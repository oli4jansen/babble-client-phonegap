app.controller("startController", function($scope, $location, $http, $rootScope, loginFactory, $sce){

	$scope.init = function() {
		var name = 'babbleAccessToken=';
		var ca = document.cookie.split(';');
		var cookieFound = false;

		for(var i=0; i<ca.length; i++){
			var c = ca[i].trim();

			if (c.indexOf(name)==0) {
				alert('Cookie gevonden');
				alert(c.substring(name.length, c.length));
				cookieFound = true;
			}
		}

		if(!cookieFound) $location.path('/login');
	};

});
