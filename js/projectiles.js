import { GAME_CONSTANTS } from './game-constants.js';
import { checkCollision } from './collision.js';

window.projectiles = [];
const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');

export function createProjectile() {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    const projectile = document.createElement('div');
    projectile.classList.add('bullet');

    const playerRect = player.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();

    projectile.style.left = `${playerRect.left + playerRect.width / 2 - gameRect.left}px`;
    projectile.style.top = `${playerRect.top - gameRect.top}px`;

    gameContainer.appendChild(projectile);
    window.projectiles.push(projectile);

    moveProjectile(projectile);
}

export function moveProjectile(projectile) {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    function update() {
        if (window.gameState.endGame || window.gameState.isPaused) return;
        if (!document.contains(projectile)) return;

        const currentTop = parseInt(projectile.style.top, 10);
        if (currentTop <= 0) {
            projectile.remove();
            return;
        }

        checkCollision(projectile);
        projectile.style.top = `${currentTop - GAME_CONSTANTS.PROJECTILE_SPEED}px`;
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}