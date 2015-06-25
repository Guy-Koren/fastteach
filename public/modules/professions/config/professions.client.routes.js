'use strict';

//Setting up route
angular.module('professions').config(['$stateProvider',
	function($stateProvider) {
		// Professions state routing
		$stateProvider.
		state('listProfessions', {
			url: '/professions',
			templateUrl: 'modules/professions/views/list-professions.client.view.html'
		}).
		state('createProfession', {
			url: '/professions/create',
			templateUrl: 'modules/professions/views/create-profession.client.view.html'
		}).
		state('viewProfession', {
			url: '/professions/:professionId',
			templateUrl: 'modules/professions/views/view-profession.client.view.html'
		}).
		state('editProfession', {
			url: '/professions/:professionId/edit',
			templateUrl: 'modules/professions/views/edit-profession.client.view.html'
		});
	}
]);