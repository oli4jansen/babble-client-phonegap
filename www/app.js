// Angular app aanmaken
var app = angular.module('Babble', ['ngRoute', 'ngAnimate']).config(function($routeProvider) {

	// Routes opgeven
	$routeProvider.when('/', {
		// Route / is de login pagina

		templateUrl: 'app/views/login.html',
		controller: 'loginController'

	}).when('/feed',
	{
		// Route /feed is de feed met personen

		templateUrl: 'app/views/feed.html',
		controller: 'feedController'

	}).when('/contacts',
	{
		// Route /contacts is het overzicht met alle matches

		templateUrl: 'app/views/contacts.html',
		controller: 'contactsController'

	}).when('/chat/:userId/:userName',
	{
		// Route /chat/:userId/:userName is het chatten met persoon met userId :userId

		templateUrl: 'app/views/chat.html',
		controller: 'chatController'

	}).when('/match/:userId',
	{
		// Route /match/:userId is de pagina met details over de match met gebruiker met userId :userId

		templateUrl: 'app/views/match.html',
		controller: 'matchController'

	}).when('/settings',
	{
		// Route /settings is de pagina met instellingen

		templateUrl: 'app/views/settings.html',
		controller: 'settingsController'

	}).when('/completeProfile',
	{
		// Route /completeProfile is de pagina die ingevuld moet worden voordat het account aangemaakt wordt

		templateUrl: 'app/views/complete.html',
		controller: 'completeProfileController'

	}).otherwise(
	{
		redirectTo: '/'
	});

}).run( function($rootScope, $location, loginFactory) {
	// 300ms delay op mobiel weghalen
	FastClick.attach(document.body);

	// Als de route wijzigt...
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		// ..checken of er ingelogd is
		if ( loginFactory.loggedIn !== true ) {
			// Zo nee, laat inloggen, stuur naar login pagina
			$location.path( "/" );
		}
    });
 });


app.directive('babbleDraggable', function() {
	return {
    restrict: 'EAC',
		link: function(scope, element, attrs) {
			scope.$watch(attrs.myDirective, function(value) {
				// Pep binden aan het element
				element.pep({
					overlapFunction: false,
					useCSSTranslation: false,
					cssEaseDuration: 350,
					revert: true,
					shouldPreventDefault: true,
					allowDragEventPropagation: false,
					start: function(ev, obj){
						obj.noCenter = false;
					},
					drag: function(ev, obj){
						console.log(ev);

						var vel = obj.velocity();
						var rot = (vel.x)/10;
						rotate(obj.$el, rot);

						if(obj.pos.x - obj.initialPosition.left > 100) {
							obj.$el.css('background', 'green');
						}else if(obj.pos.x - obj.initialPosition.left < -100) {
							obj.$el.css('background', 'red');
						}else{
							obj.$el.css('background', 'gray');
						}
					},
					stop: function(ev, obj){
						rotate(obj.$el, 0);
						obj.$el.css('background', 'gray');

						var vel = obj.velocity();

						if(vel.x > 300 || (obj.pos.x - obj.initialPosition.left > 100)) {
				//              alert('Liked');
							this.like();
						}else if(vel.x < -300 || (obj.pos.x - obj.initialPosition.left < -100)) {
				//              alert('Disliked');
							this.dislike();
						}

					}
				});
			});
			scope.$on('$destroy', function() {
				// Unbind pep van het element
				$.pep.unbind(element);
			});
		}
	}
});
