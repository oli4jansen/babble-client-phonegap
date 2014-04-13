app.directive('personCard', function() {
  return {
    restrict: 'EAC',
    scope: {
      card: '=personInfo'
    },
    template: '<h2>{{card.name}}, {{card.age}}</h2><p>{{card.description}}</p><span class="half-width"><i class="ion-ios7-navigate-outline"></i> {{card.distance}}</span><span class="half-width"><i class="ion-ios7-people-outline"></i> {{card.mutualFriends.length}} mutual</span>',
    link: function(scope, element, attrs) {
        var revert = true;

        // Pep binden aan het element
        element.pep({
          cssEaseDuration: 350,
          revert: true,
          revertIf: function() {
            return revert;
          },
          start: function(ev, obj){
            obj.noCenter = false;
            obj.$el.addClass('keepAlive');
          },
          drag: function(ev, obj){
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
          stop: function(ev, obj) {
            $('.like-buttons .like').removeClass('selected');
            $('.like-buttons .dislike').removeClass('selected');

            var vel = obj.velocity();

            if(vel.x > 300 || (obj.pos.x - obj.initialPosition.left > 60)) {
              obj.$el.css({'left': '0', 'top': '0', '-webkit-transform': 'matrix(1, 0, 0, 1, 0, 0)', 'transform': 'matrix(1, 0, 0, 1, 0, 0)'});

              revert = false;

              scope.$parent.$parent.like();
              scope.$apply();
            }else if(vel.x < -300 || (obj.pos.x - obj.initialPosition.left < -60)) {
              obj.$el.css({'left': '0', 'top': '0', '-webkit-transform': 'matrix(1, 0, 0, 1, 0, 0)', 'transform': 'matrix(1, 0, 0, 1, 0, 0)'});

              revert = false;

              scope.$parent.$parent.dislike();
              scope.$apply();
            }
          },
          rest: function(ev, obj) {
            obj.$el.removeClass('keepAlive');
          }
        });
      scope.$on('$destroy', function() {
        // Unbind pep van het element
        $.pep.unbind(element);
      });
    }
  }
});
