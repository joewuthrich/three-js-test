import { createRoad } from "./scene/createRoad";
import { createBuildings } from "./scene/createBuildings";
import { createCharacter } from "./character/createCharacter";
import { createRunnerControls } from "./controls/createControls";
import { createObstacles } from "./obstacles/createObstacles";
import { detectCollisions } from "./obstacles/detectCollisions";
import type { GameState } from "./lib/contants";
import {
  Clock,
  DirectionalLight,
  HemisphereLight,
  MathUtils,
  PerspectiveCamera,
  Scene,
  PMREMGenerator,
  WebGLRenderer,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const rgbe = new RGBELoader();
rgbe.load(
  import.meta.env.BASE_URL + "sky/kloppenheim_06_puresky_1k.hdr",
  (hdrTex) => {
    const pmrem = new PMREMGenerator(renderer);
    const envMap = pmrem.fromEquirectangular(hdrTex).texture;

    scene.background = envMap;
    scene.backgroundIntensity = 1.5;
    hdrTex.dispose();
    pmrem.dispose();
  }
);

const state: {
  gameState: GameState;
  score: number;
  highScore: number;
  speed: number;
} = {
  gameState: "waiting",
  score: 0,
  highScore: parseFloat(localStorage.getItem("highscore") || "0"),
  speed: 0.1,
};

document.getElementById(
  "highscore"
)!.textContent = `High Score: ${state.highScore.toFixed(0)}`;

const INTRO_DURATION = 1.5;
let introTime = 0;
let outroTime = 0;

const scene = new Scene();
const camera = new PerspectiveCamera(80, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 3, 4);
camera.lookAt(0, 0, 0);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new HemisphereLight(0xffffff, 0x444444, 3));
const dir = new DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 2);
scene.add(dir);

const tickRoad = createRoad(scene, camera, state);
const tickBuildings = createBuildings(scene, camera, state);
const {
  tick: tickObstacles,
  obstacles,
  resetObstacles,
} = createObstacles(scene, camera, state);

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
  }, 1500);
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

  camera.fov = MathUtils.lerp(80, 60, ease);
  // camera.position.set(0, 3, 4);
  camera.lookAt(0, MathUtils.lerp(0, 2, ease), 0);

  camera.updateProjectionMatrix();

  if (t === 1) {
    state.gameState = "running";
  }
}

function tickOutro(dt: number) {
  outroTime += dt;

  const t = Math.min(outroTime / INTRO_DURATION, 1);
  const ease = 1 - Math.pow(1 - t, 3);

  camera.fov = MathUtils.lerp(60, 80, ease);
  camera.lookAt(0, MathUtils.lerp(2, 0, ease), 0);

  camera.updateProjectionMatrix();
}

const clock = new Clock();
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

  state.speed = state.speed + 0.00001;

  tickRoad();
  tickBuildings();
  tickControls(delta);
  tickObstacles();

  state.score += 0.05 * 1 + state.speed;
  document.getElementById("score")!.textContent = `Score: ${state.score.toFixed(
    0
  )}`;

  detectCollisions(characterGroup, obstacles, () => {
    if (state.gameState === "running") {
      state.gameState = "outro";
      playCharacterAnimation("die");

      setTimeout(() => {
        state.gameState = "crashed";
      }, 1500);

      characterGroup.position.y = 0;

      state.speed = 0.1;

      if (state.score > state.highScore) {
        state.highScore = state.score;
        document.getElementById(
          "highscore"
        )!.textContent = `High Score: ${state.highScore.toFixed(0)}`;

        localStorage.setItem("highscore", state.highScore.toString());
      }
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
