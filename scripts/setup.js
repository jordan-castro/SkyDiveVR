import { Floor } from "./floor.js";
import { player, start } from "./index.js";
import { Ring } from "./ring.js"; 

/**
 * Setup the VR scene.
 */
const initialSetup = (min, max) => {
    // Find a random value between min and max.
    // This will be used to place the player.
    const value = Math.floor(Math.random() * (max - min + 1)) + min;

    // Set the position of the platform
    start.setPosition(`2 ${value + 100} 0`);
    // Set the player position
    player.rig.setPosition(start.getPosition());
    // Ohhhh this is where Player().startPos is set.
    player.startPos = start.getPosition();

    // Create the stopForms (Platforms)
    Floor.createFloors(value);
    // Create the rings
    Ring.createRings(value);
};

export { initialSetup };
