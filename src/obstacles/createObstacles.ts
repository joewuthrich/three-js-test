import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { LANES, ROAD_TILE_COUNT } from "../lib/contants";

export function createObstacles(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  state: { speed: number }
) {
  const loader = new GLTFLoader();
  const obstacles: THREE.Group<THREE.Object3DEventMap>[] = [];

  const randomObstacle = () => {
    const obstacleList = [
      "models/obstacles/firetruck.glb",
      "models/obstacles/hatchback-sports.glb",
      "models/obstacles/police.glb",
      "models/obstacles/sedan-sports.glb",
      "models/obstacles/truck.glb",
    ];
    return (
      import.meta.env.BASE_URL +
      obstacleList[Math.floor(Math.random() * obstacleList.length)]
    );
  };

  const randomLane = () => {
    return LANES[Math.floor(Math.random() * LANES.length)];
  };

  for (let i = 0; i < ROAD_TILE_COUNT; i++) {
    const obstacle = randomObstacle();

    loader.load(obstacle, (gltf) => {
      const tile = gltf.scene;
      tile.position.z = -i * 4.8 - 30;
      tile.position.x = randomLane();

      tile.scale.setScalar(1);

      tile.userData.type = obstacle;

      scene.add(tile);

      obstacles.push(tile);
    });
  }

  function resetObstacles() {
    let i = 0;

    obstacles.forEach((tile) => {
      tile.position.z = -i * 4.8 - 30;
      tile.position.x = randomLane();

      i++;
    });
  }

  function tick() {
    obstacles.forEach((tile) => {
      tile.position.z += state.speed;

      if (tile.position.z > camera.position.z) {
        tile.position.z -= ROAD_TILE_COUNT * 4.8 - 30;
        tile.position.x = randomLane();
      }
    });
  }

  return { tick, obstacles, resetObstacles };
}
