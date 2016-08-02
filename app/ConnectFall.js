var ConnectFall = angular.module('ConnectFall', []);


ConnectFall.controller('Game', ['$scope', '$rootScope', function(scope, rootScope) {
    rootScope.height = 6;
    rootScope.width = 7;
    rootScope.turn = 1;
    rootScope.status_enum = ["empty", "red", "blue"];
    rootScope.player_enum = rootScope.status_enum.splice(1)
    rootScope.default_type = rootScope.status_enum[0];
    scope.board = initBoard(rootScope.height, rootScope.width);

    function initBoard(height, width) {
        var board = new Array(height);

        for( i = 0; i < height; i++ ) {
            board[i] = new Array(width)
            for( j = 0; j < width; j++ ) {
                board[i][j] = rootScope.default_type;
            }
        }

        return board;
    }

    function pushDown(board) {
        for( i = 0; i < rootScope.height-1; i++ ) {
            for( j = 0; j < rootScope.width; j++ ) {
                next = board[i+1][j];
                curr = board[i+1][j];

                // If lower piece is empty
                if( next == rootScope.default_type ) {
                    board[i+1][j] = curr;
                }
            }
        }
    }

    function addAt(board, type, col) {
        board[0][col] = new String(type);
    }

    rootScope.nextTurn = function(row, col) {
        console.log('row: ' + row + ' col: ' + col);
        pushDown(scope.board);
        addAt(scope.board, "red", col)
        // TODO define logic for handling next turn
    }

}])
.directive('connectFall', function() {
    return {
        templateUrl: "templates/board.html"
    }
})
.directive('cfTile', function() {
    return {
        scope: {
            tileType: '=tileType'
        },
        restrict: 'E',
        template: "<img ng-src='res/tile_{{tileType}}.png'>",
        controller: ["$scope", "$rootScope", function(scope, rootScope) {
            scope.init = function(element, row, col) {
                element.addEventListener('click', function() {
                    rootScope.nextTurn(row, col)
                });
            }
        }],
        link: function(scope, element, attrs, ctlr) {
            scope.init(element[0], scope.$parent.rowIndex, scope.$parent.colIndex)
        }
    };
});