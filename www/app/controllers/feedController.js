app.controller("feedController", function($scope, $sce, $rootScope, feedFactory, loginFactory){

    $scope.status = $sce.trustAsHtml('<div class="loader"></div>Looking for people');

	// Als de pagina geladen wordt
    $scope.init = function() {
        $('.header h1').html("Babble");
        $('body').css("background-image", "url('img/background.png')").css("color", "white");

    	// Feed ophalen bij de feedFactory
        if($scope.feed === undefined) {
        	feedFactory.getFeed(loginFactory.accessToken, 0, loginFactory.userId, loginFactory.userInfo.gender, loginFactory.userInfo.likeMen, loginFactory.userInfo.likeWomen, loginFactory.userInfo.latitude, loginFactory.userInfo.longitude, loginFactory.userInfo.searchRadius).success(function(data) {
                $scope.status = 'Uhoh, you went through all of them.';
                if(data.status === '200') {
                    $scope.feed = $scope.parseFeed(data.data);
                }else{
                    alert(JSON.stringify(data));
                }
        	}).error(function(data) {
                alert(JSON.stringify(data));
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
            $scope.status = $sce.trustAsHtml('<div class="loader"></div>Looking for people');
            feedFactory.getFeed(loginFactory.accessToken, $scope.feed.length, loginFactory.userId, loginFactory.userInfo.gender, loginFactory.userInfo.likeMen, loginFactory.userInfo.likeWomen, loginFactory.userInfo.latitude, loginFactory.userInfo.longitude, loginFactory.userInfo.searchRadius).success(function(data) {
                $scope.status = 'Uhoh, you went through all of them.';
                // Ga elk resultaat langs en push het naar $scope.feed 
                if(data.status === '200') {
                    $scope.feed = $scope.parseFeed(data.data);
                    for(var key in data) {
                        $scope.feed.push(data[key]);
                    }
                }else{
                    alert(JSON.stringify(data));
                }
            });
        }
    };

    $scope.handleGesture = function(ev) {
        // disable browser scrolling
        ev.gesture.preventDefault();

        var border = 50;

        switch(ev.type) {
            case 'drag':
                    var rotation = ev.gesture.deltaX / border;
                    var translationX = ev.gesture.deltaX;
                    var translationY = ev.gesture.deltaY;

                    $(ev.target).parent().css("left", translationX+"px").css("top", translationY+"px").css("transform", "rotate("+rotation+"deg)");

                    if(Math.abs(ev.gesture.deltaX) > border) {
                        if(ev.gesture.direction == 'left'){
                            $(".button-holder .like").removeClass("selected");
                            $(".button-holder .dislike").addClass("selected");
                        }else if(ev.gesture.direction == 'right'){
                            $(".button-holder .like").addClass("selected");
                            $(".button-holder .dislike").removeClass("selected");
                        }
                    }else{
                        $(".button-holder .like").removeClass("selected");
                        $(".button-holder .dislike").removeClass("selected");
                    }
                    
                    break;

            case 'release':
                    // more then 50% moved, navigate
                    if(Math.abs(ev.gesture.deltaX) > border) {
                        
                        var user = $scope.feed[0];

                        if(ev.gesture.direction == 'left') {
                            this.dislike();
                        } else {
                            this.like();
                        }
                        $(".button-holder button").removeClass("selected");
                        $(".card").animate({left:"0", top: "0", transform: "none"}, 0);
                    } else {
                        $(".button-holder button").removeClass("selected");
                        $(ev.target).parent()
                        $(".card").animate({left:"0", top: "0", transform: "none"}, 150);
                    }
                    break;
        }
    };

    $scope.$on('$destroy', function iVeBeenDismissed() {
        $('body').css("background-image", "none");
    });

    // Pagina laden
    $scope.init();

});