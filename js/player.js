import { Bullet } from "./bullet.js";
import { throttle } from "./utils.js";

export class Player {
  constructor(container, x, y) {
    this.container = container;
    this.element = document.getElementById("player");
    this.x = x;
    this.y = y; // Position de départ du joueur
    this.speed = 5;
    this.keys = { left: false, right: false }; // Stocke les touches pressées
    this.bullets = []; // Tableau des balles
    this.initControls();
    this.updateMovement(); // Démarre le mouvement fluide
  }

  moveLeft() {
    if (this.x > this.element.offsetWidth / 2) {
      // ✅ Empêche de dépasser la limite gauche
      this.x -= this.speed;
      this.updatePosition();
    }
  }

  moveRight() {
    if (this.x < this.container.offsetWidth - this.element.offsetWidth / 2) {
      // ✅ Empêche de dépasser la limite droite
      this.x += this.speed;
      this.updatePosition();
    }
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
  }

  // Mise à jour continue de la position du joueur
  updateMovement() {
    if (this.keys.left) this.moveLeft();
    if (this.keys.right) this.moveRight();
    requestAnimationFrame(() => this.updateMovement()); // Continuation du mouvement
  }

  // Fonction pour tirer
  shoot() {
    // Créer une balle à la position du joueur (juste au-dessus du joueur)
    const bullet = new Bullet(this.container, this.x, this.y); // Position ajustée pour être juste au-dessus du joueur
    window.gameState.projectiles.player.push(bullet);
  }

  // Initialiser les contrôles
  initControls() {
    const throttledShootProjectile = throttle(() => this.shoot(), 300);

    document.addEventListener("keydown", (event) => {
      if (window.game.pause) return;
      if (event.key === "ArrowLeft") this.keys.left = true;
      if (event.key === "ArrowRight") this.keys.right = true;
      if (event.key === " ") throttledShootProjectile(); // Appuyer sur espace pour tirer
    });

    document.addEventListener("keyup", (event) => {
      if (window.game.pause) return;
      if (event.key === "ArrowLeft") this.keys.left = false;
      if (event.key === "ArrowRight") this.keys.right = false;
    });
  }

  getPosition() {
    const rect = this.element.getBoundingClientRect();
    const gameRect = this.container.getBoundingClientRect();

    return {
      x: rect.left - gameRect.left,
      y: rect.top - gameRect.top,
    };
  }
}
