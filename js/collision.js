export class Collision {
  constructor(gameState) {
    this.state = gameState;
  }

  checkCollisions() {
    this.checkPlayerProjectiles();
    this.checkEnemyProjectiles();
    this.collisionEnemiesPlayer();
    this.collisionEnd();
    this.collisionBlock();
  }

  collisionBlock() {
    const { blocks, projectiles } = this.state;

    if (!blocks || !projectiles) return false;

    const checkCollision = (projectileList) => {
      // Boucle sur chaque projectile
      for (let pIndex = projectileList.length - 1; pIndex >= 0; pIndex--) {
        const projectile = projectileList[pIndex];

        // Vérifier la collision avec chaque bloc
        for (let bIndex = 0; bIndex < blocks.length; bIndex++) {
          const block = blocks[bIndex];

          if (this.isCollision(projectile, block)) {
            // Réduire la santé du bloc touché
            block.health -= 1;

            // Mettre à jour l'affichage de la santé
            this.updateHealthDisplay();
            console.log(`Bloc touché ! Santé restante : ${block.health}`);

            // Si la santé du bloc tombe à 0, le supprimer
            if (block.health <= 0) {
              console.log(block, blocks);

              // if (blocks.element) block.element.remove(); // Supprimer l'élément du DOM
              blocks.slice(bIndex, 1); // Retirer le bloc de la liste
              console.log("Bloc détruit !", block);
              block.element.remove();
            }

            // Supprimer le projectile après la collision
            if (projectile.element) projectile.element.remove();
            projectileList.splice(pIndex, 1); // Retirer le projectile de la liste

            // Ne pas utiliser `break` pour permettre de gérer plusieurs collisions simultanées
            break; // Sortir uniquement de la boucle de blocs (le projectile ne peut toucher qu'un bloc)
          }
        }
      }
    };

    checkCollision(projectiles.enemies);
    checkCollision(projectiles.player);
  }
  remove() {
    this.element.remove();
  }
  collisionEnemiesPlayer() {
    const enemies = this.state.enemies;
    enemies.forEach((enemy) => {
      if (this.isCollision(enemy, window.game.player)) {
        this.gameOver();
      }
    });
  }
  collisionEnd() {
    this.state.enemies.forEach((enemy) => {
      if (enemy.y >= this.state.container.offsetHeight) {
        this.gameOver();
      }
    });
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
          console.log("enemies array :", this.state.enemies)
          // ✅ Vérifier s'il reste des ennemis
          if (this.state.enemies.length === 0) {
            this.state.winGame = true;
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
          this.state.gameOver = true;
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
    const healthBoardBlock = document.getElementById("health-board-blocks");
    if (healthBoardBlock) {
      let heartsBlock = this.state.blocks
        .map((block) => "❤️".repeat(block.health))
        .join(" ");

      healthBoardBlock.textContent = `blocks : ${heartsBlock}`;
    }
  }

  // endGame() {
  //   // alert("💀 Game Over ! Vous avez perdu.");
  //   window.location.reload();
  // }
  // winGame() {
  //   // alert("🎉 Félicitations ! Vous avez gagné !");
  //   window.location.reload(); // Recharge la page pour recommencer
  // }
}
