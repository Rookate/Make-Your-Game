// A. Affichage des éléments
const projectile = createProjectileElement(100, 300);
function drawPlayer() {
  const player = document.createElement("div");
  player.classList.add("player");
  player.style.left = "50%";
  player.style.bottom = "50px";
  document.body.appendChild(player);
  return player;
  // TODO : Dessiner le vaisseau du joueur avec CSS.
  //   const player = document.createElement("img");
  //   player.src = "player-ship.png"; // Remplace par le chemin de ton image
  // Ou ajouter un PNG directement.
}

function generateEnemies() {
  const ennemies = document.createElement("div");
  ennemies.classList.add("ennemies");
  ennemies.style.top = `${y}px`;
  ennemies.style.left = `${x}px`;
  document.body.appendChild(ennemies);

  // TODO : Générer une grille d'envahisseurs dynamiquement.
}

function createProjectileElement(x, y) {
  const projectile = document.createElement("div");
  projectile.classList.add("projectile");
  projectile.style.left = `${x}px`;
  projectile.style.top = `${y}px`;
  document.body.appendChild(projectile);
  return projectile;
  // TODO : Définir les projectiles du joueur en créant un élément DOM.
}

// B. Contrôles du joueur

function playerMovement() {
  // TODO : Gérer les déplacements gauche/droite du joueur.
  // - Récupérer l'input 'ArrowLeft' et 'ArrowRight'.
  // - Modifier la position du vaisseau en fonction de 'direction' et 'speed'.
  // - Utiliser requestAnimationFrame() pour une animation fluide.
}

function shootProjectile() {
  // TODO : Implémenter la logique de tir.
  // - Détecter l'appui sur la touche 'Space'.
  // - Créer un projectile et l'ajouter au DOM.
  // - Faire monter le projectile à une vitesse constante.
}

// C. Mouvement des envahisseurs

function moveEnemies() {
  // TODO : Gérer le déplacement des envahisseurs.
  // - Déplacer tous les envahisseurs de gauche à droite.
  // - Descendre et inverser la direction lorsqu'un bord est atteint.
}

function increaseEnemySpeed() {
  // TODO : Accélérer progressivement le mouvement des envahisseurs.
}

// D. Gestion des collisions

function checkCollision() {
  // TODO : Vérifier si un projectile touche un ennemi.
  // - Utiliser getBoundingClientRect() pour comparer les positions.
  // - Supprimer l'ennemi et le projectile en cas de collision.
}

function checkGameOver() {
  // TODO : Vérifier si un envahisseur atteint le bas de l'écran (défaite).
}

// E. Ajout de la difficulté

function spawnEnemyWaves() {
  // TODO : Ajouter plusieurs vagues d'ennemis.
}

function increaseEnemyFireRate() {
  // TODO : Rendre les tirs ennemis plus fréquents au fil du temps.
}

// F. Interface utilisateur

function updateScore() {
  // TODO : Augmenter le score quand un ennemi est détruit.
}

function updateLives() {
  // TODO : Gérer le compteur de vies du joueur.
}

function displayEndMessage() {
  // TODO : Afficher un message de victoire ou de défaite.
}

// G. Sons et animations

function playSound() {
  // TODO : Jouer un effet sonore spécifique (tir, explosion, etc.).
}

function animateExplosion() {
  // TODO : Ajouter une animation d'explosion lorsqu'un ennemi est détruit.
}

// H. Performances et optimisation

function gameLoop() {
  // TODO : Boucle principale du jeu avec requestAnimationFrame().
}

function optimizeProjectileManagement() {
  // TODO : Nettoyer les projectiles hors écran pour éviter une surcharge du DOM.
}

function togglePause() {
  // TODO : Mettre le jeu en pause et permettre la reprise.
}
