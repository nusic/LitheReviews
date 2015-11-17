var mongoose = require('mongoose');

var ExamDataSchema = new mongoose.Schema({
	grades: [mongoose.Schema.Types.Mixed],
	year: Number,
	course_code: String,
	code: String,
	name: String
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


	this.find(query, function (err, exams){
		if(err) return callback(err);

		if(course.exams.length > exams.length) console.log('  could not find data for all exams for ' + course.code);
		if(course.exams.length < exams.length) console.log('  found exceeding exam data for ' + course.code);


		// If nobody got grade 3 (for example), then 3 is not in the data.
		// However, we may figure out what possible grades there are, using
		// the course info. Here we will add {grade: 3, freq: 0} and so on
		exams.forEach(function (exam){
			course.exams.forEach(function (templateExam){
				if(!templateExam.stats || templateExam.code !== exam.code){
					return;
				}

				templateExam.stats.forEach(function (templateData, index){
					var found = false;
					exam.grades.forEach(function (data){
						if(templateData.grade !== data.grade){
							return;
						}
						found = true;
						templateData.freq = data.freq;
					});
					if(!found){
						exam.grades.splice(index, 0, {
							grade: templateData.grade,
							freq: 0
						});
					}
				});
			});
		});

		callback(null, exams);
	});
}

mongoose.model('ExamData', ExamDataSchema);