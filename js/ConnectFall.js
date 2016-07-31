var ConnectFall = angular.module('ConnectFall', []);

ConnectFall.controller('game_main', ['$scope', function($scope) {
    $scope.name = "ConnectFall"
}])
.directive('cfTile', function() {
    return {
        template: "<img src='res/tile_empty.png'></img>" 
    };
});
