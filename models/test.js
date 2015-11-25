var mongoose = require('mongoose');

//Connect to mongolab
var mongoose_url = 'mongodb://' + process.env.MONGOLAB_USER + 
    ':' + process.env.MONGOLAB_PW + '@ds043694.mongolab.com:43694/liureviews';
mongoose.connect(mongoose_url);


//Load models
require('./Users');
require('./Courses');
require('./Programs');
require('./Reviews');
require('./ExamData');

var Program = mongoose.model('Program');
var Course = mongoose.model('Course');

function getProgram(){
	return new Promise(function (resolve, reject){
		var program = new Program({
			code: 'MT',
			title: 'Medieteknik',
			major: 'Civilingenjörsutbildningar',
			year: 2015,
		});

		resolve(program);
	});
}

program.courseMap = {
	'TNA001': {
		period: 'myPeriod'
	}
};

console.log(program);

console.log('getting courses for ' + program.code);

program.getCourses(function (err, courses) {
	courses.forEach(function (course){
		console.log(course.code + ' ' + course.period);
	});
});