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
    const wave = document.getElementById('wave');
    wave.textContent = message;
    waveMessage.textContent = message;
    waveMessage.style.display = "block";

    setTimeout(() => {
        waveMessage.style.display = "none";
    }, 4500);
}


export function updateLivesDisplay() {
    document.getElementById("livesDisplay").textContent = `❤️ x ${window.gameState.lives}`;
}

export function updateScoreDisplay() {
    document.getElementById('scoreDisplay').textContent = `Score : ${window.gameState.score}`;
}