'use strict';

(function() {
	// Professions Controller Spec
	describe('Professions Controller Tests', function() {
		// Initialize global variables
		var ProfessionsController,
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

			// Initialize the Professions controller.
			ProfessionsController = $controller('ProfessionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Profession object fetched from XHR', inject(function(Professions) {
			// Create sample Profession using the Professions service
			var sampleProfession = new Professions({
				name: 'New Profession'
			});

			// Create a sample Professions array that includes the new Profession
			var sampleProfessions = [sampleProfession];

			// Set GET response
			$httpBackend.expectGET('professions').respond(sampleProfessions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.professions).toEqualData(sampleProfessions);
		}));

		it('$scope.findOne() should create an array with one Profession object fetched from XHR using a professionId URL parameter', inject(function(Professions) {
			// Define a sample Profession object
			var sampleProfession = new Professions({
				name: 'New Profession'
			});

			// Set the URL parameter
			$stateParams.professionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/professions\/([0-9a-fA-F]{24})$/).respond(sampleProfession);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.profession).toEqualData(sampleProfession);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Professions) {
			// Create a sample Profession object
			var sampleProfessionPostData = new Professions({
				name: 'New Profession'
			});

			// Create a sample Profession response
			var sampleProfessionResponse = new Professions({
				_id: '525cf20451979dea2c000001',
				name: 'New Profession'
			});

			// Fixture mock form input values
			scope.name = 'New Profession';

			// Set POST response
			$httpBackend.expectPOST('professions', sampleProfessionPostData).respond(sampleProfessionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Profession was created
			expect($location.path()).toBe('/professions/' + sampleProfessionResponse._id);
		}));

		it('$scope.update() should update a valid Profession', inject(function(Professions) {
			// Define a sample Profession put data
			var sampleProfessionPutData = new Professions({
				_id: '525cf20451979dea2c000001',
				name: 'New Profession'
			});

			// Mock Profession in scope
			scope.profession = sampleProfessionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/professions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/professions/' + sampleProfessionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid professionId and remove the Profession from the scope', inject(function(Professions) {
			// Create new Profession object
			var sampleProfession = new Professions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Professions array and include the Profession
			scope.professions = [sampleProfession];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/professions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProfession);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.professions.length).toBe(0);
		}));
	});
}());