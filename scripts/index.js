import { Ring } from "./ring.js";
import { Player } from "./player.js";
import { Floor } from "./floor.js";
import * as UTILS from "./utils.js";
import { Collider } from "./gravity.js";
import { initialSetup } from "./setup.js";

const player = new Player("rig", "camera");
const start = new Floor("start");
const ground = new Floor("ground");

/**
 * The settings for the game.
 * Controls are handled in './controls.js'
 */
const gameSettings = {
    isPaused: false,
    isGameOver: false,
};

// Ok start collider
player.collider = new Collider("rig", "sky-dive-collider");
player.collider.listen();

setTimeout(() => {
   initialSetup(100, 300);
}, 100);

// Listen to a key event
document.addEventListener("keydown", (e) => {
    // Check if the key is the spacebar
    if (e.key === "r") {
        resetButton(false);
    }
});
// Set listener on abuttondown
document.addEventListener('abuttondown', (e) => {
    resetButton(false);
});

const resetButton = (keepPoints) => {
    // Reset the player
    player.reset(keepPoints);
    // Loop through all rings and destroy them
    let rings = document.getElementsByClassName("rings");

    for (let i = 0; i < rings.length; i++) {
        UTILS.removeFromScene(rings[i]);
    }

    let pos = start.getPosition();
    if (keepPoints) {
        pos.y += 20;
    }

    Floor.createFloors(pos.y);
    Ring.createRings(pos.y);

    // Listen again dog
    player.collider.stopColliding();
    player.collider.listen();
}

export { player, start, resetButton, gameSettings, ground };