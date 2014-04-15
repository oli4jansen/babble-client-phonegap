app.controller("completeProfileController", function($scope, $location, loginFactory){

	$scope.user = {name: 'Loading..'}
	$scope.status = 'Start Babbling';

	$scope.init = function() {
		$('.header h1').html("Complete profile");

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

		parsedData.accessToken  = loginFactory.accessToken;

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

	$scope.deleteAccount = function() {
		if(confirm('Are you sure you want to delete your account and sign out?')){
			loginFactory.logOut();
		}
	}

});
