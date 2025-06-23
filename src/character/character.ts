import * as THREE from "three";

const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.8, 1),
  new THREE.MeshStandardMaterial({ color: "hotpink" })
);
player.position.set(0, 0.9, 2);
scene.add(player);

// lanes: -1, 0, 1
let lane = 0;
addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && lane > -1) lane--;
  if (e.key === "ArrowRight" && lane < 1) lane++;
  if (e.key === " ") jump();
});

function jump() {
  const startY = player.position.y;
  const t0 = performance.now();
  const dur = 600; // ms

  function animateJump() {
    const t = (performance.now() - t0) / dur;
    if (t < 1) {
      player.position.y = startY + Math.sin(Math.PI * t) * 1.2;
      requestAnimationFrame(animateJump);
    } else {
      player.position.y = startY;
    }
  }
  animateJump();
}

function updatePlayer() {
  player.position.x = lane * 2;
}
