class Bullet {
  constructor(container, x, y) {
    this.container = container;
    this.x = x;
    this.y = y;
    this.speed = 5; // Vitesse de la balle
    this.bullet();
  }
  // Créer l'élément de la balle
  bullet() {
    this.element = document.createElement("div");
    this.element.classList.add("bullet");
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    this.container.appendChild(this.element); // Ajouter la balle au conteneur
  }

  // Déplacer la balle vers le haut
  move() {
    this.y -= this.speed; // Déplacer la balle vers le haut
    this.element.style.top = `${this.y}px`;

    // Si la balle atteint le haut du cadre (position < 0), la supprimer
    if (this.y < 0) {
      this.remove(); // Appel de la méthode pour supprimer l'élément
      return false; // Indiquer qu'elle doit être supprimée du tableau
    }
    return true; // La balle reste active
  }

  // Supprimer la balle du DOM
  remove() {
    if (this.element) {
      this.container.removeChild(this.element); // Retirer l'élément du DOM
      this.element = null; // Libérer la référence à l'élément pour éviter des erreurs
    }
  }
}
