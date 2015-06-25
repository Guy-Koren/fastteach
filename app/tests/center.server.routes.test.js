'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Center = mongoose.model('Center'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, center;

/**
 * Center routes tests
 */
describe('Center CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Center
		user.save(function() {
			center = {
				name: 'Center Name'
			};

			done();
		});
	});

	it('should be able to save Center instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Center
				agent.post('/centers')
					.send(center)
					.expect(200)
					.end(function(centerSaveErr, centerSaveRes) {
						// Handle Center save error
						if (centerSaveErr) done(centerSaveErr);

						// Get a list of Centers
						agent.get('/centers')
							.end(function(centersGetErr, centersGetRes) {
								// Handle Center save error
								if (centersGetErr) done(centersGetErr);

								// Get Centers list
								var centers = centersGetRes.body;

								// Set assertions
								(centers[0].user._id).should.equal(userId);
								(centers[0].name).should.match('Center Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Center instance if not logged in', function(done) {
		agent.post('/centers')
			.send(center)
			.expect(401)
			.end(function(centerSaveErr, centerSaveRes) {
				// Call the assertion callback
				done(centerSaveErr);
			});
	});

	it('should not be able to save Center instance if no name is provided', function(done) {
		// Invalidate name field
		center.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Center
				agent.post('/centers')
					.send(center)
					.expect(400)
					.end(function(centerSaveErr, centerSaveRes) {
						// Set message assertion
						(centerSaveRes.body.message).should.match('Please fill Center name');
						
						// Handle Center save error
						done(centerSaveErr);
					});
			});
	});

	it('should be able to update Center instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Center
				agent.post('/centers')
					.send(center)
					.expect(200)
					.end(function(centerSaveErr, centerSaveRes) {
						// Handle Center save error
						if (centerSaveErr) done(centerSaveErr);

						// Update Center name
						center.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Center
						agent.put('/centers/' + centerSaveRes.body._id)
							.send(center)
							.expect(200)
							.end(function(centerUpdateErr, centerUpdateRes) {
								// Handle Center update error
								if (centerUpdateErr) done(centerUpdateErr);

								// Set assertions
								(centerUpdateRes.body._id).should.equal(centerSaveRes.body._id);
								(centerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Centers if not signed in', function(done) {
		// Create new Center model instance
		var centerObj = new Center(center);

		// Save the Center
		centerObj.save(function() {
			// Request Centers
			request(app).get('/centers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Center if not signed in', function(done) {
		// Create new Center model instance
		var centerObj = new Center(center);

		// Save the Center
		centerObj.save(function() {
			request(app).get('/centers/' + centerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', center.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Center instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Center
				agent.post('/centers')
					.send(center)
					.expect(200)
					.end(function(centerSaveErr, centerSaveRes) {
						// Handle Center save error
						if (centerSaveErr) done(centerSaveErr);

						// Delete existing Center
						agent.delete('/centers/' + centerSaveRes.body._id)
							.send(center)
							.expect(200)
							.end(function(centerDeleteErr, centerDeleteRes) {
								// Handle Center error error
								if (centerDeleteErr) done(centerDeleteErr);

								// Set assertions
								(centerDeleteRes.body._id).should.equal(centerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Center instance if not signed in', function(done) {
		// Set Center user 
		center.user = user;

		// Create new Center model instance
		var centerObj = new Center(center);

		// Save the Center
		centerObj.save(function() {
			// Try deleting Center
			request(app).delete('/centers/' + centerObj._id)
			.expect(401)
			.end(function(centerDeleteErr, centerDeleteRes) {
				// Set message assertion
				(centerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Center error error
				done(centerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Center.remove().exec();
		done();
	});
});