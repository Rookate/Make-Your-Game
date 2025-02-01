import { generateEnemies } from "./enemies.js";
import { GAME_CONFIG } from "./game-constants.js";
import { enemyShoot } from "./projectiles.js";
import { displayWaveMessage } from "./ui.js";

let currentProjectileRate = GAME_CONFIG.DIFFICULTY.projectileRate; // Suivi du taux de tir actuel

export function waveManagement() {
    if (window.gameState.endGame) return;
    const bullets = document.querySelectorAll('.bullet')
    bullets.forEach(bullet => bullet.remove())


    window.gameState.waveTransition = true;
    window.gameState.wave++;
    displayWaveMessage(`Wave ${window.gameState.wave}`);

    // Mise à jour de la difficulté toutes les 5 vagues
    if (window.gameState.wave % 5 === 0) {
        currentProjectileRate = Math.max(
            currentProjectileRate - GAME_CONFIG.DIFFICULTY.projectileDecrement,
            GAME_CONFIG.DIFFICULTY.minProjectileRate
        );
    }

    // Ajout des ennemis spéciaux à partir de la vague définie
    if (window.gameState.wave >= GAME_CONFIG.ENEMIES.SPECIAL_START_WAVE) {
        GAME_CONFIG.ENEMIES.HEALTH = GAME_CONFIG.ENEMIES.SPECIAL_HEALTH;
    }

    setTimeout(() => {
        generateEnemies();
        setTimeout(enemyShoot, currentProjectileRate + Math.random() * 500);
        window.gameState.waveTransition = false;
    }, 5000);
}