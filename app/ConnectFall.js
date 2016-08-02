var ConnectFall = angular.module('ConnectFall', []);


ConnectFall.controller('Game', ['$scope', '$rootScope', function($scope, $rootScope) {
    var width = 7;
    var height = 6;

    function initBoard(width, height) {
        var board = new Array(height);

        for( i = 0; i < height; i++ ) {
            board[i] = new Array(width)
            for( j = 0; j < width; j++ ) {
                board[i][j] = "empty"; // TODO maybe represent as integer value instead?
            }
        }

        return board
    }

    $scope.status_enum = ["empty", "red", "blue"];
    $scope.board = initBoard(width, height);
   
}])
.directive('connectFall', function() {
    return {
        templateUrl: "templates/board.html"
    }
})
.directive('cfTile', function() {
    return {
        scope: {
            type: '@tileType'
        },
        restrict: 'E',
        template: "<img ng-src='res/tile_{{type}}.png'>",
        controller: ["$scope", function(scope) {
            scope.init = function(element, row, col) {
                element.addEventListener('click', function() {
                    console.log('row: ' + row + ' col: ' + col);
                });
            }
        }],
        link: function(scope, element, attrs, ctlr) {
            scope.init(element[0], scope.$parent.rowIndex, scope.$parent.colIndex)
        }
    };
});
