import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils.js";

type RunnerState = "sprint" | "jump" | "crouch";

export function createRunnerControls(
  player: THREE.Object3D,
  playAnim: (name: string) => void
) {
  const LANES = [-2, 0, 2];
  let laneIdx = 1;
  let targetX = LANES[laneIdx];

  const GRAVITY = 20;
  let vy = 0;
  let y = 0;
  let state: RunnerState = "sprint";

  const pressed: Record<string, boolean> = {};

  addEventListener("keydown", (e) => {
    if (pressed[e.code]) return;
    pressed[e.code] = true;

    switch (e.code) {
      case "ArrowLeft":
        laneIdx = clamp(laneIdx - 1, 0, 2);
        targetX = LANES[laneIdx];
        break;

      case "ArrowRight":
        laneIdx = clamp(laneIdx + 1, 0, 2);
        targetX = LANES[laneIdx];
        break;

      case "ArrowUp":
        if (state === "sprint") {
          vy = 9;
          state = "jump";
          playAnim("jump");
        }
        break;

      case "ArrowDown":
        if (state === "jump") {
          y = 0;
          vy = 0;
        }

        state = "crouch";
        playAnim("sit");
        break;
    }
  });

  addEventListener("keyup", (e) => {
    pressed[e.code] = false;
    if (e.code === "ArrowDown" && state === "crouch") {
      state = "sprint";
      playAnim("sprint");
    }
  });

  return function tick(delta: number) {
    player.position.x = THREE.MathUtils.lerp(
      player.position.x,
      targetX,
      7 * delta
    );

    if (state === "jump") {
      vy -= GRAVITY * delta;
      y += vy * delta;
      if (y <= 0) {
        y = 0;
        vy = 0;
        state = "sprint";
        playAnim("sprint");
      }
      player.position.y = y;
    } else if (state === "crouch") {
      player.position.y = THREE.MathUtils.lerp(
        player.position.y,
        0.1,
        15 * delta
      );
    } else {
      player.position.y = THREE.MathUtils.lerp(
        player.position.y,
        0,
        15 * delta
      );
    }
  };
}
