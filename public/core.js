var mymod = angular.module('mymod', []);

function mainController($scope, $http){
    $scope.testParams = {};
    $scope.lastResult ="-";
    $scope.testState = "";
    $scope.buttonValue = "Start Test";
    

    $scope.runTest = function(){
		//console.log("running test");
		//console.log($scope.testParams);
		$scope.buttonValue = "Test Running";
		var button = document.getElementById("testButton");
		button.classList.add("alert");
		button.disabled = true;
		
		$http.post('/api/runTest', $scope.testParams)
			.success(function(data){
				//$scope.lastResult = data.upload;
				//console.log(data);
				$scope.buttonValue = "Start Test";
				button.classList.remove("alert");
				button.disabled = false;
				if(data.upload == "noServer"){
					alert("Could not connect to server.");
				} else if(data.upload == "noClient"){
					alert("Could not connect to client.");
				} else {
					$scope.lastResult = data.upload;
				}
			})
			.error(function(data){
				console.log("ERROR: " + data);
		});
    };
}
