// This file handles the custom Aframe components for the application.

import { Ring, nameToRingType } from "./ring.js";
import { resetButton, gameSettings } from "./index.js";

// Collide with the rings!
AFRAME.registerComponent('ring-collider', {
    init: function () {
        console.log("ring-collider");
        this.el.addEventListener('hitclosest', (e) => {
            // Check that the id has "ring" in it
            if (e.detail.el.id.includes("ring")) {
                // Get the ring type
                let ringType = nameToRingType(e.detail.el.id);
                let ring = new Ring(e.detail.el.id, ringType);
                ring.onCollideWithPlayer();
            }
        });
    },
});

// Stay above the bottom "#ground"
AFRAME.registerComponent('above-bottom', {
    init: function () {
        this.data.el = this.el;
    },

    tick: function (time, timeDelta) {
        // Check that the Y of the element is above 0
        if (this.data.el.object3D.position.y < 0) {
            // Reset the world.
            // If the game is over, then we want to reset the players score and place the player back at the start.
            resetButton(!gameSettings.isGameOver);
        }
    }
});

// Handles collision with the ring/player
document.querySelector("#camera").setAttribute("ring-collider", "");
document.querySelector("#rig").setAttribute("above-bottom", "");