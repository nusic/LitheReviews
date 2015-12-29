/*
 * Usage: 
 *  node get_course.js <course code> [<course year>]
 *
 *  Example 1: Get data for TNM031 at most recent year
 *    "node get_course.js TNM031"
 *
 *  Example 2: Get data for TNM031 at year 2015
 *    "node get_course.js TNM031 2015"
 *  
 */


if(process.argv.length < 3){
  console.log('Error: Not enough arguments provided');
  console.log('\nUsage example 1: Get data for TNM031 at most recent year');
  console.log('  "node get_course.js TNM031"');
  console.log('\nUsage example 2: Get data for TNM031 at year 2015');
  console.log('  "node get_course.js TNM031 2015"');
  console.log('');
  return;
}


// Load mongoose
var mongoose = require('mongoose');
// Load mongoose models that we will work with
require('../models/Courses');
require('../models/Reviews');
// Get mongoose interface for the collection that we will query
var Course = mongoose.model('Course');



// Get the query data
var courseCode = process.argv[2].toUpperCase();
var courseYear = process.argv[3] ? Number(process.argv[3]) : undefined;
var query = {};
query.code = courseCode;
if(courseYear) query.year = courseYear;


// Function to call when an error has occured
function handleError(err){
  console.error(err);
  mongoose.disconnect();
}

// Function to call when we have our data base results
function handleSuccess(courseWithReviews){
  courseWithReviews.exams = undefined; // Don't print "exams"
  console.log(JSON.stringify(courseWithReviews, null, 2));
  mongoose.disconnect();
}

// Build mongoose url string
var mongoose_url = 'mongodb://' + 
  process.env.MONGOLAB_USER + ':' + process.env.MONGOLAB_PW + 
  '@ds043694.mongolab.com:43694/liureviews';

// Connect to the data base
mongoose.connect(mongoose_url, function (err){
  if(err) return handleError(err);

  // Query the data base
  Course.findOne(query).sort('-year').exec(function (err, course){
    if(err) return handleError(err);
    if(course){
      course.populate('reviews', function (err, courseWithReviews){
        if(err) return handleError(err);
        handleSuccess(courseWithReviews);
      });
    }
    else return handleError('No matching element for query: ' + JSON.stringify(query));
  });
});
