var fs = require('fs');

var liu_exam_results = require('../lib/liu_exam_results.js');
require('../lib/batched_for_each.js');

var fileName = 'scrapes/all_lith_courses_2015.json';


fs.readFile(fileName, 'utf8', function (err,data) {
	if(err) return console.error(err);

	var courses = JSON.parse(data);
	var allExamResults = new Array(courses.length);

	function fn(course, index, callback){
		liu_exam_results.search(course, function (err, examResults){
			console.log(index + '. ' + course.code + ' - ' + examResults.length + ' exams');
			allExamResults[index] = examResults;
			callback();
		});
	}

	function onDone(){
		console.log('done');
		console.log(allExamResults);
	}

	//courses.batchedForEach(30, fn, onDone);

	courses.batchedForEach(100, function (course, index, callback){
		liu_exam_results.search(course, function (err, examResults){
			if(!err) allExamResults[index] = examResults;
			console.log(index + '. ' + course.code + ' - ' + examResults.length + ' exams');
			callback();
		});	
	}, function(){
		console.log('done');
	})
});