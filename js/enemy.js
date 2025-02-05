export class EnemyManager {
  constructor(container, speed = 2, columns = 6, spacing = 10) {
    this.container = container;
    this.enemies = Array.from(document.querySelectorAll(".enemy"));
    this.speed = speed;
    this.direction = 1; // 1 = droite, -1 = gauche
    this.stepDown = false;
    this.columns = columns;
    this.spacing = spacing;
    this.initEnemies();
  }

  initEnemies() {
    if (this.enemies.length === 0) {
      console.error("Aucun ennemi trouvé !");
      return;
    }

    const containerWidth = this.container.clientWidth;
    const enemyWidth = this.enemies[0].offsetWidth;
    const totalWidth =
      this.columns * enemyWidth + (this.columns - 1) * this.spacing;
    const startX = (containerWidth - totalWidth) / 2;
    const startY = 30; // Position initiale

    this.enemies.forEach((enemy, index) => {
      let col = index % this.columns;
      let x = startX + col * (enemyWidth + this.spacing);
      let y = startY;
      enemy.style.transform = `translate(${x}px, ${y}px)`;
      enemy.dataset.x = x;
      enemy.dataset.y = y;
    });

    // Démarrer le mouvement
    this.moveEnemies();
  }

  moveEnemies() {
    let moveX = this.direction * this.speed;
    let edgeReached = false;

    this.enemies.forEach((enemy) => {
      let x = parseFloat(enemy.dataset.x) + moveX;
      let y = parseFloat(enemy.dataset.y);

      // Vérifier si un ennemi atteint un bord
      if (x <= 0 || x + enemy.offsetWidth >= this.container.clientWidth) {
        edgeReached = true;
      }

      enemy.dataset.x = x;
      enemy.dataset.y = y;
    });

    // Changer de direction et descendre si un bord est atteint
    if (edgeReached) {
      this.direction *= -1;
      this.stepDown = true;
    }

    this.enemies.forEach((enemy) => {
      let x = parseFloat(enemy.dataset.x);
      let y = parseFloat(enemy.dataset.y);
      if (this.stepDown) y += 20; // Descendre de 20px
      enemy.style.transform = `translate(${x}px, ${y}px)`;
      enemy.dataset.y = y;
    });

    this.stepDown = false;

    // Animation fluide
    requestAnimationFrame(() => this.moveEnemies());
  }
}

// Initialisation après le chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game-container");
  const enemyManager = new EnemyManager(gameContainer);
});
