// let lastTime = performance.now();
// let frameCount = 0;
// let fpsDisplay = document.createElement("div");
// fpsDisplay.style.position = "absolute";
// fpsDisplay.style.top = "10px";
// fpsDisplay.style.left = "10px";
// fpsDisplay.style.color = "white";
// document.body.appendChild(fpsDisplay);

// function updateFPS() {
//     let now = performance.now();
//     frameCount++;

//     if (now - lastTime >= 1000) { // Toutes les 1 seconde
//         fpsDisplay.textContent = `FPS: ${frameCount}`;
//         frameCount = 0;
//         lastTime = now;
//     }

//     requestAnimationFrame(updateFPS);
// }

// requestAnimationFrame(updateFPS);

let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns // 32 x 16
let boardHeight = tileSize * rows // 32 x 16


// Player de taille 64 par 32
let playerWidth = tileSize * 2;
let playerHeight = tileSize;
let playerHp = 3

// --- Position du player dans la grid --- 
let playerX = tileSize * columns / 2 - tileSize // 32 x 8 - 32 = 224 
let playerY = tileSize * rows - tileSize * 2; // 32 x 16 - 32 x 2 = 448
// Player object
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight,
    pv: playerHp
}
let speed = 20
let playerSprite;
let playerVelocityX = 1 * speed // vitesse de déplacement


// Invaders
let invaders = [];
let invaderWidth = tileSize * 2;
let invaderHeight = tileSize;
let invaderX = tileSize
let invaderY = tileSize;
let invadersRows = 3
let invaderImg
let invaderColumns = 4
let invaderCount = 0
let invaderVelocityX = 1;

// Bonus 
let bonusInvaderRed = {
    x: invaderX - 100,
    y: invaderY,
    width: tileSize * 2,
    height: tileSize,
    alive: true,
}

// Shoot
let shoots = [];
let shootVelocityY = -10; // tir vers le haut (inverser la vitesse)

// Shoot
let shootsInvaders = [];
let shootInvadersVelocityY = 5; // tir vers le bas

let score = 0
let scoreBoard;
let gameOver = false;


// Explosion
let explosions = [];

// Point 
let points = []

window.onload = function () {
    const gameBoard = document.getElementById("gameBoard");

    // Créer et ajouter le joueur
    player.element = document.createElement("div");
    player.element.classList.add("player");
    gameBoard.appendChild(player.element);
    updateElementPosition(player);

    bonusInvaderRed.element = document.createElement("div")
    bonusInvaderRed.element.classList.add("bonus-red");
    console.log(bonusInvaderRed)
    gameBoard.appendChild(bonusInvaderRed.element);
    updateElementPosition(bonusInvaderRed);

    createInvaders();

    requestAnimationFrame(update);

    document.addEventListener("keydown", PlayerMovement);
    document.addEventListener("keyup", Shoot);

    invaderShootingInterval = setInterval(ShootByInvader, 1000);

    scoreBoard = document.createElement("div");
    scoreBoard.classList.add("score");
    scoreBoard.textContent = "Score: " + score;
    gameBoard.appendChild(scoreBoard);

};

function updateElementPosition(obj) {
    obj.element.style.left = obj.x + "px";
    obj.element.style.top = obj.y + "px";
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    moveBonusInvader();

    invaders.forEach(invader => {
        if (invader.alive) {
            invader.x += invaderVelocityX;

            if (invader.x + invader.width >= boardWidth || invader.x <= 0) {
                invaderVelocityX *= -1;
                invader.x += invaderVelocityX * 2;

                for (let i = 0; i < invaders.length; i++) {
                    invaders[i].y += invaderHeight;
                    updateElementPosition(invaders[i]);
                }
            }
            updateElementPosition(invader);
            if (invader.y >= player.y) {
                gameOver = true;
            }
        }
    });

    shoots.forEach(shoot => {
        shoot.y += shootVelocityY;
        updateElementPosition(shoot);
        if (shoot.y < 0) {
            shoot.used = true;
            shoot.element.remove();
        }

        invaders.forEach(invader => {
            if (!shoot.used && invader.alive && Collision(shoot, invader)) {
                shoot.used = true;
                shoot.element.remove();
                invader.alive = false;
                scoreBoard.textContent = "Score: " + score;
                invader.element.remove();
                createExplosion(invader.x, invader.y);
                showPoints(invader.x + 30, invader.y + 30, "25")
                score += 25;
                invaderCount--;
            }
        });

        if (!shoot.used && bonusInvaderRed.alive && Collision(shoot, bonusInvaderRed)) {
            shoot.used = true;
            shoot.element.remove();
            bonusInvaderRed.alive = false;
            bonusInvaderRed.element.remove();
            createExplosion(bonusInvaderRed.x, bonusInvaderRed.y)
            showPoints(bonusInvaderRed.x, bonusInvaderRed.y, "350")
            score += 350;
        }
    });

    shootsInvaders.forEach(shoot => {
        shoot.y += shootInvadersVelocityY
        updateElementPosition(shoot);

        if (shoot.y > boardHeight) {
            shoot.used = true;
            shoot.element.remove();
        }
        console.log(player.pv)
        if (!shoot.used && player.pv > 0 && Collision(shoot, player)) {
            shoot.used = true;
            shoot.element.remove();
            player.pv--;
        }
    })

    if (player.pv === 0) {
        gameOver = true;
        clearInterval(invaderShootingInterval);
    }

    shoots = shoots.filter(shoot => !shoot.used && shoot.y > 0);
    if (invaderCount === 0) {
        invaders = [];
        shoots = [];
        invaderVelocityX += 2
        createInvaders();
    }
}

