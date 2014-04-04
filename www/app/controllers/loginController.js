app.controller("loginController", function($scope, $location, $http, $rootScope, loginFactory){

	$scope.status = 'Sign in with Facebook';

	$scope.init = function() {
		$('.header h1').html("Babble");
		$('body').css("background-image", "url('img/background.png')");
	};

	$scope.logIn = function() {
	    loginFactory.logIn();
	};

	$scope.status = loginFactory.status;


/*	$scope.getLoginStatus = function() {
		FB.getLoginStatus(function(response) {
			if (response.status == 'connected') {
				alert('logged in');
				alert(JSON.stringify(response));
			} else {
				alert('not logged in');
			}
		});
	};*/

});