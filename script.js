// A. Affichage des éléments

function drawPlayer() {
    // TODO : Dessiner le vaisseau du joueur avec CSS.
    // Ou ajouter un PNG directement.
}

function generateEnemies() {
    // TODO : Générer une grille d'envahisseurs dynamiquement.
}

function createProjectileElement() {
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