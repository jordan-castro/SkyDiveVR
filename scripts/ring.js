import * as UTILS from "./utils.js";
import { player, ground } from "./index.js";
import { addToScene } from "./add_to_scene.js";

/**
 * Holds all the ring types.
 */
const RingType = {
    Point: 1,
    Boost: 2,
    Slow: 3,
};

/**
 * Get the name of a ring type.
 */
const ringTypeToName = {
    [RingType.Point]: "point",
    [RingType.Boost]: "boost",
    [RingType.Slow]: "slow"
};

/**
 * Convert a name to a ring type.
 */
const nameToRingType = (name) => {
    if (name.includes(ringTypeToName[RingType.Point])) {
        return RingType.Point;
    } else if (name.includes(ringTypeToName[RingType.Boost])) {
        return RingType.Boost;
    } else if (name.includes(ringTypeToName[RingType.Slow])) {
        return RingType.Slow;
    }

    return null;
};

/**
 * A class for a Ring
 */
class Ring extends UTILS.PositionHelper {
    constructor(id, ringType) {
        super(id, false);

        this.ringType = ringType;
        // Put in the correct attributes
        this.setup();
    }

    /**
     * Setup the ring with its attributes.
     */
    setup() {
        let gltfModel;
        
        switch (this.ringType) {
            case RingType.Point:
                gltfModel = "point-ring";    
                break;
            case RingType.Boost:
                gltfModel = "boost-ring";
                break;
            case RingType.Slow:
                gltfModel = "slow-ring";
                break;
        }

        this.el.setAttribute('class', 'rings');
        this.el.setAttribute('gltf-model', '#' + gltfModel);
        this.el.setAttribute('scale', '0.5 0.5 0.5');
    }   

    /**
     * Once colliding with the player, the ring is destroyed.
     */
    onCollideWithPlayer() {
        // Remove the ring
        this.el.remove();

        switch (this.ringType) {
            case RingType.Point:
                break;
            case RingType.Boost:
                player.boost();
                break;
            case RingType.Slow:
                player.slow();
                break;
        }

        // Add point to Player
        player.addPoint();
    }

    /**
     * Create a ring without a ID.
     */
    static create(id, ringType) {
        // Create a new a-element in the scene with the id
        let r = document.createElement("a-entity");
        r.setAttribute("id", id);
        // Add the ring to the scene
        addToScene(r);
        return new Ring(id, ringType);
    }

    /**
     * Create a number of rings, the position of the rings is random.
     */
    static createRings(height) {
        // Hold all ring positions in an array
        let maxDistanceBetween = height / 10;
        let amount = height / maxDistanceBetween;
        let distanceBetween = height / amount;

        // To get the width and scale of an object
        let width = ground.attributes['width'].value;
        let widthX = width * ground.el.object3D.scale.x + 1;
        let widthZ = width * ground.el.object3D.scale.z + 1;
        let position = ground.getPosition();

        let values = {
            x: {
                min: position.x - widthX / 2,
                max: position.x + widthX / 2
            },
            z: {
                min: position.z - widthZ / 2,
                max: position.z + widthZ / 2
            }
        };

        // Loop through the amount
        for (let i = 0; i < amount; i++) {
            // The values to get a random position
            let start = distanceBetween * i;
            let end = start + distanceBetween;

            let x = UTILS.generateRandom(values.x.min, values.x.max);
            // For y use start and end
            let y = Math.floor(Math.random() * (end - start + 1)) + start;
            let z = UTILS.generateRandom(values.z.min, values.z.max);

            // Add 5 to the Y if we are the first one
            if (i == 0) {
                y += 5;
            }

            let position = `${x} ${y} ${z}`;

            // Choose a random ring type
            let ringTypes = Object.values(RingType);
            let ringType = ringTypes[Math.floor(Math.random() * ringTypes.length)];

            // The id comes from the type of ring and which iteration we are on.
            let id = `${ringTypeToName[ringType]}-ring-` + (i + 1);
            let ring = Ring.create(id, ringType);
            // Set the ring pos
            ring.setPosition(position);
        }
    }

}

export { Ring, RingType, ringTypeToName, nameToRingType };