var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
	body: String,
	upvotes: {type: Number, default: 0},
	positive: Boolean,
	//author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

ReviewSchema.methods.upvote = function(callback){
	this.upvotes += 1;
	this.save(callback);
}

mongoose.model('Review', ReviewSchema);