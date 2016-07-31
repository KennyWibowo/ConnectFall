var ConnectFall = angular.module('ConnectFall', []);


ConnectFall.controller('Game', ['$scope', function($scope) {
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
.directive('cfTile', function() {
	var status = "empty"; // TODO parameterize this, maybe as a integer value?
    return {
        template: "<img src='res/tile_" + status + ".png'>" 
    };
});
