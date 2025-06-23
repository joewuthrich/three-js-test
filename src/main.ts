import * as THREE from "three";
import { createRoad } from "./scene/createRoad";
import { createBuildings } from "./scene/createBuildings";
import { createCharacter } from "./character/createCharacter";
import { createRunnerControls } from "./controls/createControls";
import { createObstacles } from "./obstacles/createObstacles";
import { detectCollisions } from "./obstacles/detectCollisions";
import type { GameState } from "./lib/contants";

const state: {
  gameState: GameState;
  score: number;
} = {
  gameState: "waiting",
  score: 0,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 4);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.8));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 2);
scene.add(dir);

const startGame = () => {
  if (state.gameState !== "waiting" && state.gameState !== "crashed") return;
  state.gameState = "intro";

  playCharacterAnimation("sprint");

  setTimeout(() => {
    state.gameState = "running";
    playCharacterAnimation("sprint");
  }, 2000);
};

const tickRoad = createRoad(scene, camera);
const tickBuildings = createBuildings(scene, camera);
const {
  play: playCharacterAnimation,
  group: characterGroup,
  tick: tickCharacter,
} = createCharacter(scene);
const tickControls = createRunnerControls(
  characterGroup,
  playCharacterAnimation,
  state,
  startGame
);
const { tick: tickObstacles, obstacles } = createObstacles(scene, camera);

const clock = new THREE.Clock();
function loop() {
  const delta = clock.getDelta();
  tickCharacter(delta);

  if (state.gameState !== "running") {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
    return;
  }

  tickRoad();
  tickBuildings();
  tickControls(delta);
  tickObstacles();

  detectCollisions(characterGroup, obstacles, () => {
    if (state.gameState === "running") {
      state.gameState = "crashed";
      playCharacterAnimation("die");
      console.log("Game Over! Your score:", state.score.toFixed(1));
    }
  });

  state.score += 0.05;
  document.getElementById("score")!.textContent = `Score: ${state.score.toFixed(
    0
  )}`;

  requestAnimationFrame(loop);
  renderer.render(scene, camera);
}

loop();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
