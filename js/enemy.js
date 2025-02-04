export class Enemy {
  constructor(gamebox, width, height, speed, imageSrc) {
    this.element = document.getElementById("enemy");
    this.width = width;
    this.height = height;
    this.speed = speed;

    // Positionner l'ennemi aléatoirement en haut du element
    this.x = Math.random() * (this.element.clientWidth - this.width);
    this.y = -this.height; // Commence juste au-dessus de element

    // Créer dynamiquement l'élément HTML pour l'ennemi
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.position = "absolute";
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.backgroundImage = `url(${imageSrc})`;
    this.element.style.backgroundSize = "cover";

    // Ajouter l'ennemi à element
    this.game - container.appendChild(this.element);
  }

  // Déplacement de l'ennemi vers le bas
  move() {
    this.y += this.speed;
    this.element.style.top = `${this.y}px`;
  }
}
