var ConnectFall = angular.module('ConnectFall', []);


ConnectFall.controller('Game', ['$scope', '$rootScope', function(scope, rootScope) {
    rootScope.height = 6;
    rootScope.width = 7;
    rootScope.turn = 1;
    rootScope.status_enum = ["empty", "red", "blue"];
    rootScope.player_enum = rootScope.status_enum.splice(1)
    rootScope.default_type = rootScope.status_enum[0];
    rootScope.board = [];

    scope.getNumber = function(num) {
        num_arr = new Array(num); 
        for( i = 0; i < num; i++ ) {
            num_arr[i] = i;
        }
        return num_arr;
    }

    function pushDown(board) {
        for( row = rootScope.height-2; row >= 0 ; row-- ) {
            for( col = 0; col < rootScope.width; col++ ) {
                next = board[row+1][col];
                curr = board[row][col];

                // If lower piece is empty
                if( next == rootScope.default_type ) {
                    next.setValue(curr.value);
                    curr.setValue(rootScope.default_type);
                }
            }
        }
    }

    function addAt(board, type, col) {
        board[0][col].setValue(type);
    }

    rootScope.registerTile = function (row, col, scope) {
        if( row == rootScope.board.length ) {
            rootScope.board.push([]);
        }

        rootScope.board[row][col] = scope;
    }

    rootScope.nextTurn = function(row, col) {
        console.log('row: ' + row + ' col: ' + col);
        // TODO add checking to see if next turn can be made.
        pushDown(rootScope.board);
        addAt(rootScope.board, "red", col)
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
            tileRow: '=',
            tileCol: '='
        },
        restrict: 'E',
        template: "<img ng-src='{{res_value}}'>",
        controller: ["$scope", "$rootScope", function(scope, rootScope) {
            scope.value = rootScope.default_type;

            scope.setValue = function(val) {
                scope.value = val;
                scope.res_value = 'res/tile_' + val + '.png';
            }

            scope.setValue(scope.value);

            scope.init = function(element, row, col) {
                rootScope.registerTile(row, col, scope);

                element.addEventListener('click', function() {
                    rootScope.nextTurn(row, col);
                });
            }
        }],
        link: function(scope, element, attrs, ctlr) {
            scope.init(element[0], scope.tileRow, scope.tileCol)
        }
    };
});
