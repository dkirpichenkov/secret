/**
 * Created by doki on 01.07.14.
 */

var profilersControllers = angular.module('profilerControllers', ['appsessionrec', 'dataview', 'ngResource']);

profilersControllers.factory("methods", function($resource) {
	return $resource("/profiler/:appId/:sessionId/:recId/methods", {}, {getByParents:{method:'POST', isArray:true}});
});

profilersControllers.factory("analyze", function($resource) {
	return $resource("/profiler/:appId/:sessionId/:recId/analyze");
});

profilersControllers.controller('profilerController', function($scope, dataview, methods, analyze){
	$scope.title = 'Profiling information'

	$scope.methods = [];

	$scope.stack = [];

	function processSessionData(){
		analyze.get({appId: dataview.appId, sessionId: dataview.sessionId, recId: dataview.recId}, function(data){
		});
	}

	function loadMethods(){
		$scope.recId = dataview.recId;

		if($scope.stack.length==0) {
			methods.query({
				appId: dataview.appId,
				sessionId: dataview.sessionId,
				recId: dataview.recId
			}, function (data) {
				prepareData(data)
			});
		} else {
			var stackIds = [];
			for(var i=0;i<$scope.stack.length;i++){
				stackIds.push($scope.stack[i]._id);
			}

			methods.getByParents({
				appId: dataview.appId,
				sessionId: dataview.sessionId,
				recId: dataview.recId
			}, stackIds, function(data){
				prepareData(data);
			});
		}
	}

	function prepareData(data){
		$scope.methods = []
		for (var i = 0; i < data.length; i++) {
			$scope.methods.push(data[i]);
		}
	}

	if($scope.appId>0 && $scope.sessionId>0){
		loadMethods();
	}

	$scope.analyze = function(){
		processSessionData();
	}

	$scope.resetStack = function(){
		$scope.stack = [];
		loadMethods();
	}

	$scope.upStack = function(){
		$scope.stack.pop();
		loadMethods();
	}

	$scope.onDataViewUpdated = function(){
		loadMethods();
	}

	$scope.selectMethod = function(method){
		$scope.stack.push(method);
		loadMethods();
	}

});
