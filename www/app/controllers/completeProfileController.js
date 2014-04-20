app.controller("completeProfileController", function($scope, $route, $location, loginFactory){

	$scope.user = {name: 'Loading..'}
	$scope.status = 'Start Babbling';

	$scope.pictures = [];

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
		window.imagePicker.getPictures(
			function(results) {
				for (var i = 0; i < results.length; i++) {

					$scope.pictures.push({ url: results[i] });

					// upload
					loginFactory.uploadPicture(results[i], function(err) {
						if(!err) {
							// Als dit de laatste foto was:
							if(i === results.length) {
								var picturesMirror = [];

								for (var j = 0; j < $scope.pictures.length; j++) {
									if($scope.pictures[j].local) {
										var fileNameIndex = results[i].lastIndexOf("/") + 1;
										var fileName = results[i].substr(fileNameIndex);

										picturesMirror.push({ url: 'http://www.oli4jansen.nl:81/profile-pictures/'+loginFactory.userId+'-'+fileName });
									}else{
										picturesMirror.push({ url: $scope.pictures[j].url });
									}
								}

								loginFactory.updatePictureList(picturesMirror, function(err, data){
									if(err) navigator.notification.alert(err, function(){return;}, 'Error!');
								});
							}else{
								alert('Niet de laatste foto.');
							}
						}else{
							console.log(err);
							navigator.notification.alert('We\'re sorry but we couldn\'t upload your pictures.', function(){return;}, 'Couldn\'t upload.');
						}
					});

					$scope.$apply();
				}

			}, function (error) {
				alert('Couldn\'t get your photo.'+error);
			}, {
				maximumImagesCount: 5 - $scope.pictures.length,
				width: 300,
				height: 400
			}
		);
	};

	$scope.removePicture = function(index) {
		$scope.pictures.splice(index, 1);
		$scope.$apply;
	};


	$scope.deleteAccount = function() {
		if(confirm('Are you sure you want to delete your account and sign out?')){
			loginFactory.loggedIn = 0;
			loginFactory.logOut();
			$route.reload();
		}
	}

});
