$(function () {
    // Alle gebruikte DOM elementen
    var content = $('#content');
    var input = $('#input');
 
    // my name sent to the server
    if(window.location.hash) {
        var myName = '114904';
        var herName = '114056';
    }else{
        var myName = '114056';
        var herName = '114904';
    }
 
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // Als websocket het niet doet: 
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
    }
 
    // Verbinding met server maken
    var connection = new WebSocket('ws://192.168.2.7');
 
    // Verbindingsproblemen:
    connection.onerror = function (error) {
        content.html('Sorry, but there\'s some problem with your connection or the server is down.');
    };

    // Als de verbinding gemaakt is: stuur eigen naam en naam waarmee je wil chatten
    connection.onopen = function () {
        connection.send(JSON.stringify({ myName: myName, herName: herName }));
    };
 
    // Binnenkomende berichten:
    connection.onmessage = function (message) {
        // JSON parsen naar een bruikbaar object/array
        try {
            var json = JSON.parse(message.data);
            console.log(message);
        } catch (e) {
            console.log('Het ontvangen bericht in corrupt: ', message.data);
            return;
        }
 
        // Checken wat voor soort bericht je ontvangen hebt
        if (json.type === 'status') {
            if(json.data === 'connected')
                input.removeAttr('disabled').focus();

        } else if (json.type === 'history') {

            for (var i=0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text, new Date(json.data[i].time));
            }
        } else if (json.type === 'message') { // it's a single message
            input.removeAttr('disabled'); // let the user write another message
            addMessage(json.data.author, json.data.text, new Date(json.data.time));
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };
 
    // Als er op enter gedrukt is: verstuur bericht
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            connection.send(msg);
            $(this).val('');
            input.attr('disabled', 'disabled');
        }
    });
 
    // Error laten zien als de verbinding met de server is weggevallen
    setInterval(function() {
        if (connection.readyState !== 1) {
            input.attr('disabled', 'disabled').val('Error: Unable to comminucate with the WebSocket server.');
        }else{
            if(input.attr('disabled') === 'disabled') {
                input.removeAttr('disabled').val('').focus();
            }
        }
    }, 3000);
 
    // DOM bewerkingsfunctie: message toevoegen
    function addMessage(author, message, dt) {
        var className = '';
        if(author === myName)
            className = 'myMessage';
        content.append('<div class="chatMessage '+ className +'"">' + author + ' @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + '<br><span>' + message + '</span></div>');
        $("html, body").animate({ scrollTop: $(document).height() }, "normal");
    }
});