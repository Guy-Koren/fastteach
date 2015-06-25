'use strict';

//Professions service used to communicate Professions REST endpoints
angular.module('professions').factory('Professions', ['$resource',
	function($resource) {
		return $resource('professions/:professionId', { professionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);