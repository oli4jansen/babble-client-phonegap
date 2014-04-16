app.controller("headerController", function($scope, $location, $rootScope, $routeParams){

	$scope.path = '/';
	$rootScope.popups = [];

	$scope.navigate = function(location) {
		$location.path('/'+location);
	};

	$scope.closePopup = function() {
		$rootScope.popups.splice(0,1);
		$('body').removeClass('popup');
	};

	$scope.sayHi = function(herId, herName) {
		$scope.closePopup();
		$scope.navigate('chat/'+herId+'/'+herName);
	};

	$scope.init = function() {
		$rootScope.$on( "$routeChangeStart", function(event, next, current) {

			if(next.originalPath !== undefined) {
				$scope.path = next.originalPath;
			}else{
				$scope.path = '/';
			}

			if(next.originalPath === '/settings' || next.originalPath === '/contacts' || next.originalPath.substring(0, 6) == '/chat/' || next.originalPath.substring(0, 7) == '/match/') {
				$('.header .menu-item').css('display', 'none');
				$('.header .menu-item-back').css('display', 'inline-block');
			}else if(next.originalPath === '/feed') {
				$('.header .menu-item-back, .header .menu-item#logo').css('display', 'none');
				$('.header .menu-item#settingsHandler, .header .menu-item#chatsHandler').css('display', 'inline-block');
			}else if(next.originalPath === '/' || next.originalPath === '/completeProfile') {
				$('.header .menu-item, .header .menu-item-back').css('display', 'none');
				$('.header .menu-item#logo').css('display', 'inline-block');
			}else{
				$('.header .menu-item, .header .menu-item-back').css('display', 'none');
			}
			if(next.originalPath === '/' && current.originalPath === '/feed') {
				navigator.app.exitApp();
			}
		});
	};

	$scope.headerClick = function() {
		if($scope.path.substring(0, 6) == '/chat/') {
			$location.path( "/match/"+$routeParams.userId );
		}
	};

});
