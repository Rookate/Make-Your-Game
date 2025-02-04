export class Enemy {
  constructor(width, height, speed, imageSrc) {
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
    this.move();
  }

  // Déplacement de l'ennemi vers le bas
  move() {
    const animate = () => {
      // Déplacement vers le bas
      this.y += this.speedY;

      // Déplacement latéral (rebond aux bords)
      this.x += this.speedX * this.directionX;
      if (
        this.x <= 0 ||
        this.x + this.width >= this.game - container.clientWidth
      ) {
        this.directionX *= -1; // Change de direction
      }

      // Mettre à jour la position de l'ennemi
      this.element.style.top = `${this.y}px`;
      this.element.style.left = `${this.x}px`;

      // Supprimer l'ennemi s'il sort de l'écran (en bas)
      if (this.y > this.game - container.clientHeight) {
        this.element.remove();
      } else {
        requestAnimationFrame(animate); // Continue l'animation
      }
    };

    requestAnimationFrame(animate);
  }
}
