app.controller("chatController", function($scope, $route, $routeParams, $location, loginFactory, $rootScope){

	var URL = 'www.oli4jansen.nl:81';

	$scope.herId = $routeParams.userId;
	$scope.herName = $routeParams.userName;
	$scope.messageCounter = '?';
	$scope.imageURL = 'img/unknown.png';

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
	    	refreshDOM();
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
	                input.removeAttr('disabled').focus();

	                // Counter instellen
	                $scope.messageCounter = 26 - json.counter;
	                $scope.messageCounter = 'Only ' + $scope.messageCounter + ' messages left.';
	                $scope.$apply();

	            }else if (json.data === 'visible') {
	            	input.removeAttr('disabled').focus();

	            	// Input text instellen
	                $scope.messageCounter = 'Say hi to '+$scope.herName;
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
	            refreshDOM();

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
	          addMessage(json.data.id, json.data.author, json.data.text, json.data.time);

						// Leuk geluidje laten horen
						navigator.notification.beep(1);

	          // Laten weten dat we het bericht ontvangen hebben
	          connection.send(JSON.stringify({ gotMessage: json.data }));
	        } else if (json.type === 'update') {

	        	if(json.counter < 26) {
	                $scope.messageCounter = 26 - json.counter;
	                $scope.messageCounter = 'Only '+$scope.messageCounter+' messages left.';
		        	$scope.$apply();
		        } else if(json.counter === 26 && $scope.status === 'hidden') {
		        	alert('You can see '+$scope.herName+'\'s pictures!');
		        }

	        } else {
	            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
	        }
	    };

	    // Als er op enter gedrukt is: verstuur bericht
	    input.keydown(function(e) {
	        if (e.keyCode === 13) {
	            var msg = $(this).val();
	            if (!msg) return;
	            connection.send(msg);
	            $(this).val('');
	        }
	    });

	    // Error laten zien als de verbinding met de server is weggevallen
	    setInterval(function() {
	        if (connection.readyState !== 1) {
	            input.attr('disabled', 'disabled').val('Connection failed.');
	        }
	    }, 3000);

	    var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

	    // DOM bewerkingsfunctie: message toevoegen
	    function addMessage(id, author, message, timeOri) {
	        var className = '';
	        time = new Date(timeOri);
	        if(author === myName)
	            className = 'myMessage';
	        content.append('<div id="'+id+'" class="chatMessage '+ className +'"" style="opacity: 0;">'
	             + '<span>' + message + '<small>'
 	             + time.getDate() + ' ' + monthNames[time.getMonth()] + ' ' + (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':'
	             + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes())+'</small></span></div>');

  			var n = $('#content').height();
			$('.ng-scope').animate({ scrollTop: n }, 0, function() {
				$('.chatMessage#'+id).animate({opacity: 1}, 150);
			});
	    }

	    function refreshDOM() {
	    	console.log(localStorage.getItem('chat-history-'+herName));

	    	var history = JSON.parse(localStorage.getItem('chat-history-'+herName));
	    	for (var key in history) {
	    		addMessage(history[key].id, history[key].author, history[key].message, history[key].time);
	    	}
	    }
	};
});
