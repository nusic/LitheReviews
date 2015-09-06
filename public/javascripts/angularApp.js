var app = angular.module('liuReviews', ['ui.router']);

/*  CONFIG  */
app.config([
'$stateProvider',
'$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: '/index.html',
    controller: 'MainController',
    resolve: {
      coursePromise: ['courses', function(courses){
        return courses.getAll();
      }]
    }
  })

  .state('courses', {
    url: '/courses/{id}',
    templateUrl: '/courses.html',
    controller: 'CourseController',
    resolve: {
      course: ['$stateParams', 'courses', function ($stateParams, courses){
        return courses.get($stateParams.id);
      }]
    }
  });

  $urlRouterProvider.otherwise('home');
}]);

/* FACTORIES */
app.factory('courses', ['$http', function($http){
  // Create model for courses
  var o = {
    courses: []
  };

  o.getAll = function(){
    return $http.get('/courses').success(function(data){
      angular.copy(data, o.courses);
    });
  };

  o.get = function(id){
    return $http.get('/courses/' + id).then(function(res){
      return res.data;
    });
  };

  o.getStats = function(id){
    return $http.get('/courses/' + id + '/examstats').then(function(res){
      return res.data;
    });
  }

  o.addReview = function(courseId, review){
    return $http.post('/courses/' + courseId + '/reviews/', review);
  };

  o.upvote = function(course, review){
    return $http.put('/courses/' + course._id + '/reviews/' + review._id + '/upvote')
      .success(function(data){
        review.upvotes += 1;
      })
      .catch(function (err){
        console.log(err);
      });
  };

  return o;
}]);

app.controller('MainController',[
  '$scope',
  'courses',
  function ($scope, courses){
    $scope.courses = courses.courses;

    $scope.getRating = function (course){
      
      if(!course.reviews.length) return "?";

      var sum = 0;
      course.reviews.forEach(function(review){
        sum += parseFloat(review.rating);
      });
      var avg = sum / course.reviews.length;
      return avg.toFixed(1) + "/5";
    };
  }
]);

app.controller('CourseController', [
  '$scope',
  'courses',
  'course',
  function ($scope, courses, course){
    $scope.course = course;
    courses.getStats(course._id).then(function(examstats){
      $scope.examstats = examstats;
    });

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
      return (100 * satisfaction / totalUpvotes).toFixed(0);
    }
  }
]);

