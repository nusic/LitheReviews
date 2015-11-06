var express = require('express');
var router = express.Router();

var cas_login = require('./cas_auth');
var liu = require('../lib/liu_exam_results');

// Home
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/what', function(req, res, next){
	res.render('about', {title: 'Express'});
});

// CAS login
router.get('/login', function(req, res, next){
	cas_login.cas_login(req, res, next);
});


var mongoose = require('mongoose');
var Course = mongoose.model('Course');
var Review = mongoose.model('Review');
var User = mongoose.model('User');


router.param('programme', function(req, res, next, id){
	Course.find({programmes: id}, function(err, courses){
		if(err) return next(err);

		if(!courses || !courses.length){
			return next(new Error('Cannot find courses that match program' + id));
		}
		req.programme = id;
		req.courses = courses;
		return next();
	});
});

router.get('/programme/:programme', function(req, res, next){
	return res.json(req.courses);
});


/* REST routes */ 
router.get('/courses', function(req, res, next){
	Course.find(function(err, courses){
		if(err){
			console.log("Err: " + err);
			return next(err);
		}
		res.json(courses);
	});
});

router.post('/courses', function(req, res, next){
	var course = new Course(req.query);

	course.save(function(err, course){
		if(err) return next(err);
		res.json(course);
	});
});


// Preloading post objects
router.param('course', function(req, res, next, id){
	var query = Course.findById(id);

	query.exec(function(err, course){
		if(err) return next(err);
		if(!course) return next(new Error('Cannot find course!'));

		req.course = course;
		return next();
	});
});

router.get('/courses/:course', function(req, res, next){
	function populateReviewsAndSend(req, res){
		req.course.populate('reviews', function(err, course){
			if(err) return next(err);

			User.findOrCreate({liuId: req.session.liuId}, function(err, user){
				if(err) return next(err);

				var courseObject = course.toObject();
				courseObject.reviews = course.markVotedComments(user);
				res.json(courseObject);
			});
		});
	}

	if(req.course.exams){
		liu.search(req.course, function (err, exams){
			console.log('liu search returned')
			if(err) {
				console.error(err);
			}

			req.course.exams = err ? err : exams;

			populateReviewsAndSend(req, res);
		});
		console.log('called liu exam search');
	}
	else {
		populateReviewsAndSend(req, res);
	}
});

router.post('/courses/:course/reviews', function(req, res, next){
	//Create new review
	var review = new Review(req.body);
	review.course = req.course;

	//Save review in DB
	review.save(function(err, review){
		if(err) return next(err);

		// Add review to its course's array of reviews
		req.course.reviews.push(review);

		// Save course
		req.course.save(function(err, course){
			if(err) {
				return next(err);
			}
			res.json(review);
		});
	});
});

router.param('review', function(req, res, next, id){
	var query = Review.findById(id);

	query.exec(function(err, review){
		if(err) return next(err);
		if(!review) return next(new Error('Can\'t find review'));

		req.review = review;
		return next();
	});
});

router.get('/reviews/:review', function (req, res){
	res.json(req.review);
});

router.put('/courses/:course/reviews/:review/upvote', function (req, res, next){

	//Find or create user
	User.findOrCreate({liuId: req.session.liuId}, function(err, user){
		if(err) return next(err);

		//Add vote to user
		user.upvote(req.review, function(err, user){
			if(err) {
				console.log(err);
				if(err === 'Already voted') return res.json(req.review);
				else return next(err);
			}

			//Increment vote son review
			req.review.upvote(function (err, review){
				if(err) return next(err);

				//Recalculate update satisfaction percentage
				req.course.updateSatisfaction(function (err){
					if(err) return next(err);
					res.json(req.review);
				});
			});
		});
	});
});

module.exports = router;
