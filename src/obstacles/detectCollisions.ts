import { Box3, Group } from "three";
import type { Object3DEventMap, Object3D } from "three";

const playerBB = new Box3();
const obstacleBB = new Box3();

export function detectCollisions(
  player: Object3D,
  obstacleList: Group<Object3DEventMap>[]
) {
  playerBB.setFromObject(player);

  for (const obs of obstacleList) {
    obstacleBB.setFromObject(obs);
    if (playerBB.intersectsBox(obstacleBB)) {
      console.log("HIT!");
      break;
    }
  }
}
