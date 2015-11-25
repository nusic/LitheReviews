var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
	code: String,
	title: String,
	year: Number,
	prof: String,
	satisfactionPercentage: Number,
	//period: String,
	block: String,
	hp: Number,
	site: String,
	//vof: String, // v: valbar, o: obligatorisk
	exams: [],
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
	programs: [String]
});

CourseSchema.methods.updateSatisfaction = function(callback){
	this.populate('reviews', function (err, course){
		if(err) throw err;
			
		var totalUpvotes = 0;
		var positiveUpvotes = 0;
		course.reviews.forEach(function (review){
			totalUpvotes += review.upvotes;
			if(review.positive){
				positiveUpvotes += review.upvotes;
			}
		});
		course.satisfactionPercentage = (100 * positiveUpvotes / totalUpvotes).toFixed(0);
		course.save(callback);
	});
}

CourseSchema.methods.markVotedComments = function(user){
	var markedReviews = [];
	for (var i = 0; i < this.reviews.length; i++) {
		var voted = false;

		for (var j = 0; user && j < user.upvoteReviews.length; j++) {
			if(this.reviews[i].equals(user.upvoteReviews[j])){
				voted = true;
				continue;
			}
		};

		var markedReview = this.reviews[i].toObject();
		markedReview.voted = voted;
		markedReviews.push(markedReview);
	};
	return markedReviews
}

CourseSchema.statics.findForProgram = function(program, cb){
	var query = {programs: program.code, year: program.year};
	console.log(query);

	this.find(query).lean().exec(function (err, courses){
		if(err) return cb(err);
		if(!program.courseMap) {
			console.log('no courseMap for ' + program.code);
			return cb(null, courses);
		}

		courses.forEach(function (course){
			var programSpecific = program.courseMap[course.code];

			Object.keys(programSpecific).forEach(function (key){
				course[key] = programSpecific[key];
			});
		});

		cb(null, courses); 		
	});
}

mongoose.model('Course', CourseSchema);
