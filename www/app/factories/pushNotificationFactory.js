app.factory('pushNotificationFactory', function($location, $window, $sce, $http, loginFactory) {

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
			console.log('ERROR, push notification kunnen nog niet opgezet worden voor dit platform.');
		}
	};

	factory.success = function(data) {
//		alert('Success:' + data);
	};

	factory.error = function(data) {
//		alert('error:' + data);
	};

	window.onNotificationGCM = function(e) {
		console.log(e);

		switch( e.event ) {
			case 'registered':
				if ( e.regid.length > 0 ) {
					console.log('Got our regID');
					loginFactory.GCMRegIDCurrent = e.regid;
				}
				break;

			case 'message':
				if ( e.foreground ) {
					alert('Inline notification');
				} else if ( e.coldstart ) {
					console.log('COLDSTART NOTIFICATION');
					document.addEventListener("babbleLoggedIn",function() {
						console.log('babbleLoggedIn listener called');

						if(e.payload.type !== undefined) {
							if(e.payload.type == 'chat' && e.payload.herId !== undefined && e.payload.herName !== undefined) {

								console.log('Type is chat');


								$location.path('/chat/'+e.payload.herId+'/'+e.payload.herName);
							}
						}						
					},false);
	            } else {
					alert('Background notification');
	            }

			    break;

			case 'error':
				console.log('Error:' + e.msg);
				break;

			default:
				alert('Unknown notification event');
			break;
		}
	};

	return factory;
});