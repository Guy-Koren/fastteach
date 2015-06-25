'use strict';

//Setting up route
angular.module('centers').config(['$stateProvider',
	function($stateProvider) {
		// Centers state routing
		$stateProvider.
		state('listCenters', {
			url: '/centers',
			templateUrl: 'modules/centers/views/list-centers.client.view.html'
		}).
		state('createCenter', {
			url: '/centers/create',
			templateUrl: 'modules/centers/views/create-center.client.view.html'
		}).
		state('viewCenter', {
			url: '/centers/:centerId',
			templateUrl: 'modules/centers/views/view-center.client.view.html'
		}).
		state('editCenter', {
			url: '/centers/:centerId/edit',
			templateUrl: 'modules/centers/views/edit-center.client.view.html'
		});
	}
]);