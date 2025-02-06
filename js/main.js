import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

class Game {
  constructor() {
    this.state = {
      container: document.getElementById("game-container"),
      player: null,
      enemies: [],
      direction: 1,

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
    this.generateEnemies();
    this.startEnemiesShooting();
    window.gameState = this.state;
  }

  initializePlayer() {
    const startX = this.state.container.offsetWidth / 2;
    const startY = this.state.container.offsetHeight - 50;

    this.state.player = new Player(this.state.container, startX, startY);
    console.log(this.state.player);
  }

  update() {
    this.moveProjectiles();
    this.moveEnemies();

    requestAnimationFrame(() => this.update());
  }
  moveEnemies() {
    this.state.enemies.forEach((enemy) => {
      enemy.x += this.state.direction * 0.5;
      if (enemy.x < 0 || enemy.x + 60 >= this.state.container.offsetWidth) {
        this.state.direction *= -1;

        this.state.enemies.forEach((e) => (e.y += 20));
      }
      enemy.updatePosition(enemy);
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

  shootEnemies() {
    console.log(this.state.enemies);
    if (this.state.enemies.length === 0) return;
    this.state.enemies[0].shoot();
  }

  generateEnemies() {
    const rows = 3;
    const cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * 50;
        const y = 50 + row * 50;

        const enemy = new Enemy(x, y);
        this.state.enemies.push(enemy);
      }
    }
  }

  startGame() {
    console.log("Le jeu commence !");
  }

  startEnemiesShooting() {
    const shootRandomEnemy = () => {
      if (this.state.enemies.length === 0) return;
      const randomEnemy =
        this.state.enemies[
          Math.floor(Math.random() * this.state.enemies.length)
        ];
      randomEnemy.shoot();
    };

    this.enemyShootingInterval = setInterval(shootRandomEnemy, 500);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  game.init();
});
