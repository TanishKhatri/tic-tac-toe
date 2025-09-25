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
    function setPlayers(playerX, playerO) {
        playerList.push(playerX);
        playerList.push(playerO);
    }
    function getPlayerList() {
        return playerList;
    }
    function resetPlayers() {
        playerList.pop();
        playerList.pop();
    }

    // For use in display controller: 
    // startScreen, inGame, endScreen
    let gameScreenStatus = "startScreen";
    function setGameScreenStatus(status) {
        if (status === "startScreen") {
            gameScreenStatus = "startScreen";
        } else if (status === "inGame") {
            gameScreenStatus = "inGame";
        } else if (status === "endScreen") {
            gameScreenStatus = "endScreen";
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
        return currentPlayer;
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
            getCurrentPlayer,
            toggleIllegalMoveStatus,
            getIllegalMoveStatus,
            resetPlayers
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

    function playerFactory(name) {
        let playerName = name;
        let playerMarker = "";

        return {playerName, playerMarker};
    }

    function startGame(playerX, playerO) {
        Gameboard.resetBoard();
        let p1 = playerFactory(playerX);
        let p2 = playerFactory(playerO);
        p1.playerMarker = "X";
        p2.playerMarker = "O";
        Gameboard.setPlayers(p1, p2);
        
        let playerList = Gameboard.getPlayerList();
        let currentPlayer = playerList[Math.floor(Math.random() * 2)];
        Gameboard.setCurrentPlayer(currentPlayer);
        Gameboard.setGameScreenStatus("inGame");
        displayController.updateDisplay();
    }

    function chooseNextPlayer() {
        let currentPlayer = Gameboard.getCurrentPlayer();
        let nextPlayer;
        for (let i = 0; i < 2; i++) {
            let playerList = Gameboard.getPlayerList();
            if (currentPlayer !== playerList[i]) {
                nextPlayer = playerList[i];
            }
        }
        return nextPlayer;
    }

    function playTurn(position) {
        if (Gameboard.addMarker(position, Gameboard.getCurrentPlayer().playerMarker) === 1) {
            Gameboard.toggleIllegalMoveStatus();
            displayController.updateDisplay();
            return;
        } else {
            if(Gameboard.getIllegalMoveStatus()) {
                Gameboard.toggleIllegalMoveStatus();
            }
        }

        let winDeclaration = declareTheWin();
        if (winDeclaration === "O") {
            Gameboard.setWinStatus("O");
            Gameboard.setGameScreenStatus("endScreen");
            displayController.updateDisplay();
            return;
        } else if (winDeclaration === "X") {
            Gameboard.setWinStatus("X");
            Gameboard.setGameScreenStatus("endScreen");
            displayController.updateDisplay();
            return;
        } else if (winDeclaration === "draw") {
            Gameboard.setWinStatus("draw");
            Gameboard.setGameScreenStatus("endScreen");
            displayController.updateDisplay();
            return;
        }

        Gameboard.setCurrentPlayer(chooseNextPlayer());
        displayController.updateDisplay();
    }

    return {startGame, playTurn};
})();


