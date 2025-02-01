// player.js
import { createProjectile } from './projectiles.js';

export class Player {
    constructor(x, y, speed, fireRate) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = 1;
        this.fireRate = fireRate;
        this.lives = 3;
        this.element = this.createPlayerElement();
        this.direction = 0;  // -1 pour gauche, 1 pour droite
    }

    // Crée l'élément HTML du joueur
    createPlayerElement() {
        const playerElement = document.createElement('div');
        playerElement.id = 'player';
        playerElement.classList.add('player');
        document.getElementById('gameContainer').appendChild(playerElement);
        return playerElement;
    }

    // Met à jour la position du joueur
    updatePosition() {
        this.element.style.left = `${this.x}px`;
    }

    // Déplace le joueur
    move() {
        if (this.direction !== 0) {
            this.x += this.direction * this.speed;
            if (this.x < 0) this.x = 0;
            if (this.x > gameContainer.offsetWidth - this.element.offsetWidth) {
                this.x = gameContainer.offsetWidth - this.element.offsetWidth;
            }
            this.updatePosition();
        }
    }

    // Permet au joueur de tirer
    shoot() {
        createProjectile();
    }

    increaseDamage() {
        if (this.damage >= 3) return
        this.damage += 1;

        // setTimeout(() => {
        //     this.damage = Math.max(1, this.damage - 1); // Réduction après 10s
        // }, 10000);
    }
}