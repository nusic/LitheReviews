var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
	code: String,
	title: String,
	year: Number,
	prof: String,
	satisfactionPercentage: Number,
	period: String,
	block: String,
	hp: Number,
	site: String,
	vof: String, // v: valbar, o: obligatorisk
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

mongoose.model('Course', CourseSchema);
