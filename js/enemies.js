import { Enemy, KamikazeEnemy } from './ennemyClass.js';
import { GAME_CONFIG } from './game-constants.js';

// On garde la variable enemies en export pour la compatibilité
export let enemies = [];
let enemiesDirection = 1;
let enemySpeed;
const gameContainer = document.getElementById('gameContainer');
const enemiesContainer = document.getElementById('enemiesContainer');

export function generateEnemies() {
    enemies = [];
    enemiesContainer.innerHTML = '';
    enemySpeed = GAME_CONFIG.ENEMIES.SPEED;

    const baseRows = GAME_CONFIG.ENEMIES.ROWS;
    const extraRows = Math.floor((window.gameState.wave - 1) / 5);
    const rows = baseRows + extraRows;
    const cols = GAME_CONFIG.ENEMIES.COLS;
    const totalHeight = rows * GAME_CONFIG.ENEMIES.HEIGHT;

    enemiesContainer.style.top = "0px";

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * GAME_CONFIG.ENEMIES.WIDTH;
            const y = GAME_CONFIG.ENEMIES.START_Y + row * GAME_CONFIG.ENEMIES.HEIGHT;

            const isSpecial = window.gameState.wave >= GAME_CONFIG.ENEMIES.SPECIAL_START_WAVE
                && Math.random() < 0.2;
            const health = isSpecial ? GAME_CONFIG.ENEMIES.SPECIAL_HEALTH
                : GAME_CONFIG.ENEMIES.HEALTH;

            if (Math.random() < 0.1) {  // Par exemple, 10% de chance pour chaque ennemi d'être un kamikaze
                const kamikazeEnemy = new KamikazeEnemy(x, y, 1, isSpecial);
                enemies.push(kamikazeEnemy);
            } else {
                const enemy = new Enemy(x, y, health, isSpecial);
                enemies.push(enemy);
            }
        }
    }

    enemiesContainer.style.width = `${cols * GAME_CONFIG.ENEMIES.WIDTH}px`;
    enemiesContainer.style.left = `${(gameContainer.offsetWidth - enemiesContainer.offsetWidth) / 2}px`;
    enemiesContainer.style.height = `${totalHeight}px`;
}
export function moveEnemies() {
    if (window.gameState.endGame || window.gameState.isPaused) return;

    const containerWidth = gameContainer.offsetWidth;
    let directionChanged = false;

    // Trouver les positions extrêmes avant le mouvement
    let leftmostX = Infinity;
    let rightmostX = -Infinity;
    enemies.forEach(enemy => {
        leftmostX = Math.min(leftmostX, enemy.x);
        rightmostX = Math.max(rightmostX, enemy.x + GAME_CONFIG.ENEMIES.WIDTH);
    });

    // Calculer la nouvelle position potentielle
    const newLeftmostX = leftmostX + (enemySpeed * enemiesDirection);
    const newRightmostX = rightmostX + (enemySpeed * enemiesDirection);

    // Vérifier si le groupe d'ennemis touche un bord
    if (newRightmostX >= containerWidth || newLeftmostX <= 0) {
        directionChanged = true;
    }

    // Obtenir les coordonnées du joueur pour diriger les kamikazes
    const playerX = window.player.x;
    const playerY = window.player.y;

    // Déplacer les ennemis
    enemies.forEach(enemy => {
        if (enemy instanceof KamikazeEnemy) {
            // Si c'est un kamikaze, le déplacer vers le joueur
            enemy.moveTowardsPlayer(playerX, playerY);
            enemy.checkCollisionWithPlayer(window.player);
        } else {
            // Sinon, bouger normalement
            if (directionChanged) {
                enemy.move(0, GAME_CONFIG.ENEMIES.STEP_DOWN);
            } else {
                enemy.move(enemySpeed * enemiesDirection, 0);
            }
        }
    });

    if (directionChanged) {
        enemiesDirection *= -1;  // Inverser la direction
        enemySpeed += 0.1;      // Augmenter la vitesse
    }

    requestAnimationFrame(moveEnemies);
}
export function updateEnemiesContainerSize() {
    if (enemies.length === 0) return;

    let leftmostX = Infinity;
    let rightmostX = -Infinity;
    let topmostY = Infinity;
    let bottommostY = -Infinity;

    // On trouve juste les bornes sans modifier les positions
    enemies.forEach(enemy => {
        leftmostX = Math.min(leftmostX, enemy.x);
        rightmostX = Math.max(rightmostX, enemy.x + GAME_CONFIG.ENEMIES.WIDTH);
        topmostY = Math.min(topmostY, enemy.y);
        bottommostY = Math.max(bottommostY, enemy.y + GAME_CONFIG.ENEMIES.HEIGHT);
    });

    const newWidth = rightmostX - leftmostX;
    const newHeight = bottommostY - topmostY;

    // On met à jour uniquement la taille du conteneur sans toucher aux positions des ennemis
    enemiesContainer.style.width = `${newWidth}px`;
    enemiesContainer.style.height = `${newHeight}px`;
}