// playerControls.js
import { throttle } from './utils.js';
import { GAME_CONFIG } from './game-constants.js';
import { Player } from './player.js';

// Variables pour l'instance du joueur
export let playerMovementId;

// Initialisation du joueur
export function initializePlayer() {
    const startX = gameContainer.offsetWidth / 2;
    const startY = gameContainer.offsetHeight - 50;  // Position en bas au centre
    window.player = new Player(startX, startY, GAME_CONFIG.PLAYER.SPEED, GAME_CONFIG.PLAYER.FIRE_RATE);
    window.player.updatePosition();  // Mise à jour de la position après la création de l'élément
    playerMovementId = requestAnimationFrame(playerMovement);
}

// Déplacement du joueur
export function playerMovement() {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    window.player.move();  // Déplacement via la méthode `move` de la classe `Player`
    playerMovementId = requestAnimationFrame(playerMovement);
}

// Gestion du tir du joueur
function shootProjectile() {
    if (window.gameState.endGame) return;
    window.player.shoot();
}

// Utilisation de throttle pour gérer la fréquence des tirs
const throttledShootProjectile = throttle(shootProjectile, GAME_CONFIG.PLAYER.FIRE_RATE);

export function setupPlayerControls() {
    const keyDownHandler = (e) => {
        if (e.key === 'ArrowLeft') window.player.direction = -1;  // Déplacement à gauche
        else if (e.key === 'ArrowRight') window.player.direction = 1;  // Déplacement à droite
        else if (e.key === ' ') throttledShootProjectile();  // Tir
    };

    const keyUpHandler = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') window.player.direction = 0;  // Arrêter le déplacement
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    return { keyDownHandler, keyUpHandler };
}