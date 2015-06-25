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