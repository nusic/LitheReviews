var request = require('request');
var iconv = require('iconv-lite');
var fs = require('fs');

if(process.argv[2] == '--all'){
	process.argv[3] = '--all';
	process.argv[2] = null;
}
var fileName = process.argv[2] || 'exam_data.json';
var getTSV = (process.argv[3] === '--all') ? getAllLiuExamsTSV : getTestTSV;


console.log('Get exam data ...')

/*
 * Main
 *
 * Get TSV data, preprocess and aggregate it, then store to file
 */
getTSV(function (tsv){
	var jsonObjects = convertTSVToJSON(tsv);
	jsonObjects = preprocess(jsonObjects);
	jsonObjects = aggregate(jsonObjects);
	//jsonObjects = filter(jsonObjects);
	writeToFile(jsonObjects, function(){
		console.log('Done!');
	});
});




/**
 * Gets some TSV exam test data in the same format as used by LiU.
 * 
 * Input: 
 *	callback - function to pass the data to
 */
function getTestTSV(callback){
	var tsv = '';

	tsv += 'Developmental Psychology and Deviations  10.5 Credits	0100	20020101	G	Utvecklingspsykologiska avvikelser  10.5 hp	Tentamen  10.5 hp	28	12	Examination  10.5 Credits';
	tsv += '\n';
	tsv += 'Algorithms and Optimization  9.0 Credits	LAB1	20020101	G	Algoritmer och optimering  9.0 hp	Laboration  3.0 hp	2	12	Laboratory Work  3.0 Credits';
	tsv += '\n';
	tsv += 'Communication I  3.0 Credits	UPG2	20020101	G 	Kommunikation I  3.0 hp	Skriftliga och muntliga uppgifter  1.5 hp	1	12	Written and Oral Exercise  1.5 Credits'

	callback(tsv)
}


function getTestTSVFromFile(callback){
	fs.readFile('test_data.txt', 'utf8', function(err, data){
		if(err) return console.error(err);

		callback(data);
	});
}


/**
 * Gets all exam data in TSV format from LiU's database
 *
 * Input: 
 *	callback - function to pass the data to
 */
function getAllLiuExamsTSV(callback){
	var url = 'https://tentabokning.liu.se/tentaresult/?dumpall=1';
	console.log('  querying ' + url + ' ...');	

	request.get({
		uri: url,
		encoding: null // <-- Need to this to get correct encoding
	},
	function(err, resp, body){
		if(err) return console.error(err);

		var tsv = iconv.decode(body, 'iso-8859-1'); // <-- Need to this to get correct encoding
		callback(tsv);
	});
}



/**
 * Parses a TSV string containing N lines (records), to an array of N json objects
 *
 * Input: 
 *	tsv - multiline string of exam data with tab separated values
 *
 * Returns: 
 *	jsonObject - Array of exam objects (one for each record, i.e. line in the tsv string)
 */
function convertTSVToJSON(tsv){
	console.log('  converting data to json ...');

	// Headers according to LiU webmaster. Those are incorrect
	// var headers = ['kurskod', 'provkod', 'datum', 'betyg', 'kursnamn', 'provnamn', 'antal', 'betygsordning', 'kursnamn_en', 'provnamn_en'];
	var headers = ['course_code', 'exam_code', 'date', 'grade', 'course_name', 'exam_name', 'freq', 'grade_order', 'course_name_en', 'exam_name_en'];
	// var headers = ['course_code', 'provkod', 'datum', 'betyg', 'kursnamn', 'provnamn', 'antal', 'betygsordning', 'kursnamn_en', 'provnamn_en'];
	var jsonObjects = [];
	var lines = tsv.split('\n');
	
	for(var i = 0; i<lines.length; ++i){
		if(!lines[i].length) {
			continue;
		}

		var values = lines[i].split('\t');

		var obj = {};
		//console.log('-');
		for(var j = 0; j<headers.length; ++j){
			//console.log('   ' + headers[j] + ': ' + values[j]);
			obj[headers[j]] = values[j] ? values[j].trim() : '-';
		}
		jsonObjects.push(obj);
	}
	return jsonObjects;
}





/**
 * Any necessary processing of the jsonObjects are done 
 *
 * Input: 
 *	jsonObject - Array of exam objects
 *	callback 	 - Function to call with the processed jsonObjects
 */
