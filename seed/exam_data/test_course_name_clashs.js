// Load models
var mongoose = require('mongoose');
require('../models/Courses');
var Course = mongoose.model('Course');

//Connect to mongo db
var mongoose_url = 'mongodb://' + process.env.MONGOLAB_USER + 
    ':' + process.env.MONGOLAB_PW + '@ds043694.mongolab.com:43694/liureviews';
mongoose.connect(mongoose_url, function(err){
	console.log('connected');

	var query = {year: 2015};

	var t0 = Date.now();
	Course.find(query, function (err, courses){
		if(err) return console.error(err);

		console.log('query time: ' + (Date.now() - t0) + 'ms');
		
		var titles = {};
		courses.forEach(function(course){
			if(!titles[course.title]){
				titles[course.title] = [];
			}
			
			titles[course.title].push(course.code);
			
		});

		for(courseName in titles){
			if(titles.hasOwnProperty(courseName)){
				if(titles[courseName].length > 1){
					console.log(courseName + ': ' + titles[courseName]);
				}
			}
		}

		mongoose.disconnect();
	});
});



