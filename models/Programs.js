var mongoose = require('mongoose');
var Course = mongoose.model('Course');

var ProgramSchema = new mongoose.Schema({
	code: String,
	title: String,
	category: String,
	year: Number,
	courseMap: mongoose.Schema.Types.Mixed
});

ProgramSchema.methods.getCourses = function (callback){
	console.log('getCourses');
	var thisProgram = this;

	Course.find({programs: this.code, year: this.year}, function (err, courses){
		if(err) callback(err);

		console.log('found ' + courses.length + ' courses');

		if(!thisProgram.courseMap){
			return callback(null, courses);
		}

		courses.forEach(function (course){
			var programSpecific = thisProgram.courseMap[course.code] || {};
			course.vof = programSpecific.vof;
			course.level = programSpecific.level;
			course.period = programSpecific.period;
		});

		callback(null, courses);
	});
}

mongoose.model('Program', ProgramSchema);


var Program = mongoose.model('Program');

