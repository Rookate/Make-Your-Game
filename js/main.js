import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Collision } from "./collision.js";
import { Block } from "./block.js";

class Game {
  constructor() {
    this.state = {
      container: document.getElementById("game-container"),
      containerBlock: document.getElementById("block-container"),

      player: null,
      enemies: [],
      direction: 1,
      pause: false,
      blocks: [],
      projectiles: {
        enemies: [],
        player: []
      }
    };
    // console.log(this.state.containerBlock);
    this.collisionManager = new Collision(this.state);

    window.game = this.state;
  }

  init() {
    this.update();
    this.initializePlayer();
    this.generateEnemies();
    this.startEnemiesShooting();
    this.createBlocks();
    window.gameState = this.state;

    document.addEventListener("keydown", (e) => {
      if (e.key === "p") {
        this.gamePause();
      }
    });

    document.getElementById("continue").addEventListener("click", () => {
      this.gamePause();
    });
  }
  createBlocks() {
    const blockWidth = 50; // Largeur de chaque bloc
    const numBlocks = 4; // Nombre de blocs
    const spacing = 20; // Espacement entre les blocs

    const totalWidth = numBlocks * blockWidth + (numBlocks - 1) * spacing; // Largeur totale des blocs avec espacement
    const startX = (this.state.container.offsetWidth - totalWidth) / 2; // Point de départ pour centrer

    const yPosition = this.state.container.offsetHeight; // Place les blocs à 100px du bas

    for (let i = 0; i < numBlocks; i++) {
      const x = startX + i * (blockWidth + spacing); // Position horizontale de chaque bloc
      const block = new Block(x, yPosition, this.state.containerBlock); // Ajoute chaque bloc au conteneur
      this.state.blocks.push(block);
    }
  }

  initializePlayer() {
    const startX = this.state.container.offsetWidth / 2;
    const startY = this.state.container.offsetHeight - 100;

    this.state.player = new Player(this.state.container, startX, startY);

    // ✅ Initialise la vie du joueur à 3 points
    this.state.player.health = 6;

    // ✅ Met à jour l'affichage dès le début
    this.collisionManager.updateHealthDisplay();

    console.log("🛡️ Vie du joueur initialisée :", this.state.player.health);
  }

  update() {
    this.moveProjectiles();
    this.moveEnemies();
    this.collisionManager.checkCollisions();

    this.gameLoop = requestAnimationFrame(() => this.update());
  }

  moveEnemies() {
    this.state.enemies.forEach((enemy) => {
      enemy.x += this.state.direction * 1;
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

  startEnemiesShooting() {
    const shootRandomEnemy = () => {
      if (this.state.enemies.length === 0) return;
      const randomEnemy =
        this.state.enemies[
          Math.floor(Math.random() * this.state.enemies.length)
        ];
      randomEnemy.shoot();
    };

    this.enemyShootingInterval = setInterval(shootRandomEnemy, 3000);
  }

  gamePause() {
    const menupause = document.getElementById("pause");

    if (!this.state.pause) {
      this.state.pause = true;
      menupause.style.display = "flex";
      console.log(this.state.pause);
      cancelAnimationFrame(this.gameLoop);
      clearInterval(this.enemyShootingInterval);
    } else {
      menupause.style.display = "none";
      this.state.pause = false;
      this.startEnemiesShooting();
      this.update();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  game.init();
});
