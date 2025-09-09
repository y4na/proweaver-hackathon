document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('start-game-button');

    if (startGameButton) {
        startGameButton.addEventListener('click', () => {
            window.location.href = 'game.html';
        });
    }
});