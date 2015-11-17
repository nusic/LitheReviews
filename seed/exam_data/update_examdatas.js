var fs = require('fs');

var fileName = process.argv[2];

fs.readFile(fileName, 'utf8', function (err, data){
	if(err) return console.error(err);

	var jsonObjects = JSON.parse(data);
	importToMongoDB(jsonObjects, function(){
		console.log('Done!');
	})
});




/**
 * Imports the jsonObjects as a collection to MongoLab 
 *
 * Input: 
 *	jsonObject - Array of exam objects
 *
 */
function importToMongoDB(jsonObjects, done){

	console.log('updating MongoLab ...');

	// Load models
	var mongoose = require('mongoose');
	require('../../models/ExamData');
	var ExamData = mongoose.model('ExamData');

	connectMongoose();

	function connectMongoose(){
		console.log('  connecting ...');		
		//Connect to mongo db
		var mongoose_url = 'mongodb://' + process.env.MONGOLAB_USER + 
		    ':' + process.env.MONGOLAB_PW + '@ds043694.mongolab.com:43694/liureviews';
		mongoose.connect(mongoose_url, function (err){
			if(err) return onError(err);

			removeAllExamdatas()
		});	
	}
	
	function removeAllExamdatas(){
		console.log('  clearing examdatas ...')
		ExamData.remove({}, function (err){
			if(err) return onError(err);

			insertNewExamdatas();	
		});
	}

	function insertNewExamdatas(){
		console.log('  inserting new examdatas ...')
		ExamData.collection.insert(jsonObjects, function (err){
			if(err) return onError(err);

			else console.log('  ensuring indexes ...');
			ExamData.ensureIndexes(function (err){
				if(err) console.error(err);

				mongoose.disconnect();		
				done();
			});
		});
	}

	function onError(err){
		console.error(err);
		mongoose.disconnect();
	}
}