import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Textures
const textureLoader = new THREE.TextureLoader();
const doorColor = textureLoader.load("./textures/door/color.jpg");
const doorAlpha = textureLoader.load("./textures/door/alpha.jpg");
const ambientOcclusion = textureLoader.load("./textures/door/ambientOcclusion.jpg");
const height = textureLoader.load("./textures/door/height.jpg");
const normal = textureLoader.load("./textures/door/normal.jpg");

// Environment
const rgbeloader = new RGBELoader();
rgbeloader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping; 
    scene.background = environmentMap;
    scene.environment = environmentMap;
});

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = -10;
material.metalness = 1;
material.side = THREE.DoubleSide;
material.color.set(0xff0000); // Set color to red

// Helper Functions for Heart Shape
const makeHeartShape = (b = 9, mb = 0.75, sx = 2.5, sy = 2.5) => {
    const shape = new THREE.Shape();
    shape.moveTo(sx, sy);
    shape.bezierCurveTo(sx, sy, 2, 0, 0, 0);
    shape.bezierCurveTo(-3, 0, -3, 3, -3, 3);
    shape.bezierCurveTo(-3, 5, -1, b * mb, 2, b);
    shape.bezierCurveTo(6, b * mb, 8, 5, 8, 3);
    shape.bezierCurveTo(8, 3, 8, 0, 5, 0);
    shape.bezierCurveTo(3, 0, sx, sy, sx, sy);
    return shape;
};

const makeHeartGeo = (b = 9, mb = 0.75, sx = 2.5, sy = 2.5, extrudeSettings = { depth: 1.5, bevelEnabled: false, steps: 2 }) => {
    const shape = makeHeartShape(b, mb, sx, sy);
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(Math.PI * 1);
    geometry.center();
    return geometry;
};

// Create heart meshes
const createHeartMesh = (positionY) => {
    const geometry = makeHeartGeo();
    const heartMesh = new THREE.Mesh(geometry, material);
    const scale = 0.16;
    heartMesh.scale.set(scale, scale, scale);
    heartMesh.position.x = positionY;
    return heartMesh;
};

// Add heart meshes to the scene
const heartMesh1 = createHeartMesh(0);
const heartMesh2 = createHeartMesh(1.5);
const heartMesh3 = createHeartMesh(-1.5);

scene.add(heartMesh1);
//scene.add(heartMesh2);
//scene.add(heartMesh3);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    heartMesh1.rotation.y = elapsedTime * 1;
    heartMesh2.rotation.y = elapsedTime * 0.3;
    heartMesh3.rotation.y = elapsedTime * 0.3;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
