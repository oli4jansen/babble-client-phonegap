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
			$scope.path = next.originalPath;

			if(next.originalPath === '/settings' || next.originalPath === '/contacts' || next.originalPath.substring(0, 6) == '/chat/' || next.originalPath.substring(0, 7) == '/match/') {
				$('.header .menu-item').fadeOut(0, function() {
					$('.header .menu-item-back').fadeIn(0);
				});
			}else if(next.originalPath === '/feed') {
				$('.header .menu-item-back, .header .menu-item#logo').fadeOut(0, function() {
					$('.header .menu-item#settingsHandler, .header .menu-item#chatsHandler').fadeIn(0);
				});
			}else if(next.originalPath === '/' || next.originalPath === '/completeProfile') {
				$('.header .menu-item, .header .menu-item-back').fadeOut(0, function() {
					$('.header .menu-item#logo').fadeIn(0);
				});
			}else{
				$('.header .menu-item, .header .menu-item-back').fadeOut(0);
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
