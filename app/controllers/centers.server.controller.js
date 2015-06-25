'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Center = mongoose.model('Center'),
	_ = require('lodash');

/**
 * Create a Center
 */
exports.create = function(req, res) {
	var center = new Center(req.body);
	center.user = req.user;

	center.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(center);
		}
	});
};

/**
 * Show the current Center
 */
exports.read = function(req, res) {
	res.jsonp(req.center);
};

/**
 * Update a Center
 */
exports.update = function(req, res) {
	var center = req.center ;

	center = _.extend(center , req.body);

	center.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(center);
		}
	});
};

/**
 * Delete an Center
 */
exports.delete = function(req, res) {
	var center = req.center ;

	center.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(center);
		}
	});
};

/**
 * List of Centers
 */
exports.list = function(req, res) { 
	Center.find().sort('-created').populate('user', 'displayName').exec(function(err, centers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(centers);
		}
	});
};

/**
 * Center middleware
 */
exports.centerByID = function(req, res, next, id) { 
	Center.findById(id).populate('user', 'displayName').exec(function(err, center) {
		if (err) return next(err);
		if (! center) return next(new Error('Failed to load Center ' + id));
		req.center = center ;
		next();
	});
};

/**
 * Center authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.center.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
