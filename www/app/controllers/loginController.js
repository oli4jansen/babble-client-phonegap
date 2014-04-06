app.controller("loginController", function($scope, $location, $http, $rootScope, loginFactory){

	$scope.status = $sce.trustAsHtml('Sign in with Facebook <i class="ion-social-facebook-outline"></i>';

	$scope.init = function() {
		$('.header h1').html("Babble");
		$('body').css("background-image", "url('img/background.png')");
	};

	$scope.logIn = function() {
	    loginFactory.logIn();
	};

	$scope.status = loginFactory.status;

});