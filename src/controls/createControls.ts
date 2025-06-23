import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils.js";
import { LANES } from "../lib/contants";

type RunnerState = "sprint" | "jump" | "roll";

export function createRunnerControls(
  player: THREE.Object3D,
  play: (n: string) => void
) {
  const GRAVITY = 20;
  const FAST_FALL = -35;
  const ROLL_TIME = 0.7;
  const ROLL_HOLD = ROLL_TIME - 0.1;
  const TILT_X = Math.PI / 4;

  let lane = 1,
    targetX = LANES[lane];
  let vy = 0,
    y = 0;
  let state: RunnerState = "sprint";
  let rollTimer = 0;

  const pressed: Record<string, boolean> = {};

  addEventListener("keydown", (e) => {
    if (pressed[e.code]) return;
    pressed[e.code] = true;

    switch (e.code) {
      case "ArrowLeft":
        lane = clamp(lane - 1, 0, 2);
        targetX = LANES[lane];
        break;
      case "ArrowRight":
        lane = clamp(lane + 1, 0, 2);
        targetX = LANES[lane];
        break;

      case "ArrowUp":
        if (state === "jump") return;

        vy = 9;
        state = "jump";
        play("jump");
        break;

      case "ArrowDown":
        if (state === "jump") vy = FAST_FALL;
        state = "roll";
        rollTimer = 0;
        play("sit");
        break;
    }
  });

  addEventListener("keyup", (e) => (pressed[e.code] = false));

  return function tick(dt: number) {
    player.position.x = THREE.MathUtils.lerp(
      player.position.x,
      targetX,
      7 * dt
    );
    if (state === "jump" || state === "roll") {
      vy -= GRAVITY * dt;
      y += vy * dt;
      if (y <= 0) {
        y = 0;
        vy = 0;
      }
    }

    if (state === "jump" && y === 0) {
      state = "sprint";
      play("sprint");
    }

    if (state === "roll") {
      rollTimer += dt;

      const holdPhase = rollTimer < ROLL_HOLD;

      player.rotation.x = holdPhase
        ? THREE.MathUtils.lerp(player.rotation.x, TILT_X, 15 * dt)
        : THREE.MathUtils.lerp(player.rotation.x, 0, 15 * dt);

      if (rollTimer >= ROLL_TIME) {
        state = "sprint";
        play("sprint");
        player.rotation.x = 0;
      }
    } else {
      player.rotation.x = THREE.MathUtils.lerp(player.rotation.x, 0, 15 * dt);
    }

    player.position.y = y;
  };
}
