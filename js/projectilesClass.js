import { createProjectileElement } from "./ui.js";

export class Projectile {
    constructor(x, y, speed, damage) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage;
        this.element = this.createElement();
    }

    createElement() {
        const projectile = createProjectileElement(window.gameState.player.damage);
        projectile.style.left = `${this.x}px`;
        projectile.style.top = `${this.y}px`;
        document.getElementById("gameContainer").appendChild(projectile);
        return projectile;
    }

    update() {
        this.y -= this.speed;
        if (this.y <= 0) {
            this.remove();
        } else {
            this.element.style.top = `${this.y}px`;
        }
    }

    remove() {
        this.element.remove();
        const index = window.gameState.projectiles.player.indexOf(this);
        if (index > -1) {
            window.gameState.projectiles.player.splice(index, 1);
        }
    }
}

export class EnemyProjectile {
    constructor(x, y, speed, damage) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage;
        this.element = this.createElement();
    }

    createElement() {
        const projectile = document.createElement('div');
        projectile.classList.add('enemy-bullet');
        projectile.style.left = `${this.x}px`;
        projectile.style.top = `${this.y}px`;
        document.getElementById("gameContainer").appendChild(projectile);
        return projectile;
    }

    update() {
        this.y += this.speed;
        if (this.y >= document.getElementById('gameContainer').offsetHeight) {
            this.remove();
        } else {
            this.element.style.top = `${this.y}px`;
        }
    }

    remove() {
        this.element.remove();
        const index = window.gameState.projectiles.enemies.indexOf(this);
        if (index > -1) {
            window.gameState.projectiles.enemies.splice(index, 1);
        }
    }
}