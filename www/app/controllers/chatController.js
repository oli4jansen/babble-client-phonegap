app.controller("chatController", function($scope, $route, $routeParams, $location, loginFactory, $rootScope){

	var URL = 'www.oli4jansen.nl:81';

	// Uit de URL halen we de naam en het ID van degene met wie we gaan chatten
	$scope.herId = $routeParams.userId;
	$scope.herName = $routeParams.userName;

	$scope.status = 'Updating chat, please wait..';
	$scope.imageURL = 'img/unknown.png';

	$scope.offset = 0;
	$scope.range = 10;

	$scope.messages = [];

	$scope.monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

	$scope.init = function() {
		$('.header h1').html($scope.herName);

		var content = $('#content');
		var input = $('#input');

		var myName = loginFactory.userId;
		var herName = $routeParams.userId;

		window.WebSocket = window.WebSocket || window.MozWebSocket;

		if (!window.WebSocket) {
			alert('Sorry, but your browser doesn\'t support WebSockets.');
		}

		// Verbinding met server maken
		var connection = new WebSocket('ws://'+URL);

		$scope.$on('$destroy', function iVeBeenDismissed() {
	    	if(connection) {
	    		connection.close();
	    	}
	    });

	    // Verbindingsproblemen:
	    connection.onerror = function (error) {
	        content.html('Sorry, but there\'s some problem with your connection or the server is down.');
	    };

	    // Als de verbinding gemaakt is: stuur eigen naam en naam waarmee je wil chatten
	    connection.onopen = function () {
	    	$scope.refreshMessages();
	        connection.send(JSON.stringify({ myName: myName, herName: herName }));
	    };

	    // Binnenkomende berichten:
	    connection.onmessage = function (message) {
	        // JSON parsen naar een bruikbaar object/array
	        try {
	            var json = JSON.parse(message.data);
	            console.log(message);
	        } catch (e) {
	            console.log('Het ontvangen bericht is corrupt: ', message.data);
	            return;
	        }

	        // Checken wat voor soort bericht je ontvangen hebt
	        if (json.type === 'status') {

                $scope.status = json.data;

	            if(json.data === 'hidden') {
	                input.removeAttr('disabled');

	                // Counter instellen
	                $scope.status = 26 - json.counter;
	                $scope.status = 'Only ' + $scope.status + ' messages left.';
	                $scope.$apply();

	            }else if (json.data === 'visible') {
	            	input.removeAttr('disabled').focus();

	            	// Input text instellen
	                $scope.status = 'Say hi to '+$scope.herName;
	                $scope.$apply();

	            }else if(json.data === 'declined') {
	            	$location.path('/contacts');
	            }

	        } else if (json.type === 'history') {

	        	var history = localStorage.getItem('chat-history-'+herName);
	        	if(history === null || history === 'null') {
	        		// History bestond nog niet in localStorage
	           		console.log('Your message history storage for this chat was empty, so we created one.');
	        		history = {};
	        	}else{
	        		// History bestond al in localStorage
	        		history = JSON.parse(history);
	        	}

	        	// Voor elk ontvangen bericht v/d nog niet gelezen chatgeschiedenis:
	            for (var i=0; i < json.data.length; i++) {
	            	// Bericht toevoegen aan history array
	            	history[json.data[i].id] = { author: json.data[i].author, message: json.data[i].text, time: new Date(json.data[i].time) };
	            }

	            // History array weer in localStorage zetten
	            localStorage.setItem('chat-history-'+herName, JSON.stringify(history));

	            // Hele DOM in 1x updaten ipv per bericht
	            $scope.refreshMessages();

	            connection.send(JSON.stringify({ gotMessage: json.data }));
	        } else if (json.type === 'message') { // it's a single message
	            // Add message to localStorage
	            var history = localStorage.getItem('chat-history-'+herName);
	           	if(history === null || history === 'null') {
	           		// History bestond nog niet in localStorage
	           		console.log('Your message history storage for this chat was empty, so we created one.');
	        		history = {};
	        	}else{
	        		// History bestond al in localStorage
	        		history = JSON.parse(history);
	        	}

	        	// Dit bericht aan de array toevoegen
	        	history[json.data.id] = { author: json.data.author, message: json.data.text, time: new Date(json.data.time) };

	        	// Array weer in localstorage zetten
	          localStorage.setItem('chat-history-'+herName, JSON.stringify(history));

	          // Bericht ook toevoegen aan DOM
	          $scope.parseMessage(json.data.id, json.data.author, json.data.text, json.data.time);

						// Leuk geluidje laten horen
						if(json.data.author !== myName) navigator.notification.beep(1);

	          // Laten weten dat we het bericht ontvangen hebben
	          connection.send(JSON.stringify({ gotMessage: json.data }));
	        } else if (json.type === 'update') {

	        	if(json.counter < 26) {
	                $scope.status = 26 - json.counter;
	                $scope.status = 'Only '+$scope.status+' messages left.';
		        	$scope.$apply();
		        } else if(json.counter === 26 && $scope.status === 'hidden') {
	                $scope.status = '';
		        	alert('You can see '+$scope.herName+'\'s pictures!');
		        }

	        } else {
	            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
	        }
	    };

	    // Als er op enter gedrukt is: verstuur bericht
	    $('#submitMessage').click(function(e) {
	    	var msg = input.val();
			if (!msg) return;
			connection.send(msg);
			input.val('');
			input.focus();
	    });

		input.focus(function() {
			var n = $('#content').height();
			$('.ng-scope').animate({ scrollTop: n }, 100);
		});

	    // Error laten zien als de verbinding met de server is weggevallen
	    setInterval(function() {
	        if (connection === undefined || connection.readyState !== 1) {
	            input.attr('disabled', 'disabled').val('Connection failed.');
	        }
	    }, 3000);

	};

	$scope.getOlderMessages = function() {
		$scope.offset = $scope.offset + $scope.range;
		$scope.loadMessagesFromStorage($scope.range, $scope.offset);
	};

	$scope.refreshMessages = function() {
    	$scope.messages = [];
		$scope.loadMessagesFromStorage($scope.range, $scope.offset);
    };

    $scope.loadMessagesFromStorage = function(range, offset) {
    	var history = JSON.parse(localStorage.getItem('chat-history-'+herName));
		history = history.splice(0, history.length-(range + offset));

		var i = 0;
		for (var key in history) {
			if(i<range) {
	    		$scope.parseMessage(history[key].id, history[key].author, history[key].message, history[key].time);
	    	}else{
	    		break;
	    	}
    		i++;
    	}
    };

	$scope.parseMessage = function(id, author, body, timestamp) {
		// Tijd parsen
		var time = new Date(timestamp);
		
		// Leeg message object aanmaken
		var message = {};

		// Shit toevoegen aan het object
		message.id = id;
		if(author === myName) {
			message.myMessage = true;
		}else{
			message.myMessage = false;
		}
		message.body = body;
		message.time = time.getDate() + ' ' + $scope.monthNames[time.getMonth()] + ' ' + (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());

		// Object in de array zetten
		$scope.messages.push(message);

		// Pagina naar beneden laten scrollen
  		var n = $('#content').height();
		$('.ng-scope').animate({ scrollTop: n }, 0);
	};
});
