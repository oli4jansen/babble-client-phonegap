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
		$scope.deleteButtonStatus = 'Waiting..';
		navigator.notification.confirm("Confirm that you want to delete your account.", function(index){
			if(index===1) {
				loginFactory.deleteAccount(function(err, data){
					$scope.deleteButtonStatus = 'Delete and sign out';

					if(!err) {
						if(data.status !== '200') {
							navigator.notification.alert('Something went wrong while deleting your account from our database.', function(){return;}, 'Error');
						}else{
							navigator.notification.alert('Your account was successfully deleted.', function(){return;}, 'Deleted!');
							loginFactory.logOut();
						}
					}else{
						alert(err);
					}
				});
			}else{
				$scope.deleteButtonStatus = 'Delete and sign out';
			}
		}, 'Are you sure?');
	}

});
