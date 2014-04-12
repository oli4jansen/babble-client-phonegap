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
					$('#userPicture').css('background-image', 'url('+data.picture+')').children('h2').removeClass('loader');
				}
			}
		});
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
