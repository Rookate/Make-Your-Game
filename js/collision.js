import { enemies } from './enemies.js';
import { displayEndMessage } from './ui.js';
import { stopGame } from './game.js';

export function checkCollision(projectile) {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    Array.from(enemies).forEach(enemy => {
        const enemyRect = enemy.getBoundingClientRect();
        const projectileRect = projectile.getBoundingClientRect();

        if (projectileRect.left < enemyRect.right &&
            projectileRect.right > enemyRect.left &&
            projectileRect.top < enemyRect.bottom &&
            projectileRect.bottom > enemyRect.top) {
            enemy.remove();
            projectile.remove();
        }
    });

    if (document.querySelectorAll('.enemy').length === 0) {
        window.gameState.endGame = true;
        stopGame();
        displayEndMessage("Victory! All enemies are dead!");
    }
}

const playerRect = player.getBoundingClientRect();
const playerTop = playerRect.top;

export function checkGameOver() {
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        const enemyRect = enemy.getBoundingClientRect();
        const enemyTop = enemyRect.top;

        if (enemyTop >= playerTop - 50) {
            window.gameState.endGame = true;
            stopGame()
            displayEndMessage("Game Over!");
        }
    });
}