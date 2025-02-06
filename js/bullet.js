export class Bullet {
  constructor(container, x, y) {
    this.container = container;
    this.x = x;
    this.y = y;
    this.speed = 5; // Vitesse de la balle
    this.element = this.bullet();
  }
  // Créer l'élément de la balle
  bullet() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = `${this.x}px`;
    bullet.style.top = `${this.y}px`;

    this.container.appendChild(bullet); // Ajouter la balle au conteneur
    return bullet;
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
    this.element.remove();
  }
}

export class Bulletenemy {
  constructor(container, x, y) {
    this.container = container;
    this.x = x;
    this.y = y;
    this.speed = 5; // Vitesse de la balle
    this.element = this.bullet();
  }
  // Créer l'élément de la balle
  bullet() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet-enemy");
    bullet.style.left = `${this.x}px`;
    bullet.style.top = `${this.y}px`;
    this.container.appendChild(bullet); // Ajouter la balle au conteneur
    return bullet;
  }

  // Déplacer la balle vers le haut
  move() {
    this.y += 1; // Déplacer la balle vers le haut
    this.element.style.top = `${this.y}px`;

    // Si la balle atteint le haut du cadre (position < 0), la supprimer
    if (this.y >= document.getElementById('game-container').offsetHeight) {
      this.remove(); // Appel de la méthode pour supprimer l'élément
      return false; // Indiquer qu'elle doit être supprimée du tableau
    }
    return true; // La balle reste active
  }

  // Supprimer la balle du DOM
  remove() {
    this.element.remove();
  }
}
