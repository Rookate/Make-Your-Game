import { enemies, updateEnemiesContainerSize } from './enemies.js';
import { displayEndMessage, updateLivesDisplay, updateScoreDisplay } from './ui.js';
import { stopGame } from './game.js';
import { GAME_CONFIG } from './game-constants.js';

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
            updateEnemiesContainerSize();

            let points = GAME_CONFIG.SCORES.LOW_ROW;
            if (enemyRect.top < 200) points = GAME_CONFIG.SCORES.HIGH_ROW;
            else if (enemyRect.top < 400) points = GAME_CONFIG.SCORES.MID_ROW;

            window.gameState.score += points;
            updateScoreDisplay();
        }
    });
}

export function checkPlayerCollision(projectile) {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    const player = document.getElementById('player');
    const playerRect = player.getBoundingClientRect();
    const projectileRect = projectile.getBoundingClientRect();

    if (projectileRect.left < playerRect.right &&
        projectileRect.right > playerRect.left &&
        projectileRect.top < playerRect.bottom &&
        projectileRect.bottom > playerRect.top) {

        projectile.remove();
        window.gameState.lives--;

        updateLivesDisplay();

        if (window.gameState.lives <= 0) {
            window.gameState.endGame = true;
            stopGame();
            displayEndMessage("Game Over! You lost all your lives");
        }
    }
}


export function checkGameOver() {
    const playerRect = player.getBoundingClientRect();
    const playerTop = playerRect.top;

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