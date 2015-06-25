'use strict';

// Configuring the Articles module
angular.module('professions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Professions', 'professions', 'dropdown', '/professions(/create)?');
		Menus.addSubMenuItem('topbar', 'professions', 'List Professions', 'professions');
		Menus.addSubMenuItem('topbar', 'professions', 'New Profession', 'professions/create');
	}
]);