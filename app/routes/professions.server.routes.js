'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var professions = require('../../app/controllers/professions.server.controller');

	// Professions Routes
	app.route('/professions')
		.get(professions.list)
		.post(users.requiresLogin, professions.create);

	app.route('/professions/:professionId')
		.get(professions.read)
		.put(users.requiresLogin, professions.hasAuthorization, professions.update)
		.delete(users.requiresLogin, professions.hasAuthorization, professions.delete);

	// Finish by binding the Profession middleware
	app.param('professionId', professions.professionByID);
};
