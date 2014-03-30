app.factory('loginFactory', function($http, $location, $window) {

	var URL = 'http://192.168.2.14';

	var FB = $window.FB;
	if(!FB) {
		alert('FB not loaded');
	}

	var factory = {};

	// Boolean die aangeeft of er ingelogd is
	factory.loggedIn;

	// Boolean die aangeeft of het profiel al volledig aangevuld is
	factory.profileCompleted;

	// Data voor een incompleet profiel
	factory.userPartialData;

	// Facebook access token
	factory.accessToken;

	// UserID en info
	factory.userId;
	factory.userInfo = [];

	factory.logIn = function() {
		// Inloggen
		FB.login(
	        function(response) {
	            if (response.authResponse) {
	            	location.reload();
	            }else{
	                alert('Niet ingelogd');
	                return;
	            }
	        },
	        { scope: "email" }
	    );
	};

	factory.logOut = function() {
		FB.logout(function(response) {
			location.reload();
		});
	};

	factory.authenticate = function(data) {

		$http.post(URL + '/user/authenticate', data).success(function(data) {
			if(data.status === 200) {
				factory.loggedIn 			= true;
				factory.profileCompleted 	= true;
				factory.userId 				= data.data.id;
				factory.getUserInfo(function(err, data) {
					if(err) alert(err);
					factory.userInfo = data;
					$location.path( "/feed" );
				});
			}else if(data.status === 206) {
				factory.loggedIn 			= true;
				factory.profileCompleted 	= false;
				factory.userId 				= data.data.id;
				factory.userPartialData 	= data.data;
				$location.path('/completeProfile');
			}else{
				alert(JSON.stringify(data));
				alert('Something went wrong while authenticating.');
			}
		}).error(function(data){
			alert('Couldn\'t connect to the API server.');
		});
	};

	factory.getUserInfo = function(callback) {
		$http.get(URL + '/user/'+this.userId).success(function(data) {
			callback(false, data.data[0]);
		}).error(function(data){
			callback('Error connecting to API', {});
		});
	};

	factory.getMatchInfo = function(matchId, callback) {
		$http.get(URL + '/user/'+this.userId+'/match/'+matchId).success(function(data) {
			callback(false, data.data[0]);
		}).error(function(data){
			callback('Error connecting to API', {});
		});
	};

	factory.getMatches = function(callback) {
		$http.get(URL + '/user/'+this.userId+'/matches').success(function(data) {
			callback(false, data.data);
		}).error(function(data){
			callback('Error connecting to API', {});
		});
	};

	factory.deleteAccount = function(callback) {
		$http.delete(URL + '/user/'+this.userId).success(function(data) {
			callback(false, data);
		}).error(function(data){
			callback('Error connecting to API', {});
		});
	};

	factory.refreshUserInfo = function() {
		factory.getUserInfo(function(err, data) {
			if(!err){
				factory.userInfo = data;
			}else{
				alert('Data refresh error '+err);
			}
		});
	};

	factory.updateUserInfo = function(data, callback) {
		try {
			var parsedData = {};
			for(var i=0;i<data.length;i++) {
				//console.log(formData[i].name);
				parsedData[data[i].name] = data[i].value;
			}
			if(!parsedData.likeMen) parsedData.likeMen = '0';
			if(!parsedData.likeWomen) parsedData.likeWomen = '0';

			if(parsedData.description !== undefined && parsedData.likeMen !== undefined && parsedData.likeWomen !== undefined && parsedData.searchRadius !== undefined) {
				$http.put(URL + '/user/'+this.userId, parsedData).success(function(data) {
					factory.refreshUserInfo();
					callback(0, data);
				}).error(function(data){
					callback('Error connecting to API', {});
				});
			}else{
				callback('Data didn\'t fit the format.'+JSON.stringify(parsedData), {});
			}
		} catch(err) {
			callback(err, {});
		}
	};

	FB.Event.subscribe('auth.login', function(response) {
		factory.accessToken = response.authResponse.accessToken;
		factory.authenticate({ accessToken: response.authResponse.accessToken });
	});

	FB.Event.subscribe('auth.logout', function(response) {
		alert('auth.logout event');
	});

	try {
		FB.init({ appId: "1432398570331786", nativeInterface: CDV.FB, useCachedDialogs: false });
	} catch (e) {
		alert('Error with Facebook Init: ' + e);
	}

	return factory;
});