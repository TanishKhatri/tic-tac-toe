"use strict";
const Gameboard = (function () {
    let gameArray = ['' ,'' ,'' ,'' ,'' ,'' ,'' ,'' ,'' ];

    function add(position, marker) {
        if (gameArray[position] !== '' ) {
            return 1;
        } else {
            gameArray[position] = marker;
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
    function declareTheWin() {
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

    function playGame() {
        function chooseFirstMarker() {
            let randomBinary = Math.floor(Math.random * 2);
            if (randomBinary === 0) {
                return "X";
            } else {
                return "O";
            }
        }
        
        function makeTurn(position, marker) {
            if (Gameboard.add(position, marker) === 1) {
                console.log("Incorrect Position: Try Again");
                return "illegalMove";
            }
        }
         
        let currentMarker = chooseFirstMarker();
        while(true) {
            displayController.updateDisplay(gameArray);
            if (declareTheWin() === "O") {
                console.log("O won");
                Gameboard.resetBoard();
                break;
            } else if (declareTheWin() === "X") {
                console.log("X won");
                Gameboard.resetBoard();
                break;
            } else if (declareTheWin() === "tie") {
                console.log("Tie!");
                Gameboard.resetBoard();
                break;
            }
            
            let chosenPosition = parseInt(prompt(`Choose your position your marker is ${currentMarker}`));
            if (Number.isNaN(chosenPosition)) {
                console.log("Bad Position Argument");
                Gameboard.resetBoard();
                break;
            }

            if (makeTurn(chosenPosition, currentMarker) === "illegalMove") {
                continue;
            }

            if (currentMarker === "X") {
                currentMarker = "O";
            } else {
                currentMarker = "X";
            }
        }
    }

    return {playGame};
})(Gameboard.getGameArray());

function displayBoard(gameArray) {
    for (let i = 0; i < 9; i += 3) {
        console.log(`${gameArray[i]} | ${gameArray[i+1]} | ${gameArray[i+2]}\n`);
    }
}

function playerFactory(name) {
    let playerName = name;
    let playerMarker = "";

    return {playerName, playerMarker};
}

const displayController = (function() {
    function updateDisplay(gameArray) {
        for(let i = 0; i < 9; i++) {
            if (gameArray[i] === "O") {
                const box = document.querySelector(`[data-index="${i}"]`);
                const circle = document.querySelector(".O-Marker").content.cloneNode(true);
                box.appendChild(circle);
            } else if (gameArray[i] === "X") {
                const box = document.querySelector(`[data-index="${i}"]`);
                const cross = document.querySelector(".X-Marker").content.cloneNode(true);
                box.appendChild(cross);
            }
        }
    }

    return {updateDisplay};
})();