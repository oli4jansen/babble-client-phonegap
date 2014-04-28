app.factory('loginFactory', function($http, $location, $window, $sce, cacheFactory) {

	// API URL
	var URL = 'http://www.oli4jansen.nl:81';

	// Facebook SDK variabele
	var FB = $window.FB;
	if(!FB) alert('FB not loaded');

	// Deze factory is een object
	var factory = {};

	// Boolean die aangeeft of er ingelogd is
	factory.loggedIn;

	// Boolean die aangeeft of het profiel al volledig aangevuld is
	factory.profileCompleted;

	// Data voor een incompleet profiel
	factory.userPartialData;

	// Facebook access token
	factory.accessToken;

	// GCM Registration ID
	factory.GCMRegIDList = [];

	// UserID en info
	factory.userId;
	factory.userInfo = [];

	/*
	 *	Facebook SDK functions
	 */

	// Inloggen bij Facebook
	factory.logIn = function() {
		FB.login(
	        function(response) {
	            if (response.authResponse) {
	            	// Als het gelukt is; herlaad de 'pagina'/app
	            	location.reload();
	            }else{
	            	// Gebruiker cancelde het login scherm
	                return;
	            }
	        },
	        { scope: "email" }
	    );
	};

	// Uitloggen bij Facebook
	factory.logOut = function() {
		FB.logout(function(response) {
			$route.reload();
		});
	};

	/*
	 *	Babble API functions
	 */

  factory.authenticationStatus = 'Start Babbling';

	// Authenticate een gebruiker bij de API
	// Verplicht in data: { accessToken: (..) }
	factory.authenticate = function(data, callback) {
		factory.authenticationStatus = 'Please wait..';
		// POST de data naar het API endpoint
		$http.post(URL + '/user/authenticate', data).success(function(data) {
			if(data.status === 200) {
				// Status 200 betekent:
				//   -  gebruiker bestaat en accessToken is geldig en bijgewerkt
				//   -  gebruiker bestond niet maar is aangemaakt met de geleverde data

				// Er is ingelogd
				factory.loggedIn 			= true;

				// Het profiel bestaat in de database
				factory.profileCompleted 	= true;

				// Het userID zoals we die terugkregen van de server
				factory.userId 				= data.data.id;

				// Alle info van de gebruiker ophalen en instellen in de factory zodat deze beschikbaar is voor verschillende controllers
				factory.getUserInfo(function(err, data) {
					if(err) {
						if(!callback) {
							alert(err);
						}else{
							callback(err);
						}
					}else{
						factory.userInfo 	 = data;
						factory.GCMRegIDList = data.GCMRegIDList;
						if(factory.GCMRegIDList === '' || factory.GCMRegIDList === undefined || factory.GCMRegIDList === null) {
							factory.GCMRegIDList = [];
						}

						// Shit is geregeld; doorsturen naar de feed
						if(!callback) {
							$location.path( "/feed" );
						}else{
							callback('');
						}
					}
				});

			}else if(data.status === 206) {
				// Status 206 betekent: gebruiker bestaat niet en er was alleen een accessToken aanwezig in de data

				// Er is ingelogd
				factory.loggedIn 			= true;

				// Het profiel bestaat echter nog niet in de database
				factory.profileCompleted 	= false;

				// Het userID zoals we die terugkregen van de server
				factory.userId 				= data.data.id;

				// De data die al wel bekend is van de gebruiker
				factory.userPartialData 	= data.data;

				// Doorsturen naar een scherm om extra info in te voeren
				$location.path('/completeProfile');
			}else if(data.status === 500 && data.data !== undefined) {
				if(!callback) {
					navigator.notification.alert(data.data, function(){return;}, 'Woops..');
				}else{
					callback(data.data);
				}
			}else{
				factory.status = $sce.trustAsHtml('Sign in with Facebook <i class="ion-social-facebook-outline"></i>');
				if(!callback) {
					navigator.notification.alert('Something went wrong while authenticating.', function(){return;}, 'Woops..');
				}else{
					callback('Something went wrong while authenticating.');
				}
			}
		}).error(function(data){
			factory.status = $sce.trustAsHtml('Sign in with Facebook <i class="ion-social-facebook-outline"></i>');
			// Verbinding maken met API is mislukt
			if(!callback) {
				navigator.notification.alert('Couldn\'t connect to the API server.', function(){return;}, 'Woops..');
			}else{
				callback('Couldn\'t connect to the API server.');
			}
		});
	};

	factory.setRegID = function(newRegID) {
		if(factory.GCMRegIDList.indexOf(newRegID) === -1) {
			factory.GCMRegIDList.push(newRegID);

			$http.post(URL + '/user/'+factory.userId+'/regid', { accessToken: factory.accessToken, regIdList: JSON.stringify(factory.GCMRegIDList) }).success(function(data) {
				console.log(data);
			}).error(function(data){
				alert('Failed to register for push notifications.');
				console.log(data);
			});
		}
	};

	// Gebruiker info ophalen bij de API
	factory.getUserInfo = function(callback) {
		cacheFactory.get(URL + '/user/'+this.userId, function(data) {
			callback(false, data.data[0]);
		}, function(error) {
			callback('Error connecting to API', {});
		});
	}

	// Informatie over een match tussen 2 personen ophalen
	factory.getMatchInfo = function(matchId, callback) {
		$http.get(URL + '/user/'+this.userId+'/match/'+matchId).success(function(data) {
			callback(false, data.data[0]);
		}).error(function(data){
			callback('Error connecting to API', {});
		});
	};

	// Alle matches van 1 persoon ophalen
	factory.getMatches = function(callback) {
		cacheFactory.get(URL + '/user/'+this.userId+'/matches', function(data) {
			callback(false, data.data);
		}, function(error) {
			alert('Error connecting to API', {});
		});
	};

	// Account verwijderen
	factory.deleteAccount = function(callback) {
		$http.delete(URL + '/user/'+this.userId).success(function(data) {
			callback(false, data);
			factory.logOut();
		}).error(function(data){
			callback('Error connecting to API', {});
		});
	};

	factory.uploadPicture = function(imageUrl, callback) {
		if (imageUrl.substring(0,21) === "content://com.android") {
			photo_split = imageUrl.split("%3A");
			imageUrl    = "content://media/external/images/media/"+photo_split[1];
		}

		console.log(imageUrl);

		var options         = new FileUploadOptions();

		options.fileKey     = "file";
		options.mimeType    = "image/jpeg";
		options.fileName    = imageUrl.substr(imageUrl.lastIndexOf('/')+1);
		options.chunkedMode = false;
		options.params      = {
								accessToken: factory.accessToken,
								fileName: options.fileName
							  };

		var ft = new FileTransfer();
		ft.upload(imageUrl, URL+"/user/"+factory.userId+"/picture", function(r){

			console.log("Response = " + r.response);
			console.log("Bytes Sent = " + r.bytesSent);

			if(JSON.parse(r.response).status === '200') {
				callback(false, r);
			}else{
				callback('Something went wrong while uploading your picture.', r);
			}

		}, function(err) {
			callback(err.code);
		}, options);
	};

	// De lijst met foto's updaten
	factory.updatePictureList = function(data, callback) {
		try {
			if(!(data instanceof Array)) callback('Your request was invalid.', {});

			$http.put(URL + '/user/'+this.userId+'/pictureList', { accessToken: factory.accessToken, pictureList: JSON.stringify(data) }).success(function(data) {
				factory.refreshUserInfo();
				callback(0, data);
			}).error(function(data){
				callback('Error connecting to API', {});
			});
		} catch(err) {
			callback(err, {});
		}
	};

	// De user info updaten met nieuwe gegevens
	factory.updateUserInfo = function(data, callback) {
		try {
			// Object met data die we naar de server gaan sturen
			var parsedData = {};

			// Data is een array, dus voor elke row uit data:
			for(var i=0;i<data.length;i++) {
				// Een item aan parsedData toevoegen
				parsedData[data[i].name] = data[i].value;
			}

			// Checkboxes verdwijenen als je ze niet checkt
			if(!parsedData.likeMen) parsedData.likeMen = '0';
			if(!parsedData.likeWomen) parsedData.likeWomen = '0';

			// Als alles klopt, kunnen we PUTten
			if(parsedData.description !== undefined && parsedData.likeMen !== undefined && parsedData.likeWomen !== undefined && parsedData.searchRadius !== undefined) {
				// PUT nieuwe data
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

	/*
	 *	Overige functies
	 */

	// Functie om het verversen van de user info in deze factory van buitenaf makkelijker te maken
	factory.refreshUserInfo = function() {
		factory.getUserInfo(function(err, data) {
			if(!err){
				factory.userInfo = data;
			}else{
				alert('Data refresh error '+err);
			}
		});
	};

	factory.status = $sce.trustAsHtml('Sign in with Facebook <i class="ion-social-facebook-outline"></i>');

	// Als Facebook een login detecteert, kunnen we de authenticate functie uitvoeren
	FB.Event.subscribe('auth.login', function(response) {
		factory.status = $sce.trustAsHtml('<div class="loader"><span class="loaderA"></span><span class="loaderMain"></span><span class="loaderB"></span></div>');

		// AccessToken instellen
		factory.accessToken = response.authResponse.accessToken;

		// Authenticate gebruiker met accessToken
		factory.authenticate({ accessToken: response.authResponse.accessToken });
	});

	// Facebook SDK instellen met ons Facebook App ID
	try {
		FB.init({ appId: "1432398570331786", nativeInterface: CDV.FB, useCachedDialogs: false });
	} catch (e) {
		alert('Error with Facebook Init: ' + e);
	}

	return factory;
});
