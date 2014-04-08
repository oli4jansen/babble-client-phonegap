app.controller("completeProfileController", function($scope, $location, loginFactory){

	$scope.user = {name: 'Loading..'}
	$scope.status = 'Start Babbling';

	$scope.init = function() {
		$('.header h1').html("Complete profile");
		$('body').css("background-image", "none");

		$scope.user = loginFactory.userPartialData;

		$('#userPicture').css('background-image', 'url('+$scope.user.picture+')');
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

		parsedData.accessToken  = loginFactory.accessToken;

		loginFactory.authenticate(parsedData, function(err, data) {
			if(err) {
				alert(err);
			}else{
				if(data.status === '200') {
					location.reload();
				}else{
					alert('The server didn\'t accept your request.');
				}
			}
		});
	};

	$scope.chosenDate = '01/01/1985';

	$scope.pickDate = function() {
		datePicker.show({ date: new Date(), mode: 'date', allowFutureDates: false }, function(date){
			alert(date);
			$scope.chosenDate = date;
			alert($scope.chosenDate);
		});
	};

	$scope.deleteAccount = function() {
		if(confirm('Are you sure you want to delete your account and sign out?')){
			loginFactory.logOut();
		}
	}

});
