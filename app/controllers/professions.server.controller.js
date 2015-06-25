'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Profession = mongoose.model('Profession'),
	_ = require('lodash');

/**
 * Create a Profession
 */
exports.create = function(req, res) {
	var profession = new Profession(req.body);
	profession.user = req.user;

	profession.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profession);
		}
	});
};

/**
 * Show the current Profession
 */
exports.read = function(req, res) {
	res.jsonp(req.profession);
};

/**
 * Update a Profession
 */
exports.update = function(req, res) {
	var profession = req.profession ;

	profession = _.extend(profession , req.body);

	profession.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profession);
		}
	});
};

/**
 * Delete an Profession
 */
exports.delete = function(req, res) {
	var profession = req.profession ;

	profession.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profession);
		}
	});
};

/**
 * List of Professions
 */
exports.list = function(req, res) { 
	Profession.find().sort('-created').populate('user', 'displayName').exec(function(err, professions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(professions);
		}
	});
};

/**
 * Profession middleware
 */
exports.professionByID = function(req, res, next, id) { 
	Profession.findById(id).populate('user', 'displayName').exec(function(err, profession) {
		if (err) return next(err);
		if (! profession) return next(new Error('Failed to load Profession ' + id));
		req.profession = profession ;
		next();
	});
};

/**
 * Profession authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.profession.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
