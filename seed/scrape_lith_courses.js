var fs = require('fs');

var liu_courses = require('../lib/liu_courses.js');
var liu_course_info = require('../lib/liu_course_info.js');

//http://www.lith.liu.se/sh/forkortningar.html
var year = 2015;

//var outputFile = 'all_lith_courses_'+year+'.json';
var outputFile = 'MT_CS_courses_'+year+'.json';

require('../lib/batched_for_each.js');

var lithe_test_programs = [{code: 'MT'}, {code: 'CS'}];
var programs = lithe_test_programs;
var courseCodeToCourse = {};

programs.batchedForEach(10, perProgramFn, onPerProgramDone)

function perProgramFn(program, programIndex, callback){
	var courseQuery = {program: program.code, year: year};
	liu_courses.search(courseQuery, function(err, courses){
		if(err) console.error(err);

		console.log('  ' + programIndex + '/' + programs.length + ': ' + program.code + ' -> ' + courses.length + ' courses');

		// Add course to map
		courses.forEach(function (course){
			// Add program specific
			if(!program.specific) program.specific = {};
			if(!program.specific[course.code]) program.specific[course.code] = {};
			program.specific[course.code].period = course.period;


			// Add course
			if(!courseCodeToCourse[course.code]){
				course.programs = [program.code];
				courseCodeToCourse[course.code] = course;
			}
			else{
				courseCodeToCourse[course.code].programs.push(program.code);
			}
		});
		callback();
	});
}

function onPerProgramDone(){

	//console.log(JSON.stringify(programs));
	console.log('stopping to prevent DOS');

	return;
	var courses = Object.keys(courseCodeToCourse).map(function (key) {
		delete courseCodeToCourse[key].period;
		return courseCodeToCourse[key];
	});

	var coursesFullInfo = [];
	courses.batchedForEach(10, perCourseFn, perCourseOnDone);

	function perCourseFn(course, courseIndex, callback){
		liu_course_info.search(course, function (err, courseFullInfo){
			if(err) {
				console.log(courseIndex + '/' + courses.length + ': ' + err);
			}

			coursesFullInfo[courseIndex] = courseFullInfo;
			console.log(courseIndex + '/' + courses.length + ': ' + course.code + " - " + course.title);

			callback();
		});
	}

	function perCourseOnDone(){
		console.log('Done scraping');

		console.log('saving to ' + outputFile);
		var jsonStr = JSON.stringify(coursesFullInfo, null, 2);

		fs.writeFile(outputFile, jsonStr, function(err) {
			if(err) {
				return console.log(err);
			}

			console.log("File saved");
		});
	}
}
