
import * as THREE from 'three';

import {GUI} from 'dat.gui';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// ############## Boilerplate ##############

const scene = new THREE.Scene();

// #### GUI ##### 
const gui = new GUI();

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

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#e5e5e5");
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

const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(10, 10, 10);
scene.add(light);

// ############## MAIN ##############


const cubeWidth = 1;
const cubeHeight = 1;
const cubeLength = 1;

const cubeGeometry = new THREE.BoxGeometry(cubeLength, cubeWidth, cubeHeight);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const redBaseMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
// cube.position.z = -5;

const cube = new THREE.Mesh(cubeGeometry, redBaseMaterial);
scene.add(cube);

const gridGroup = new THREE.Group();

const grid1 = gridCubes(3, 3);
const grid2 = gridCubes(3, 3);
const grid3 = gridCubes(3, 3);
grid1.position.z =  1 + 0.2;
grid3.position.z = -1 - 0.2;

gridGroup.add(grid1, grid2, grid3);
scene.add(gridGroup);

function getCube(x, y, z) {
  const cube = new THREE.Mesh(cubeGeometry, baseMaterial);
  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = z;
  return cube;
}

function gridCubes(numX, numY) {
  const _cubesGroup = new THREE.Group()
  const gap = 0.2;
  for (let i = 0; i < numX; i++) {
    for (let j = 0; j < numY; j++) {
      _cubesGroup.add(getCube(i * cubeLength + i * gap, j * cubeWidth + j * gap, 0)
        .translateX(-numX * (cubeLength - gap) / 2 )
        .translateY(-numY * (cubeWidth  - gap) / 2  )
      );
    }
  }
  return _cubesGroup;
}

// ##############
// #### GUI #####
// ##############

// #### Camera controls #### 
const camFolder = gui.addFolder("Camera");
camFolder.add(camera.position, "x", -100, 100);
camFolder.add(camera.position, "y", -100, 100);
camFolder.add(camera.position, "z", -100, 100);
camFolder.open();

// #### Grid controls #### 
const gridFolder = gui.addFolder("Grid");
gridFolder.add(gridGroup.position, "x", -100, 100);
gridFolder.add(gridGroup.position, "y", -100, 100);
gridFolder.add(gridGroup.position, "z", -100, 100);

// #####################
//##### Render loop ####  
// #####################

const render = () => {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}

render();

