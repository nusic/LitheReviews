var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
	code: String,
	title: String,
	year: Number,
	prof: String,
	satisfactionPercentage: Number,
	period: String,
	exams: [],
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
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



mongoose.model('Course', CourseSchema);
