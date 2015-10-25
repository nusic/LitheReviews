angular.module('myApp').factory('courses', ['$http', function($http){
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
      .success(function(rev){
        review.upvotes = rev.upvotes;
      })
      .catch(function (err){
        console.log(err);
      });
  };

  return o;
}]);