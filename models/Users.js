var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new mongoose.Schema({
	liuId: {type: String, unique: true, required: true, dropDups: true},
	upvoteReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

UserSchema.plugin(findOrCreate);

UserSchema.methods.upvote = function(review, callback){
	for (var i = 0; i < this.upvoteReviews.length; i++) {
		if(this.upvoteReviews[i].equals(review._id)){
			return callback('Already voted');
		}
	};

	this.upvoteReviews.push(review);
	this.save(callback);
}

mongoose.model('User', UserSchema);

