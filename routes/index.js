var express = require('express');
var router = express.Router();

var cas_login = require('./cas_auth');
var liu = require('../lib/liu_exam_results');

// Home
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// CAS login
router.get('/login', function(req, res, next){
	cas_login.cas_login(req, res, next);
});



var mongoose = require('mongoose');
var Course = mongoose.model('Course');
var Review = mongoose.model('Review');
var User = mongoose.model('User');

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
	if(req.course.exams){
		liu.search(req.course, function (err, exams){
			if(err) return next(err);
			console.log(exams);
			req.course.exams = exams;
			req.course.save(function (err, course){
				if(err) return next(err);

				req.course.populate('reviews', function(err, course){
					if(err) return next(err);

					res.json(req.course);
				});
			});
		});
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
			if(err) return next(err);
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
})

router.put('/courses/:course/reviews/:review/upvote', function (req, res, next){
	req.review.upvote(function (err, review){
		if(err) return next(err);
		req.course.updateSatisfaction(function (err){
			if(err) return next(err);
			res.json(req.review);
		});
	});
});

module.exports = router;
