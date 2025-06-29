import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { ROAD_TILE_COUNT } from "../lib/contants";

export function createRoad(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  state: { speed: number }
) {
  const loader = new GLTFLoader();
  const roadTiles: THREE.Group<THREE.Object3DEventMap>[] = [];

  for (let i = 0; i < ROAD_TILE_COUNT; i++) {
    loader.load(
      import.meta.env.BASE_URL + "models/road/road-straight.glb",
      (gltf) => {
        const tile = gltf.scene;
        tile.position.z = -i * 4.9;

        tile.scale.setScalar(7);
        tile.rotation.y = Math.PI / 2;

        scene.add(tile);
        roadTiles.push(tile);
      }
    );
  }

  return function tick() {
    roadTiles.forEach((tile) => {
      tile.position.z += state.speed;

      if (tile.position.z > camera.position.z + 5) {
        tile.position.z -= ROAD_TILE_COUNT * 4.8;
      }
    });
  };
}
