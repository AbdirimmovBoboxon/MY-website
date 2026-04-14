// ===============================
// SATURN FIXED (REAL IMAGE)
// ===============================

(() => {
  const saturnCanvas = document.getElementById('saturn-canvas');
  const saturnWrap = document.getElementById('saturn-wrap');

  if (!saturnCanvas || !window.THREE) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({
    canvas: saturnCanvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(saturnWrap.clientWidth, saturnWrap.clientHeight);

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
