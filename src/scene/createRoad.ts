import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export function createRoad(scene: THREE.Scene) {
  const loader = new GLTFLoader();
  const roadTiles: THREE.Group<THREE.Object3DEventMap>[] = [];

  for (let i = 0; i < 17; i++) {
    loader.load("/models/road/road-straight.glb", (gltf) => {
      const tile = gltf.scene;
      tile.position.z = -i * 4.9;

      tile.scale.setScalar(7);
      tile.rotation.y = Math.PI / 2;

      scene.add(tile);
      roadTiles.push(tile);
    });
  }

  return roadTiles;
}
