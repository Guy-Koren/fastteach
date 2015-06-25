'use strict';

(function() {
	// Centers Controller Spec
	describe('Centers Controller Tests', function() {
		// Initialize global variables
		var CentersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Centers controller.
			CentersController = $controller('CentersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Center object fetched from XHR', inject(function(Centers) {
			// Create sample Center using the Centers service
			var sampleCenter = new Centers({
				name: 'New Center'
			});

			// Create a sample Centers array that includes the new Center
			var sampleCenters = [sampleCenter];

			// Set GET response
			$httpBackend.expectGET('centers').respond(sampleCenters);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.centers).toEqualData(sampleCenters);
		}));

		it('$scope.findOne() should create an array with one Center object fetched from XHR using a centerId URL parameter', inject(function(Centers) {
			// Define a sample Center object
			var sampleCenter = new Centers({
				name: 'New Center'
			});

			// Set the URL parameter
			$stateParams.centerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/centers\/([0-9a-fA-F]{24})$/).respond(sampleCenter);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.center).toEqualData(sampleCenter);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Centers) {
			// Create a sample Center object
			var sampleCenterPostData = new Centers({
				name: 'New Center'
			});

			// Create a sample Center response
			var sampleCenterResponse = new Centers({
				_id: '525cf20451979dea2c000001',
				name: 'New Center'
			});

			// Fixture mock form input values
			scope.name = 'New Center';

			// Set POST response
			$httpBackend.expectPOST('centers', sampleCenterPostData).respond(sampleCenterResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Center was created
			expect($location.path()).toBe('/centers/' + sampleCenterResponse._id);
		}));

		it('$scope.update() should update a valid Center', inject(function(Centers) {
			// Define a sample Center put data
			var sampleCenterPutData = new Centers({
				_id: '525cf20451979dea2c000001',
				name: 'New Center'
			});

			// Mock Center in scope
			scope.center = sampleCenterPutData;

			// Set PUT response
			$httpBackend.expectPUT(/centers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/centers/' + sampleCenterPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid centerId and remove the Center from the scope', inject(function(Centers) {
			// Create new Center object
			var sampleCenter = new Centers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Centers array and include the Center
			scope.centers = [sampleCenter];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/centers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCenter);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.centers.length).toBe(0);
		}));
	});
}());