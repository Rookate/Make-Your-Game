import { Bonus } from "./bonus.js";
import { GAME_CONFIG } from "./game-constants.js";
import { EnemyProjectile } from "./projectilesClass.js";
import { updateLivesDisplay, updateScoreDisplay } from "./ui.js";

export class Enemy {
    constructor(x, y, health, isSpecial = false) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.isSpecial = isSpecial;
        this.element = this.createEnemyElement();
        this.updatePosition();
    }

    createEnemyElement() {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        if (this.isSpecial) {
            enemy.classList.add('special-enemy');
        }
        enemy.dataset.health = this.health;

        // Ajout de référence à l'instance pour faciliter la gestion des collisions
        enemy.enemyInstance = this;

        document.getElementById('enemiesContainer').appendChild(enemy);
        return enemy;
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    move(dx, dy) {
        if (this.y >= document.getElementById('gameContainer').offsetHeight) window.gameState.currentState = 'GAME_OVER'
        this.x += dx;
        this.y += dy;
        this.updatePosition();
    }

    takeDamage() {
        this.health -= window.gameState.player.damage;
        this.element.dataset.health = this.health;

        if (this.health <= 0) {
            // this.split(); // Diviser l'ennemi avant de le détruire
            this.destroy();
            return true;
        }
        return false;
    }

    destroy() {
        this.addPoints();
        this.element.enemyInstance = null;
        this.createExplosion();
        this.element.remove();
        // Ne pas donner de bonus avant la vague 3
        if (window.gameState.wave < 3) {
            return;
        }

        // Calcul du taux de drop basé sur la vague actuelle
        const waveDropRate = Math.min(0.01 + window.gameState.wave * 0.005, 0.1); // Commence à 1%, maximum à 10%

        if (Math.random() < waveDropRate) {
            this.spawnBonus();
        }
    }

    addPoints() {
        const enemyRect = this.element.getBoundingClientRect();
        let points = GAME_CONFIG.SCORES.LOW_ROW;
        if (enemyRect.top < 200) points = GAME_CONFIG.SCORES.HIGH_ROW;
        else if (enemyRect.top < 400) points = GAME_CONFIG.SCORES.MID_ROW;

        window.gameState.score += points;
        updateScoreDisplay();
    }


    playExplosionSound() {
        const explosionSound = new Audio('../css/audio/explosion.wav');
        explosionSound.volume = 0.04;
        explosionSound.play();
    }


    createExplosion() {
        const explosion = document.createElement('div');
        explosion.classList.add('explosion');
        explosion.style.left = `${this.x}px`;
        explosion.style.top = `${this.y}px`;

        document.getElementById('gameContainer').appendChild(explosion);
        this.playExplosionSound();
        setTimeout(() => {
            explosion.remove();
        }, 500);
    }

    spawnBonus() {
        const types = ["damage", "spread", "lives"];
        const randomType = types[Math.floor(Math.random() * types.length)];

        const bonus = new Bonus(this.x, this.y, randomType);
        window.gameState.activeBonuses.push(bonus);
    }

    shoot() {
        if (window.gameState.currentState !== "PLAYING") return;

        const enemyRect = this.element.getBoundingClientRect();
        const gameRect = document.getElementById('gameContainer').getBoundingClientRect();

        const projectileX = enemyRect.left + enemyRect.width / 2 - gameRect.left;
        const projectileY = enemyRect.top + enemyRect.height - gameRect.top;

        const projectile = new EnemyProjectile(projectileX, projectileY, GAME_CONFIG.PROJECTILE.SPEED, GAME_CONFIG.ENEMIES.DAMAGE);
        window.gameState.projectiles.enemies.push(projectile);
    }
}

export class KamikazeEnemy extends Enemy {
    constructor(x, y, health, isSpecial = false) {
        super(x, y, health, isSpecial);
        this.speed = 5;
    }

    moveTowardsPlayer(playerX, playerY) {
        const angle = Math.atan2(playerY - this.y, playerX - this.x);
        const dx = Math.cos(angle) * this.speed;
        const dy = Math.sin(angle) * this.speed;
        this.move(dx, dy);
    }

    explode() {
        window.gameState.player.takeDamage(); // Enlève 1 PV au joueur
        updateLivesDisplay();
        this.destroy();  // Détruit l'ennemi kamikaze
    }

    update(player) {
        this.moveTowardsPlayer(player.x, player.y);
    }
}