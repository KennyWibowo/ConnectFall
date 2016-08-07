var ConnectFall = angular.module('ConnectFall', []);


ConnectFall.controller('Game', ['$scope', '$rootScope', function(scope, rootScope) {
    rootScope.height = 6;
    rootScope.width = 7;
    rootScope.turn = 1;
    rootScope.status_enum = ["empty", "red", "blue"];
    rootScope.player_enum = rootScope.status_enum.splice(1)
    rootScope.default_type = rootScope.status_enum[0];
    rootScope.board = [];

    scope.current_player = rootScope.player_enum[rootScope.turn - 1]
    scope.alertType = null;
    scope.message = null;

    scope.getNumber = function(num) {
        num_arr = new Array(num); 
        for( var i = 0; i < num; i++ ) {
            num_arr[i] = i;
        }
        return num_arr;
    }

    function pushDown(board) {
        for( var row = rootScope.height-2; row >= 0 ; row-- ) {
            for( var col = 0; col < rootScope.width; col++ ) {
                next = board[row+1][col];
                curr = board[row][col];

                // If lower piece is empty
                if( next.value == rootScope.default_type ) {
                    next.setValue(curr.value);
                    curr.setValue(rootScope.default_type);
                }
            }
        }
    }

    function getNextTurn(turn) {
        var next = (turn - 1) % rootScope.player_enum.length;
        return rootScope.player_enum[next];
    }

    function addAt(board, type, col) {
        board[0][col].setValue(type);
    }

    function applyAllBoard() {
        for( var row = 0; row < rootScope.height; row++ ) {
            for( var col = 0; col < rootScope.width; col++ ) {
                rootScope.board[row][col].$apply();
            }
        }
    }

    function isValidMove(col) {
        for( var row = 0; row < rootScope.height; row++ ) {
            if(rootScope.board[row][col].value == rootScope.default_type) {
                return true;
            }
        }
        return false;
    }

    function setMessage(alertType, message) {
        scope.alertType = alertType;
        scope.message = message;
        scope.$apply();
    }

    rootScope.registerTile = function (row, col, scope) {
        if( row == rootScope.board.length ) {
            rootScope.board.push([]);
        }

        rootScope.board[row][col] = scope;
    }

    rootScope.nextTurn = function(row, col) {
        console.log('row: ' + row + ' col: ' + col);

        if(isValidMove(col)) {
            setMessage("info", null);
            var next = scope.current_player;
            rootScope.turn++;
            scope.current_player = getNextTurn(rootScope.turn);
            pushDown(rootScope.board);
            addAt(rootScope.board, next, col);
            applyAllBoard();
        } else {
            setMessage("danger", "Error: Invalid move!");
        }

        scope.$apply();
        
    }

}])
.directive('connectFall', function() {
    return {
        replace: true,
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
