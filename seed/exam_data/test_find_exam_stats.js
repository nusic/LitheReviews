// Load models
var mongoose = require('mongoose');
require('../../models/ExamData');
var ExamData = mongoose.model('ExamData');

//Connect to mongo db
var mongoose_url = 'mongodb://' + process.env.MONGOLAB_USER + 
    ':' + process.env.MONGOLAB_PW + '@ds043694.mongolab.com:43694/liureviews';
mongoose.connect(mongoose_url, function(err){
	console.log('connected');

	/*var query = {
		year: 2015,//{ $in: [2008, 2009] },
		course_code: "TNA001",
		//exam_code: 'TEN1'
	};
	var t0 = Date.now();
	ExamData.find(query, function (err, examDatas){
		if(err) {
			console.error(err);
			return done();
		}

		console.log('query time: ' + (Date.now() - t0) + 'ms');
		
		examDatas.forEach(function(examData){
			console.log(examData);
		});

		done()
	});
	*/

	var course = {
		year: 2015,
		code: "TNA001"
	};

	var t0 = Date.now();
	ExamData.findByCourse(course, function (err, examDatas){
		if(err) {
			console.error(err);
			return done();
		}

		console.log('query time: ' + (Date.now() - t0) + 'ms');
		
		examDatas.forEach(function(examData){
			console.log('-');
			console.log(examData);
		});

		done();
	});

	function done(){
		mongoose.disconnect();
	}
});