function PlayerMovement(e) {
    if (gameOver) return;
    if (e.key === "ArrowLeft" && player.x - playerVelocityX >= 0) {
        player.x -= playerVelocityX;
    } else if (e.key === "ArrowRight" && player.x + playerVelocityX + player.width <= boardWidth) {
        player.x += playerVelocityX;
    }
    updateElementPosition(player);
}

function createInvaders() {
    const gameBoard = document.getElementById("gameBoard");

    for (let i = 0; i < invaderColumns; i++) {
        for (let j = 0; j < invadersRows; j++) {
            let invader = {
                x: invaderX + i * invaderWidth,
                y: invaderY + j * invaderHeight,
                width: invaderWidth,
                height: invaderHeight,
                alive: true,
                element: document.createElement("div")
            };
            invader.element.classList.add("invader");
            gameBoard.appendChild(invader.element);
            updateElementPosition(invader);
            invaders.push(invader);
        }
    }
    invaderCount = invaders.length;
}

function Shoot(e) {
    if (gameOver) return;
    if (e.code == "Space") {
        const gameBoard = document.getElementById("gameBoard");

        let shoot = {
            x: player.x + playerWidth * 15 / 32,
            y: player.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false,
            element: document.createElement("div")
        };

        shoot.element.classList.add("shoot");
        gameBoard.appendChild(shoot.element);
        updateElementPosition(shoot);
        shoots.push(shoot);
    }
}
function ShootByInvader() {
    // Vérifie d'abord s'il reste des invaders vivants
    const aliveInvaders = invaders.filter(invader => invader.alive);
    if (aliveInvaders.length === 0) return;

    const gameBoard = document.getElementById("gameBoard");
    let shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];

    let shootInvaders = {
        x: shooter.x + invaderWidth / 2,
        y: shooter.y + invaderHeight,
        width: tileSize / 8,
        height: tileSize / 2,
        used: false,
        element: document.createElement("div")
    };

    shootInvaders.element.classList.add("shoot");
    gameBoard.appendChild(shootInvaders.element);
    updateElementPosition(shootInvaders);
    shootsInvaders.push(shootInvaders);
}

function Collision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function moveBonusInvader() {
    if (!bonusInvaderRed.alive) return;
    setTimeout(() => {
        bonusInvaderRed.x += 2;
    }, 10000)


    if (bonusInvaderRed.x > boardWidth) {
        bonusInvaderRed.x = -bonusInvaderRed.width;
        setTimeout(() => {
            bonusInvaderRed.x = 0;
            bonusInvaderRed.alive = true;
        }, 10000);
    }

    updateElementPosition(bonusInvaderRed);
}

function createExplosion(x, y) {
    const gameBoard = document.getElementById("gameBoard");

    let explosion = {
        x: x,
        y: y,
        width: tileSize * 2,
        height: tileSize * 2,
        element: document.createElement("div")
    };

    explosion.element.classList.add("explosion");
    gameBoard.appendChild(explosion.element);
    updateElementPosition(explosion);

    // Supprime l'explosion après 500 ms
    setTimeout(() => {
        explosion.element.remove();
    }, 100);
}

function showPoints(x, y, amount) {
    const gameBoard = document.getElementById("gameBoard");

    let point = {
        x: x,
        y: y,
        width: tileSize * 2,
        height: tileSize * 2,
        element: document.createElement("div")
    };

    point.element.classList.add("point");

    point.element.textContent = "+" + amount;

    gameBoard.appendChild(point.element);
    updateElementPosition(point);




    // Supprime le texte après 500 ms
    setTimeout(() => {
        point.element.remove();
    }, 300);
}
