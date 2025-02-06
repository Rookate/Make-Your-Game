export class Enemy {
  constructor(x, y, spacing = 1) {
    this.container = document.getElementById("enemy-container");
    this.stepDown = false;
    this.spacing = spacing;
    this.x = x;
    this.y = y;
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

  // Move(x, y) {
  //   this.x += x
  //   this.y += y
  //   this.updatePosition();
  //   // Animation fluide
  // }
}