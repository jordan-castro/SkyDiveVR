/**
 * Convert a position object to a readable string. 
 * 
 * @param {object} position 
 */
 const getReadablePosition = (position) => {
    return `${position.x} ${position.y} ${position.z}`;
};

/**
 * Convert a readable string to a position object.
 * 
 * @param {string} position
 * 
 * @returns {object}
 */
const getPositionFromString = (position) => {
    // Split the string by " "
    const positionArray = position.split(' ');
    // Return an object with the x, y, and z values.
    return {
        x: parseFloat(positionArray[0]),
        y: parseFloat(positionArray[1]),
        z: parseFloat(positionArray[2]),
        isVector3: true
    };
};

/**
 * Remove something from the dom
 */
const removeFromScene = (el) => {
    if (typeof el === "sring") {
        el = document.querySelector(`#${el}`);
    }
    el.remove();
};

/**
 * Class that gives access to the Position of an entity.
 */
class PositionHelper {
    constructor(id, isDynamic) {
        this.el = document.querySelector(`#${id}`);
        this._isDynamic = isDynamic;
        this.isCurrentlyDynamic = isDynamic;

        this.dynamicString = null;
    }

    /**
     * Get the current position of the entity.
     * 
     * @returns {object}
     */
    getPosition() {
        return this.el.object3D.position;
    }

    /**
     * Set the position of the entity.
     * 
     * @param {string | object} position
     */
    setPosition(position) {
        // Disable if needed
        if (this._isDynamic) {
            this.disableDynamicPhysics();
        }
        // Check if the position is a string
        let pos = typeof position === "string" ? getPositionFromString(position) : position;

        this.el.object3D.position.set(pos.x, pos.y, pos.z);
        // Enable if needed
        if (this._isDynamic) {
            this.enableDynamicPhysics();
        }
    }

    /**
     * Disable dynamic-body
     */
    disableDynamicPhysics() {
        this.el.removeAttribute('dynamic-body');
        this.isCurrentlyDynamic = false;
    }

    /**
     * Enable dynamic-body
     */
    enableDynamicPhysics() {
        this.el.setAttribute('dynamic-body', this.dynamicString);
        this.isCurrentlyDynamic = true;
    }
}

/**
 * Convert Hex to RGB.
 */
const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const generateRandom = (min, max) => {

    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor( rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
}


export { getReadablePosition, getPositionFromString, PositionHelper, removeFromScene, hexToRgb, generateRandom };