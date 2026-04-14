// === REAL TEXTURE (TOG'RI PATH) ===
const loader = new THREE.TextureLoader();

// ❗ MUHIM: ../ NI OLIB TASHLA
const saturnTexture = loader.load('images/fullsize/176saturn.jpg');

// PLANET
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.3, 64, 64),
  new THREE.MeshStandardMaterial({
    map: saturnTexture
  })
);

// RING (hozircha minimal — rasm ichida ring bor)
const ring = new THREE.Mesh(
  new THREE.RingGeometry(1.6, 2.6, 128),
  new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  })
);

ring.rotation.x = Math.PI * 0.6;

// GROUP
const saturn = new THREE.Group();
saturn.add(planet);
saturn.add(ring);

scene.add(saturn);

// POSITION
saturn.position.set(1.2, 0.1, 0);

// === ANIMATION ===
const clock = new THREE.Clock();

function animateSaturn() {
  const time = clock.getElapsedTime();

  planet.rotation.y += 0.002;   // slow
  ring.rotation.z += 0.0005;

  saturn.position.y = Math.sin(time * 0.2) * 0.1;

  requestAnimationFrame(animateSaturn);
}

animateSaturn();

  // ===============================
  // LIGHTING
  // ===============================
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffd2a6, 1.5);
  light.position.set(5, 3, 5);
  scene.add(light);

  // ===============================
  // SATURN TEXTURE (REAL)
  // ===============================
  const loader = new THREE.TextureLoader();

  const texture = loader.load('../images/fullsize/176saturn.jpg');

  // PLANET
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 64, 64),
    new THREE.MeshStandardMaterial({
      map: texture
    })
  );

  scene.add(planet);

  // ===============================
  // RINGS
  // ===============================
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.6, 2.8, 128),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    })
  );

  ring.rotation.x = Math.PI * 0.65;
  scene.add(ring);

  // ===============================
  // POSITION (RIGHT SIDE FEEL)
  // ===============================
  const group = new THREE.Group();
  group.add(planet);
  group.add(ring);

  group.position.set(1.2, 0.1, 0);
  scene.add(group);

  // ===============================
  // RESIZE
  // ===============================
  function resize() {
    const w = saturnWrap.clientWidth;
    const h = saturnWrap.clientHeight;

    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();

  // ===============================
  // ANIMATION (SLOW)
  // ===============================
  const clock = new THREE.Clock();

  function animate() {
    const time = clock.getElapsedTime();

    // VERY SLOW ROTATION
    planet.rotation.y += 0.002;
    ring.rotation.z += 0.0005;

    // FLOATING
    group.position.y = Math.sin(time * 0.2) * 0.1;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
})();
