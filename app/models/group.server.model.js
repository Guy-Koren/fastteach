'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Group name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    center: {
        type: Schema.ObjectId,
        ref: 'Center'
    },
    profession: {
        type: Schema.ObjectId,
        ref: 'Profession'
    },
    level: {
        type: Schema.ObjectId,
        ref: 'Level'
    }
});

mongoose.model('Group', GroupSchema);
