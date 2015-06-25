'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'fasteach';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('centers');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('cities');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('groups');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('levels');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('professions');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
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
'use strict';

// Centers controller
angular.module('centers').controller('CentersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Centers',
	function($scope, $stateParams, $location, Authentication, Centers) {
		$scope.authentication = Authentication;

		// Create new Center
		$scope.create = function() {
			// Create new Center object
			var center = new Centers ({
				name: this.name
			});

			// Redirect after save
			center.$save(function(response) {
				$location.path('centers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Center
		$scope.remove = function(center) {
			if ( center ) { 
				center.$remove();

				for (var i in $scope.centers) {
					if ($scope.centers [i] === center) {
						$scope.centers.splice(i, 1);
					}
				}
			} else {
				$scope.center.$remove(function() {
					$location.path('centers');
				});
			}
		};

		// Update existing Center
		$scope.update = function() {
			var center = $scope.center;

			center.$update(function() {
				$location.path('centers/' + center._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Centers
		$scope.find = function() {
			$scope.centers = Centers.query();
		};

		// Find existing Center
		$scope.findOne = function() {
			$scope.center = Centers.get({ 
				centerId: $stateParams.centerId
			});
		};
	}
]);
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
'use strict';

// Configuring the Articles module
angular.module('cities').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cities', 'cities', 'dropdown', '/cities(/create)?');
		Menus.addSubMenuItem('topbar', 'cities', 'List Cities', 'cities');
		Menus.addSubMenuItem('topbar', 'cities', 'New City', 'cities/create');
	}
]);
'use strict';

//Setting up route
angular.module('cities').config(['$stateProvider',
	function($stateProvider) {
		// Cities state routing
		$stateProvider.
		state('listCities', {
			url: '/cities',
			templateUrl: 'modules/cities/views/list-cities.client.view.html'
		}).
		state('createCity', {
			url: '/cities/create',
			templateUrl: 'modules/cities/views/create-city.client.view.html'
		}).
		state('viewCity', {
			url: '/cities/:cityId',
			templateUrl: 'modules/cities/views/view-city.client.view.html'
		}).
		state('editCity', {
			url: '/cities/:cityId/edit',
			templateUrl: 'modules/cities/views/edit-city.client.view.html'
		});
	}
]);
'use strict';

// Cities controller
angular.module('cities').controller('CitiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cities', '$http',
	function($scope, $stateParams, $location, Authentication, Cities, $http) {
		$scope.authentication = Authentication;

		// Create new City
		$scope.create = function() {
			// Create new City object
			var city = new Cities ({
				name: this.name
			});

			// Redirect after save
			city.$save(function(response) {
				$location.path('cities/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing City
		$scope.remove = function(city) {
			if ( city ) { 
				city.$remove();

				for (var i in $scope.cities) {
					if ($scope.cities [i] === city) {
						$scope.cities.splice(i, 1);
					}
				}
			} else {
				$scope.city.$remove(function() {
					$location.path('cities');
				});
			}
		};

		// Update existing City
		$scope.update = function() {
			var city = $scope.city;

			city.$update(function() {
				$location.path('cities/' + city._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cities
		$scope.find = function() {
			//$scope.cities = Cities.query();
            $http.get('/cities').then(function(res){
                $scope.cities = res.data;
                console.log('res: ', res);
            }, function(){});
		};

		// Find existing City
		$scope.findOne = function() {
			$scope.city = Cities.get({ 
				cityId: $stateParams.cityId
			});
		};
	}
]);

'use strict';

//Cities service used to communicate Cities REST endpoints
angular.module('cities').factory('Cities', ['$resource',
	function($resource) {
		return $resource('cities/:cityId', { cityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('groups').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Groups', 'groups', 'dropdown', '/groups(/create)?');
		Menus.addSubMenuItem('topbar', 'groups', 'List Groups', 'groups');
		Menus.addSubMenuItem('topbar', 'groups', 'New Group', 'groups/create');
	}
]);
'use strict';

//Setting up route
angular.module('groups').config(['$stateProvider',
	function($stateProvider) {
		// Groups state routing
		$stateProvider.
		state('listGroups', {
			url: '/groups',
			templateUrl: 'modules/groups/views/list-groups.client.view.html'
		}).
		state('createGroup', {
			url: '/groups/create',
			templateUrl: 'modules/groups/views/create-group.client.view.html'
		}).
		state('viewGroup', {
			url: '/groups/:groupId',
			templateUrl: 'modules/groups/views/view-group.client.view.html'
		}).
		state('editGroup', {
			url: '/groups/:groupId/edit',
			templateUrl: 'modules/groups/views/edit-group.client.view.html'
		});
	}
]);
'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups',
	function($scope, $stateParams, $location, Authentication, Groups) {
		$scope.authentication = Authentication;

		// Create new Group
		$scope.create = function() {
			// Create new Group object
			var group = new Groups ({
				name: this.name
			});

			// Redirect after save
			group.$save(function(response) {
				$location.path('groups/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Group
		$scope.remove = function(group) {
			if ( group ) { 
				group.$remove();

				for (var i in $scope.groups) {
					if ($scope.groups [i] === group) {
						$scope.groups.splice(i, 1);
					}
				}
			} else {
				$scope.group.$remove(function() {
					$location.path('groups');
				});
			}
		};

		// Update existing Group
		$scope.update = function() {
			var group = $scope.group;

			group.$update(function() {
				$location.path('groups/' + group._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Groups
		$scope.find = function() {
			$scope.groups = Groups.query();
		};

		// Find existing Group
		$scope.findOne = function() {
			$scope.group = Groups.get({ 
				groupId: $stateParams.groupId
			});
		};
	}
]);
'use strict';

//Groups service used to communicate Groups REST endpoints
angular.module('groups').factory('Groups', ['$resource',
	function($resource) {
		return $resource('groups/:groupId', { groupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('levels').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Levels', 'levels', 'dropdown', '/levels(/create)?');
		Menus.addSubMenuItem('topbar', 'levels', 'List Levels', 'levels');
		Menus.addSubMenuItem('topbar', 'levels', 'New Level', 'levels/create');
	}
]);
'use strict';

//Setting up route
angular.module('levels').config(['$stateProvider',
	function($stateProvider) {
		// Levels state routing
		$stateProvider.
		state('listLevels', {
			url: '/levels',
			templateUrl: 'modules/levels/views/list-levels.client.view.html'
		}).
		state('createLevel', {
			url: '/levels/create',
			templateUrl: 'modules/levels/views/create-level.client.view.html'
		}).
		state('viewLevel', {
			url: '/levels/:levelId',
			templateUrl: 'modules/levels/views/view-level.client.view.html'
		}).
		state('editLevel', {
			url: '/levels/:levelId/edit',
			templateUrl: 'modules/levels/views/edit-level.client.view.html'
		});
	}
]);
'use strict';

// Levels controller
angular.module('levels').controller('LevelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Levels',
	function($scope, $stateParams, $location, Authentication, Levels) {
		$scope.authentication = Authentication;

		// Create new Level
		$scope.create = function() {
			// Create new Level object
			var level = new Levels ({
				name: this.name
			});

			// Redirect after save
			level.$save(function(response) {
				$location.path('levels/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Level
		$scope.remove = function(level) {
			if ( level ) { 
				level.$remove();

				for (var i in $scope.levels) {
					if ($scope.levels [i] === level) {
						$scope.levels.splice(i, 1);
					}
				}
			} else {
				$scope.level.$remove(function() {
					$location.path('levels');
				});
			}
		};

		// Update existing Level
		$scope.update = function() {
			var level = $scope.level;

			level.$update(function() {
				$location.path('levels/' + level._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Levels
		$scope.find = function() {
			$scope.levels = Levels.query();
		};

		// Find existing Level
		$scope.findOne = function() {
			$scope.level = Levels.get({ 
				levelId: $stateParams.levelId
			});
		};
	}
]);
'use strict';

//Levels service used to communicate Levels REST endpoints
angular.module('levels').factory('Levels', ['$resource',
	function($resource) {
		return $resource('levels/:levelId', { levelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

// Professions controller
angular.module('professions').controller('ProfessionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Professions',
	function($scope, $stateParams, $location, Authentication, Professions) {
		$scope.authentication = Authentication;

		// Create new Profession
		$scope.create = function() {
			// Create new Profession object
			var profession = new Professions ({
				name: this.name
			});

			// Redirect after save
			profession.$save(function(response) {
				$location.path('professions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Profession
		$scope.remove = function(profession) {
			if ( profession ) { 
				profession.$remove();

				for (var i in $scope.professions) {
					if ($scope.professions [i] === profession) {
						$scope.professions.splice(i, 1);
					}
				}
			} else {
				$scope.profession.$remove(function() {
					$location.path('professions');
				});
			}
		};

		// Update existing Profession
		$scope.update = function() {
			var profession = $scope.profession;

			profession.$update(function() {
				$location.path('professions/' + profession._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Professions
		$scope.find = function() {
			$scope.professions = Professions.query();
		};

		// Find existing Profession
		$scope.findOne = function() {
			$scope.profession = Professions.get({ 
				professionId: $stateParams.professionId
			});
		};
	}
]);
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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);