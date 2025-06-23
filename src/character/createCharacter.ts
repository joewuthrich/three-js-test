import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function createCharacter(scene: THREE.Scene) {
  const ROLL = "sit";

  const loader = new GLTFLoader();
  const group = new THREE.Group();
  scene.add(group);

  const mixer = new THREE.AnimationMixer(group);
  const actions: Record<string, THREE.AnimationAction> = {};
  let current: THREE.AnimationAction | null = null;

  loader.load("/models/characters/character-male-f.glb", (gltf) => {
    const model = gltf.scene;
    model.scale.setScalar(2);
    model.rotation.y = Math.PI;
    group.add(model);

    gltf.animations.forEach((clip) => {
      console.log("Loaded animation:", clip.name);
      actions[clip.name] = mixer.clipAction(clip);
    });

    if (actions[ROLL]) {
      const action = actions[ROLL];
      action.setLoop(THREE.LoopOnce, 1).clampWhenFinished = true;
    }

    play("sprint");
  });

  function play(name: string, fade = 0.25) {
    const next = actions[name];
    if (!next || current === next) return;
    next.reset().fadeIn(fade).play();
    current?.fadeOut(fade);
    current = next;
  }

  return {
    group,
    play,
    tick: (delta: number) => mixer.update(delta),
  };
}