function preprocess(jsonObjects, callback){
	console.log('  preprocessing ...');

	jsonObjects.forEach(function (obj){
		
		// 1. Extract and parse string props to numbers
		obj.year = parseInt(obj.date.substring(0, 4));
		obj.freq = parseInt(obj.freq);
		obj.grade_order = parseInt(obj.grade_order);

		// 2. Strip hp from course_name and course_name_en and add hp as prop to exam
		var splitIndexCourseName = obj.course_name.indexOf('  ');
		var splitIndexCourseNameEn = obj.course_name_en.indexOf('  ');

		var hpIndex = obj.course_name.indexOf('hp');
		var creditIndex = obj.course_name_en.indexOf('Credits');

		if(hpIndex !== -1){
			obj.hp = parseFloat(obj.course_name.substring(splitIndexCourseName, hpIndex));
		}
		else if(creditIndex !== -1){
			obj.hp = parseFloat(obj.course_name_en.substring(splitIndexCourseNameEn, creditIndex));
		}
		else{
			console.error('unknown hp');
			obj.hp = '-';
		}

		obj.course_name = obj.course_name.substring(0, splitIndexCourseName).trim();
		obj.course_name_en = obj.course_name_en.substring(0, splitIndexCourseNameEn).trim();

		// 3. Remove hp/credits from exam_name/exam_name_en respectively
		var splitIndexExamName = obj.exam_name.indexOf('  ');
		var splitIndexExamNameEn = obj.exam_name_en.indexOf('  ');

		obj.exam_name = obj.exam_name.substring(0, splitIndexExamName);
		obj.exam_name_en = obj.exam_name_en.substring(0, splitIndexExamNameEn);

		
	});
	
	return jsonObjects;
}



function filter(jsonObjects){
	return jsonObjects.filter(function(exam){
		return exam.year >= 2015;
	});
}



/**
 * Aggregates the freq property of exam data with the same year, course, exam_code and grade. 
 *
 * Input: 
 *	jsonObject - Array of exam objects
 *
 * Returns: 
 *	jsonObject - Array of (aggregated) exam objects
 *
 *
 *	Example input: 
 *	[
 *		{"year": 2002, "course_name": "Datastrukturer", "exam_code": "UPG1", "grade": "G", "freq": 65, .. },
 *		{"year": 2002, "course_name": "Datastrukturer", "exam_code": "UPG1", "grade": "G", "freq": 13, .. },
 *		{"year": 2002, "course_name": "Datastrukturer", "exam_code": "UPG1", "grade": "U", "freq": 19, .. }
 *	]
 *
 *	Example output:
 *	[
 *		{"year": 2002, "course_name": "Datastrukturer", "exam_code": "UPG1", "grade": "G", "freq": 78, .. },
 *		{"year": 2002, "course_name": "Datastrukturer", "exam_code": "UPG1", "grade": "U", "freq": 19, .. }
 *	]
 *
 */
function aggregate(jsonObjects){
	console.log('  aggregating ...');

	// Create a mapping hierarchy structure object:
	//   Year -> Course -> Exam -> Grade -> Aggregated exam stats
	var o = {};

	for (var i = 0; i < jsonObjects.length; i++) {
		var y = jsonObjects[i].year;
		var c = jsonObjects[i].course_code;
		var e = jsonObjects[i].exam_code;
		var g = jsonObjects[i].grade;
		if(!o[y]){
			o[y] = {};
		}

		if(!o[y][c]){
			o[y][c] = {};
		}

		if(!o[y][c][e]){
			o[y][c][e] = {};
		}

		if(!o[y][c][e][g]){
			o[y][c][e][g] = jsonObjects[i];
		}
		else{
			o[y][c][e][g].freq += jsonObjects[i].freq;
		}
	};

	//console.log(JSON.stringify(o, null, 2));

	// Convert to array structure
	aggregatedJsonObjects = [];
	for (var y in o) {
		if (o.hasOwnProperty(y)) {
			//console.log('y: ' + y);
			for (var c in o[y]) {
				if (o[y].hasOwnProperty(c)) {
					//console.log(' c: ' + c);
					for (var e in o[y][c]) {
						if (o[y][c].hasOwnProperty(e)) {
							//console.log('  e: ' + e);

							var examStats = [];
							for (var g in o[y][c][e]) {
								if (o[y][c][e].hasOwnProperty(g)) {
									//console.log('   g: ' + g );
									examStats.push({
										grade: g,
										freq: o[y][c][e][g].freq,
										grade_order: o[y][c][e][g].grade_order,
									});
								}
							}

							examStats = examStats.sort(function (a,b){
								return a.grade_order - b.grade_order;
							});

							//Remove grade order property
							for (var i = 0; i < examStats.length; i++) {
								delete examStats[i].grade_order;
							};

							aggregatedJsonObjects.push({
								year: o[y][c][e][g].year,
								course_code: c,
								exam_code: e,
								exam_name: o[y][c][e][g].exam_name,
								grades: examStats
							});
						}
					}
				}
			}
		}
	}

	return aggregatedJsonObjects;
}

/**
 * Writes jsonObject to file
 *
 * Input: 
 *	jsonObject - Array of exam objects
 *
 */
function writeToFile(jsonObjects, done){
	console.log('  writing to file ...');
	var jsonString = JSON.stringify(jsonObjects, null, 2);
	fs.writeFile(fileName, jsonString, function (err){
		if(err) console.error(err);

		console.log('  file saved! (' + fileName + ')');
		done();
	});
}

