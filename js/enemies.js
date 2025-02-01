import { GAME_CONFIG } from './game-constants.js';

export let enemies = [];
let enemiesDirection = 1;
let enemySpeed;
const enemiesContainer = document.getElementById('enemies');
const gameContainer = document.getElementById('gameContainer');

export function generateEnemies() {
    enemySpeed = GAME_CONFIG.ENEMIES.SPEED; // Prend la vitesse de base
    enemiesContainer.style.top = "0px";

    const totalHeight = GAME_CONFIG.ENEMIES.ROWS * GAME_CONFIG.ENEMIES.HEIGHT;
    enemiesContainer.innerHTML = '';

    // Augmente le nombre de lignes toutes les 5 vagues
    const baseRows = GAME_CONFIG.ENEMIES.ROWS;
    const extraRows = Math.floor((window.gameState.wave - 1) / 5);
    const rows = baseRows + extraRows;
    const cols = GAME_CONFIG.ENEMIES.COLS;

    for (let i = 0; i < rows * cols; i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');

        // Vérifie si on ajoute un ennemi spécial
        if (window.gameState.wave >= GAME_CONFIG.ENEMIES.SPECIAL_START_WAVE && Math.random() < 0.2) {
            enemy.classList.add('special-enemy');
            enemy.dataset.health = GAME_CONFIG.ENEMIES.SPECIAL_HEALTH;
        } else {
            enemy.dataset.health = GAME_CONFIG.ENEMIES.HEALTH;
        }

        const x = (i % cols) * GAME_CONFIG.ENEMIES.WIDTH;
        const y = GAME_CONFIG.ENEMIES.START_Y + Math.floor(i / cols) * GAME_CONFIG.ENEMIES.HEIGHT;

        enemy.style.left = `${x}px`;
        enemy.style.top = `${y}px`;

        enemiesContainer.appendChild(enemy);
    }

    enemies = document.querySelectorAll('.enemy');
    enemiesContainer.style.width = `${GAME_CONFIG.ENEMIES.COLS * GAME_CONFIG.ENEMIES.WIDTH}px`;
    enemiesContainer.style.left = `${(gameContainer.offsetWidth - enemiesContainer.offsetWidth) / 2}px`;
    enemiesContainer.style.height = `${totalHeight}px`;
}

export function moveEnemies() {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    const containerWidth = gameContainer.offsetWidth;
    const currentLeft = parseInt(enemiesContainer.style.left, 10) || 0;
    const newLeft = currentLeft + enemySpeed * enemiesDirection;

    enemiesContainer.style.left = `${newLeft}px`;

    const enemiesRect = enemiesContainer.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();
    const leftmost = enemiesRect.left - gameRect.left;
    const rightmost = enemiesRect.right - gameRect.left;

    if (rightmost >= containerWidth || leftmost <= 0) {
        enemiesDirection *= -1;
        const currentTop = parseInt(enemiesContainer.style.top || 0, 10);
        enemiesContainer.style.top = `${currentTop + GAME_CONFIG.ENEMIES.STEP_DOWN}px`;

        // Augmenter la vitesse des ennemis
        enemySpeed += 0.2;
    }

    requestAnimationFrame(moveEnemies);
}

export function updateEnemiesContainerSize() {
    const enemies = document.querySelectorAll('.enemy');

    if (enemies.length === 0) return;

    let leftmostX = Infinity;
    let rightmostX = -Infinity;

    enemies.forEach(enemy => {
        const enemyX = parseFloat(enemy.style.left);
        leftmostX = Math.min(leftmostX, enemyX);
        rightmostX = Math.max(rightmostX, enemyX + GAME_CONFIG.ENEMIES.WIDTH);
    });

    const newWidth = rightmostX - leftmostX;
    enemiesContainer.style.width = `${newWidth}px`;

    enemies.forEach(enemy => {
        const currentX = parseFloat(enemy.style.left);
        const newX = currentX - leftmostX;
        enemy.style.left = `${newX}px`;
    });

    const currentLeft = parseFloat(enemiesContainer.style.left) || 0;
    const adjustment = leftmostX;
    enemiesContainer.style.left = `${currentLeft + adjustment}px`;
}