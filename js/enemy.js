export class Enemy {
  constructor(gamebox, width, height, speed, imageSrc) {
    this.gamebox = gamebox;
    this.width = width;
    this.height = height;
    this.speedY = speed; // Vitesse de descente
    this.speedX = 2; // Vitesse latérale
    this.directionX = 1; // 1 = droite, -1 = gauche

    // Positionner l'ennemi aléatoirement en haut du gamebox
    this.x = Math.random() * (this.gamebox.clientWidth - this.width);
    this.y = -this.height; // Commence hors de l'écran

    // Créer dynamiquement l'élément HTML pour l'ennemi
    this.element = document.createElement("div");
    this.element.classList.add("enemy");
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.position = "absolute";
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.backgroundImage = `url(${imageSrc})`;
    this.element.style.backgroundSize = "cover";

    // Ajouter l'ennemi à gamebox
    this.gamebox.appendChild(this.element);

    // Démarrer le mouvement
    this.move();
  }

  move() {
    const interval = setInterval(() => {
      // Déplacement vers le bas
      this.y += this.speedY;

      // Déplacement latéral
      this.x += this.speedX * this.directionX;

      // Changer de direction si on atteint le bord de gamebox
      if (this.x <= 0 || this.x + this.width >= this.gamebox.clientWidth) {
        this.directionX *= -1; // Inverser la direction
      }

      // Mettre à jour la position de l'ennemi
      this.element.style.top = `${this.y}px`;
      this.element.style.left = `${this.x}px`;

      // Supprimer l'ennemi s'il sort de l'écran (en bas)
      if (this.y > this.gamebox.clientHeight) {
        this.element.remove();
        clearInterval(interval);
      }
    }, 300);
  }
}
