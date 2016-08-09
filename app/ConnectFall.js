var connectFall = angular.module('connectFall', []);


connectFall.controller('GameController', ['$scope', '$rootScope', function(scope, rootScope) {
    rootScope.height = 6; 
    rootScope.width = 7;
    rootScope.turn = 1;
    rootScope.status_enum = ["empty", "red", "blue"];
    rootScope.player_enum = rootScope.status_enum.splice(1) 
    rootScope.default_type = rootScope.status_enum[0];
    rootScope.board = [];   //board is empty array

    scope.current_player =  null;
    scope.next_player = rootScope.player_enum[rootScope.turn - 1]
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

    function advanceTurn() {
        var curr = (rootScope.turn - 1) % rootScope.player_enum.length;
        var next = (rootScope.turn) % rootScope.player_enum.length
        
        rootScope.turn++;

        scope.current_player = rootScope.player_enum[curr]
        scope.next_player = rootScope.player_enum[next];

        scope.$apply();
        
        return scope.current_player;
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

    function resetGame() {
        rootScope.turn = 1;
        scope.current_player =  null;
        scope.next_player = rootScope.player_enum[rootScope.turn - 1]
        scope.$apply();
        setMessage("info", null); // clear the message
    }

    function clearBoard() {
        for( var row = 0; row < rootScope.height; row++ ) {
            for( var col = 0; col < rootScope.width; col++ ) {
                rootScope.board[row][col].setValue(rootScope.default_type);
                rootScope.board[row][col].$apply();
            }
        }
    }

    function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function checkThree(i,j,color){ 
        if(color == rootScope.default_type){
            return false;
        }else{
            if(i <= rootScope.height - 4){
                if(rootScope.board[i+1][j].value == color && rootScope.board[i+2][j].value == color && rootScope.board[i+3][j].value==color){
                    return true;
                }
            }
            if(j <= rootScope.width - 4){
                if(rootScope.board[i][j+1].value == color && rootScope.board[i][j+2].value == color && rootScope.board[i][j+3].value == color){
                    return true;
                }
            }
            if(i <= rootScope.height - 4 && j <= rootScope.width - 4){
                if(rootScope.board[i+1][j+1].value == color && rootScope.board[i+2][j+2].value == color && rootScope.board[i+3][j+3].value == color){
                    return true;
                }
            }
            if(i <= rootScope.height - 4 && j >= 3){
               if(rootScope.board[i+1][j-1].value == color && rootScope.board[i+2][j-2].value == color && rootScope.board[i+3][j-3].value == color){
                return true;
               }
            }
        }
        return false;
    }

    //VICTORY CHECK
    function checkWin(){
        for(i = 0; i < rootScope.height; i++) {
            for(j = 0; j < rootScope.width; j++){
                if(checkThree(i,j,rootScope.board[i][j].value)){
                    return rootScope.board[i][j].value;
                }
            }
        }
        return false;
    }

    rootScope.registerTile = function (row, col, scope) {
        if( row == rootScope.board.length ) {
            rootScope.board.push([]);
        }

        rootScope.board[row][col] = scope;
    }

    rootScope.nextTurn = function(row, col) {

        if(checkWin()) {
            resetGame();
            clearBoard();
            return;
        }

        if(isValidMove(col)) {
            setMessage("info", null); // clear the message
            var current_player = advanceTurn(); 
            pushDown(rootScope.board);
            addAt(rootScope.board, current_player, col);

            var winner = checkWin();

            if(winner) {
                setMessage("success", "Victory! " + capitalizeFirstLetter(winner) + " wins! (Click board to reset)");
            };

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
