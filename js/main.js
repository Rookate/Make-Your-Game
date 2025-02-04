import { Player } from "./player";

class Game {
  constructor() {
    this.container = document.querySelector(".game-container");
    this.player = new Player(this.container); // Création du joueur

    this.startGame();
  }

  startGame() {
    console.log("Le jeu commence !");
  }
}
const game = new Game();
