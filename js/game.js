import { GameStateManager } from './gameStateManager.js';

let gameState = new GameStateManager();

function entryGame() {
    gameState.init()
}

function newGame() {
    if (gameState) {
        gameState.cleanup();
    }
    gameState = new GameStateManager();
    gameState.init();
}
// Initialisation du jeu
document.addEventListener('DOMContentLoaded', entryGame);
document.getElementById('startButton').addEventListener('click', newGame)