angular.module('d3', []).factory('d3Service', [function(){
  var d3;

  d3.test = function(){
    console.log("TESTING TESTING!");
  }

  return d3;
}]);


var app = angular.module('liuReviews', ['ui.router', 'd3']);

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
    courses.getStats(course._id).then(function(exams){
      $scope.exams = exams;

      barChart(".chart", exams[0]);
    });

    $scope.addBarChart = function(selector, exam){
      barChart(selector, exam);
    }

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



function barChart(selector, exam){
  var title = exam.examType;
  var data = exam.stats;

  var margin = {top: 40, right: 10, bottom: 40, left:10};

  var width = 150;
  var height= 150;

  var y = d3.scale.linear()
      .range([height, 0]);

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

  var chart = d3.select(selector)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.bottom + margin.top);

  x.domain(data.map(function(d){ return d.grade; }));
  y.domain([0, d3.max(data, function(d){ return d.freq; })]);

  var barWidth = width / 5;

  var bar = chart.selectAll('g')
      .data(data)
      .enter().append('g')
      .attr('transform', function(d,i) {
        return 'translate(' + (margin.left + i*barWidth) + ',0)';
      });

  bar.append('rect')
      .attr('y', function (d) { return margin.top + y(d.freq); })
      .attr('height', function (d) { return height - y(d.freq); })
      .attr('width', barWidth - 1);

  chart.append("text")
      .attr("class", "title")
      .attr("x", (width + margin.left + margin.right)/2)
      .attr("y", 20)
      .text(title);

  bar.append('text')
      .attr('x', barWidth / 2)
      .attr('y', function (d) { return margin.top + y(d.freq) + 3; })
      .attr('dy', '.75em')
      .attr('class', 'bar_label')
      .text(function (d) { return d.freq; });

  bar.append('text')
      .attr('x', barWidth / 2)
      .attr('y', function (d) { return margin.top + height + 5; })
      .attr('dy', '.75em')
      .attr('class', 'x_label')
      .text(function (d) { return d.grade; });
}

angular.module('liuReviews.directives', ['d3'])
  .directive('blogBarChart', ['d3Service', function (d3Service){
    console.log('in directive blogBarChart');
    return {
      restrict: 'EA',
      scope: {},
      link: function(scope, element, attrs){
        d3Service.d3().then(function (d3){
          //d3 is the raw d3 object

          window.onresize = function() {
            scope.$apply();
          };


          var svg = d3.select('#myChart');
          svg.selectAll('*').remove();
          svg.append('svg')
          svg.style('width', '100%');

        });
      },
    };
  }]);