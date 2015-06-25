'use strict';

//Centers service used to communicate Centers REST endpoints
angular.module('centers').factory('Centers', ['$resource',
	function($resource) {
		return $resource('centers/:centerId', { centerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);