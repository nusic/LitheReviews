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
        $scope.course.reviews.push(review);
      });

      $scope.body = '';
      $scope.reviewType = undefined;
    };

    $scope.incrementUpvotes = function(review){
      courses.upvote(course, review);
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
