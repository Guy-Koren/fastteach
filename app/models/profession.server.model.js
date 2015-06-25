'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Profession Schema
 */
var ProfessionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Profession name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Profession', ProfessionSchema);