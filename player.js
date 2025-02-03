class Player {
  constructor(elementId, speed) {
    // Récupérer l'élément du joueur et définir les dimensions
    this.player = document.getElementById(elementId);
    this.playerWidth = this.player.offsetWidth;
    this.screenWidth = window.innerWidth;

    // Vitesse de déplacement
    this.speed = speed;

    // Position initiale du joueur (centré horizontalement)
    this.x = this.screenWidth / 2 - this.playerWidth / 2;
    this.player.style.left = `${this.x}px`;

    // Variables pour gérer le mouvement fluide
    this.isMovingLeft = false;
    this.isMovingRight = false;

    // Écouter les événements de clavier pour déplacer le joueur
    this.listenForMovement();
  }

  // Fonction pour déplacer le joueur à gauche
  moveLeft() {
    if (this.x > 0) {
      this.x -= this.speed;
      this.updatePosition();
    }
  }

  // Fonction pour déplacer le joueur à droite
  moveRight() {
    if (this.x + this.playerWidth < this.screenWidth) {
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
    }, 16); // 16ms pour un mouvement fluide (environ 60fps)
  }
}

// Créer une instance de la classe Player
const player = new Player("player", 5);
