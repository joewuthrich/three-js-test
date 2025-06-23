import * as THREE from "three";
import { createRoad } from "./scene/createRoad";
import { createBuildings } from "./scene/createBuildings";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.GridHelper(20, 20));
scene.add(new THREE.AxesHelper(3));

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.8));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 2);
scene.add(dir);

scene.add(new THREE.DirectionalLightHelper(dir));

const roadTiles = createRoad(scene);
const buildingTiles = createBuildings(scene);

function loop() {
  const speed = 0.1;

  roadTiles.forEach((tile) => {
    tile.position.z += speed;

    if (tile.position.z > camera.position.z) {
      tile.position.z -= roadTiles.length * 4.8;
    }
  });

  buildingTiles.forEach((tile) => {
    tile.position.z += speed;

    if (tile.position.z > camera.position.z) {
      tile.position.z -= roadTiles.length * 4.8;
    }
  });

  requestAnimationFrame(loop);
  renderer.render(scene, camera);
}

loop();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
