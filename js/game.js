class Game {
  constructor() {
    this.container = document.querySelector(".game-container");
    this.player = new Player(this.container);
    this.bullets = []; // Tableau pour garder une trace des balles tirées
    this.isShooting = false; // Indicateur de cooldown pour éviter des tirs trop rapides
    this.shootCooldown = 500; // Délai en millisecondes entre deux tirs (par exemple, 500ms)

    // Écouter les événements de pression des touches
    document.addEventListener("keydown", (event) => {
      if (event.key === " " && !this.isShooting) this.shoot(); // Permettre le tir si cooldown est fini
    });

    this.startGame();
  }

  // Fonction pour tirer une balle
  shoot() {
    const { x, y } = this.player.getPosition(); // Récupérer la position du joueur
    const bullet = new Bullet(this.container, x + 15, y); // Créer une balle juste au-dessus du joueur
    this.bullets.push(bullet); // Ajouter la balle au tableau des balles

    // Activer le cooldown pour le prochain tir
    this.isShooting = true;

    // Attendre un certain délai, puis réinitialiser isShooting pour permettre un nouveau tir
    setTimeout(() => {
      this.isShooting = false; // Réinitialiser le cooldown après 500ms
    }, this.shootCooldown);
  }

  // Mettre à jour les balles et leur mouvement
  updateBullets() {
    // Filtrer les balles qui sont sorties de l'écran et les supprimer
    this.bullets = this.bullets.filter((bullet) => bullet.move()); // Supprimer les balles qui sortent de l'écran
  }

  // Mettre à jour l'état du jeu (balles, ennemis, etc.)
  update() {
    this.updateBullets(); // Mettre à jour les balles et les supprimer si nécessaire
    // Ajouter d'autres mises à jour du jeu (mouvement des ennemis, collisions, etc.)
  }

  // Lancer le jeu
  startGame() {
    setInterval(() => this.update(), 100); // Appeler la méthode update toutes les 100ms
  }
}
