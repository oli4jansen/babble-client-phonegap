app.factory('pushNotificationFactory', function($location, $window, $sce, $http, loginFactory, $rootScope) {

	// Deze factory is een object
	var factory = {};

	var pushService = window.plugins.pushNotification;

	factory.enablePushNotifications = function(url, success, error) {
		if ( device.platform == 'android' || device.platform == 'Android' )
		{
		    pushService.register(
		        factory.success,
		        factory.error,
		        {
		            "senderID"	: "40396801652",
		            "ecb"		: "onNotificationGCM"
		        });
		}else{
			console.log('ERROR, push notification kunnen (nog) niet opgezet worden voor dit platform.');
		}
	};

	factory.success = function(data) {
		console.log('pushNotificationFactory Success:' + data);
	};

	factory.error = function(data) {
		console.log('pushNotificationFactory Error:' + data);
	};

	window.onNotificationGCM = function(e) {
		console.log(e);

		switch( e.event ) {
			case 'registered':
				// Bevestiging van GCM met een Registration ID, nodig op te pushen
				if ( e.regid.length > 0 ) loginFactory.GCMRegIDCurrent = e.regid;
				break;

			case 'message':
				// Een 'echte' notification
				if ( e.foreground ) {
					// Notificaties die binnenkomen terwijl de gebruiker in de app is
					if(e.payload.type !== undefined) {
						if(e.payload.type == 'match') {
							// Match popup laten zien
			                $('body').addClass('popup');
			                $rootScope.popups.push({name: herName, id: herId})
						}
					}						
				} else if ( e.coldstart ) {
					// Notificaties waar op geklikt is vanuit het Notification Center v/d telefoon
					if(e.payload.type !== undefined) {
						if(e.payload.type == 'chat' && e.payload.herId !== undefined && e.payload.herName !== undefined) {
							loginFactory.desiredLocation = '/chat/'+e.payload.herId+'/'+e.payload.herName;
						}else if(e.payload.type == 'match') {
							loginFactory.desiredLocation = '/chat/'+e.payload.herId+'/'+e.payload.herName;							
						}
					}
	            }
			    break;

			case 'error':
				console.log('Error:' + e.msg);
				break;
		}
	};

	return factory;
});