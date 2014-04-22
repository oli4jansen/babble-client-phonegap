app.controller("contactsController", function($scope, $location, loginFactory){

	$scope.matches = [];

	$scope.init = function() {
		$('.header h1').html("Your matches");

		loginFactory.getMatches(function(err, data) {

			data.forEach(function(item) {
				if(item.action < 26) {
					item.pictureStyle = { backgroundImage: 'url("img/unknown.png")', backgroundSize: 'cover', backgroundPosition: 'center' };
				}else{
					item.pictureStyle = { backgroundImage: 'url("'+JSON.parse(item.pictureList)[0].url+'")', backgroundSize: 'cover', backgroundPosition: 'center' };
				}
			});
			$scope.matches = data;
		});
	};

	$scope.startChat = function(id, name) {
//		alert(id);
		$location.path('/chat/'+id+'/'+name);
	}

});
