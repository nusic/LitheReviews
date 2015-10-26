angular.module('myApp').controller('CourseController', [
  '$scope',
  'courses',
  'course',
  function ($scope, courses, course){
    $scope.course = course;
    $scope.loadingComment = false;

    $scope.goToInput = function(){
      window.scrollBy(0, 200);
    }

    $scope.addReview = function(){
      if($scope.body === '') return;

      $scope.loadingComment = true;
      courses.addReview(course._id, {
        body: $scope.body,
        positive: $scope.reviewType == '+',
      }).success(function(review){
        review.voted = false;
        $scope.loadingComment = false;
        $scope.course.reviews.push(review);
      });

      $scope.body = '';
      $scope.reviewType = undefined;
    };

    $scope.incrementUpvotes = function(review){
      //Enumerate tr:s
      $('tr[ng-repeat]').each(function(i, ele){
        ele.setAttribute('id', i);
      });

      review.upvotes++;
      courses.upvote(course, review);
      review.voted = true;
      $scope.course.satisfactionPercentage = $scope.calculateSatisfactionPercentage();
    };

    $scope.calculateSatisfactionPercentage = function(){
      if(!course.reviews || !course.reviews.length) {
        return undefined;
      }

      var totalUpvotes = 0;
      var satisfaction = 0;
      course.reviews.forEach(function (review){
        totalUpvotes += review.upvotes;
        if(review.positive){
          satisfaction += review.upvotes;
        }
      });

      if(!totalUpvotes) return undefined;
      return (100 * satisfaction / totalUpvotes).toFixed(0);
    }
  }
]);


angular.module('myApp').animation('.comment', function(){
  return {
    move: function(element, done){
      //find new position of element
      var diff = -1;

      var $eles = $('tr[ng-repeat]');
      for (var i = 0; i < $eles.length; i++) {
        if($eles[i].innerHTML === element[0].innerHTML){
          diff = +$eles[i].id - i;
          break;
        }
      };
      
      if(diff > 0){
        element.css('top', diff*40 + 'px');
        $(element).animate({
          top: "0px"
        }, done);
      }

      return function(isCancelled){
        if(isCancelled){
          $(element).stop();
        }
      }
    }
  };
})