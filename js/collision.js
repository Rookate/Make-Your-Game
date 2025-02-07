export class Collision {
  constructor(gameState) {
    this.state = gameState;
  }

  checkCollisions() {
    this.checkPlayerProjectiles();
    this.checkEnemyProjectiles();
  }

  checkPlayerProjectiles() {
    const playerProjectiles = this.state.projectiles.player;
    const enemies = this.state.enemies;

    playerProjectiles.forEach((projectile, pIndex) => {
      enemies.forEach((enemy, eIndex) => {
        if (this.isCollision(projectile, enemy)) {
          // Supprimer les éléments du DOM
          if (projectile.element) projectile.element.remove();
          if (enemy.element) enemy.element.remove();

          // Retirer les objets des listes du jeu
          this.state.projectiles.player.splice(pIndex, 1);
          this.state.enemies.splice(eIndex, 1);

          // Augmenter le score
          this.state.score = (this.state.score || 0) + 100;
          // ✅ Mettre à jour l'affichage du score
          this.updateScoreDisplay();
          console.log(`💥 Ennemi détruit ! Score: ${this.state.score}`);
          // ✅ Vérifier s'il reste des ennemis
          if (this.state.enemies.length === 0) {
            this.winGame(); // 🎉 Si plus d'ennemis, on gagne !
          }
        }
      });
    });
  }

  checkEnemyProjectiles() {
    const enemyProjectiles = this.state.projectiles.enemies;
    const player = this.state.player;

    enemyProjectiles.forEach((projectile, pIndex) => {
      if (this.isCollision(projectile, player)) {
        // Supprimer le projectile du DOM
        if (projectile.element) projectile.element.remove();
        this.state.projectiles.enemies.splice(pIndex, 1);

        // Réduire la vie du joueur
        player.health -= 1;
        this.updateHealthDisplay();
        console.log(`🔥 Joueur touché ! Vie restante: ${player.health}`);

        if (player.health <= 0) {
          console.log("💀 Game Over !");
          this.endGame();
        }
      }
    });
  }

  isCollision(obj1, obj2) {
    if (!obj1.element || !obj2.element) return false; // Vérifier que les éléments existent

    const rect1 = obj1.element.getBoundingClientRect();
    const rect2 = obj2.element.getBoundingClientRect();

    return (
      rect1.top < rect2.bottom &&
      rect1.left < rect2.right &&
      rect1.bottom > rect2.top &&
      rect1.right > rect2.left
    );
  }
  updateScoreDisplay() {
    const scoreBoard = document.getElementById("score-board");
    if (scoreBoard) {
      scoreBoard.textContent = `Score: ${this.state.score}`;
    }
  }
  updateHealthDisplay() {
    const healthBoard = document.getElementById("health-board");
    if (healthBoard) {
      let hearts = "❤️".repeat(this.state.player.health);
      healthBoard.textContent = `Vie : ${hearts}`;
    }
  }

  endGame() {
    alert("💀 Game Over ! Vous avez perdu.");
    window.location.reload();
  }
  winGame() {
    alert("🎉 Félicitations ! Vous avez gagné !");
    window.location.reload(); // Recharge la page pour recommencer
  }
}
