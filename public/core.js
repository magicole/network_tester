var mymod = angular.module('mymod', []);

function mainController($scope, $http){
    $scope.formData = {};

    //make an initial call to getNum
    $http.get('/api/getNum')
	.success(function(data){
	    $scope.number = data;
	    console.log(data);
	})
	.error(function(data){
	    console.log("Error: " + data);
	});

    //define sendData to call our api
    $scope.sendData = function(){
	$scope.formData.doors = "wide open";
	$http.post('/api/test', $scope.formData)
	    .success(function(data){
		$scope.formData = {};
		$scope.number = data;
		console.log(data);
	    })
	    .error(function(data){
		console.log("Error: " + data);
	    });
    };
}
