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

	var currYear = new Date().getFullYear();
	var onlyCurrYear = true;

	connectMongoose();

	function connectMongoose(){
		console.log('  connecting ...');		
		//Connect to mongo db
		var mongoose_url = 'mongodb://' + process.env.MONGOLAB_USER + 
		    ':' + process.env.MONGOLAB_PW + '@ds043694.mongolab.com:43694/liureviews';
		mongoose.connect(mongoose_url, function (err){
			if(err) return onError(err);

			removeExamdatas()
		});
	}
	
	function removeExamdatas(){
		console.log('  clearing examdatas ...')

		var q = {};
		if (onlyCurrYear){
			q = { year: currYear };
		}

		ExamData.remove(q, function (err){
			if(err) return onError(err);

			insertNewExamdatas();	
		});
	}

	function insertNewExamdatas(){
		console.log('  inserting new examdatas ...');

		var jsonObjectsToInsert = jsonObjects;
		if(onlyCurrYear){
			jsonObjectsToInsert = jsonObjects.filter(function(o){
				return o.year === currYear;
			});
		}
		
		if(!jsonObjectsToInsert.length){
			return onError('No data to insert');
		}

		ExamData.collection.insert(jsonObjectsToInsert, function (err){
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