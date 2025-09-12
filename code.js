const Gameboard = (function () {
    let gameArray = [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ];

    function add(position, symbol) {
        if (gameArray[position] != ' ' ) {
            return 1;
        } else {
            gameArray[position] = symbol;
        }
    }

    function getGameArray() {
        return gameArray;
    }

    function resetBoard() {
        gameArray = [' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ,' ' ];
    }

    return {add, getGameArray, resetBoard};
})();

function displayBoard() {
    let gameArray = Gameboard.getGameArray();
    for (let i = 0; i < 9; i += 3) {
        console.log(gameArray[i] + " | " + gameArray[i+1] + " | " + gameArray[i+2] + "\n");
    }
}

