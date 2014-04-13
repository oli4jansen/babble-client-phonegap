app.controller("feedController", function($scope, $sce, $rootScope, feedFactory, loginFactory){

    $scope.status = $sce.trustAsHtml('<div class="loader"><span class="loaderA"></span><span class="loaderMain"></span><span class="loaderB"></span></div>Looking for people');

	// Als de pagina geladen wordt
    $scope.init = function() {
        $('.header h1').html("Babble");

    	// Feed ophalen bij de feedFactory
        if($scope.feed === undefined) {
        	feedFactory.getFeed(loginFactory.accessToken, 0, loginFactory.userId, loginFactory.userInfo.gender, loginFactory.userInfo.likeMen, loginFactory.userInfo.likeWomen, loginFactory.userInfo.latitude, loginFactory.userInfo.longitude, loginFactory.userInfo.searchRadius).success(function(data) {
                $scope.status = $sce.trustAsHtml('');
                if(data.status === '200') {
                    $scope.feed = $scope.parseFeed(data.data);
                }else{
                    $scope.status = $sce.trustAsHtml('We couldn\'t find anyone near you.');
                }
        	}).error(function(data) {
                $scope.status = $sce.trustAsHtml('Something went wrong.');
                alert('Woops:'+JSON.stringify(data));
            });
        }
    };

    $scope.like = function() {
        var herId = $scope.feed[0].id;
        feedFactory.postLiked(loginFactory.userId, herId).success(function(data){
            if(data.status !== '200') {
                alert('Failed to like.');
            }else if(data.data === 'match'){
                $('body').addClass('popup');
                $rootScope.popups.push({name: 'Je moeder', id: herId})
            }
        }).error(function(data){
            alert('Failed to like.');
        });
        $scope.removeFirstCard();
    };

    $scope.dislike = function() {
        feedFactory.postDisliked(loginFactory.userId, $scope.feed[0].id).success(function(data){
            if(data.status !== '200') {
                alert('Failed to dislike.');
            }

        }).error(function(data){
            alert('Failed to like.');
        });
        $scope.removeFirstCard();
    };

    $scope.parseFeed = function(data) {
        for(var key in data) {
            if(data[key].distance < 1) {
                data[key].distance = '< 1 km';
            }else{
                data[key].distance = Math.round(data[key].distance * 10) / 10 + ' km';
            }
        }
        return data;
    };

    $scope.removeFirstCard = function() {
        // Bovenste item uit feed verwijderen
        $scope.feed.splice(0,1);

        // Ook checken of we de array niet aan moeten vullen met nieuwe mensjes
        if($scope.feed.length < 5) {
            // Zo ja, haal de feed op bij de feedFactory
            $scope.status = $sce.trustAsHtml('<div class="loader"><span class="loaderA"></span><span class="loaderMain"></span><span class="loaderB"></span></div>Looking for people');
            feedFactory.getFeed(loginFactory.accessToken, $scope.feed.length, loginFactory.userId, loginFactory.userInfo.gender, loginFactory.userInfo.likeMen, loginFactory.userInfo.likeWomen, loginFactory.userInfo.latitude, loginFactory.userInfo.longitude, loginFactory.userInfo.searchRadius).success(function(data) {
                $scope.status = $sce.trustAsHtml('');
                // Ga elk resultaat langs en push het naar $scope.feed
                if(data.status === '200') {
                    data.data = $scope.parseFeed(data.data);
                    for(var key in data.data) {
                        $scope.feed.push(data.data[key]);
                    }
                }else{
                    $scope.status = $sce.trustAsHtml('We couldn\'t find anyone near you.');
                }
            }).error(function(data){
                $scope.status = $sce.trustAsHtml('Something went wrong.');
            });
        }
    };

    // Pagina laden
    $scope.init();

});
