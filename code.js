"use strict";
const Gameboard = (function () {
    let gameArray = ['' ,'' ,'' ,'' ,'' ,'' ,'' ,'' ,'' ];

    function add(position, symbol) {
        if (gameArray[position] != '' ) {
            return 1;
        } else {
            gameArray[position] = symbol;
        }
    }

    function getGameArray() {
        return gameArray;
    }

    function resetBoard() {
        gameArray = ['' ,'' ,'' ,'' ,'' ,'' ,'' ,'' ,'' ];
    }

    return {add, getGameArray, resetBoard};
})();

const gameLogic = (function (gameArray) {
    // Returns "X" if X wins and "O" if O wins, returns '' if no winner found.
    function checkWinner() {
        const winArray = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        let winnerFoundFlag = false;
        for (let i = 0; i < 8; i++) {
            let [a, b, c] = winArray[i];

            if (gameArray[a] === gameArray[b] && gameArray[a] === gameArray[c]) {
                winnerFoundFlag = true;
                return gameArray[a];
            }
        }

        if (!winnerFoundFlag) {
            return '';
        }
    }

    function checkTie(){
        for (let i = 0; i < 9; i++) {
            if (gameArray[i] === '') {
                return false;
            }
        }
        return true;
    }

    function declareTheWin() {
        const winner = checkWinner();
        if (winner === '') {
            const tie = checkTie();
            if (tie) {
                return 'tie';
            } else {
                return 'continueGame';
            }
        }
        return winner;
    }

    return {declareTheWin};
})(Gameboard.getGameArray());