var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	liuId: String,
	ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

UserSchema.methods.getByLiuId = function(liuId){
	var result = this.find({ liuId: liuId });
	if(result.length === 0){
		var user = new User({ liuId: liuId });
		user.save(function(err, user){
			if(err) return new Error('Couldn\'t save user!');
			return user;
		});
	}
	else if(result.length > 1){
		throw new Error('Found duplicates of liuId in DB!', result);
	}
	return result[0];
}

mongoose.model('User', UserSchema);