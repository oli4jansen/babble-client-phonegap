app.controller("settingsController", function($scope, $location, $route, $rootScope, loginFactory){

	$scope.user = {name: ''};
	$scope.updateButtonStatus = 'Update';
	$scope.deleteButtonStatus = 'Delete and sign out';

	$scope.init = function() {
		$('.header h1').html("Settings");
		loginFactory.getUserInfo(function(err, data) {
			if(err) {
				alert(err);
			}else{
				if(data) {
					$scope.user = data;
					if(data.likeMen === 1) $('#checkboxMen').attr('checked', 'true');
					if(data.likeWomen === 1) $('#checkboxWomen').attr('checked', 'true');
					$scope.pictures = JSON.parse(data.pictureList);
				}
			}
		});
	};

	$scope.pictures = [];

	$scope.selectPicture = function() {
		window.imagePicker.getPictures(
			function(results) {
				for (var i = 0; i < results.length; i++) {

					$scope.pictures.push({ url: results[i] });

					// upload
					loginFactory.uploadPicture(results[i], function(err) {
						alert('Photo '+i+' of '+results.length+' uploading..');
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
				alert('Couldn\'t get your photo.');
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

	$scope.update = function() {
		$scope.updateButtonStatus = 'Updating..';

		var formData = $('#settingsForm').serializeArray();
		loginFactory.updateUserInfo(formData, function(err, data) {
			$scope.updateButtonStatus = 'Update';
			if(err) {
				alert(err);
			}else{
				if(data.status === '200') {
					navigator.notification.alert('Your settings were successfully saved.', function(){return;}, 'Saved!');
				}else{
					navigator.notification.alert('Our server didn\'t accept your request.', function(){return;}, 'Uhoh..');
				}
			}
		});
	}

	$scope.deleteAccount = function() {
		$scope.deleteButtonStatus = 'Deleting..';

		loginFactory.deleteAccount(function(err, data){

			if(!err) {
				if(data.status !== '200') {
					$scope.deleteButtonStatus = 'Delete and sign out';
					navigator.notification.alert('Something went wrong while deleting your account from our database.', function(){return;}, 'Error');
				}else{
					$scope.deleteButtonStatus = 'Deleted';
					navigator.notification.alert('Your account was successfully deleted.', function(){return;}, 'Deleted!');
//					loginFactory.loggedIn = 0;
//					loginFactory.logOut();
				}
			}else{
				alert(err);
			}
		});
	}

});
