'use strict';

angular.module('app').component('game', {
    templateUrl: './game/game.html',
    bindings: {},
    controller: function(){
        var $ctrl = this;

        $ctrl.init = function(){
            $ctrl.isGameOver = false;
            $ctrl.winner = null;

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

        $ctrl.checkWin = function( move ){
            $ctrl.isGameOver = false;
            console.group($ctrl.currentPlayer.color, move);
            console.log( $ctrl.plays );

            // http://stackoverflow.com/a/1058804
            var player = $ctrl.currentPlayer;
            var moves = {col: 0, row: 0, diag: 0, rdiag: 0};

            for( var i = 0; i < $ctrl.boardDimensions.w; i += 1 ){
                console.group(i);
                console.log('check | col: ', move.x, i);
                console.log('check | row: ', i, move.y);
                console.log('check | diag: ', i, i);
                console.log('check | rdiag: ', i, $ctrl.boardDimensions.w - i + 1);
                // if( $ctrl.board[move.x][i] === player ){
                //     col += 1;
                // }
                // if( $ctrl.board[i][move.y] === player ){
                //     row += 1;
                // }
                // if( $ctrl.board[i][i] === player ){
                //     diag += 1;
                // }
                // if( $ctrl.board[i][$ctrl.boardSize - i + 1] === player ){
                //     rdiag += 1;
                // }
                console.groupEnd();
            }
            console.groupEnd();
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

        $ctrl.events = {
            onSpaceClick: function( row, col ){
                if( $ctrl.isGameOver || ($ctrl.plays[col] && $ctrl.plays[col].length >= $ctrl.boardDimensions.h) ){
                    return;
                }

                var move = {
                    x: row,
                    y: col
                };

                var newMoveCoords = $ctrl.addMove( move );
                $ctrl.checkWin( newMoveCoords );
                $ctrl.setNextPlayer();
            }
        };

        $ctrl.init();
    }
});
