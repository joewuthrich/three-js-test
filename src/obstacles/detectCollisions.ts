import { Box3, Group, Vector3 } from "three";
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
  const hitBox = playerBB.clone().expandByScalar(-0.8);

  for (const obs of obstacleList) {
    obstacleBB.setFromObject(obs);

    const hitBoxObstacle =
      obs.userData.type ===
      import.meta.env.BASE_URL + "models/obstacles/firetruck.glb"
        ? obstacleBB.clone().expandByVector(new Vector3(0, 1, 0))
        : obstacleBB.clone();

    if (hitBox.intersectsBox(hitBoxObstacle)) {
      setCrashed();
      break;
    }
  }
}
