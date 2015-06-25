'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Profession = mongoose.model('Profession'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, profession;

/**
 * Profession routes tests
 */
describe('Profession CRUD tests', function() {
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

		// Save a user to the test db and create new Profession
		user.save(function() {
			profession = {
				name: 'Profession Name'
			};

			done();
		});
	});

	it('should be able to save Profession instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Profession
				agent.post('/professions')
					.send(profession)
					.expect(200)
					.end(function(professionSaveErr, professionSaveRes) {
						// Handle Profession save error
						if (professionSaveErr) done(professionSaveErr);

						// Get a list of Professions
						agent.get('/professions')
							.end(function(professionsGetErr, professionsGetRes) {
								// Handle Profession save error
								if (professionsGetErr) done(professionsGetErr);

								// Get Professions list
								var professions = professionsGetRes.body;

								// Set assertions
								(professions[0].user._id).should.equal(userId);
								(professions[0].name).should.match('Profession Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Profession instance if not logged in', function(done) {
		agent.post('/professions')
			.send(profession)
			.expect(401)
			.end(function(professionSaveErr, professionSaveRes) {
				// Call the assertion callback
				done(professionSaveErr);
			});
	});

	it('should not be able to save Profession instance if no name is provided', function(done) {
		// Invalidate name field
		profession.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Profession
				agent.post('/professions')
					.send(profession)
					.expect(400)
					.end(function(professionSaveErr, professionSaveRes) {
						// Set message assertion
						(professionSaveRes.body.message).should.match('Please fill Profession name');
						
						// Handle Profession save error
						done(professionSaveErr);
					});
			});
	});

	it('should be able to update Profession instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Profession
				agent.post('/professions')
					.send(profession)
					.expect(200)
					.end(function(professionSaveErr, professionSaveRes) {
						// Handle Profession save error
						if (professionSaveErr) done(professionSaveErr);

						// Update Profession name
						profession.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Profession
						agent.put('/professions/' + professionSaveRes.body._id)
							.send(profession)
							.expect(200)
							.end(function(professionUpdateErr, professionUpdateRes) {
								// Handle Profession update error
								if (professionUpdateErr) done(professionUpdateErr);

								// Set assertions
								(professionUpdateRes.body._id).should.equal(professionSaveRes.body._id);
								(professionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Professions if not signed in', function(done) {
		// Create new Profession model instance
		var professionObj = new Profession(profession);

		// Save the Profession
		professionObj.save(function() {
			// Request Professions
			request(app).get('/professions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Profession if not signed in', function(done) {
		// Create new Profession model instance
		var professionObj = new Profession(profession);

		// Save the Profession
		professionObj.save(function() {
			request(app).get('/professions/' + professionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', profession.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Profession instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Profession
				agent.post('/professions')
					.send(profession)
					.expect(200)
					.end(function(professionSaveErr, professionSaveRes) {
						// Handle Profession save error
						if (professionSaveErr) done(professionSaveErr);

						// Delete existing Profession
						agent.delete('/professions/' + professionSaveRes.body._id)
							.send(profession)
							.expect(200)
							.end(function(professionDeleteErr, professionDeleteRes) {
								// Handle Profession error error
								if (professionDeleteErr) done(professionDeleteErr);

								// Set assertions
								(professionDeleteRes.body._id).should.equal(professionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Profession instance if not signed in', function(done) {
		// Set Profession user 
		profession.user = user;

		// Create new Profession model instance
		var professionObj = new Profession(profession);

		// Save the Profession
		professionObj.save(function() {
			// Try deleting Profession
			request(app).delete('/professions/' + professionObj._id)
			.expect(401)
			.end(function(professionDeleteErr, professionDeleteRes) {
				// Set message assertion
				(professionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Profession error error
				done(professionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Profession.remove().exec();
		done();
	});
});