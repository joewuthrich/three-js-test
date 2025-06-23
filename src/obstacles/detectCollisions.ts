import { Box3, Group } from "three";
import type { Object3DEventMap, Object3D } from "three";

const playerBB = new Box3();
const obstacleBB = new Box3();

export function detectCollisions(
  player: Object3D,
  obstacleList: Group<Object3DEventMap>[],
  setCrashed: () => void
) {
  playerBB.setFromObject(player);
  // Player bounding box is far too big, perhaps due to animations
  const hitBox = playerBB.clone().expandByScalar(-0.7);

  for (const obs of obstacleList) {
    obstacleBB.setFromObject(obs);
    if (hitBox.intersectsBox(obstacleBB)) {
      setCrashed();
      break;
    }
  }
}
