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
					$scope.pictures.push({ url: data.picture });
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
						if(err) navigator.notification.alert('We\'re sorry but we couldn\'t upload your pictures.', function(){return;}, 'Couldn\'t upload.');
						// Als dit de laatste foto was:
						if(i+1 === results.length) loginFactory.updatePictureList(JSON.stringify($scope.pictures), function(err, data){
							if(err) navigator.notification.alert(err, function(){return;}, 'Error!');
						});
					});

					$scope.$apply();
				}

			}, function (error) {
				alert('Couldn\'t get your photo.');
			}, {
				maximumImagesCount: 4 - $scope.pictures.length,
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
					loginFactory.loggedIn = 0;
					loginFactory.logOut();
				}
			}else{
				alert(err);
			}
		});
	}

});
