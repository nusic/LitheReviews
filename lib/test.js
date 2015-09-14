var liu_courses = require('./liu_courses.js');
var liu_master_courses = require('./liu_master_courses.js');
var liu_course_info = require('./liu_course_info.js');

//liu_course_info.search({code: 'TDDB84', year: 2015}, function (err, res) {
//	console.log(res);
//});

liu_master_courses.search({programme: 'MT', year: 2015}, function(err, courses){
	console.log(courses);
});