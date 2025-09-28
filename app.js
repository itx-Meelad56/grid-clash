const cells = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');

let currentPlayer = 'X';
let gameActive = false;
let singlePlayerMode = false;

// Winning combinations
const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// Start game
function startGame(mode) {
    singlePlayerMode = mode === 'single';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    currentPlayer = 'X';
    message.textContent = `Turn: ${currentPlayer}`;
    gameActive = true;
}

function handleCellClick(e) {
    const cell = e.target;
    if (!gameActive || cell.textContent) return;

    cell.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        endGame(false);
        return;
    } else if (isDraw()) {
        endGame(true);
        return;
    }

    switchPlayer();

    if (singlePlayerMode && currentPlayer === 'O') {
        aiMove();
    }
}


function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Turn: ${currentPlayer}`;
}


function checkWin(player) {
    return WIN_COMBINATIONS.some(combination => {
        return combination.every(index => cells[index].textContent === player);
    });
}

function isDraw() {
    return [...cells].every(cell => cell.textContent);
}


function endGame(draw) {
    gameActive = false;
    if (draw) {
        message.textContent = "It's a Draw!";
    } else {
        message.textContent = `${currentPlayer} Wins!`;
        WIN_COMBINATIONS.forEach(combination => {
            if (combination.every(index => cells[index].textContent === currentPlayer)) {
                combination.forEach(index => cells[index].classList.add('winner'));
            }
        });
    }
}


function aiMove() {
    const emptyCells = [...cells].filter(cell => !cell.textContent);
    if (emptyCells.length === 0) return;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    setTimeout(() => {
        randomCell.click();
    }, 500);
}


restartButton.addEventListener('click', () => startGame(singlePlayerMode ? 'single' : 'two'));
singlePlayerBtn.addEventListener('click', () => startGame('single'));
twoPlayerBtn.addEventListener('click', () => startGame('two'));
