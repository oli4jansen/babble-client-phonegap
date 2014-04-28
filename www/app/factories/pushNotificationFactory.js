app.factory('pushNotificationFactory', function($location, $window, $sce, $http) {

	// Deze factory is een object
	var factory = {};

	var pushService = window.plugins.pushNotification;

	factory.enablePushNotifications = function(url, success, error) {
		if ( device.platform == 'android' || device.platform == 'Android' )
		{
		    pushService.register(
		        factory.success,
		        factory.error, {
		            "senderID"	: "40396801652",
		            "ecb"		: "pushNotificationFactory.onNotificationGCM"
		        });
		}else{
			console.log('ERROR, push notification kunnen nog niet opgezet worden voor dit platform.');
		}
	};

	factory.success = function(data) {
		alert('Success:' + data);
	};

	factory.error = function(data) {
		alert('error:' + data);
	};

	factory.onNotificationGCM = function(e) {
		alert('EVENT -> RECEIVED:' + e.event);

		switch( e.event ) {
			case 'registered':
				if ( e.regid.length > 0 ) {
					alert('Reg ID:' + e.regid);
					console.log('Reg ID:' + e.regid);
				}
				break;

			case 'message':
				if ( e.foreground ) {
					alert('Inline notification');
				} else if ( e.coldstart ) {
	                alert('Coldstart notification');
	            } else {
					alert('Background notification');
	            }

				alert('MSG: ' + e.payload.message);
				alert('MSGCNT: ' + e.payload.msgcnt);
			    break;

			case 'error':
				alert('Error:' + e.msg);
				break;

			default:
				alert('Unknown notification event');
			break;
		}
	};

	return factory;
});