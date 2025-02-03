export class Player {
  constructor(player, container, speed) {
    // Récupérer l'élément du joueur et le conteneur
    this.player = document.getElementById("player");
    this.container = document.getElementById("container");

    // Définir les dimensions du joueur et du conteneur
    this.playerWidth = this.player.offsetWidth;
    this.containerWidth = this.container.offsetWidth;

    // Vitesse de déplacement
    this.speed = speed;

    // Position initiale du joueur (centré horizontalement dans le conteneur)
    this.x = this.containerWidth / 2;
    this.player.style.left = `${this.x}px`;

    // Variables pour gérer le mouvement fluide
    this.isMovingLeft = false;
    this.isMovingRight = false;

    // Écouter les événements de clavier pour déplacer le joueur
    this.listenForMovement();
  }

  // Fonction pour déplacer le joueur à gauche
  moveLeft() {
    if (this.x > 50) {
      this.x -= this.speed;
      this.updatePosition();
    }
  }

  // Fonction pour déplacer le joueur à droite
  moveRight() {
    if (this.x + this.playerWidth < this.containerWidth) {
      this.x += this.speed;
      this.updatePosition();
    }
  }

  // Mettre à jour la position du joueur
  updatePosition() {
    this.player.style.left = `${this.x}px`;
  }

  // Fonction d'écoute des mouvements
  listenForMovement() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this.isMovingLeft = true;
      } else if (event.key === "ArrowRight") {
        this.isMovingRight = true;
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft") {
        this.isMovingLeft = false;
      } else if (event.key === "ArrowRight") {
        this.isMovingRight = false;
      }
    });

    // Animation fluide avec un intervalle
    this.animateMovement();
  }

  // Fonction pour animer le mouvement
  animateMovement() {
    setInterval(() => {
      if (this.isMovingLeft) {
        this.moveLeft();
      } else if (this.isMovingRight) {
        this.moveRight();
      }
    }, 10); // 16ms pour un mouvement fluide (environ 60fps)
  }
}
