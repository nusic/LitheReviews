var liu_courses = require('./liu_courses.js');
var liu_course_info = require('./liu_course_info.js');
var liu_exam_results = require('./liu_exam_results.js');
var liu_programs = require('./liu_programs.js');

require('./batched_for_each.js');

function test_course_info(code){
	liu_course_info.search({code: code, year: 2015})
	.then(function (course) {
		console.log(JSON.stringify(course, null, 2));
	});	
}

function test_courses(program){
	liu_courses.search({program: program, year: 2015})
	.then(function (courses){
		courses.forEach(function (course){
			console.log(course.code + ' - ' + course.title);
		});
	});	
}
//
function test_exam_results(code, year){
	liu_exam_results.search({code: code, year: year}) 
	.then(function (examStats){
		console.log(JSON.stringify(examStats, null, 2));
	});
}

function test_course_info_and_exam_results(){
	liu_course_info.search({code: 'TNG032', year: 2015}, function(err, course){
		if(err) throw new Error(err);

		liu_exam_results.search(course, function(err, exams){
			console.log(JSON.stringify(exams, null, 2));
		});
	});
}

function test_all_programs(){
	var programs = ['ACG', 'AER', 'APB', 'ASIENJ', 'ASIENK', 'Bas', 'X', 'BasT', 'BasTC', 'BI', 'Bio', 'BKM', 'BME', 'C', 'CII', 'DE', 'GI', 'KO', 'SN', 'TA', 'COE', 'COM', 'COS', 'CS', 'D', 'DAV', 'DE', 'DI', 'DPU', 'ECO', 'ED', 'EI', 'EL', 'ELE', 'EM', 'ENG', 'ENV', 'ERG', 'ES', 'ETH', 'FL', 'FORE', 'FRIST', 'FT', 'FyN', 'Fys', 'GDK', 'HU', 'I', 'IE', 'Ii', 'IMM', 'IND', 'INN', 'IP', 'IT', 'ITS', 'Jap', 'KA', 'KBI', 'KeBi', 'Kem', 'KI', 'KOS', 'KTS', 'LOG', 'M', 'Mat', 'MEC', 'MED', 'MES', 'MFYS', 'MI', 'MK', 'MMAT', 'MOL', 'MPN', 'MSK', 'MSN', 'MT', 'MuP', 'NO', 'OI', 'PRO', 'SEM', 'SL', 'SOC', 'SUS', 'SY', 'TB', 'TES', 'TL', 'TSL', 'U', 'WNE', 'X', 'XACG', 'XSY', 'Y', 'YDT', 'YH', 'Yi', 'YMP', 'YTHele', 'YTHträ']
	programs.forEach(function (program){
		test_courses(program, true);
	});
}

function test_batchedForEach(){
	var array = [1,2,3,4,5,6,7,8,9,10];
	
	array.batchedForEach(2, function (element, i, done){
		done(element * element);
	})
	.then(function(result){
		console.log(result);
	})
}

function test_liu_programs(){
	liu_programs.search(2015)
	.then(function (programs){
		console.log(programs);
	});
}

function test_liu_program_specifics(){
	liu_programs.search(2015, function (err, programs){
		if(err) return console.error(err);

		console.log('TDDB84');

		var allCourses = [];
		function onEach(program, i, callback){
			liu_courses.search({program: program.code, year: 2015}, function (err, courses){
				if(err) throw new Error(err);

				allCourses.concat(courses);
				console.log(program.code + ' - ' + courses.length);
				callback();
			});
		}

		function onDone(){
			allCourses.forEach(function (course){
				console.log(TDDB84);
				if(course.code === 'TDDB84'){
					console.log('     period: ' + course.period);
				}
			});
		}

		programs.batchedForEach(2, onEach, onDone);

	});
}

//test_courses('Y');
//test_course_info('TMAL02');
//test_exam_results('TNA001', 2015);
//test_course_info_and_exam_results();
//test_all_programs();
//test_liu_programs();
//test_liu_program_specifics();
test_batchedForEach();
