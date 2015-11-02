var fs = require('fs');

var liu_courses = require('../lib/liu_courses.js');
var liu_course_info = require('../lib/liu_course_info.js');


var lith_programmes = ['ACG', 'AER', 'APB', 'ASIENJ', 'ASIENK', 'Bas', 'X', 'BasT', 'BasTC', 'BI', 'Bio', 'BKM', 'BME', 'C', 'CII', 'DE', 'GI', 'KO', 'SN', 'TA', 'COE', 'COM', 'COS', 'CS', 'D', 'DAV', 'DE', 'DI', 'DPU', 'ECO', 'ED', 'EI', 'EL', 'ELE', 'EM', 'ENG', 'ENV', 'ERG', 'ES', 'ETH', 'FL', 'FORE', 'FRIST', 'FT', 'FyN', 'Fys', 'GDK', 'HU', 'I', 'IE', 'Ii', 'IMM', 'IND', 'INN', 'IP', 'IT', 'ITS', 'Jap', 'KA', 'KBI', 'KeBi', 'Kem', 'KI', 'KOS', 'KTS', 'LOG', 'M', 'Mat', 'MEC', 'MED', 'MES', 'MFYS', 'MI', 'MK', 'MMAT', 'MOL', 'MPN', 'MSK', 'MSN', 'MT', 'MuP', 'NO', 'OI', 'PRO', 'SEM', 'SL', 'SOC', 'SUS', 'SY', 'TB', 'TES', 'TL', 'TSL', 'U', 'WNE', 'X', 'XACG', 'XSY', 'Y', 'YDT', 'YH', 'Yi', 'YMP', 'YTHele', 'YTHträ'];
var year = 2015;

var outputFile = 'all_lith_courses_'+year+'.json';


function shallow_scrape_programme_courses(query, callback){
	console.log('Scraping courses from ' + query.programmes.length + ' programmes')
	//Maps course codes to full courses
	var courseCodeToCourse = {};
	var responseCounter = 0;

	query.programmes.forEach(function(programme){
		var courseQuery = {programme: programme, year: query.year};
		liu_courses.search(courseQuery, function(err, courses){
			if(err) return console.error(err);
				
			responseCounter++;
			console.log('  ' + responseCounter + '/' + query.programmes.length + ': ' + programme + ' -> ' + courses.length + ' courses');

			// Add course to map
			courses.forEach(function (course){
				if(!courseCodeToCourse[course.code]){
					course.programmes = [programme];
					courseCodeToCourse[course.code] = course;
				}
				else{
					courseCodeToCourse[course.code].programmes.push(programme);	
				}
			});

			if(responseCounter === query.programmes.length){
				//Convert courseCodeToCourse to array
				var courses = Object.keys(courseCodeToCourse).map(function (key) {
					return courseCodeToCourse[key];
				});
				callback(null, courses);
			}
		});
	});
}

var simple_query = {
	programmes: ['MT', 'ED'],
	year: 2015
};

var full_query = {
	programmes: lith_programmes,
	year: 2015
};

shallow_scrape_programme_courses(full_query, function (err, courses){
	console.log('Found ' + courses.length + ' unique courses');


	console.log('Scraping course info for each course');
	var allCoursesFullInfo = [];
	var batchSize = 50;
	var numBatches = Math.ceil(courses.length/batchSize);
	var batchIndex = 0;
	
	function recursiveScrape(courses){
		var from = batchIndex*batchSize;
		var to = Math.min(from + batchSize, courses.length);
		console.log('Scraping batch ' + batchIndex + ' from ' + from + ' to ' + to);
		var batch = courses.slice(from, to);

		scrapeCourseInfo(batch, function (err, coursesFullInfo){
			batchIndex++;
			coursesFullInfo.forEach(function(courseFullInfo){
				allCoursesFullInfo.push(courseFullInfo);
			});
			if(batchIndex === numBatches){
				onScrapeDone(null, allCoursesFullInfo);
			} 
			else{
				recursiveScrape(courses);
			}
		});
	}


	function scrapeCourseInfo(courses, callback){
		var numCourseInfoScraped = 0;
		var coursesFullInfo = [];
		courses.forEach(function(course, i){
			(function (courseIndex){
				liu_course_info.search(course, function (err, courseFullInfo){
					numCourseInfoScraped++;

					if(err) {
						console.log(numCourseInfoScraped + '/' + courses.length + ': ' + err);
					}
					
					coursesFullInfo[courseIndex] = courseFullInfo;
					console.log(numCourseInfoScraped + '/' + courses.length + ': ' + course.code + " - " + course.title);	
					
					if(numCourseInfoScraped === courses.length){
						callback(null, coursesFullInfo);
					}
				});
			})(i)
		});
	}

	recursiveScrape(courses);
	
});


/*

var courseArray = [];
var numCourses = -1;
var numCourseInfoScraped = 0;

liu_courses.search(query, function (err, courses){
	if(err) return console.error(err);

	numCourses = courses.length;
	console.log("Found " + numCourses + " courses. Scraping course info ..");

	courses.forEach(function(course, i){

		(function (courseIndex){
			liu_course_info.search(course, function (err, course){
				if(err) return console.error(err);

				courseArray[courseIndex] = course;
				numCourseInfoScraped++;

				console.log(numCourseInfoScraped + '/' + numCourses + ': ' + course.code + " - " + course.title);

				if(numCourseInfoScraped === numCourses){
					onDone();
				}
			});
		})(i)
	});
});*/

function onScrapeDone(err, coursesFullInfo){
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

