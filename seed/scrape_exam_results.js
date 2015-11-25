var fs = require('fs');

function read(fileName){
	var promise = new Promise(function (resolve, reject){

		fs.readFile(fileName, 'utf8', function (err,data) {
			if(err) return reject(err);

			resolve(data);
		});
	});
	return promise;
}

var liu_exam_results = require('../lib/liu_exam_results.js');
require('../lib/batched_for_each.js');

var fileName = 'scrapes/some_MT_courses.json';
var courses

// Read file with courses
read(fileName)


// Get exam data for all courses
.then(function (data){
	courses = JSON.parse(data);

	return courses.batchedForEach(30, function (course, index, done){
		course.exams = [];
		liu_exam_results.search(course).then(function (examResults){
			course.exams.push(examResults);
			done();
		});
	});
})

// All done
.then(function(){
	courses.forEach(function (course){
		console.log(course);
	});
})