const displayController = (function() {

    function updateBoard() {
        let gameArray =  Gameboard.getGameArray();
        let illegalMoveStatus = Gameboard.getIllegalMoveStatus();

        for (let i = 0; i < gameArray.length; i++) {
            if (gameArray[i] === "O") {
                let box = document.querySelector(`[data-index="${i}"]`);
                if (box.hasChildNodes()) {
                    continue;
                }
                let marker = document.querySelector(".O-Marker").content.cloneNode(true);
                box.appendChild(marker);
            } else if (gameArray[i] === "X") {
                let box = document.querySelector(`[data-index="${i}"]`);
                if (box.hasChildNodes()) {
                    continue;
                }
                let marker = document.querySelector(".X-Marker").content.cloneNode(true);
                box.appendChild(marker);
            }
        }

        if (illegalMoveStatus) {
            let gameBoardNode = document.querySelector(".gameBoard");
            gameBoardNode.classList.add("illegalMove");
        } else {
            let gameBoardNode = document.querySelector(".gameBoard");
            gameBoardNode.classList.remove("illegalMove");
        }

        let currentPlayer = Gameboard.getCurrentPlayer();
        let playerX = document.querySelector(".inGame .Xplayer");
        let playerO = document.querySelector(".inGame .Oplayer");
        if (currentPlayer.playerMarker === "X") {
            playerO.classList.remove("currentPlayer");
            playerX.classList.add("currentPlayer");
        } else if (currentPlayer.playerMarker === "O") {
            playerX.classList.remove("currentPlayer");
            playerO.classList.add("currentPlayer");
        }
    }

    function updateDisplay() {
        let gameScreen = Gameboard.getGameScreenStatus();
        if (gameScreen === "startScreen") {
            const startScreenTemp = document.querySelector(".startScreenTemp");
            const startScreen =  startScreenTemp.content.cloneNode(true);
            const inGameScreen = document.querySelector(".inGame");
            if (inGameScreen !== null) {
                inGameScreen.remove();
            }
            let startButton = startScreen.querySelector(".start");
            startButton.addEventListener("click", () => {
                let playerX = document.querySelector("#playerX");
                let playerO = document.querySelector("#playerO");
                gameLogic.startGame(playerX.value, playerO.value);
            });

            document.body.appendChild(startScreen);
        } else if (gameScreen === "inGame") {
            const startScreen = document.querySelector(".startScreen");
            if (startScreen !== null) {
                startScreen.remove();
            }

            if (!document.querySelector(".inGame")) {
                const inGameScreenTemp = document.querySelector(".inGameTemp");
                const inGame = inGameScreenTemp.content.cloneNode(true);
                let buttonList = inGame.querySelectorAll(".boardSquare");
                buttonList.forEach((button) => {
                    button.addEventListener("click", () => {
                        let index = button.dataset.index;
                        gameLogic.playTurn(index);
                    })
                });

                let playAgainButton = inGame.querySelector(".playAgain");
                playAgainButton.addEventListener("click", () => {
                    Gameboard.setGameScreenStatus("startScreen");
                    Gameboard.resetBoard();
                    Gameboard.setWinStatus("winNotDeclared");
                    Gameboard.resetPlayers();
                    if(Gameboard.getIllegalMoveStatus()) {
                        Gameboard.toggleIllegalMoveStatus();
                    }

                    let winDeclaration = document.querySelector(".winnerDeclaration");
                    let winDeclarationSpan = document.querySelector(".winnerDeclaration span");
                    let drawElement = document.querySelector(".draw");
                    if (!winDeclaration.classList.contains("hidden")) {
                        winDeclaration.classList.add("hidden");
                    }
                    if (!drawElement.classList.contains("hidden")) {
                        drawElement.
                        classList.add("hidden");
                    }
                    winDeclarationSpan.textContent = "";
                    updateDisplay();

                    let gameBoard = document.querySelector(".gameBoard");
                    gameBoard.classList.remove("unclickable");
                });

                let playerList = Gameboard.getPlayerList();
                let playerX = inGame.querySelector(".Xplayer");
                let playerO = inGame.querySelector(".Oplayer");
                playerX.textContent = playerList[0].playerName;
                playerO.textContent = playerList[1].playerName;
                let currentPlayer = Gameboard.getCurrentPlayer();
                if (currentPlayer.playerMarker === "X") {
                    playerO.classList.remove("currentPlayer");
                    playerX.classList.add("currentPlayer");
                } else if (currentPlayer.playerMarker === "O") {
                    playerX.classList.remove("currentPlayer");
                    playerO.classList.add("currentPlayer");
                }
                document.body.appendChild(inGame);
            } else {
                updateBoard();
            }
        } else if (gameScreen === "endScreen") {
            updateBoard();
            let winDeclaration = document.querySelector(".winnerDeclaration");
            let winDeclarationSpan = document.querySelector(".winnerDeclaration span");
            if (Gameboard.getWinStatus() === "O") {
                let playerList = Gameboard.getPlayerList();
                let playerO = playerList[1];
                winDeclarationSpan.textContent = playerO.playerName;
                winDeclarationSpan.classList.add("O-won");
                winDeclaration.classList.remove("hidden");
            } else if (Gameboard.getWinStatus() === "X") {
                let playerList = Gameboard.getPlayerList();
                let playerX = playerList[0];
                winDeclarationSpan.textContent = playerX.playerName;
                winDeclarationSpan.classList.add("X-won");
                winDeclaration.classList.remove("hidden");
            } else if (Gameboard.getWinStatus() === "draw") {
                let drawElement = document.querySelector(".draw");
                drawElement.classList.remove("hidden"); 
            }

            let gameBoard = document.querySelector(".gameBoard");
            gameBoard.classList.add("unclickable");
        }
    }

    return {updateDisplay};
})();

displayController.updateDisplay();