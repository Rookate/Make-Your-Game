import { KamikazeEnemy } from "./ennemyClass.js";

export class CollisionManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    checkCollisions() {
        if (this.gameState.endGame || this.gameState.isPaused) return;

        this.checkPlayerProjectiles();
        this.checkEnemyProjectiles();
        this.checkProjectileBonuses();
        this.checkKamikazeEnemies();
    }

    checkPlayerProjectiles() {
        this.gameState.projectiles.player.forEach((projectile, pIndex) => {
            this.gameState.enemies.forEach((enemy, eIndex) => {
                if (this.isColliding(projectile, enemy)) {
                    enemy.takeDamage();
                    projectile.remove();
                    if (enemy.health <= 0) {
                        this.gameState.enemies.splice(eIndex, 1);
                    }
                }
            });
        });
    }

    checkEnemyProjectiles() {
        this.gameState.projectiles.enemies.forEach((projectile, pIndex) => {
            if (this.isColliding(projectile, this.gameState.player)) {
                this.gameState.player.takeDamage();
                projectile.remove();
            }
        });
    }

    checkProjectileBonuses() {
        this.gameState.activeBonuses.forEach((bonus, bIndex) => {
            this.gameState.projectiles.player.forEach((projectile, pIndex) => {
                if (this.isColliding(bonus, projectile)) {
                    bonus.applyBonus(this.gameState.player);
                    bonus.destroy();
                    // Supprime le bonus et le projectile
                    this.gameState.activeBonuses.splice(bIndex, 1);
                    projectile.remove();
                }
            });
        });
    }

    checkKamikazeEnemies() {
        this.gameState.enemies.forEach((enemy, eIndex) => {
            if (enemy instanceof KamikazeEnemy && this.isColliding(enemy, this.gameState.player)) {
                this.gameState.player.lives--;
                enemy.destroy();
                this.gameState.enemies.splice(eIndex, 1);

                if (this.gameState.player.lives <= 0) {
                    this.gameState.endGame = true;
                }
            }
        });
    }

    isColliding(obj1, obj2) {
        const rect1 = obj1.element.getBoundingClientRect();
        const rect2 = obj2.element.getBoundingClientRect();
        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }
}