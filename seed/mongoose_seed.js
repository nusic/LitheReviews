var mongoose = require('mongoose');

mongoose.Model.seed = function(entities) {
    var promise = new mongoose.Promise;
    this.create(entities, function(err) {
        if(err) { promise.reject(err); }
        else    { promise.resolve(); }
    });
    return promise;
};

//So, finally I am able to create a nice and neat promise chain in the beforeEach function of my test suite. Voilà!

beforeEach(function(done) {

    // Reset collections
    User.remove().exec()
    .then(function() { 
        return Exercise.remove().exec() 
    })
    .then(function() { 
        return WorkoutTemplate.remove().exec() 
    })

    // Seed
    .then(function() { 
        return User.seed(
            require('users.json'));
    })
    .then(function() {
        return Exercise.seed(
            require('exercises.json'));
    })
    .then(function() {     
        return WorkoutTemplate.seed(
            require('workoutTemplates.json')); })

    // Finito!
    .then(function() { 
        done(); 
    }, function(err) { 
        return done(err); 
    });

});