import { Bonus } from "./bonus.js";
import { activeBonuses } from "./collision.js";
import { enemies } from "./enemies.js";
import { updateLivesDisplay } from "./ui.js";

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
        this.x += dx;
        this.y += dy;
        this.updatePosition();
    }

    // Une idée pour un potentiel boss
    // split() {
    //     if (this.health <= 0) {
    //         // Créer deux nouveaux ennemis avec des positions et caractéristiques modifiées
    //         const newEnemy1 = new Enemy(this.x - 10, this.y, this.health / 2);
    //         const newEnemy2 = new Enemy(this.x + 10, this.y, this.health / 2);

    //         // Ajouter les nouveaux ennemis à la liste
    //         enemies.push(newEnemy1, newEnemy2);
    //     }
    // }

    takeDamage() {
        this.health -= window.player.damage;
        this.element.dataset.health = this.health;

        if (this.health <= 0) {
            // this.split(); // Diviser l'ennemi avant de le détruire
            this.destroy();
            return true;
        }
        return false;
    }

    destroy() {
        this.element.enemyInstance = null;
        this.createExplosion();
        this.element.remove();

        const index = enemies.indexOf(this);
        if (index > -1) {
            enemies.splice(index, 1);
        }

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
        const types = ["damage"];
        const randomType = types[Math.floor(Math.random() * types.length)];

        const bonus = new Bonus(this.x, this.y, randomType);
        activeBonuses.push(bonus);
    }
}

export class KamikazeEnemy extends Enemy {
    constructor(x, y, health, isSpecial = false) {
        super(x, y, health, isSpecial);  // Appelle le constructeur de la classe Enemy
        this.speed = 5;  // Vitesse à ajuster
    }

    // Met à jour la position de l'ennemi pour le faire foncer vers le joueur
    moveTowardsPlayer(playerX, playerY) {
        const angle = Math.atan2(playerY - this.y, playerX - this.x);
        const dx = Math.cos(angle) * this.speed;
        const dy = Math.sin(angle) * this.speed;
        this.move(dx, dy);
    }

    // Explosion lors du contact avec le joueur
    checkCollisionWithPlayer(player) {
        const kamikazeX = Math.round(this.x);
        const kamikazeY = Math.round(this.y);

        // Calculer la distance entre le kamikaze et le centre du joueur
        const playerRadius = player.element.offsetWidth / 2;  // Rayon du joueur (60px / 2 = 30px)
        const distance = Math.sqrt(Math.pow(kamikazeX - player.x, 2) + Math.pow(kamikazeY - player.y, 2));

        // Si la distance entre le kamikaze et le joueur est inférieure ou égale au rayon du joueur, on considère qu'il y a une collision
        if (distance <= playerRadius) {
            this.explode();
        }
    }

    // Explose l'ennemi et inflige des dégâts au joueur
    explode() {
        window.gameState.lives--  // Enlève 1 PV au joueur
        updateLivesDisplay();
        this.destroy();  // Détruit l'ennemi kamikaze
    }

    // Ajoute une méthode de mise à jour spécifique pour l'ennemi kamikaze
    update(player) {
        this.moveTowardsPlayer(player.x, player.y);
        this.checkCollisionWithPlayer(player);
    }
}

