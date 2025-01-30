import { GAME_CONSTANTS } from './game-constants.js';

export let enemies = [];
let enemiesDirection = 1;
const enemiesContainer = document.getElementById('enemies');
const gameContainer = document.getElementById('gameContainer');

export function generateEnemies() {
    enemiesContainer.innerHTML = '';

    for (let i = 0; i < GAME_CONSTANTS.ENEMY_ROWS * GAME_CONSTANTS.ENEMY_COLS; i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');

        const x = (i % GAME_CONSTANTS.ENEMY_COLS) * GAME_CONSTANTS.ENEMY_WIDTH;
        const y = GAME_CONSTANTS.ENEMY_START_Y +
            Math.floor(i / GAME_CONSTANTS.ENEMY_COLS) * GAME_CONSTANTS.ENEMY_HEIGHT;

        enemy.style.left = `${x}px`;
        enemy.style.top = `${y}px`;

        enemiesContainer.appendChild(enemy);
    }

    enemies = document.querySelectorAll('.enemy');
    enemiesContainer.style.width = `${GAME_CONSTANTS.ENEMY_COLS * GAME_CONSTANTS.ENEMY_WIDTH}px`;
    enemiesContainer.style.left = `${(gameContainer.offsetWidth - enemiesContainer.offsetWidth) / 2}px`;
}


export function moveEnemies() {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    const containerWidth = gameContainer.offsetWidth;
    const currentLeft = parseInt(enemiesContainer.style.left, 10) || 0;
    const newLeft = currentLeft + GAME_CONSTANTS.ENEMIES_SPEED * enemiesDirection;

    enemiesContainer.style.left = `${newLeft}px`;

    const enemiesRect = enemiesContainer.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();
    const leftmost = enemiesRect.left - gameRect.left;
    const rightmost = enemiesRect.right - gameRect.left;

    if (rightmost >= containerWidth || leftmost <= 0) {
        enemiesDirection *= -1;
        const currentTop = parseInt(enemiesContainer.style.top || 0, 10);
        enemiesContainer.style.top = `${currentTop + GAME_CONSTANTS.STEP_DOWN}px`;
    }

    requestAnimationFrame(moveEnemies);
}
