app.factory('feedFactory', function($http) {
	var factory = {};

	var URL = 'http://www.oli4jansen.nl:81';

	factory.getFeed = function(accessToken, offset, userId, gender, likeMen, likeWomen, latitude, longitude, searchRadius) {
		return $http.post(URL + '/feed/'+userId+'/'+offset+'/'+gender+'/'+likeMen+'/'+likeWomen+'/'+latitude+'/'+longitude+'/'+searchRadius, { accessToken: accessToken });
	};
	factory.postLiked = function(userIdMe, userIdHer) {
		return $http.post(URL + '/user/like', {userIdMe: userIdMe, userIdHer: userIdHer});
	};
	factory.postDisliked = function(userIdMe, userIdHer) {
		return $http.post(URL + '/user/dislike', {userIdMe: userIdMe, userIdHer: userIdHer});
	};
	return factory;
});