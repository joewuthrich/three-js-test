import * as THREE from "three";
import { createRoad } from "./scene/createRoad";
import { createBuildings } from "./scene/createBuildings";
import { createCharacter } from "./character/character";

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

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.8));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 2);
scene.add(dir);

const tickRoad = createRoad(scene, camera);
const tickBuildings = createBuildings(scene, camera);
const tickCharacter = createCharacter(scene);

const clock = new THREE.Clock();
function loop() {
  const delta = clock.getDelta();
  tickCharacter(delta);
  tickRoad();
  tickBuildings();

  requestAnimationFrame(loop);
  renderer.render(scene, camera);
}

loop();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
