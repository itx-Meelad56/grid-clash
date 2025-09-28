const cells = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');

let currentPlayer = 'X';
let gameActive = false;
let singlePlayerMode = false;

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

// ---- Sounds ----
const clickSound = new Audio('sounds/click.mp3.mp3');  // move
const winSound = new Audio('sounds/win.mp3.wav');      // win

clickSound.volume = 0.3;
winSound.volume = 0.5;
// -----------------

function startGame(mode) {
    singlePlayerMode = mode === 'single';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
        cell.addEventListener('click', handleCellClickWrapper);
    });
    currentPlayer = 'X';
    message.textContent = `Turn: ${currentPlayer}`;
    gameActive = true;
}

function handleCellClickWrapper(e) {
    handleCellClick(e.target);
}

function handleCellClick(cell) {
    if (!gameActive || cell.textContent) return;

    // Play click sound for every move
    clickSound.currentTime = 0;
    clickSound.play();

    cell.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        endGame(false);
        return;
    } else if (isDraw()) {
        endGame(true);  // draw without sound
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
        message.textContent = "It's a Draw";
        // no sound for draw
    } else {
        message.textContent = `${currentPlayer} Wins!`;
        winSound.play();

        WIN_COMBINATIONS.forEach(combination => {
            if (combination.every(index => cells[index].textContent === currentPlayer)) {
                combination.forEach(index => cells[index].classList.add('winner'));
            }
        });
    }
}

function aiMove() {
    let emptyCells = [...cells].filter(cell => !cell.textContent);
    if (emptyCells.length === 0) return;

    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    setTimeout(() => {
        handleCellClick(randomCell); // directly call to ensure click sound
    }, 500);
}

// Event listeners
restartButton.addEventListener('click', () => startGame(singlePlayerMode ? 'single' : 'two'));
singlePlayerBtn.addEventListener('click', () => startGame('single'));
twoPlayerBtn.addEventListener('click', () => startGame('two'));