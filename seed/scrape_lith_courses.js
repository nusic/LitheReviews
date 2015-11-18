var fs = require('fs');

var liu_courses = require('../lib/liu_courses.js');
var liu_course_info = require('../lib/liu_course_info.js');

//http://www.lith.liu.se/sh/forkortningar.html
var lith_programs = ['ACG', 'AER', 'APB', 'ASIENJ', 'ASIENK', 'Bas', 'X', 'BasT', 'BasTC', 'BI', 'Bio', 'BKM', 'BME', 'C', 'CII', 'DE', 'GI', 'KO', 'SN', 'TA', 'COE', 'COM', 'COS', 'CS', 'D', 'DAV', 'DE', 'DI', 'DPU', 'ECO', 'ED', 'EI', 'EL', 'ELE', 'EM', 'ENG', 'ENV', 'ERG', 'ES', 'ETH', 'FL', 'FORE', 'FRIST', 'FT', 'FyN', 'Fys', 'GDK', 'HU', 'I', 'IE', 'Ii', 'IMM', 'IND', 'INN', 'IP', 'IT', 'ITS', 'Jap', 'KA', 'KBI', 'KeBi', 'Kem', 'KI', 'KOS', 'KTS', 'LOG', 'M', 'Mat', 'MEC', 'MED', 'MES', 'MFYS', 'MI', 'MK', 'MMAT', 'MOL', 'MPN', 'MSK', 'MSN', 'MT', 'MuP', 'NO', 'OI', 'PRO', 'SEM', 'SL', 'SOC', 'SUS', 'SY', 'TB', 'TES', 'TL', 'TSL', 'U', 'WNE', 'X', 'XACG', 'XSY', 'Y', 'YDT', 'YH', 'Yi', 'YMP', 'YTHele', 'YTHträ'];
var year = 2015;

var outputFile = 'all_lith_courses_'+year+'.json';

require('../lib/batched_for_each.js');

var lithe_test_programs = ['MT', 'Y', 'ED'];
var programs = lith_programs;
var courseCodeToCourse = {};

programs.batchedForEach(10, perProgramFn, onPerProgramDone)

function perProgramFn(program, programIndex, callback){
	var courseQuery = {program: program, year: year};
	liu_courses.search(courseQuery, function(err, courses){
		if(err) console.error(err);

		console.log('  ' + programIndex + '/' + programs.length + ': ' + program + ' -> ' + courses.length + ' courses');

		// Add course to map
		courses.forEach(function (course){
			if(!courseCodeToCourse[course.code]){
				course.programs = [program];
				courseCodeToCourse[course.code] = course;
			}
			else{
				courseCodeToCourse[course.code].programs.push(program);	
			}
		});
		callback();
	});
}

function onPerProgramDone(){
	var courses = Object.keys(courseCodeToCourse).map(function (key) {
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
