app.controller("chatController", function($scope, $route, $routeParams, $location, loginFactory, $rootScope){

	var URL = 'www.oli4jansen.nl:81';

	$scope.myId = loginFactory.userId;

	// Uit de URL halen we de naam en het ID van degene met wie we gaan chatten
	$scope.herId = $routeParams.userId;
	$scope.herName = $routeParams.userName;

	$scope.status = 'Updating chat, please wait..';
	$scope.imageURL = 'img/unknown.png';

	$scope.offset = 0;
	$scope.range = 10;

	$scope.messages = [];
	$scope.olderMessagesAvailable = false;

	$scope.monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

	$scope.init = function() {
		$('.header h1').html($scope.herName);

		var content = $('#content');
		var input = $('#input');

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
	        connection.send(JSON.stringify({ myName: $scope.myId, herName: $scope.herId }));
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

	        	var history = localStorage.getItem('chat-history-'+$scope.herId);
	        	if(history === null || history === 'null') {
	        		// History bestond nog niet in localStorage
	           		console.log('Your message history storage for this chat was empty, so we created one.');
	        		history = [];
	        	}else{
	        		// History bestond al in localStorage
	        		history = JSON.parse(history);
	        	}

	        	// Voor elk ontvangen bericht v/d nog niet gelezen chatgeschiedenis:
	            json.data.forEach(function(item){
	            	// Bericht toevoegen aan history array
	            	history.push({ id: item.id, author: item.author, message: item.text, time: new Date(item.time) });
	            });

	            // History array weer in localStorage zetten
	            localStorage.setItem('chat-history-'+$scope.herId, JSON.stringify(history));

	            // Hele DOM in 1x updaten ipv per bericht
	            $scope.refreshMessages();

	            connection.send(JSON.stringify({ gotMessage: json.data }));
	        } else if (json.type === 'message') { // it's a single message
	            // Add message to localStorage
	            var history = localStorage.getItem('chat-history-'+$scope.herId);
	           	if(history === null || history === 'null') {
	           		// History bestond nog niet in localStorage
	           		console.log('Your message history storage for this chat was empty, so we created one.');
	        		history = [];
	        	}else{
	        		// History bestond al in localStorage
	        		history = JSON.parse(history);
	        	}

	        	// Dit bericht aan de array toevoegen
	        	history.push({ id: json.data.id, author: json.data.author, message: json.data.text, time: new Date(json.data.time) });

	        	// Array weer in localstorage zetten
	        	localStorage.setItem('chat-history-'+$scope.herId, JSON.stringify(history));

	        	// Bericht ook toevoegen aan DOM
	        	$scope.parseMessage(json.data.id, json.data.author, json.data.text, json.data.time);

				// Leuk geluidje laten horen
				if(json.data.author !== $scope.myId) navigator.notification.beep(1);

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

	// Functie die aangeroepen wordt als de huidige berichten mogen blijven staan en er oudere bij moeten komen
	$scope.getOlderMessages = function() {
		$scope.offset = $scope.offset + $scope.range;
		$scope.loadMessagesFromStorage($scope.range, $scope.offset);
	};

	// Functie die aangeroepen wordt als alle berichten opnieuw opgehaald moeten worden
	$scope.refreshMessages = function() {
    	$scope.messages = [];
		$scope.loadMessagesFromStorage($scope.range, $scope.offset);
    };

    // Is verantwoordelijk voor het ophalen van de berichten uit de opslag
    $scope.loadMessagesFromStorage = function(range, offset) {
    	console.log('Getting messages: range:'+range+' & offset:'+offset);

    	var history = localStorage.getItem('chat-history-'+$scope.herId);
		
		if(history !== null && history !== 'null') {
			history = JSON.parse(history);

			console.log('Total number of messages available in storage:'+history.length);

			history = history.splice(0, history.length-(range + offset));

			var i = 0;
			history.forEach(function(item) {
				if(i<range) {
		    		$scope.parseMessage(item.id, item.author, item.message, item.time);
		    	}
	    		i++;
	    	});
	    }
    };

	$scope.parseMessage = function(id, author, body, timestamp) {
		// Tijd parsen
		var time = new Date(timestamp);
		
		// Leeg message object aanmaken
		var message = {};

		// Shit toevoegen aan het object
		message.id = id;
		if(author === $scope.myId) {
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
