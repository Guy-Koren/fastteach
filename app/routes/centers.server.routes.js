'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var centers = require('../../app/controllers/centers.server.controller');

	// Centers Routes
	app.route('/centers')
		.get(centers.list)
		.post(users.requiresLogin, centers.create);

	app.route('/centers/:centerId')
		.get(centers.read)
		.put(users.requiresLogin, centers.hasAuthorization, centers.update)
		.delete(users.requiresLogin, centers.hasAuthorization, centers.delete);

	// Finish by binding the Center middleware
	app.param('centerId', centers.centerByID);
};
