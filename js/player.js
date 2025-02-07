import { Projectile } from "./projectilesClass.js";
import { updateLivesDisplay } from "./ui.js";

export class Player {
  constructor(x, y, speed, fireRate) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.damage = 1;
    this.fireRate = fireRate;
    this.lives = 3;
    this.hasSpreadShot = false; // Ajout pour gérer le bonus
    this.element = this.createPlayerElement();
    this.direction = 0;  // -1 pour gauche, 1 pour droite
    this.isInvulnerable = false
  }

  createPlayerElement() {
    const playerElement = document.createElement('div');
    playerElement.id = 'player';
    playerElement.classList.add('player');
    document.getElementById('gameContainer').appendChild(playerElement);
    return playerElement;
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
  }

  move() {
    if (window.gameState.currentState !== "PLAYING") return;

    if (this.direction !== 0) {
      this.x += this.direction * this.speed;
      if (this.x < 0) this.x = 0;
      if (this.x > gameContainer.offsetWidth - this.element.offsetWidth) {
        this.x = gameContainer.offsetWidth - this.element.offsetWidth;
      }
      this.updatePosition();
    }
  }

  shoot() {
    if (window.gameState.currentState !== "PLAYING") return;

    const x = this.x;
    const y = this.y - 20;

    let projectilesToCreate = [];

    if (this.hasSpreadShot) {
      projectilesToCreate.push(new Projectile(x - 15, y, this.speed, this.damage));
      projectilesToCreate.push(new Projectile(x + 5, y, this.speed, this.damage));
    } else {
      projectilesToCreate.push(new Projectile(x, y, this.speed, this.damage));
    }

    projectilesToCreate.forEach(proj => window.gameState.projectiles.player.push(proj));

  }

  takeDamage(amount = 1) {
    if (this.isInvulnerable) return; // Empêche les dégâts si invincible

    this.lives -= amount;
    updateLivesDisplay();

    // Effet visuel (le joueur clignote)
    this.element.classList.add("damage-effect");
    setTimeout(() => {
      this.element.classList.remove("damage-effect");
    }, 300);

    // Vérification de la défaite
    if (this.lives <= 0) {
      this.lives = 0;
      window.gameState.currentState = 'GAME_OVER';
    }
  }

  increaseDamage() {
    if (this.damage >= 3) return;
    this.damage += 1;
  }

  enableSpreadShot() {
    this.hasSpreadShot = true;
  }

  powerUp() {
    if (this.lives >= 5) return
    this.lives++;
    updateLivesDisplay();
  }
}