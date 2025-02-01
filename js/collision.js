import { enemies, updateEnemiesContainerSize } from './enemies.js';
import { displayEndMessage, updateLivesDisplay, updateScoreDisplay } from './ui.js';
import { stopGame } from './game.js';
import { GAME_CONFIG } from './game-constants.js';
import { KamikazeEnemy } from './ennemyClass.js';

export let activeBonuses = [];

export function checkCollision(projectile) {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    enemies.forEach(enemy => {
        const enemyRect = enemy.element.getBoundingClientRect(); // Utiliser enemy.element au lieu de enemy
        const projectileRect = projectile.getBoundingClientRect();

        if (projectileRect.left < enemyRect.right &&
            projectileRect.right > enemyRect.left &&
            projectileRect.top < enemyRect.bottom &&
            projectileRect.bottom > enemyRect.top) {

            enemy.takeDamage(); // Utiliser la méthode destroy() de la classe Enemy
            projectile.remove();
            updateEnemiesContainerSize();

            let points = GAME_CONFIG.SCORES.LOW_ROW;
            if (enemyRect.top < 200) points = GAME_CONFIG.SCORES.HIGH_ROW;
            else if (enemyRect.top < 400) points = GAME_CONFIG.SCORES.MID_ROW;

            window.gameState.score += points;
            updateScoreDisplay();
        }
    });
    activeBonuses.forEach((bonus, index) => {
        if (bonus.checkCollisionWithProjectile(projectile, window.player)) {
            activeBonuses.splice(index, 1);
            projectile.remove();
        }
    });
}

export function checkGameOver() {
    const playerRect = window.player.element.getBoundingClientRect();
    const playerTop = playerRect.top;

    enemies.forEach(enemy => {
        const enemyRect = enemy.element.getBoundingClientRect(); // Utiliser enemy.element ici aussi
        const enemyTop = enemyRect.top;

        // Vérifie si c'est un kamikaze
        if (enemy instanceof KamikazeEnemy) {
            // Si le kamikaze touche le joueur, game over
            const distance = Math.sqrt(Math.pow(enemy.x - window.player.x, 2) + Math.pow(enemy.y - window.player.y, 2));
            if (distance < GAME_CONFIG.PLAYER.RADIUS) {
                window.gameState.endGame = true;
                stopGame();
                displayEndMessage("Game Over!");
            }
        } else if (enemyTop >= playerTop - 50) {
            // Game over si n'importe quel autre ennemi touche le joueur
            window.gameState.endGame = true;
            stopGame();
            displayEndMessage("Game Over!");
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