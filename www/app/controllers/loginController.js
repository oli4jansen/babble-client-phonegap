app.controller("loginController", function($scope, $location, $http, $rootScope, loginFactory, $sce){

	$scope.init = function() {
		$('.header h1').html("Babble");
		$('body').css("background-image", "url('img/background.png')");
	};

	$scope.logIn = function() {
		$scope.status = $sce.trustAsHtml('<div class="loader"><span class="loaderA"></span><span class="loaderMain"></span><span class="loaderB"></span></div>');
		loginFactory.logIn();
	};

	$scope.status = loginFactory.status;

});
