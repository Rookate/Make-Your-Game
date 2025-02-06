import { Bulletenemy } from "./bullet.js";

export class Enemy {
  constructor(x, y, speed = 5, spacing = 1) {
    this.container = document.getElementById("enemy-container");
    this.stepDown = false;
    this.spacing = spacing;
    this.bullets = [];
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.element = this.createEnemy();
    // this.updatePosition();
  }

  createEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    this.container.appendChild(enemy);
    return enemy;
  }

  updatePosition(obj) {
    obj.element.style.left = obj.x + "px";
    obj.element.style.top = obj.y + "px";
    // this.element.style.top = `${this.y}px`;
  }
  shoot() {
    const bullet = new Bulletenemy(this.container, this.x + 25, this.y + 25);
    window.gameState.projectiles.enemies.push(bullet);
  }
  // Move(x, y) {
  //   if (this.x > 35) {
  //     this.x -= this.speed;
  //     this.updatePosition();
  //   }
  //   if (this.y < 670) {
  //     this.x += this.speed;
  //     this.updatePosition();
  //   }
  //   // Animation fluide
  // }
}
