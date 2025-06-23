import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { ROAD_TILE_COUNT } from "../lib/contants";

export function createBuildings(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) {
  const loader = new GLTFLoader();
  const buildings: THREE.Group<THREE.Object3DEventMap>[] = [];

  const randomBuilding = () => {
    const buildings = [
      "/models/buildings/building-window-awnings.glb",
      "/models/buildings/building-window-door-window.glb",
      "/models/buildings/building-sample-tower-c.glb",
      "/models/buildings/building-sample-tower-d.glb",
    ];
    return buildings[Math.floor(Math.random() * buildings.length)];
  };

  for (let i = 0; i < ROAD_TILE_COUNT; i++) {
    loader.load(randomBuilding(), (gltf) => {
      const tile = gltf.scene;
      tile.position.z = -i * 4.8;
      tile.position.x = 5.5;

      tile.scale.setScalar(5);
      tile.rotation.y = Math.PI / 2 + Math.PI;

      scene.add(tile);
      buildings.push(tile);
    });
  }

  for (let i = 0; i < ROAD_TILE_COUNT; i++) {
    loader.load(randomBuilding(), (gltf) => {
      const tile = gltf.scene;
      tile.position.z = -i * 4.8;
      tile.position.x = -5.5;

      tile.scale.setScalar(5);
      tile.rotation.y = Math.PI / 2;

      scene.add(tile);
      buildings.push(tile);
    });
  }

  return function tick() {
    const speed = 0.1;

    buildings.forEach((tile) => {
      tile.position.z += speed;

      if (tile.position.z > camera.position.z) {
        tile.position.z -= ROAD_TILE_COUNT * 4.8;
      }
    });
  };
}
