"use strict";
const Gameboard = (function () {
    let gameArray = ['' ,'' ,'' ,'' ,'' ,'' ,'' ,'' ,'' ];

    function addMarker(position, marker) {
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

    //set and get players
    let playerList = [];
    function setPlayers(player1, player2) {
        playerList.push(player1);
        playerList.push(player2);
    }
    function getPlayerList() {
        return playerList;
    }

    // For use in display controller: 
    // startScreen, inGame, endScreen
    let gameScreenStatus = "startScreen";
    function setGameScreenStatus(status) {
        if (status === "startScreen") {
            gameStatus = "startScreen";
        } else if (status === "inGame") {
            gameStatus = "inGame";
        } else if (status === "endScreen") {
            gameStatus = "endScreen";
        } else {
            throw Error("gameStatus is being set incorrectly");
        }
    }
    function getGameScreenStatus() {
        return gameScreenStatus;
    }

    //For DOM to check for illegal Moves
    let illegalMoveStatus = false;
    function toggleIllegalMoveStatus() {
        illegalMoveStatus  = !illegalMoveStatus;
    }
    function getIllegalMoveStatus() {
        return illegalMoveStatus;
    }


    //Used for win Screens
    // O if O won, X if X won, draw when drawed and winNotDeclared if no one has won yet.
    let winStatus = "winNotDeclared";
    function setWinStatus(status) {
        if (status === "O") {
            winStatus = "O"
        } else if (status === "X") {
            winStatus = "X";
        } else if (status === "draw") {
            winStatus = "draw";
        } else if (status === "winNotDeclared") {
            winStatus = "winNotDeclared";
        } else {
            throw Error("Incorrect argument in setWinStatus");
        }
    }
    function getWinStatus() {
        return winStatus;
    }

    let currentPlayer;
    function setCurrentPlayer(player) {
        currentPlayer = player;
    }  
    function getCurrentPlayer() {
        return getCurrentPlayer;
    }

    return {
            addMarker,
            getGameArray,
            resetBoard,
            setPlayers,
            getPlayerList,
            setGameScreenStatus,
            getGameScreenStatus,
            setWinStatus,
            getWinStatus,
            setCurrentPlayer,
            getCurrentPlayer
        };
})();

const gameLogic = (function () {
    function declareTheWin() {
        // Returns "X" if X wins and "O" if O wins, returns '' if no winner found.
        let gameArray = Gameboard.getGameArray();
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
                return 'draw';
            } else {
                return 'continueGame';
            }
        }
        return winner;
    }

    function playTurn() {

    }
})();

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
                box.innerHTML = "";
                const circle = document.querySelector(".O-Marker").content.cloneNode(true);
                box.appendChild(circle);
            } else if (gameArray[i] === "X") {
                const box = document.querySelector(`[data-index="${i}"]`);
                box.innerHTML = "";
                const cross = document.querySelector(".X-Marker").content.cloneNode(true);
                box.appendChild(cross);
            }
        }
    }

    let allowButtonsToBeClicked = false;
    let userHasClicked = false;
    let chosenPosition;
    function addButtonEventListeners() {
        const boxList = document.querySelectorAll(".boardSquare");
        boxList.forEach((box) => {
            box.addEventListener("click", () => {
                if (allowButtonsToBeClicked) {
                    chosenPostion = parseInt(box.dataset.index);
                    allowButtonsToBeClicked = false;
                    userHasClicked = true;
                }   
            });
        });
    }

    addButtonEventListeners();

    function getUserChosenPosition() {
        allowButtonsToBeClicked = true;

    }


    return {updateDisplay};
})();