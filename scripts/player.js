// This file holds and handles any player related code.

import * as UTILS from "./utils.js";

/**
 * The player class.
 */
class Player {
    constructor(rigId, cameraId) {
        // Camera and rig are seperate objects
        this.rig = new UTILS.PositionHelper(rigId, false);
        this.camera = new UTILS.PositionHelper(cameraId, false);

        // Global start position which is actually wrong tbh.
        this.startPos = "2 101 0";
        this.points = 0;
        this.collider = null;
    }

    reset(keepPoints) {
        if (keepPoints === false) {
            // If we don't want to keep the points, then reset them and
            // move the player to the start position.
            this.rig.setPosition(this.startPos);
            this.points = 0;
        } else {
            // Only update the Y axis.
            let xAndZ = this.rig.getPosition();
            this.rig.setPosition({x: xAndZ.x, y: this.startPos.y, z: xAndZ.z});
        }
    }

    removePoint() {
        this.points--;
        this.onPointChange();
    }

    addPoint() {
        this.points++;
        this.onPointChange();
    }

    updatePoints(points) {
        this.points = points;
        this.onPointChange();
    }

    onPointChange() {
        // update the text on the a-box
        let pointsEl = document.querySelector("#score-text");
        pointsEl.setAttribute("value", "Points: " + this.points);
    }

    boost() {
        this.collider.velocityIncrement += 0.5;
    }

    slow() {
        this.collider.resetVelocity();
    }
}

export {
    Player
}