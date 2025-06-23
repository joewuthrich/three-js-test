import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export function createBuildings(scene: THREE.Scene) {
  const loader = new GLTFLoader();
  const roadTiles: THREE.Group<THREE.Object3DEventMap>[] = [];

  const randomBuilding = () => {
    const buildings = [
      "/models/buildings/building-window-awnings.glb",
      "/models/buildings/building-window-door-window.glb",
      "/models/buildings/building-sample-tower-c.glb",
      "/models/buildings/building-sample-tower-d.glb",
    ];
    return buildings[Math.floor(Math.random() * buildings.length)];
  };

  for (let i = 0; i < 17; i++) {
    loader.load(randomBuilding(), (gltf) => {
      const tile = gltf.scene;
      tile.position.z = -i * 4.8;
      tile.position.x = 5.5;

      tile.scale.setScalar(5);
      tile.rotation.y = Math.PI / 2 + Math.PI;

      scene.add(tile);
      roadTiles.push(tile);
    });
  }

  for (let i = 0; i < 17; i++) {
    loader.load(randomBuilding(), (gltf) => {
      const tile = gltf.scene;
      tile.position.z = -i * 4.8;
      tile.position.x = -5.5;

      tile.scale.setScalar(5);
      tile.rotation.y = Math.PI / 2;

      scene.add(tile);
      roadTiles.push(tile);
    });
  }

  return roadTiles;
}
