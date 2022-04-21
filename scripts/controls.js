import { gameSettings, ground, resetButton, player } from './index.js';

// Set a listener for the q key
document.addEventListener("keydown", (e) => {
    // Check if the key is the spacebar
    if (e.key === "q") {
        if (!gameSettings.isGameOver) {
            quit();
        } else {
            restart();
        }
    } else if (e.key === "p") {
        pauseGame();
    }
});
// VR version of ^^^ Only on Quest 2 ATM.
document.addEventListener('bbuttondown', (e) => {
    if (!gameSettings.isGameOver) {
        quit();
    } else {
        restart();
    }
});

/**
 * Restart the game.
 */
const restart = () => {
    gameSettings.isGameOver = false;
    // Remove collision from the cround
    ground.el.setAttribute('class', ground.el.classList[0]);
    // Reset the player
    resetButton(false);
};

/**
 * Quit the game
 */
const quit = () => {
    gameSettings.isGameOver = true;
    // Set the ground to collide
    let baseClass = ground.el.classList[0];
    // Add collision to the ground
    ground.el.setAttribute("class", baseClass + " " + "sky-dive-collider");
};

/**
 * Pause the game
 */
const pauseGame = () => {
    if (!gameSettings.isPaused) {
        console.log("Ok stop falling");
        // Pause the player
        player.collider.stopColliding();
    } else {
        // Unpause the player
        player.collider.listen();
    }

    // Set to opposite
    gameSettings.isPaused = !gameSettings.isPaused;
};