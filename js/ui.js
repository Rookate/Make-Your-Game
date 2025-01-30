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