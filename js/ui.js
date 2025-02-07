export function displayEndMessage(message) {
    const endMessageElement = document.getElementById('endMessage');
    const messageTextElement = document.getElementById('endMessageText');
    const restartButton = document.getElementById('restartButton');

    messageTextElement.textContent = message;
    endMessageElement.style.display = 'block';

    restartButton.addEventListener('click', () => {
        location.reload();
    });
}

export function displayWaveMessage(message) {
    const waveMessage = document.getElementById("waveMessage");
    waveMessage.textContent = message;
    waveMessage.style.display = "block";

    setTimeout(() => {
        waveMessage.style.display = "none";
    }, 4500);
}

export function updateWaveDisplay() {
    const wave = document.getElementById('wave');
    wave.textContent = `wave : ${window.gameState.wave}`;
}

export function updateLivesDisplay() {
    document.getElementById("livesDisplay").textContent = `❤️ x ${window.gameState.player.lives}`;
}

export function updateScoreDisplay() {
    document.getElementById('scoreDisplay').textContent = `Score : ${window.gameState.score}`;
}

export function createProjectileElement(damage) {
    const projectile = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    projectile.setAttribute("width", "10");
    projectile.setAttribute("height", "30");
    projectile.setAttribute("viewBox", "0 0 10 30");
    projectile.classList.add("bullet");

    const colors = {
        1: "red",     // Dégâts de base
        2: "yellow",  // Boost 1
        3: "blue",  // Boost 2
    };

    const color = colors[damage] || "white";

    projectile.innerHTML = `
        <rect x="3" y="0" width="4" height="30" fill="${color}" />
        <rect x="2" y="5" width="6" height="20" fill="${color}" />
        <rect x="1" y="10" width="8" height="10" fill="${color}" />
    `;

    return projectile;
}

export function displayBonus(x, y, type) {
    const msg = document.createElement('div');
    msg.classList.add('bonus-msg');
    msg.textContent = type;
    msg.style.top = `${y}px`;
    msg.style.left = `${x}px`;

    const gameContainer = document.getElementById('gameContainer');
    gameContainer.appendChild(msg)

    return msg
}