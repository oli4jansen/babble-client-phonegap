// App aanmaken
var app = angular.module('TinderPro', ['ngRoute', 'hammer', 'ngAnimate']).config(function($routeProvider) {
	// Routes opgeven
	$routeProvider.when('/', {

		templateUrl: 'app/views/login.html',
		controller: 'loginController'
	
	}).when('/feed', 
	{
	
		templateUrl: 'app/views/feed.html',
		controller: 'feedController'
	
	}).when('/contacts', 
	{
	
		templateUrl: 'app/views/contacts.html',
		controller: 'contactsController'
	
	}).when('/chat/:userId/:userName', 
	{
	
		templateUrl: 'app/views/chat.html',
		controller: 'chatController'
	
	}).when('/match/:userId', 
	{
	
		templateUrl: 'app/views/match.html',
		controller: 'matchController'
	
	}).when('/settings', 
	{
	
		templateUrl: 'app/views/settings.html',
		controller: 'settingsController'

	}).when('/completeProfile', 
	{
	
		templateUrl: 'app/views/complete.html',
		controller: 'completeProfileController'

	}).otherwise({redirectTo: '/'});

}).run( function($rootScope, $location, loginFactory) {
	// Als de route wijzigt
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		// Checken of er ingelogd is
		if ( loginFactory.loggedIn !== true ) {
			// Zo nee, laat inloggen
			$location.path( "/" );
		}
    });
 });