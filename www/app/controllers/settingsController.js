app.controller("settingsController", function($scope, $location, $route, $rootScope, loginFactory){

	$scope.user = {name: ''}

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
		var formData = $('#settingsForm').serializeArray();
		loginFactory.updateUserInfo(formData, function(err, data) {
			if(err) {
				alert(err);
			}else{
				if(data.status === '200') {
					alert('Your settings are saved!');
				}else{
					alert('The server didn\'t accept your request.');	
				}
			}
		});
	}

	$scope.deleteAccount = function() {
		if(confirm("Confirm that you want to delete your account.")) {


			// TODO: facebook logout here


			loginFactory.deleteAccount(function(err, data){
				if(!err) {
					if(data.status !== '200') {
						alert('Something went wrong deleting your account from our database.');
					}
				}else{
					alert(err);
				}
			});
		}
	}

});