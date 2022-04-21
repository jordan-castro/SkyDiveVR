// This script handles Gravity in our SkyDive game.
import * as UTILS from './utils.js';

const Gravity = -9.8;

/**
 * Global time for deltatime.
 */
var lastTime = Date.now();

/**
 * Get delta time.
 */
const getDeltaTime = () => {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    lastTime = now;
    
    return dt;
};

/**
 * Calcualte velocity.
 */
const calculateVelocity = (acceleration, dt) => {
    return acceleration * dt;
};

/**
 * Class that adds gravity to an object.
 */
class AddGravity extends UTILS.PositionHelper {
    constructor(id) {
        super(id, false);

        // Set the acceleration
        this.acceleration = new THREE.Vector3(0, -Gravity, 0);
        /**
         * The current velocity
         */
        this.velocity = new THREE.Vector3(0, 0, 0);
        /**
         * Whether or not the object is currently accelerating.
         */
        this.isAccelerating = false;
        /**
         * The intervalId so that we can clear it later.
         */
        this.intervalId = null;
        /**
         * The increment starts at 0.1 and is constantly incremented by 0.001.
         */
        this.velocityIncrement = 0.1;
    }

    /**
     * Set the acceleration.
     */
    setAcceleration(acceleration) {
        this.acceleration.y = -acceleration;
    }

    /**
     * Update the position of the object.
     */
    updatePosition() {
        // Get the delta time
        let dt = getDeltaTime();

        // Calculate the velocity and set velocity
        this.velocity = calculateVelocity(this.acceleration.y, dt) + this.velocityIncrement;
        // Add to the velocity increment
        this.velocityIncrement += 0.001;

        // Get the current position
        let currentPosition = this.getPosition();

        // Calculate the new position
        let newPosition = new THREE.Vector3(currentPosition.x, currentPosition.y - this.velocity, currentPosition.z);

        // Set the new position
        this.setPosition(newPosition);
    }

    /**
     * Function to start accelerating the object.
     */
    start() {
        if (this.isAccelerating === false) {
            this.isAccelerating = true;
            this._accelerate();
        }
    }

    /**
     * stop accelerating the object.
     */
    stop() {
        this.isAccelerating = false;
        // this.velocityIncrement = 0.1;
        // Clear the interval
        clearInterval(this.intervalId);
    }

    /**
     * Accelerate the object.
     */
    _accelerate() {
        this.intervalId = setInterval(() => {
            if (this.isAccelerating === true) {
                this.updatePosition();
            }
        }, 10);
    }
}

/**
 * Class for collisions
 */
class Collider extends AddGravity {
    constructor(id, collidesWith) {
        super(id);

        this.colliderClass = collidesWith;
        this.colliderInterval = null;
    }

    /**
     * Check if we are colliding with another collider.
     */
    listen() {
        this.colliderInterval = setInterval(() => {
            // Get all the element of colliders
            this.colliders = document.getElementsByClassName(this.colliderClass);

            // Check if we touching any collider
            for (let i = 0; i < this.colliders.length; i++) {
                // Range of the collider
                let colliderRange = this.getColliderRange(this.colliders[i]);
                if (this.isInRange(colliderRange)) {
                    // Stop the player
                    this.stop();
                } else {
                    // Start that jaunt dog
                    this.start();
                }
            }
        }, 10);
    }

    /**
     * Get the range of the collider.
     */
    getColliderRange(element) {
        // Range comes from width * scale and height / 2
        let collider = element.getAttribute('position');

        // Get the width and height from the elements attributes
        let width = element.getAttribute('width');
        let height = element.getAttribute('height');
        // Scale is globally available
        let scale = element.object3D.scale;

        let range = {
            x: {
                min: collider.x - (width / 2) * scale.x,
                max: collider.x + (width / 2) * scale.x
            },
            y: {
                min: collider.y - (height / 2),
                max: collider.y + (height / 2)
            },
            z: {
                min: collider.z - (width / 2) * scale.z,
                max: collider.z + (width / 2) * scale.z
            }
        };

        return range;
    }
    
    /**
     * Get our range
     */
    getRange() {
        return this.getColliderRange(this.el);
    }

    /**
     * Check if we are in the bounds of a range
     */
    isInRange(range) {
        // Get our range
        let ourRange = this.getRange();

        // Check if we are in the range
        // Basically checks that we are in the x, y, and z range.
        if (ourRange.x.min < range.x.max && ourRange.x.max > range.x.min &&
            ourRange.y.min < range.y.max && ourRange.y.max > range.y.min &&
            ourRange.z.min < range.z.max && ourRange.z.max > range.z.min) {
            return true;
        }

        // We are not in the range
        return false;
    }

    /**
     * Stop colliding with another collider.
     */
    stopColliding() {
        clearInterval(this.colliderInterval);
        this.stop();
    }

    /**
     * Reset the velocity.
     */
    resetVelocity() {
        this.velocityIncrement = 0.001;
        this.velocity = new THREE.Vector3(0, 0, 0);
    }
}

export {
    Collider
}

// TODO Add to velocity as element falls.