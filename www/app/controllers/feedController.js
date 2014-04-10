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
                    $scope.feed.forEach(function(item){
                      $('#'+item.id).pep();
                    });
                }else{
                    $scope.status = $sce.trustAsHtml('We couldn\'t find anyone near you.');
                }
        	}).error(function(data) {
                $scope.status = $sce.trustAsHtml('Something went wrong.');
                alert('Woops:'+JSON.stringify(data));
            });
        }

/*{
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
}*/

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
                    $scope.feed = $scope.parseFeed(data.data);
                    for(var key in data) {
                        $scope.feed.push(data[key]);
                    }
                }else{
                    $scope.status = $sce.trustAsHtml('We couldn\'t find anyone near you.');
                }
            }).error(function(data){
                $scope.status = $sce.trustAsHtml('Something went wrong.');
            });
        }
    };

/*    $scope.handleGesture = function(ev) {
        // disable browser scrolling
        ev.gesture.preventDefault();
        ev.preventDefault();

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
    };*/

    $scope.rotate = function rotate($obj, deg){
      $obj.css({
          "-webkit-transform": "rotate("+ deg +"deg)",
             "-moz-transform": "rotate("+ deg +"deg)",
              "-ms-transform": "rotate("+ deg +"deg)",
               "-o-transform": "rotate("+ deg +"deg)",
                  "transform": "rotate("+ deg +"deg)"
        });
    }

    $scope.$on('$destroy', function iVeBeenDismissed() {
        $('body').css("background-image", "none");
    });

    // Pagina laden
    $scope.init();

});
