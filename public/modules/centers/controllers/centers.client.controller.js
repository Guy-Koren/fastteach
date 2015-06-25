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