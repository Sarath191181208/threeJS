
import * as THREE from 'three';

import { GUI } from 'dat.gui';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// ############## Boilerplate ##############

const scene = new THREE.Scene();

// #### GUI ##### 
const gui = new GUI();

// #### Texture loader ####
const textureLoader = new THREE.TextureLoader();
const wallTextureLight = textureLoader.load('../assets/normal_maps/wallTextureLight.ppm');

// #### Camera ####

const _temp_ar = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(
    75,       // field of view
    _temp_ar, // aspect ratio
    0.1,      // near plane
    1000      // far plane
);
camera.position.z = 30;
camera.position.y = 0;

// #### Renderer ####

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setClearColor("#e5e5e5");
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// #### Controls ####
let controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
};


// #### Resize canvas ####

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// #### Lights ####

const light = new THREE.PointLight(0x4525be, 1, 1000);
light.position.set(10, 10, 10);
scene.add(light);

const light2 = new THREE.PointLight(0xBe2535, 1, 1000);
light2.position.set(-10, 10, 10);
scene.add(light2);


// ############## MAIN ##############

// Objects
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);

// Materials
const stdMaterial = new THREE.MeshStandardMaterial();
stdMaterial.color = new THREE.Color(0xffffff);
stdMaterial.metalness = 0.9;
stdMaterial.roughness = 0.7;
stdMaterial.normalMap = wallTextureLight;

// Meshes
const sphere = new THREE.Mesh(sphereGeometry, stdMaterial);
scene.add(sphere);

// ##############
// #### GUI #####
// ##############

// #### Camera controls #### 
const light1Folder = gui.addFolder('Light 1');
light1Folder.add(light.position, 'x').min(0).max(50).step(0.01);
light1Folder.add(light.position, 'y').min(-50).max(50).step(0.01);
light1Folder.add(light.position, 'z').min(-50).max(50).step(0.01);

const light2Folder = gui.addFolder('Light 2');
light2Folder.add(light2.position, 'x').min(-50).max(0).step(0.01);
light2Folder.add(light2.position, 'y').min(-50).max(50).step(0.01);
light2Folder.add(light2.position, 'z').min(-50).max(50).step(0.01);

light1Folder.open();
light2Folder.open();

// #### Grid controls #### 

// #####################
//##### Render loop ####  
// #####################

const render = () => {
    requestAnimationFrame(render);
    sphere.rotation.y += 0.01;
    sphere.rotation.x += 0.01;
    sphere.rotation.z += 0.01;
    controls.update();
    renderer.render(scene, camera);
}

render();

