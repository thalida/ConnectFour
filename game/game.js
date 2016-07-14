'use strict';

angular.module('app').component('game', {
    templateUrl: './game/game.html',
    bindings: {},
    controller: function(){
        var $ctrl = this;

        $ctrl.init = function(){
            $ctrl.isGameOver = false;
            $ctrl.winner = null;
            $ctrl.winState = 4;

            $ctrl.players = [
                {id: 0, color: 'yellow', name: 'Player 1'},
                {id: 1, color: 'red', name: 'Player 2'}
            ];
            $ctrl.currentPlayer = $ctrl.players[0];

            $ctrl.plays = [];
            $ctrl.board = [];
            $ctrl.boardDimensions = {w: 7, h: 6};
            for( var i = 0; i < $ctrl.boardDimensions.h; i += 1 ){
                $ctrl.board.push( new Array($ctrl.boardDimensions.w).fill('') );
            }

            console.log('$ctrl.board ' , $ctrl.board);
        };

        // http://stackoverflow.com/questions/33181356/connect-four-game-checking-for-wins-js
        $ctrl.checkLineWin = function (a, b, c, d) {
            var plays = [a, b, c, d];
            var ids = _.pluck(plays, 'id');
            var isSame = _.every(ids, function( id ){ return $ctrl.currentPlayer.id === id});
            return isSame;
        }

        $ctrl.checkWin = function(){
            var bd = angular.copy($ctrl.plays);
            var won = false;

            // Check down
            for (var r = 0; r < 3; r += 1){
                for (var c = 0; c < 7; c += 1){
                    if( bd[r] && bd[r+1] && bd[r+2] && bd[r+3] ){
                        if( $ctrl.checkLineWin(bd[r][c], bd[r+1][c], bd[r+2][c], bd[r+3][c]) ){
                            won = true;
                            return true;
                        }
                    }
                }
            }

            // Check right
            for (var r = 0; r < 6; r += 1){
                for (var c = 0; c < 4; c += 1){
                    if( bd[r] && $ctrl.checkLineWin(bd[r][c], bd[r][c+1], bd[r][c+2], bd[r][c+3]) ){
                        won = true;
                        return true;
                    }
                }
            }

            // Check down-right
            for (var r = 0; r < 3; r += 1){
                for (var c = 0; c < 4; c += 1){
                    if( bd[r] && bd[r+1] && bd[r+2] && bd[r+3] ){
                        if ($ctrl.checkLineWin(bd[r][c], bd[r+1][c+1], bd[r+2][c+2], bd[r+3][c+3])){
                            won = true;
                            return true;
                        }
                    }
                }
            }

            // Check down-left
            for (var r = 3; r < 6; r += 1){
                for (var c = 0; c < 4; c += 1){
                    if( bd[r] && bd[r-1] && bd[r-2] && bd[r-3] ){
                        if ($ctrl.checkLineWin(bd[r][c], bd[r-1][c+1], bd[r-2][c+2], bd[r-3][c+3])){
                            won = true;
                            return true;
                        }
                    }
                }
            }

            return won;
        }

        $ctrl.addMove = function( move ){
            var playCoords = {x: null, y: null};
            if( typeof $ctrl.plays[move.y] === 'undefined' || $ctrl.plays[move.y] === null ){
                $ctrl.plays[move.y] = [];
            }

            playCoords.x = move.y;
            playCoords.y = $ctrl.plays[move.y].length;
            $ctrl.plays[move.y].push( $ctrl.currentPlayer );

            return playCoords;
        }

        $ctrl.setNextPlayer = function(){
            if( $ctrl.isGameOver ){
                return;
            }

            var nextIndex = ($ctrl.currentPlayer.id + 1 >= $ctrl.players.length) ? 0 : $ctrl.currentPlayer.id + 1;
            $ctrl.currentPlayer = $ctrl.players[nextIndex];
        };

        $ctrl.onSpaceClick = function( row, col ){
            if( $ctrl.isGameOver || ($ctrl.plays[col] && $ctrl.plays[col].length >= $ctrl.boardDimensions.h) ){
                return;
            }

            var move = {
                x: row,
                y: col
            };

            var newMoveCoords = $ctrl.addMove( move );
            var isWon = $ctrl.checkWin( newMoveCoords );
            if( isWon ){
                $ctrl.isGameOver = true;
                $ctrl.winner = $ctrl.currentPlayer;
            }
            $ctrl.setNextPlayer();
        };

        $ctrl.init();
    }
});
