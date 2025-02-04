import { GameStateManager } from './gameStateManager.js';

const gameState = new GameStateManager();

function entryGame() {
    gameState.init()
}
// Initialisation du jeu
document.addEventListener('DOMContentLoaded', entryGame);