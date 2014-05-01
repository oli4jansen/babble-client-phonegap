app.controller("startController", function($scope, $location, $http, $rootScope, loginFactory, $sce){

	$scope.init = function() {
		if(localStorage.getItem('babbleAccessToken') !== undefined && localStorage.getItem('babbleAccessToken') !== null && localStorage.getItem('babbleAccessToken') !== 'null') {
			alert('Cookie gevonden');
			alert(localStorage.getItem('babbleAccessToken'));
		}else{
//			$location.path('/login');
			alert('Naj');
		}
	};

});
