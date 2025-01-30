import { initializePlayer, playerMovement, playerMovementId, setupPlayerControls } from './player.js';
import { generateEnemies, moveEnemies } from './enemies.js';
import { moveProjectile } from './projectiles.js';
import { checkGameOver } from './collision.js';

let animationId;
let gameControls;
const player = document.getElementById('player');
const gameContainer = document.getElementById('gameContainer');


// État global du jeu
window.gameState = {
    endGame: false,
    score: 0,
    isPaused: false
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

    const playerRect = player.getBoundingClientRect();
    const gameContainerRect = gameContainer.getBoundingClientRect();

    // Position du joueur par rapport au gameContainer
    const playerRelativePosition = {
        top: playerRect.top - gameContainerRect.top,
        left: playerRect.left - gameContainerRect.left,
    };

    console.log(playerRelativePosition);
}

function gameLoop() {
    if (window.gameState.endGame || window.gameState.isPaused) {
        return;
    }
    checkGameOver();
    animationId = requestAnimationFrame(gameLoop);
}

export function togglePause() {
    if (window.gameState.isPaused) {
        window.gameState.isPaused = false;
        playerMovement()
        moveEnemies()
        window.projectiles.forEach(projectile => {
            moveProjectile(projectile);
        });
    } else {
        window.gameState.isPaused = true;
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