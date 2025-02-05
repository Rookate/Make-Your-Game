// export class EnemyManager {
//   constructor(speed = 1, columns = 6, spacing = 1) {
//     this.container = document.getElementById("enemy-container");
//     this.speed = speed;
//     this.direction = 1; // 1 = droite, -1 = gauche
//     this.stepDown = false;
//     this.columns = columns;
//     this.spacing = spacing;
//     this.enemies = [];
//     this.Move();
//   }
// }

export class Enemy {
  constructor(speed = 1, spacing = 1) {
    this.container = document.getElementById("enemy-container");
    this.speed = speed;
    this.direction = 1;
    this.stepDown = false;
    this.spacing = spacing;
    this.y = 0;
    this.x = 0;
    this.element = this.createEnemy();
    this.Move();
  }

  createEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    this.container.appendChild(enemy);
    return enemy;
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    // this.element.style.top = `${this.y}px`;
  }

  Move() {
    let moveX = this.direction * this.speed;
    console.log("1 =>", moveX);
    let edgeReached = false;
    let x = this.x + moveX;

    // Vérifier si un ennemi touche le bord
    if (x <= 0 || x + this.element.offsetWidth >= this.container.clientWidth) {
      console.log("Arrivé au bord");
      edgeReached = true;
    }
    this.updatePosition();

    // Si un ennemi touche un bord, on descend et on change de direction
    if (edgeReached) {
      this.direction *= -1;
      this.stepDown = true;
    }

    // Faire descendre les ennemis
    // if (this.stepDown) {
    //   window.game.enemies.forEach((enemy) => {
    //     enemy.setPosition(enemy.x, enemy.y + 20);
    //   });
    //   this.stepDown = false;
    // }

    // Animation fluide
    requestAnimationFrame(() => this.Move());
  }
}

// Initialisation après le chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game-container");
});
