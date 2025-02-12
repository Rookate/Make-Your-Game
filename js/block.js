export class Block {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;

    // Création de l'élément DOM pour le bloc
    this.element = document.createElement("div");
    this.element.style.position = "absolute";
    this.element.style.width = "50px";
    this.element.style.height = "20px";
    this.element.style.backgroundColor = "green"; // Personnalise la couleur
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px ` / 2;

    // Ajout du bloc au conteneur
    container.appendChild(this.element);
  }
}
