import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

class Game {
  constructor() {
    this.state = {
      container: document.getElementById("game-container"),
      player: null,
      enemies: [],

      projectiles: {
        enemies: [],
        player: [],
      },
    };
    this.init();
    window.game = this.state;
  }

  init() {
    this.update();
    this.initializePlayer();
    window.gameState = this.state;
  }

  initializePlayer() {
    const startX = this.state.container.offsetWidth / 2;
    const startY = this.state.container.offsetHeight - 50;

    this.state.player = new Player(this.state.container, startX, startY);
  }

  update() {
    this.moveProjectiles();
    this.moveEnemies();

    requestAnimationFrame(() => this.update());
  }
  moveEnemies() {
    this.state.enemies.forEach((enemy) => {
      enemy.Move();
    });
  }

  moveProjectiles() {
    // Déplacer les tirs ennemis
    this.state.projectiles.enemies.forEach((projectile, index) => {
      const isActive = projectile.move();
      if (!isActive) {
        this.state.projectiles.enemies.splice(index, 1); // Retirer les projectiles hors écran
      }
    });

    // Déplacer les tirs du joueur (ajoute un tableau pour stocker les tirs du joueur)
    this.state.projectiles.player.forEach((projectile, index) => {
      const isActive = projectile.move();
      if (!isActive) {
        this.state.projectiles.player.splice(index, 1);
      }
    });
  }

  startGame() {
    console.log("Le jeu commence !");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  // const gameContainer = document.getElementById("game-container");
  for (let i = 1; i <= 10; i++) {
    const enemy = new Enemy();
    game.state.enemies.push(enemy); // Ajoute les ennemis à this.state.enemies
  }

  game.init();
});
