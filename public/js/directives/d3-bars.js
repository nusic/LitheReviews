angular.module('myApp')
	.directive('d3Bars', ['$window', '$timeout', 'd3Service', function ($window, $timeout, d3Service) {

		// Link function to be returned
		function link(scope, element, attrs){
			d3Service.d3().then(function (d3){
				//d3 is the raw d3 object

			var title = scope.exam.examType;
	  		var data = scope.exam.stats;

			var margin = {top: 10, right: 45, bottom: 20, left: 0};
			var width = 150;
			var height= 150;

			var y = d3.scale.linear()
		    	.range([height, 0]);

			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width]);

			var svg = d3.select(element[0])
					.append('svg')
					.attr('width', width + margin.left + margin.right)
					.attr('height', height + margin.bottom + margin.top);

			d3.select(element[0]).append('p')
				.attr('class', 'title')
				.text('Betyg för ' + title);

			x.domain(data.map(function(d){ return d.grade; }));
			y.domain([0, d3.max(data, function(d){ return d.freq; })]);

			var barWidth = width / 5;

			var bar = svg.selectAll('g')
				.data(data)
				.enter().append('g')
				.attr('transform', function(d,i) {
					return 'translate(' + (margin.left + i*barWidth) + ',0)';
				});

			bar.append('rect')
				.attr('y', function (d) { return margin.top + y(d.freq); })
				.attr('height', function (d) { return height - y(d.freq); })
				.attr('width', barWidth - 1);

			bar.append('text')
				.attr('x', barWidth / 2)
				.attr('y', function (d) { return margin.top + y(d.freq) - 10; })
				.attr('dy', '.75em')
				.attr('class', 'bar_label')
				.text(function (d) { return d.freq; });

			bar.append('text')
				.attr('x', barWidth / 2)
				.attr('y', function (d) { return margin.top + height + 5; })
				.attr('dy', '0.75em')
				.attr('class', 'x_label')
				.text(function (d) { return d.grade; });

			})
		};

		return {
			restrict: 'EA',
			scope: {
				exam: '=',
			},
			link: link
		};
	}
]);

