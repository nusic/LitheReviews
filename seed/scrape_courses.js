var fs = require('fs');

var liu_courses = require('../lib/liu_courses.js');
var liu_course_info = require('../lib/liu_course_info.js');

var programme = 'MT';
var year = 2014;

var outputFile = 'courses_'+programme+'_'+year+'.json';

console.log('Scraping courses of: ' + programme);

var courseArray = [];
var numCourses = -1;
var numCourseInfoScraped = 0;

liu_courses.search(programme, function (err, courses){
	if(err) return console.error(err);

	numCourses = courses.length;
	console.log("Found " + numCourses + " courses. Scraping course info ..");

	courses.forEach(function(course, i){
		course.year = year;

		(function (courseIndex){
			liu_course_info.search(course, function (err, course){
				if(err) return console.error(err);

				courseArray[courseIndex] = course;
				numCourseInfoScraped++;

				console.log(numCourseInfoScraped + '/' + numCourses + ' : ' + course.code + " - " + course.title);

				if(numCourseInfoScraped === numCourses){
					onDone();
				}
			});
		})(i)
	});
});

function onDone(){
	console.log('Done scraping');
	
	console.log('saving to ' + outputFile);
	var jsonStr = JSON.stringify(courseArray, null, 2);

	fs.writeFile(outputFile, jsonStr, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("File saved");
	});
}
