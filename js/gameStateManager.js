import { API_SCORE } from './api/api.js';
import { CinematicEventType, CinematicManager } from './cinematicManager.js';
import { CollisionManager } from './collisionManager.js';
import { Enemy, KamikazeEnemy } from './ennemyClass.js';
import { GAME_CONFIG } from './game-constants.js';
import { createLeaderBoard } from './leaderBoard.js';
import { Player } from './player.js';
import { displayWaveMessage, updateLivesDisplay, updateScoreDisplay, updateWaveDisplay } from './ui.js';
import { throttle } from './utils.js';

export class GameStateManager {
    constructor() {
        this.state = {
            currentState: 'MENU', // MENU, PLAYING, PAUSED, GAME_OVER
            score: 0,
            wave: 1,
            waveTransition: false,
            endGame: false,
            music: {
                background: new Audio('../css/audio/bitRush.mp3'),
                isPlaying: false
            },
            projectiles: {
                player: [],
                enemies: []
            },
            activeBonuses: [],
            enemyShootTimeout: null,

            // Ajouts pour la gestion des ennemis
            enemies: [],
            enemySpeed: GAME_CONFIG.ENEMIES.SPEED,
            enemiesDirection: 1,

            player: null // Le joueur sera initialisé plus tard
        };

        this.collisionManager = new CollisionManager(this.state);
        this.api = new API_SCORE()


        // this.transition = new SceneTransition();
        this.cinematic = new CinematicManager();
        this.isGameStarted = false;
        this.waveStarted = false;

        // Configuration de la musique
        this.state.music.background.loop = true;
        this.state.music.background.volume = 0.2;

        // Éléments DOM
        this.ui = {
            mainMenu: document.getElementById('mainMenu'),
            gameContainer: document.getElementById('gameContainer'),
            pauseMenu: document.getElementById('pauseMenu'),
            endMessage: document.getElementById('endMessage'),
            waveDisplay: document.getElementById('wave'),
            scoreDisplay: document.getElementById('scoreDisplay'),
            livesDisplay: document.getElementById('livesDisplay'),
            enemiesContainer: document.getElementById('enemiesContainer'),
            logo: document.getElementById('logo'),
            leaderBoard: document.getElementById('leaderBoard')
        };

        // Bind des méthodes
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    init() {
        // Initialisation des écouteurs d'événements
        document.addEventListener('keydown', this.handleKeyPress);
        this.setupMenuControls();
        this.showMainMenu();
        window.gameState = this.state;
    }

    setupMenuControls() {
        const controls = {
            'startButton': () => this.startGame(),
            'optionsButton': () => this.openOptions(),
            'exitButton': () => window.close(),
            'resumeButton': () => this.togglePause(),
            'quitButton': () => this.quitToMenu(),
            'saveScoreButton': () => this.postScore(),
            'menu-button': () => this.showMainMenu(),
            'leaderBoardButton': () => this.leaderBoard(),
            'homeButton': () => this.showMainMenu(),
        };

        Object.entries(controls).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) element.onclick = handler;
        });
    }

    handleKeyPress(event) {
        if (this.state.waveTransition) return;
        if (event.key === 'p') {
            this.togglePause();
        }
        if (event.key === 'Escape') {
            this.quitToMenu();
        }
    }

    async startGame() {
        if (this.isGameStarted) return;
        this.hideAllScreens();

        const cinematic = this.cinematic;

        cinematic.createEvent('titleText', CinematicEventType.SCENE, {
            duration: 3000,
            text: 'Welcome to the game',
            className: 'cut-scene',
            planet: "css/Lava.png"
        });
        cinematic.createEvent('titleText3', CinematicEventType.SCENE, {
            duration: 3000,
            text: 'The invader come and destroy our planet',
            className: 'cut-scene',
            planet: "css/Terran.png"
        });
        cinematic.createEvent('titleText4', CinematicEventType.SCENE, {
            duration: 4000,
            text: 'You are the last chance',
            className: 'cut-scene',
            planet: "css/Ice.png"
        });
        cinematic.createEvent('playerAppear', CinematicEventType.PLAYER, {
            duration: 5000,
            className: 'cutscene',
            text: 'Space June 2079 9pm',
            playerImage: 'css/pngkey.com-galaga-ship-png-1472422.png',
            backgroundImage: "css/HD-wallpaper-artistic-pixel-art-space-moon.jpg"
        });
        cinematic.createEvent('zoomPlayer', CinematicEventType.PLAYER, {
            duration: 4000,
            className: 'cutscene',
            text: 'Leader to falcon I approach the targets',
            backgroundImage: 'css/471a0d1d9af520c394e02a09120fc7c1.gif'
        });
        cinematic.createEvent('zoomPlayer2', CinematicEventType.PLAYER, {
            duration: 5000,
            className: 'cutscene',
            text: 'Ok leader you can engage',
            backgroundImage: 'css/f2162a69274b7cb1f9330c4580f28723.gif'
        });
        cinematic.createEvent('zoomPlayer3', CinematicEventType.PLAYER, {
            duration: 2000,
            className: 'cutscene',
            text: 'Prepare to fight !',
            backgroundImage: 'css/471a0d1d9af520c394e02a09120fc7c1.gif'
        });
        //,
        try {
            //   await transition.play('levelStart');
            await cinematic.playSequence(['titleText', 'titleText2', 'titleText3', 'titleText4', 'playerAppear', 'zoomPlayer', 'zoomPlayer2', 'zoomPlayer3']);
            this.launchGame();
        } catch (error) {
            console.error('Failed to start game:', error);
            this.cleanup();
        }
    }

    launchGame() {
        this.isGameStarted = true;
        this.state.currentState = 'PLAYING';
        this.state.score = 0;
        this.state.lives = GAME_CONFIG.PLAYER.LIVES;
        this.state.wave = 1;
        this.state.waveTransition = false;

        this.hideAllScreens();
        this.ui.gameContainer.classList.remove('hidden');
        this.ui.enemiesContainer.classList.remove('hidden');
        this.ui.livesDisplay.classList.remove('hidden');
        this.ui.scoreDisplay.classList.remove('hidden');
        this.ui.waveDisplay.classList.remove('hidden');
        this.playMusic();

        this.initGameElements();
        this.startGameLoop();
        this.startEnemyShooting();
        updateWaveDisplay();
        updateLivesDisplay();
        updateScoreDisplay();
    }

    togglePause() {
        if (this.state.currentState === 'PLAYING') {
            this.state.currentState = 'PAUSED';
            clearInterval(this.enemyShootingInterval);
            this.pauseGameLoop();
            this.ui.pauseMenu.classList.remove('hidden')
            this.pauseMusic();
        } else if (this.state.currentState === 'PAUSED') {
            this.state.currentState = 'PLAYING';
            this.ui.pauseMenu.classList.add('hidden');
            this.startGameLoop();
            this.startEnemyShooting();
            this.playMusic();
        }
    }

    async launchGameOver() {
        this.hideAllScreens();

        const cinematic = this.cinematic;

        cinematic.createEvent('titleText', CinematicEventType.PLAYER, {
            duration: 3000,
            text: 'Game Over, Invaders win',
            className: 'cut-scene',
            playerImage: "css/galaga-ship.png",
            backgroundImage: "css/83024e2e5cd4fc4261e4b97dc93ed12c.gif"
        });

        try {
            //   await transition.play('levelStart');
            await cinematic.playSequence(['titleText']);
            this.gameOver();
        } catch (error) {
            console.error('Failed to start game:', error);
            this.cleanup();
        }
    }

    async gameOver() {

        this.state.currentState = 'GAME_OVER';
        this.ui.endMessage.classList.remove('hidden');
        this.ui.gameContainer.classList.add('hidden')
        this.pauseMusic();
        this.stopGameLoop();
        clearTimeout(this.enemyShootingTimeout);
    }

    showMainMenu() {
        this.hideAllScreens();
        this.ui.mainMenu.classList.remove('hidden');
        this.ui.logo.classList.remove('hidden');
        this.state.currentState = 'MENU';
    }

    openOptions() {
        alert('Options non implémentées.');
    }

    quitToMenu() {
        this.hideAllScreens();
        this.ui.mainMenu.classList.remove('hidden')
        this.ui.logo.classList.remove('hidden')
        this.ui.pauseMenu.classList.add('hidden')
        this.state.currentState = 'MENU';
        this.pauseMusic();
        this.stopGameLoop();
        clearTimeout(this.enemyShootingTimeout);
        this.resetState();
    }

    resetState() {
        this.state.score = 0;
        this.state.lives = GAME_CONFIG.PLAYER.LIVES;
        this.state.wave = 1;
        this.state.waveTransition = false;
        this.state.projectiles = { player: [], enemies: [] };
        this.state.activeBonuses = [];
    }

    hideAllScreens() {
        Object.values(this.ui).forEach(element => {
            if (element) {
                element.classList.add('hidden');
            }
        });
    }

    playMusic() {
        if (!this.state.music.isPlaying) {
            this.state.music.background.play();
            this.state.music.isPlaying = true;
        }
    }

    pauseMusic() {
        if (this.state.music.isPlaying) {
            this.state.music.background.pause();
            this.state.music.isPlaying = false;
        }
    }

    setMusicVolume(volume) {
        this.state.music.background.volume = Math.max(0, Math.min(1, volume));
    }

    initGameElements() {
        this.state.enemies = [];
        this.ui.enemiesContainer.innerHTML = '';
        this.generateEnemies();
        this.initializePlayer();
        this.moveEnemies();  // Lancer le mouvement des ennemis
        this.setupPlayerControls();
    }

    startGameLoop() {
        if (!this.gameLoop) {
            this.gameLoop = requestAnimationFrame(this.update);
        }
    }

    pauseGameLoop() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
        clearTimeout(this.enemyShootingTimeout);
    }

    resumeGameLoop() {
        this.startGameLoop();
    }

    stopGameLoop() {
        this.pauseGameLoop();
    }

    update = () => {
        if (this.state.currentState === 'GAME_OVER') this.launchGameOver();
        if (this.state.currentState !== 'PLAYING') return;

        if (!this.state.waveTransition && this.ui.enemiesContainer.querySelectorAll('.enemy').length === 0) {
            this.startNextWave();
        }

        this.state.activeBonuses.forEach(bonus => bonus.updatePosition());
        this.moveEnemies();
        this.playerMovement();
        this.collisionManager.checkCollisions();
        this.moveProjectiles();


        this.gameLoop = requestAnimationFrame(this.update);
    }

    cleanup() {
        // Suppression des écouteurs d'événements globaux
        document.removeEventListener('keydown', this.handleKeyPress);

        if (this.keyDownHandler) {
            document.removeEventListener('keydown', this.keyDownHandler);
        }
        if (this.keyUpHandler) {
            document.removeEventListener('keyup', this.keyUpHandler);
        }

        // Arrêt de la musique
        if (this.state.music.background) {
            this.state.music.background.pause();
            this.state.music.background.currentTime = 0;
            this.state.music.isPlaying = false;
        }

        // Nettoyage des timeouts et intervals
        this.stopEnemyShooting()
        this.stopGameLoop();

        // Suppression des ennemis du DOM
        if (this.ui.enemiesContainer) {
            this.ui.enemiesContainer.innerHTML = '';
        }

        // Suppression des projectiles du DOM

        const projectiles = document.querySelectorAll('.bullet')
        const enemiesBullet = document.querySelectorAll('.enemy-bullet')
        projectiles.forEach(projectile => projectile.remove())
        enemiesBullet.forEach(projectile => projectile.remove())

        // Réinitialisation des listes d'objets du jeu
        this.state.projectiles.player = [];
        this.state.projectiles.enemies = [];
        this.state.enemies = [];
        this.state.activeBonuses = [];

        // Suppression du joueur du DOM
        if (this.state.player && this.state.player.element) {
            this.state.player.element.remove(); // Suppression du joueur
            this.state.player = null; // Réinitialisation
        }

        // Masquer les écrans
        this.hideAllScreens();

        console.log("Nettoyage terminé, prêt pour une nouvelle partie.");
        this.cinematic.cleanup();
        this.isGameStarted = false;
    }

    // Player
    initializePlayer() {
        const startX = this.ui.gameContainer.offsetWidth / 2;
        const startY = this.ui.gameContainer.offsetHeight - 50; // Position en bas au centre

        this.state.player = new Player(startX, startY, GAME_CONFIG.PLAYER.SPEED, GAME_CONFIG.PLAYER.FIRE_RATE);
        this.state.player.updatePosition();

        this.state.playerMovementId = requestAnimationFrame(this.playerMovement.bind(this));
    }

    playerMovement() {
        if (this.state.currentState !== 'PLAYING') return;
        this.state.player.move();
    }

    moveProjectiles() {
        this.state.projectiles.player.forEach(projectile => projectile.update());
        this.state.projectiles.enemies.forEach(projectile => projectile.update())
    }

    setupPlayerControls() {
        this.isShooting = false; // Ajout d'un état pour suivre le tir

        const throttledShootProjectile = throttle(() => this.shootProjectile(), GAME_CONFIG.PLAYER.FIRE_RATE);

        this.keyDownHandler = (e) => {
            if (e.key === 'ArrowLeft') {
                this.state.player.direction = -1;
            } else if (e.key === 'ArrowRight') {
                this.state.player.direction = 1;
            } else if (e.key === ' ' && !this.isShooting) {
                this.isShooting = true;
                this.shootingLoop(throttledShootProjectile);
            }
        };

        this.keyUpHandler = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.state.player.direction = 0;
            } else if (e.key === ' ') {
                this.isShooting = false;
            }
        };

        document.addEventListener('keydown', this.keyDownHandler);
        document.addEventListener('keyup', this.keyUpHandler);
    }

    shootProjectile() {
        if (this.state.currentState !== 'PLAYING') return;
        this.state.player.shoot();
    }

    shootingLoop(throttledShootProjectile) {
        if (!this.isShooting) return; // Stoppe la boucle si la touche espace est relâchée
        throttledShootProjectile(); // Utilisation de throttle pour limiter le tir
        setTimeout(() => this.shootingLoop(throttledShootProjectile), GAME_CONFIG.PLAYER.FIRE_RATE);
    }


    // Enemy
    generateEnemies() {
        if (this.state.currentState !== 'PLAYING') return;

        const enemiesContainer = this.ui.enemiesContainer;
        enemiesContainer.innerHTML = '';
        const wave = this.state.wave;

        const baseRows = GAME_CONFIG.ENEMIES.ROWS;
        const extraRows = Math.floor((wave - 1) / 5);
        const rows = baseRows + extraRows;
        const cols = GAME_CONFIG.ENEMIES.COLS;
        const totalHeight = rows * GAME_CONFIG.ENEMIES.HEIGHT;

        enemiesContainer.style.top = "0px";
        this.state.enemies = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * GAME_CONFIG.ENEMIES.WIDTH;
                const y = GAME_CONFIG.ENEMIES.START_Y + row * GAME_CONFIG.ENEMIES.HEIGHT;

                const isSpecial = wave >= GAME_CONFIG.ENEMIES.SPECIAL_START_WAVE && Math.random() < 0.2;
                const health = isSpecial ? GAME_CONFIG.ENEMIES.SPECIAL_HEALTH : GAME_CONFIG.ENEMIES.HEALTH;

                let enemy;
                if (Math.random() < 0.1) {  // 10% de chance d'être un kamikaze
                    enemy = new KamikazeEnemy(x, y, 1, isSpecial);
                } else {
                    enemy = new Enemy(x, y, health, isSpecial);
                }

                this.state.enemies.push(enemy);
            }
        }

        enemiesContainer.style.width = `${cols * GAME_CONFIG.ENEMIES.WIDTH}px`;
        enemiesContainer.style.left = `${(this.ui.gameContainer.offsetWidth - enemiesContainer.offsetWidth) / 2}px`;
        enemiesContainer.style.height = `${totalHeight}px`;
    }

    moveEnemies() {
        if (this.state.currentState !== 'PLAYING') return;

        const containerWidth = this.ui.gameContainer.offsetWidth;
        let directionChanged = false;

        let leftmostX = Infinity;
        let rightmostX = -Infinity;

        this.state.enemies.forEach(enemy => {
            leftmostX = Math.min(leftmostX, enemy.x);
            rightmostX = Math.max(rightmostX, enemy.x + GAME_CONFIG.ENEMIES.WIDTH);
        });

        const newLeftmostX = leftmostX + (this.state.enemySpeed * this.state.enemiesDirection);
        const newRightmostX = rightmostX + (this.state.enemySpeed * this.state.enemiesDirection);

        if (newRightmostX >= containerWidth || newLeftmostX <= 0) {
            directionChanged = true;
        }
        const playerX = this.state.player.x;
        const playerY = this.state.player.y;

        this.state.enemies.forEach(enemy => {
            if (enemy instanceof KamikazeEnemy) {
                enemy.moveTowardsPlayer(playerX, playerY);
            } else {
                if (directionChanged) {
                    enemy.move(0, GAME_CONFIG.ENEMIES.STEP_DOWN);
                } else {
                    enemy.move(this.state.enemySpeed * this.state.enemiesDirection, 0);
                }
            }
        });

        if (directionChanged) {
            this.state.enemiesDirection *= -1;
            this.state.enemySpeed += 0.1;
        }
    }

    updateEnemiesContainerSize() {
        if (this.state.enemies.length === 0) return;

        let leftmostX = Infinity;
        let rightmostX = -Infinity;
        let topmostY = Infinity;
        let bottommostY = -Infinity;

        this.state.enemies.forEach(enemy => {
            leftmostX = Math.min(leftmostX, enemy.x);
            rightmostX = Math.max(rightmostX, enemy.x + GAME_CONFIG.ENEMIES.WIDTH);
            topmostY = Math.min(topmostY, enemy.y);
            bottommostY = Math.max(bottommostY, enemy.y + GAME_CONFIG.ENEMIES.HEIGHT);
        });

        const newWidth = rightmostX - leftmostX;
        const newHeight = bottommostY - topmostY;

        this.ui.enemiesContainer.style.width = `${newWidth}px`;
        this.ui.enemiesContainer.style.height = `${newHeight}px`;
    }

    startEnemyShooting() {
        if (this.state.currentState !== 'PLAYING') return;

        const shootRandomEnemy = () => {
            const enemies = this.state.enemies;
            if (enemies.length === 0) return;

            // Choisir un ennemi au hasard
            const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
            randomEnemy.shoot();
        };

        // Démarrer les tirs à intervalles réguliers
        this.enemyShootingInterval = setInterval(shootRandomEnemy, 500);  // Tir toutes les 500ms
    }

    // Pour arrêter les tirs
    stopEnemyShooting() {
        clearInterval(this.enemyShootingInterval);
    }


    // Wave
    startNextWave() {
        if (this.state.waveTransition) return;
        this.state.waveTransition = true;
        this.state.wave += 1;
        updateWaveDisplay();

        this.state.enemySpeed = GAME_CONFIG.ENEMIES.SPEED

        if (this.state.wave >= GAME_CONFIG.ENEMIES.SPECIAL_START_WAVE) {
            GAME_CONFIG.ENEMIES.HEALTH = GAME_CONFIG.ENEMIES.SPECIAL_HEALTH;
        }

        const cinematic = this.cinematic;
        cinematic.createEvent(`waveIntro${this.state.wave}`, CinematicEventType.PLAYER, {
            duration: 2000,
            text: `Wave ${this.state.wave} Incoming!`,
            className: 'cut-scene',
            backgroundImage: 'css/885542.png'
        });

        cinematic.createEvent(`waveBriefing${this.state.wave}`, CinematicEventType.PLAYER, {
            duration: 3000,
            text: `Prepare for stronger enemies!`,
            className: 'cut-scene',
            backgroundImage: 'css/885542.png'
        });

        if (this.state.wave % 2 === 0) {
            cinematic.createEvent(`waveSpecial${this.state.wave}`, CinematicEventType.PLAYER, {
                duration: 3000,
                text: `Special enemies appear every 5 waves!`,
                className: 'cut-scene-special',
                backgroundImage: 'css/HD-wallpaper-artistic-pixel-art-space-moon.jpg'
            });
        }

        cinematic.playSequence([`waveIntro${this.state.wave}`, `waveSpecial${this.state.wave}`, `waveBriefing${this.state.wave}`])
            .then(() => {
                this.state.waveTransition = false;
                this.generateEnemies();
            })
            .catch(error => {
                console.error('Wave cinematic failed:', error);
                this.state.waveTransition = false;
                this.generateEnemies();
            });
    }

    async leaderBoard() {
        this.hideAllScreens();
        document.getElementById('player-score-list').innerHTML = ''
        const scores = await this.api.getScore()
        const sortedScore = scores.sort((a, b) => b.score - a.score)
        sortedScore.forEach(score => createLeaderBoard(score))
        this.ui.leaderBoard.classList.remove('hidden')
    }

    async postScore() {
        const playerName = document.getElementById('finalPlayerName').value.trim()
        const data = {
            username: playerName,
            score: this.state.score,
            date: new Date().toLocaleDateString("fr-FR")
        }
        if (await this.api.postScore(data)) {
            this.showMainMenu();
        }
    }
}