import { GAME_CONFIG } from './game-constants.js';
import { initializePlayer, playerMovement, playerMovementId, setupPlayerControls } from './playerControls.js';
import { generateEnemies, moveEnemies } from './enemies.js';
import { enemyShoot, moveEnemyProjectile, moveProjectile } from './projectiles.js';
import { activeBonuses, checkGameOver } from './collision.js';
import { waveManagement } from './wave.js';

let animationId;
let gameControls;

const backgroundMusic = new Audio('../css/audio/bitRush.mp3');
backgroundMusic.loop = true;  // Répéter la musique en boucle
backgroundMusic.volume = 0.2; // Volume à 20% (ajustable)

function startBackgroundMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    }
}

function stopBackgroundMusic() {
    if (!backgroundMusic.paused) {
        backgroundMusic.pause();
    }
}

let musicStarted = false;

document.addEventListener('click', startMusicAfterInteraction);
document.addEventListener('keydown', startMusicAfterInteraction);

function startMusicAfterInteraction() {
    if (!musicStarted) {
        backgroundMusic.play();
        musicStarted = true;
    }
}

// État global du jeu
window.gameState = {
    endGame: false,
    score: 0,
    isPaused: false,
    lives: GAME_CONFIG.PLAYER.LIVES,
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
    if (window.gameState.endGame) {
        stopBackgroundMusic();
        return;
    }

    // Vérifie si tous les ennemis sont éliminés et gère la transition de vague
    if (!window.gameState.waveTransition && document.querySelectorAll('.enemy').length === 0) {
        waveManagement();
    }

    if (!window.gameState.isPaused) {
        activeBonuses.forEach((bonus) => {
            bonus.updatePosition();
        })
    }
    checkGameOver();
    animationId = requestAnimationFrame(gameLoop);
}

let enemyShootTimeout = null;

export function togglePause() {
    window.gameState.isPaused = !window.gameState.isPaused;

    if (!window.gameState.isPaused) {
        // Reprendre les mouvements et les tirs des ennemis
        playerMovement();
        moveEnemies();
        window.projectiles.player.forEach(moveProjectile);
        window.projectiles.enemies.forEach(moveEnemyProjectile);

        startBackgroundMusic();

        startEnemyShooting();
    } else {
        stopBackgroundMusic();
        stopEnemyShooting();
    }
}

// Démarrer les tirs des ennemis
function startEnemyShooting() {
    if (enemyShootTimeout === null) {
        // Relancer les tirs des ennemis après un délai
        enemyShootTimeout = setTimeout(() => {
            enemyShoot();
            startEnemyShooting(); // Relance la fonction après chaque tir
        }, GAME_CONFIG.ENEMIES.FIRE_RATE + Math.random() * 500);
    }
}

// Arrêter les tirs des ennemis
function stopEnemyShooting() {
    if (enemyShootTimeout !== null) {
        clearTimeout(enemyShootTimeout);
        enemyShootTimeout = null;
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

export function setBackgroundMusicVolume(volume) {
    backgroundMusic.volume = volume; // 0.0 à 1.0
}