import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Collision } from "./collision.js";
import { Block } from "./block.js";

class Game {
  constructor() {
    this.state = {
      container: document.getElementById("game-container"),
      player: null,
      enemies: [],
      direction: 1,
      pause: false,
      gameOver: false,
      winGame: false,
      blocks: [],
      projectiles: {
        enemies: [],
        player: [],
      },
    };
    this.collisionManager = new Collision(this.state);

    window.game = this.state;
  }

  init() {
    this.update();
    this.initializePlayerAndBlock();
    this.generateEnemies();
    this.startEnemiesShooting();
    this.createBlocks();
    this.setTimer()
    window.gameState = this.state;
    this.collisionManager.updateHealthDisplay();

    document.addEventListener("keydown", (e) => {
      if (this.state.gameOver) return;
      if (e.key === "p") {
        this.gamePause();
      }
    });
    document.getElementById("gameover");
    document.getElementById("wingame");
    document.getElementById("continue").addEventListener("click", () => {
      this.gamePause();
    });
  }
  createBlocks() {
    const numBlocks = 4; // Nombre de blocs

    for (let i = 0; i < numBlocks; i++) {
      const block = new Block(i); // Ajoute chaque bloc au conteneur

      block.health = 3;
      block.id = i;
      block.element.id = i;
      this.state.blocks.push(block);
    }
  }

  initializePlayerAndBlock() {
    const startX = this.state.container.offsetWidth / 2;
    const startY = this.state.container.offsetHeight - 40;

    this.state.player = new Player(this.state.container, startX, startY);

    // ✅ Initialise la vie du joueur à 6 points et le block 3 points
    this.state.player.health = 6;

    // ✅ Met à jour l'affichage dès le début
    this.collisionManager.updateHealthDisplay();
  }

  update() {
    if (this.state.winGame) {
      this.winGame();
      cancelAnimationFrame(this.gameLoop);
    } else if (this.state.gameOver) {
      this.gameOver();
      cancelAnimationFrame(this.gameLoop);
    } else {
      this.moveProjectiles();
      this.moveEnemies();
      this.collisionManager.checkCollisions();

      this.gameLoop = requestAnimationFrame(() => this.update());
    }
  }

  moveEnemies() {
    this.state.enemies.forEach((enemy) => {
      enemy.x += this.state.direction * 1;
      if (enemy.x < 0 || enemy.x + 60 >= this.state.container.offsetWidth) {
        this.state.direction *= -1;

        this.state.enemies.forEach((e) => (e.y += 10));
      }
      enemy.updatePosition(enemy);
    });
  }

  moveProjectiles() {
    // Déplacer les tirs ennemis
    this.state.projectiles.enemies = this.state.projectiles.enemies.filter(
      (projectile) => projectile.move()
    );

    // Déplacer les tirs du joueur
    this.state.projectiles.player = this.state.projectiles.player.filter(
      (projectile) => projectile.move()
    );
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
    if (this.enemyShootingInterval) clearInterval(this.enemyShootingInterval);
    const shootRandomEnemy = () => {
      if (this.state.enemies.length === 0) return;
      const randomEnemy =
        this.state.enemies[
        Math.floor(Math.random() * this.state.enemies.length)
        ];
      randomEnemy.shoot();
    };

    this.enemyShootingInterval = setInterval(shootRandomEnemy, 1000);
  }

  gamePause() {
    const menupause = document.getElementById("pause");

    if (!this.state.pause) {
      this.state.pause = true;
      menupause.style.display = "flex";
      cancelAnimationFrame(this.gameLoop);
      clearInterval(this.enemyShootingInterval);
    } else {
      menupause.style.display = "none";
      this.state.pause = false;
      this.startEnemiesShooting();
      this.update();
    }
  }
  gameOver() {
    this.state.projectiles.enemies.forEach(proj => proj.remove())
    this.state.projectiles.player.forEach(proj => proj.remove())

    const menugameover = document.getElementById("gameover");
    menugameover.style.display = "flex"; // Affiche l'écran Game Over
    cancelAnimationFrame(this.gameLoop);
    clearInterval(this.enemyShootingInterval);
  }

  winGame() {
    this.state.projectiles.enemies.forEach(proj => proj.remove())
    this.state.projectiles.player.forEach(proj => proj.remove())

    const menuwin = document.getElementById("wingame");
    menuwin.style.display = "flex"; // Affiche l'écran de victoire
    cancelAnimationFrame(this.gameLoop);
    clearInterval(this.enemyShootingInterval);
  }

  setTimer() {
    let seconds = 0;
    const timerElement = document.getElementById("timer");

    this.timerInterval = setInterval(() => {
      if (!this.state.gameOver && !this.state.pause) {
        seconds++;
        timerElement.textContent = `${seconds} secondes`;
      }
    }, 1000);
  }

}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.init();
});
