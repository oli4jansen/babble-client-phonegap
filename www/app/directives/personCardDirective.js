app.directive('personCard', function() {
  return {
    restrict: 'EAC',
    scope: {
      card: '=personInfo'
    },
    template: '<h2>{{card.name}}, {{card.age}}</h2><p>{{card.description}}</p><span class="half-width"><i class="ion-ios7-navigate-outline"></i> {{card.distance}}</span><span class="half-width"><i class="ion-ios7-people-outline"></i> {{card.mutualFriends.length}} mutual</span>',
    link: function(scope, element, attrs) {
        // Pep binden aan het element
        element.pep({
          cssEaseDuration: 350,
          revert: true,
//					shouldPreventDefault: true,
//					allowDragEventPropagation: false,
          start: function(ev, obj){
            obj.noCenter = false;
          },
          drag: function(ev, obj){

//            var vel = obj.velocity();
//            var rot = (vel.x)/10;
//						scope.rotate(obj.$el, rot);

            if(obj.pos.x - obj.initialPosition.left > 100) {
              $('.like-buttons .like').addClass('selected');
              $('.like-buttons .dislike').removeClass('selected');
            }else if(obj.pos.x - obj.initialPosition.left < -100) {
              $('.like-buttons .like').removeClass('selected');
              $('.like-buttons .dislike').addClass('selected');
            }else{
              $('.like-buttons .like').removeClass('selected');
              $('.like-buttons .dislike').removeClass('selected');
            }
          },
          stop: function(ev, obj){
//						scope.rotate(obj.$el, 0);
            $('.like-buttons .like').removeClass('selected');
            $('.like-buttons .dislike').removeClass('selected');

            var vel = obj.velocity();

            if(vel.x > 300 || (obj.pos.x - obj.initialPosition.left > 60)) {
              scope.$parent.$parent.like();
              scope.$apply();
//							obj.$el.fadeOut(100);
            }else if(vel.x < -300 || (obj.pos.x - obj.initialPosition.left < -60)) {
              scope.$parent.$parent.dislike();
              scope.$apply();
//							obj.$el.fadeOut(100);
            }

          }
        });
      scope.$on('$destroy', function() {
        // Unbind pep van het element
        $.pep.unbind(element);
      });
      scope.rotate = function rotate($obj, deg){
        $obj.css({
            "-webkit-transform": "rotate("+ deg +"deg)",
               "-moz-transform": "rotate("+ deg +"deg)",
                "-ms-transform": "rotate("+ deg +"deg)",
                 "-o-transform": "rotate("+ deg +"deg)",
                    "transform": "rotate("+ deg +"deg)"
          });
      };
    }
  }
});
