class Enemy {
  constructor(speed) {
    this.enemy = document.getElementById("enemy");
    this.container = document.getElementById("container");

    this.enemyWidht = this.enemy.offsetWidth;
    this.containerWidht = this.container.offsetWidth;

    this.speed = speed;

    this.x = this.containerWidht / 2;
    this.enemy.style.left = `${this.x}px`;

    this.isMovingLeft = false;
    this.isMovingright = false;

    this.listenForMovement();
  }
  movement() {
    if (this.x > 50) {
      this.x -= this.speed;
      this.updatePosition();
    }
    if (this.x + this.enemyWidht < this.containerWidht) {
      this.x += this.speed;
      this.updatePosition();
    }
  }
  updatePosition() {
    this.enemy.style.left = `${this.x}px`;
  }
  listenForMovement() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this.isMovingLeft = true;
      } else if (event.key === "ArrowRight") {
        this.isMovingright = true;
      }
    });
    this.animateMovement();
  }
  animateMovement() {
    setInterval(() => {
      if (this.isMovingLeft) {
        this.moveLeft();
      } else if (this.isMovingright) {
        this.moveRight();
      }
    }, 10);
  }
}

const enemy = new Enemy("enemy", "conainer", 5);

const container = document.getElementById("container");
export class Enemy2 {
  constructor(x, y, health, speed) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = speed;
    this.element = this.createEnemy();
  }

  createEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    container.appendChild(enemy);
    return enemy;
  }

  destroy() {
    this.element.remove();
  }

  move() {
    this.element.style.left = `${this.x}px`;
  }
}
