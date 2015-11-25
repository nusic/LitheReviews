var fs = require('fs');

var liu_programs = require('../lib/liu_programs.js');
var liu_courses = require('../lib/liu_courses.js');
var liu_course_info = require('../lib/liu_course_info.js');

require('../lib/batched_for_each.js');


// Output files
var date = ('' + new Date).slice(0,15).replace(/ /g, '_');
var coursesOutputFile = date + '_courses.json';
var programsOutputFile = date + '_programs.json';


console.log('searching programs ... ');
var year = 2015;
liu_programs.search(year, false).then(function (programs){
	return new Promise(function (resolve, reject){

		//For testing: use only a subset of programs
		//programs = programs.slice(0,3);

		console.log('found ' + programs.length + ' programs');
		console.log(' ');
		console.log('searching courses for each program ... ');

		// Get courses for programs
		var courseCodeToCourse = {};
		programs.batchedForEach(3, function (program, programIndex, done){

			//Create courseMap for program
			program.courseMap = {};

			// Search courses for each program
			var courseQuery = {program: program.code, year: year};
			liu_courses.search(courseQuery, false).then(function (courses){

				//For testing: use only a subset of courses
				//courses = courses.slice(0, 3);

				console.log('  ' + (programIndex+1) + '/' + programs.length + ': ' + program.code + ' -> ' + courses.length + ' courses');

				// Add course to map with program specific details
				courses.forEach(function (course){
					
					program.courseMap[course.code] = {
						vof: course.vof,
						level: course.level,
						period: course.period
					};

					// 1) Add course to courseCodeToCourse map
					// 2) Add program to the course's list of programs.
					// If 1) is already done, only do 2).
					if(!courseCodeToCourse[course.code]){
						courseCodeToCourse[course.code] = course;
						course.programs = [program.code];
					}
					else{
						courseCodeToCourse[course.code].programs.push(program.code);
					}
				});

				// To avoid DOS attacking liu
				setTimeout(function(){
					done(); // Done with this program
				}, 1000);

			}); // liu_courses.search done

		}) // programs.batchedForEach done
		.then(function (){
			//Save programs
			var programsJsonStr = JSON.stringify(programs, null, 2);
			fs.writeFile(programsOutputFile, programsJsonStr, function(err) { 
				if(err) return console.error(err);
				console.log('Programs saved: ' + programsOutputFile);

				resolve(courseCodeToCourse);
			});
		});
	}); // End promise definition
})
.then(function (courseCodeToCourse){
	return new Promise(function (resolve, reject){
		var courses = Object.keys(courseCodeToCourse).map(function (key) {
			delete courseCodeToCourse[key].period;
			delete courseCodeToCourse[key].level;
			delete courseCodeToCourse[key].vof;
			return courseCodeToCourse[key];
		});

		var coursesJsonStr = JSON.stringify(courses, null, 2);

		var tmpCoursesOutputFile = 'tmp_' + coursesOutputFile;
		fs.writeFile(tmpCoursesOutputFile, coursesJsonStr, function(err) { 
			if(err) reject(err);
			console.log('Courses (not full info) saved: ' + tmpCoursesOutputFile);

			resolve(courses);
		});
	});
})
.then(function (courses){

	console.log(' ');
	console.log('Searching course info for each course ...');

	return courses.batchedForEach(5, function (course, courseIndex, done){
		liu_course_info.search(course, false).then(function (courseFullInfo){
			console.log('  ' + (courseIndex+1) + '/' + courses.length + ': ' + course.code + " - " + course.title);

			// To avoid DOS attacking Liu
			var waitTime = courseIndex%300 === 100 ? 2*60*1000 : 1000;
			setTimeout(function(){
				done(courseFullInfo);
			}, waitTime);
		});
	});
})
.then(function (coursesFullInfo){
	var coursesJsonStr = JSON.stringify(coursesFullInfo, null, 2);

	fs.writeFile(coursesOutputFile, coursesJsonStr, function(err) {
		if(err) return console.log(err);
		console.log('Courses saved: ' + coursesOutputFile);
	});
});
