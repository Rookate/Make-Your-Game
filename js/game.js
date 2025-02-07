import { GAME_CONFIG } from './game-constants.js';
import { initializePlayer, playerMovement, playerMovementId, setupPlayerControls } from './player.js';
import { generateEnemies, moveEnemies } from './enemies.js';
import { moveEnemyProjectile, moveProjectile } from './projectiles.js';
import { checkGameOver } from './collision.js';
import { waveManagement } from './wave.js';

let animationId;
let gameControls;

// État global du jeu
window.gameState = {
    endGame: false,
    score: 0,
    isPaused: false,
    lives: GAME_CONFIG.PLAYER.LIVES, // Utilisation de la config
    wave: 1,
    waveTransition: false,
};

export function stopGame() {
    cancelAnimationFrame(animationId);
    cancelAnimationFrame(playerMovementId);
    document.removeEventListener('keydown', gameControls.keyDownHandler);
    document.removeEventListener('keyup', gameControls.keyUpHandler);
}

export function startGame() {
    generateEnemies();
    initializePlayer();
    gameControls = setupPlayerControls();
    moveEnemies();
    playerMovement();
    gameLoop();
}

function gameLoop() {
    if (window.gameState.endGame || window.gameState.isPaused) {
        return;
    }

    // Vérifie si tous les ennemis sont éliminés et gère la transition de vague
    if (!window.gameState.waveTransition && document.querySelectorAll('.enemy').length === 0) {
        waveManagement();
    }

    checkGameOver();
    animationId = requestAnimationFrame(gameLoop);
}

export function togglePause() {
    window.gameState.isPaused = !window.gameState.isPaused;

    if (!window.gameState.isPaused) {
        playerMovement();
        moveEnemies();
        window.projectiles.player.forEach(moveProjectile);
        window.projectiles.enemies.forEach(moveEnemyProjectile);
    }
}

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', startGame);

// Ajouter un contrôle pour la pause
document.addEventListener('keydown', (e) => {
    if (e.key === 'p') {
        togglePause();
    }
});