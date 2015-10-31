var liu_courses = require('./liu_courses.js');
var liu_course_info = require('./liu_course_info.js');
var liu_exam_results = require('./liu_exam_results.js');

function test_course_info(){
	liu_course_info.search({code: 'TNA001', year: 2015}, function (err, res) {
		console.log(JSON.stringify(res, null, 2));
	});	
}

function test_courses(){
	liu_courses.search({programme: 'MT', year: 2015}, function (err, courses){
		console.log(courses);
	});	
}

function test_exam_results(code, year){
	liu_exam_results.search({code: code, year: year}, function (err, examStats){
		console.log(JSON.stringify(examStats[2].examType));
	});
}

test_course_info();
//test_exam_results('TNA001', 2014);