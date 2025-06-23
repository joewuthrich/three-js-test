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

const INTRO_DURATION = 1.5;
let introTime = 0;
let outroTime = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  80,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.8));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 2);
scene.add(dir);

const tickRoad = createRoad(scene, camera);
const tickBuildings = createBuildings(scene, camera);
const {
  tick: tickObstacles,
  obstacles,
  resetObstacles,
} = createObstacles(scene, camera);

const {
  play: playCharacterAnimation,
  group: characterGroup,
  tick: tickCharacter,
} = createCharacter(scene);

const startGame = () => {
  if (state.gameState !== "waiting" && state.gameState !== "crashed") return;
  introTime = 0;
  outroTime = 0;

  if (state.gameState === "crashed") {
    state.score = 0;
    document.getElementById("score")!.textContent = "Score: 0";
    resetObstacles();
  }

  state.gameState = "intro";

  playCharacterAnimation("sprint");

  setTimeout(() => {
    state.gameState = "running";
    playCharacterAnimation("sprint");
  }, 1000);
};

const tickControls = createRunnerControls(
  characterGroup,
  playCharacterAnimation,
  state,
  startGame
);

function tickIntro(dt: number) {
  introTime += dt;
  const t = Math.min(introTime / INTRO_DURATION, 1);
  const ease = 1 - Math.pow(1 - t, 3);

  camera.fov = THREE.MathUtils.lerp(80, 60, ease);
  // camera.position.set(0, 3, 4);
  camera.lookAt(0, THREE.MathUtils.lerp(0, 2, ease), 0);

  camera.updateProjectionMatrix();

  if (t === 1) {
    state.gameState = "running";
  }
}

function tickOutro(dt: number) {
  outroTime += dt;

  const t = Math.min(outroTime / INTRO_DURATION, 1);
  const ease = 1 - Math.pow(1 - t, 3);

  camera.fov = THREE.MathUtils.lerp(60, 80, ease);
  camera.lookAt(0, THREE.MathUtils.lerp(2, 0, ease), 0);

  camera.updateProjectionMatrix();
}

const clock = new THREE.Clock();
function loop() {
  const delta = clock.getDelta();
  tickCharacter(delta);

  if (state.gameState === "crashed" || state.gameState === "outro") {
    tickOutro(delta);
  }

  if (state.gameState !== "running" && state.gameState !== "intro") {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
    return;
  }

  if (state.gameState === "intro") {
    tickIntro(delta);
  }

  tickRoad();
  tickBuildings();
  tickControls(delta);
  tickObstacles();

  detectCollisions(characterGroup, obstacles, () => {
    if (state.gameState === "running") {
      state.gameState = "outro";
      playCharacterAnimation("die");

      setTimeout(() => {
        state.gameState = "crashed";
      }, 1500);
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
