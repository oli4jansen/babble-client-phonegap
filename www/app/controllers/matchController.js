app.controller("matchController", function($scope, $rootScope, $routeParams, loginFactory){

	$scope.herId = $routeParams.userId;

	$scope.init = function() {
		loginFactory.getMatchInfo($scope.herId, function(err, data) {
			if(err) {
				alert(err);
				$location.path( "/feed" );
			}else{
				if(data.action < 26) {
					data.picture = 'img/unknown.png';
				}
				$scope.user = data;
				$scope.$apply();

				$('.header h1').html(data.name);
//				$('#userPicture').css('background-image', 'url('+data.picture+')');
			}
		});
	};

});