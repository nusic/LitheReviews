angular.module('myApp').controller('CourseController', [
  '$scope',
  'courses',
  'course',
  function ($scope, courses, course){
    $scope.course = course;

    $scope.addReview = function(){
      if($scope.body === '') return;

      courses.addReview(course._id, {
        body: $scope.body,
        positive: $scope.reviewType == '+',
      }).success(function(review){
        review.voted = false;
        $scope.course.reviews.push(review);
      });

      $scope.body = '';
      $scope.reviewType = undefined;
    };

    $scope.incrementUpvotes = function(review){
      review.upvotes++;
      courses.upvote(course, review);
      review.voted = true;
    };

    $scope.satisfactionPercentage = function(){
      if(!course.reviews) return undefined;

      var totalUpvotes = 0;
      var satisfaction = 0;
      course.reviews.forEach(function (review){
        totalUpvotes += review.upvotes;
        if(review.positive){
          satisfaction += review.upvotes;
        }
      });
      if(!totalUpvotes) return 50;
      return (100 * satisfaction / totalUpvotes).toFixed(0);
    }
  }
]);
