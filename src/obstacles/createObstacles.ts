import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { LANES, ROAD_TILE_COUNT } from "../lib/contants";

export function createObstacles(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) {
  const loader = new GLTFLoader();
  const obstacles: THREE.Group<THREE.Object3DEventMap>[] = [];

  const randomObstacle = () => {
    const obstacleList = [
      "/models/obstacles/firetruck.glb",
      "/models/obstacles/garbage_truck.glb",
      "/models/obstacles/hatchback_sports.glb",
      "/models/obstacles/police.glb",
      "/models/obstacles/sedan-sports.glb",
      "/models/obstacles/truck.glb",
    ];
    return obstacleList[Math.floor(Math.random() * obstacleList.length)];
  };

  const randomLane = () => {
    return LANES[Math.floor(Math.random() * LANES.length)];
  };

  for (let i = 0; i < ROAD_TILE_COUNT; i++) {
    loader.load(randomObstacle(), (gltf) => {
      const tile = gltf.scene;
      tile.position.z = -i * 4.8 - 30;
      tile.position.x = randomLane();

      tile.scale.setScalar(1);

      scene.add(tile);

      obstacles.push(tile);
    });
  }

  function tick() {
    const speed = 0.1;

    obstacles.forEach((tile) => {
      tile.position.z += speed;

      if (tile.position.z > camera.position.z) {
        tile.position.z -= ROAD_TILE_COUNT * 4.8;
      }
    });
  }

  return { tick, obstacles };
}
