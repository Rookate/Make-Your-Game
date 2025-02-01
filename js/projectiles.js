import { GAME_CONFIG } from './game-constants.js';
import { checkCollision, checkPlayerCollision } from './collision.js';
import { createProjectileElement } from './ui.js';

window.projectiles = {
    player: [],
    enemies: [],
};

const gameContainer = document.getElementById('gameContainer');

// projectiles.js
export function createProjectile() {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    // Création du projectile
    const projectile = createProjectileElement(window.player.damage);

    // Utilisation de l'instance du joueur pour obtenir les coordonnées
    const startLeft = window.player.x;
    const startTop = window.player.y - 20;  // Juste au-dessus du joueur

    // Initialiser les positions
    projectile.style.left = `${startLeft}px`;
    projectile.style.top = `${startTop}px`;

    // Stocker la position initiale dans dataset
    projectile.dataset.top = startTop;

    gameContainer.appendChild(projectile);
    window.projectiles.player.push(projectile);

    moveProjectile(projectile);
}

export function moveProjectile(projectile) {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    function update() {
        if (window.gameState.endGame || window.gameState.isPaused) return;
        if (!document.contains(projectile)) return;

        // Utiliser la valeur stockée dans dataset ou parseInt du style
        let currentTop = parseFloat(projectile.dataset.top) || parseFloat(projectile.style.top);

        if (currentTop <= 0) {
            projectile.remove();
            const index = window.projectiles.player.indexOf(projectile);
            if (index > -1) {
                window.projectiles.player.splice(index, 1);
            }
            return;
        }

        // Calculer la nouvelle position
        let newTop = currentTop - window.player.speed;

        // Mettre à jour la position stockée et le style
        projectile.dataset.top = newTop;
        projectile.style.top = `${newTop}px`;

        checkCollision(projectile);

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

export function enemyShoot() {
    if (window.gameState.isPaused || window.gameState.endGame) return;

    const enemies = document.querySelectorAll('.enemy');
    if (enemies.length === 0) return;

    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    createEnemyProjectile(randomEnemy);

    // Réduction progressive de la cadence de tir des ennemis
    if (GAME_CONFIG.ENEMIES.FIRE_RATE > GAME_CONFIG.DIFFICULTY.minProjectileRate) {
        GAME_CONFIG.ENEMIES.FIRE_RATE -= GAME_CONFIG.DIFFICULTY.projectileDecrement;
    }

    // Relance l’attaque avec le nouveau délai ajusté
    setTimeout(enemyShoot, GAME_CONFIG.ENEMIES.FIRE_RATE + Math.random() * 500);
}

function createEnemyProjectile(enemy) {
    const projectile = document.createElement('div');
    projectile.classList.add('enemy-bullet');

    const enemyRect = enemy.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();

    projectile.style.left = `${enemyRect.left + enemyRect.width / 2 - gameRect.left}px`;
    projectile.style.top = `${enemyRect.top + enemyRect.height - gameRect.top}px`;

    gameContainer.appendChild(projectile);
    window.projectiles.enemies.push(projectile);
    moveEnemyProjectile(projectile);
}

export function moveEnemyProjectile(projectile) {
    function update() {
        if (!document.contains(projectile) || window.gameState.isPaused) return;

        const currentTop = parseInt(projectile.style.top, 10);
        if (currentTop >= gameContainer.offsetHeight) {
            projectile.remove();
            return;
        }

        checkPlayerCollision(projectile);
        projectile.style.top = `${currentTop + GAME_CONFIG.PROJECTILE.SPEED}px`;

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// Démarrage initial du tir ennemi
setTimeout(enemyShoot, GAME_CONFIG.ENEMIES.FIRE_RATE + Math.random() * 500);