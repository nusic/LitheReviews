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

  o.getForProgram = function(program){
    return $http.get('/program/' + program).then(function(res){
      angular.copy(res.data, o.courses);
    });
  }

  o.get = function(id){
    return $http.get('/courses/' + id).then(function(res){
      res.data.exams = setPotentialGraphHides(res.data.exams);
      return res.data;
    });
  };

  o.getStats = function(id){
    return $http.get('/courses/' + id + '/examstats').then(function(res){
      console.log(res);
      return setPotentialGraphHides(res.data);
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

  function setPotentialGraphHides(examStatsJSON){
    var numShow = 3;

    if(examStatsJSON.length <= numShow){
      examStatsJSON.noHides = true;
      return examStatsJSON;
    }

    //give score
    examStatsJSON.forEach(function (exam, i){
      examStatsJSON[i].score = exam.stats.length;
      var numDifferentGrades = 0;
      exam.stats.forEach(function(d){
        numDifferentGrades += +(d.freq > 0);
      });
      examStatsJSON[i].score += numDifferentGrades;
      examStatsJSON[i].score += 0.5*Math.log(exam.total);
    });

    examStatsJSON = examStatsJSON.sort(function(e1, e2){
      return e1.score < e2.score;
    });

    for (var i = numShow; i < examStatsJSON.length; i++) {
      examStatsJSON[i].hide = true;
    };
    return examStatsJSON;
  }

  return o;
}]);