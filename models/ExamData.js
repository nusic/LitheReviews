var mongoose = require('mongoose');

var ExamDataSchema = new mongoose.Schema({
	grades: [mongoose.Schema.Types.Mixed],
	year: Number,
	course_code: String,
	exam_code: String
});

ExamDataSchema.index({year: -1, course_code: 1});

ExamDataSchema.statics.findByCourse = function(course, callback){
	if(!course.code || !course.year){
		return callback('Need to provide course.code and course.year');
	}

	var query = {
		year: course.year,
		course_code: course.code
	};

	// Output is just the input course augmented with the data
	var output = course;

	this.find(query, function (err, exams){
		if(err) return callback(err);

		if(output.exams.length > exams.length) console.log('  could not find data for all exams for ' + course.code);
		if(output.exams.length < exams.length) console.log('  found exceeding exam data for ' + course.code);
	
		output.exams.forEach(function (outputExam){
			exams.forEach(function(exam){
				if(outputExam.code !== exam.exam_code){
					return;
				}
				outputExam.stats.forEach(function (ouputData){
					ouputData.freq = 0;
					exam.grades.forEach(function (data){
						if(ouputData.grade !== data.grade){
							return;
						}
						//console.log(' grade: ' + ouputData.grade + ': ' + data.freq);

						ouputData.freq = data.freq;
					});
				});
			});
		});

		callback(null, output.exams);
	});
}

mongoose.model('ExamData', ExamDataSchema);