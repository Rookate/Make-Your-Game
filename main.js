import { Player } from "./player.js";

class Game {
  constructor() {
    this.container = document.getElementById("container");
    this.player = new Player("player", "container", 5);
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
