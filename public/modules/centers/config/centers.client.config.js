'use strict';

// Configuring the Articles module
angular.module('centers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Centers', 'centers', 'dropdown', '/centers(/create)?');
		Menus.addSubMenuItem('topbar', 'centers', 'List Centers', 'centers');
		Menus.addSubMenuItem('topbar', 'centers', 'New Center', 'centers/create');
	}
]);