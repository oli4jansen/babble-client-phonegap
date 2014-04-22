app.controller("completeProfileController", function($scope, $route, $location, loginFactory){

	$scope.user = {name: 'Loading..'}
	$scope.status = 'Start Babbling';

	$scope.pictures = [];
	$scope.uploadStatus = '+';

	$scope.init = function() {		
		$scope.user = loginFactory.userPartialData;

		$scope.pictures = JSON.parse(loginFactory.userPartialData.pictureList);
	};

	$scope.start = function() {

		$scope.status = 'Please wait..';

		var formData = $('#completeProfileForm').serializeArray();

		var parsedData = {};
		for(var i=0;i<formData.length;i++) {
			//console.log(formData[i].name);
			parsedData[formData[i].name] = formData[i].value;
		}
		if(!parsedData.likeMen) parsedData.likeMen = '0';
		if(!parsedData.likeWomen) parsedData.likeWomen = '0';

		parsedData.pictureList = JSON.stringify($scope.pictures);
		parsedData.accessToken = loginFactory.accessToken;

		loginFactory.authenticate(parsedData, function(err) {
			if(!err) {
				$scope.status = 'Logging you in..';
				$('.header .rn-carousel-controls').remove();
				$location.path( "/feed" );
			}else{
				navigator.notification.alert(err, function(){return;}, 'Woops..');
				$scope.status = 'Start Babbling';
			}
		});
	};

	$scope.chosenDate = '1985/10/22';

	$scope.pickDate = function($event) {
		$event.preventDefault();
		datePicker.show({ date: new Date($scope.chosenDate), mode: 'date', allowFutureDates: false }, function(date){
			$scope.chosenDate = date;
			$scope.$apply();
		});
	};


	$scope.selectPicture = function() {
		console.log(loginFactory.accessToken);
		navigator.camera.getPicture(function(data){

			$scope.uploadStatus = '..';
			$scope.$apply();

			loginFactory.uploadPicture(data, function(err, result) {
				$scope.uploadStatus = '+';
				if(!err) {
					$scope.pictures.push({ url: JSON.parse(result.response).location });
					$scope.updatePictureList();
					$scope.$apply();
				}else{
					$scope.$apply();
					navigator.notification.alert('We\'re sorry but we couldn\'t upload your pictures.', function(){return;}, 'Couldn\'t upload.');
				}
			});
		}, function(error){
			alert(error);
		}, {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
		});
	};

	$scope.removePicture = function(index) {
		$scope.pictures.splice(index, 1);
		$scope.$apply;
		$scope.updatePictureList();
	};

	$scope.updatePictureList = function() {
		loginFactory.updatePictureList($scope.pictures, function(err, data) {
			if(err) alert('Pictures are note updated.');
		});
	};

	$scope.deleteAccount = function() {
		if(confirm('Are you sure you want to delete your account and sign out?')){
			loginFactory.loggedIn = 0;
			loginFactory.logOut();
			location.reload();
		}
	}

});
