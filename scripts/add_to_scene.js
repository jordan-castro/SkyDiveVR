/**
 * Add a A-Frame element to a a-scene.
 */
const addToScene = (el) => {
    // Get the scene
    let scene = document.querySelector("a-scene");
    scene.appendChild(el);
}

export { addToScene };