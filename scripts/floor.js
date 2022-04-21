import { addToScene } from './add_to_scene.js';
import { ground } from './index.js';
import * as UTILS from './utils.js';

/**
 * Handles the platforms for the player to stand on.
 */
class Floor extends UTILS.PositionHelper {
    constructor(id) {
        super(id, false);
        
        // Get all its attributes
        this.attributes = this.el.attributes;
        this.tagName = this.el.tagName.toLowerCase();
        // Whether or not the elemnt is currently present in the scene
        this.isThere = true;
    }

    /**
     * Remove
    */
    remove() {
        this.el.remove();
        this.isThere = false;
    }

    /**
     * Create a floor, and add to the scene before returning it.
     * 
     * @param {string} id 
     * @param {double} width 
     * @param {doubl} height 
     * @param {string} color
     *  
     * @returns {Floor}
     */
    static create(id, width, height, color) {
        // Create a new element
        let element = document.createElement("a-entity");
        // Set the ID so that we can add attributes to it
        element.setAttribute("id", id);
        // The attributes
        let attributes = {
            "class": "sky-dive-collider",
            "rotation": "-90 0 0",
            // Width and height must be set twice.
            // Once as a seperate attribute, and once as a property.
            "width": width,
            "height": height,
            "geometry": "primitive: box; width: " + width + "; height: " + height,
            "color": color,
        };

        // Set the attributes
        for (let attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }

        addToScene(element);

        return new Floor(id);
    }

    /**
     * Create a number of Floors (Platforms on the map)
     */
    static createFloors(height) {
        // For every 100 distance create a flooor
        let amount = height / 100;

        let width = ground.attributes['width'].value;
        let xScale = ground.el.object3D.scale.x;
        let zScale = ground.el.object3D.scale.z;
        let widthX = width * xScale + 1;
        let widthZ = width * zScale + 1;
        
        let corners = [
            {x: -widthX / 2, z: -widthZ / 2},
            {x: -widthX / 2, z: widthZ / 2},
            {x: widthX / 2, z: widthZ / 2},
            {x: widthX / 2, z: -widthZ / 2},
        ];

        for (let i = 0; i < amount; i++) {
            // The floors must stay within the range
            let corner = corners[Math.floor(Math.random() * corners.length)];
            // There should be a distance between of 100.
            let pos = `${corner.x} ${i * 100 + 100} ${corner.z}`;
            // Create the floor
            let floor = Floor.create("floor-" + (i + 1), 4, 4, "#ffffff");
            // Set position
            floor.setPosition(pos);
        }
    }
}

export {
    Floor
}