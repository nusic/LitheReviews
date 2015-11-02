var liu_courses = require('./liu_courses.js');
var liu_course_info = require('./liu_course_info.js');
var liu_exam_results = require('./liu_exam_results.js');

function test_course_info(code){
	liu_course_info.search({code: code, year: 2015}, function (err, course) {
		if(err) throw new Error(err);

		console.log(JSON.stringify(course, null, 2));
	});	
}

function test_courses(programme, onlyCourseSize){
	liu_courses.search({programme: programme, year: 2015}, function (err, courses){
		if(err) throw new Error(err);

		if(onlyCourseSize){
			console.log(programme + ': ' + courses.length);
		}
		else{
			//console.log(courses.map(function(course){
			//	return course.code + ' - ' + course.title;
			//}));
			//console.log(courses);	
		}
	});	
}

function test_exam_results(code, year){
	liu_exam_results.search({code: code, year: year}, function (err, examStats){
		if(err) throw new Error(err);

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

function test_all_programmes(){
	var programmes = ['ACG', 'AER', 'APB', 'ASIENJ', 'ASIENK', 'Bas', 'X', 'BasT', 'BasTC', 'BI', 'Bio', 'BKM', 'BME', 'C', 'CII', 'DE', 'GI', 'KO', 'SN', 'TA', 'COE', 'COM', 'COS', 'CS', 'D', 'DAV', 'DE', 'DI', 'DPU', 'ECO', 'ED', 'EI', 'EL', 'ELE', 'EM', 'ENG', 'ENV', 'ERG', 'ES', 'ETH', 'FL', 'FORE', 'FRIST', 'FT', 'FyN', 'Fys', 'GDK', 'HU', 'I', 'IE', 'Ii', 'IMM', 'IND', 'INN', 'IP', 'IT', 'ITS', 'Jap', 'KA', 'KBI', 'KeBi', 'Kem', 'KI', 'KOS', 'KTS', 'LOG', 'M', 'Mat', 'MEC', 'MED', 'MES', 'MFYS', 'MI', 'MK', 'MMAT', 'MOL', 'MPN', 'MSK', 'MSN', 'MT', 'MuP', 'NO', 'OI', 'PRO', 'SEM', 'SL', 'SOC', 'SUS', 'SY', 'TB', 'TES', 'TL', 'TSL', 'U', 'WNE', 'X', 'XACG', 'XSY', 'Y', 'YDT', 'YH', 'Yi', 'YMP', 'YTHele', 'YTHträ']
	programmes.forEach(function (programme){
		test_courses(programme, true);
	});
}

//test_courses('ACG');
test_course_info('TMAL02');
//test_exam_results('TNA001', 2015);
//test_course_info_and_exam_results();
//test_all_programmes();
