class Enemy {
  constructor(container, x, y) {
    this.x = x; // Position horizontale initiale
    this.y = y; // Position verticale initiale
    this.speed = 2;
  }
  createElement() {
    this.container = container;
    this.element = document.createElement("div");
    this.element.classList.add("enemy");
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    container.appendChild(this.element);
  }
  move(dx, dy) {
    this.x += dx;
    this.y += dy;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  remove() {
    this.element.remove();
  }
}