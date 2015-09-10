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
