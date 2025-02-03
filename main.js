class Game {
  constructor() {
    this.container = ".game-container";
    this.player = new Player(this.container);
  }

  start() {
    console.log("Jeu démarré !");
  }
}

// Démarrer le jeu quand la page est chargée
document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.start();
});
