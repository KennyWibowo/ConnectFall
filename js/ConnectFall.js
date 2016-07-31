var ConnectFall = angular.module('ConnectFall', []);

ConnectFall.controller('Game', ['$scope', function($scope) {
    $scope.height = 6
    $scope.width = 7
	$scope.getNumber = function(num) {
	    return new Array(num);   
	}
}])
.directive('cfTile', function() {
    return {
        template: "<img src='res/tile_empty.png'>" 
    };
});
