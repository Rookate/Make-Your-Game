import { GAME_CONFIG } from './game-constants.js';
import { throttle } from './utils.js';
import { createProjectile } from './projectiles.js';

export let playerMovementId;
export let playerDirection = 0;
let playerX;
const player = document.getElementById('player');
const gameContainer = document.getElementById('gameContainer');

export function initializePlayer() {
  playerX = gameContainer.offsetWidth / 2;
  player.style.left = `${playerX}px`;
}

export function playerMovement() {
  if (window.gameState.endGame || window.gameState.isPaused) return;

  if (playerDirection !== 0) {
    playerX += playerDirection * GAME_CONFIG.PLAYER.SPEED; // Utilisation de GAME_CONFIG
    if (playerX < 0) playerX = 0;
    if (playerX > gameContainer.offsetWidth - player.offsetWidth) {
      playerX = gameContainer.offsetWidth - player.offsetWidth;
    }
    player.style.left = `${playerX}px`;
  }

  playerMovementId = requestAnimationFrame(playerMovement);
}

function shootProjectile() {
  if (window.gameState.endGame) return;
  createProjectile();
}

// Correction : Utilisation de GAME_CONFIG pour le temps entre tirs
const throttledShootProjectile = throttle(shootProjectile, GAME_CONFIG.PLAYER.FIRE_RATE);

export function setupPlayerControls() {
  const keyDownHandler = (e) => {
    if (e.key === 'ArrowLeft') playerDirection = -1;
    else if (e.key === 'ArrowRight') playerDirection = 1;
    else if (e.key === ' ') throttledShootProjectile();
  };

  const keyUpHandler = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') playerDirection = 0;
  };

  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  return { keyDownHandler, keyUpHandler };
}