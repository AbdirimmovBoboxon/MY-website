/*
  Space / Cosmos Portfolio — interactions
  - Starfield (canvas)
  - Roles typing effect
  - Parallax + cursor glow
  - Scroll reveal + active nav
  - Contact form validation + Formspree submit (keeps action/method intact)
*/

(() => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------
     Loader
  ---------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    if (!loader) return;
    loader.classList.add('is-hidden');
    window.setTimeout(() => loader.remove(), 900);
  });

  /* ---------------------------
     Cursor glow + parallax vars
  ---------------------------- */
  const cursorGlow = document.getElementById('cursor-glow');
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  let pointerNX = 0;
  let pointerNY = 0;

  function setParallaxVars(clientX, clientY) {
    const nx = clientX / window.innerWidth - 0.5;
    const ny = clientY / window.innerHeight - 0.5;
    pointerNX = nx;
    pointerNY = ny;
    const px = nx * 22;
    const py = ny * 22;
    root.style.setProperty('--mx', `${px.toFixed(2)}px`);
    root.style.setProperty('--my', `${py.toFixed(2)}px`);
  }

  if (supportsHover && cursorGlow && !prefersReducedMotion) {
    let raf = 0;
    let lastX = -999;
    let lastY = -999;

    const paint = () => {
      const w = cursorGlow.offsetWidth || 360;
      const h = cursorGlow.offsetHeight || 360;
      cursorGlow.style.transform = `translate3d(${lastX - w / 2}px, ${lastY - h / 2}px, 0)`;
      raf = 0;
    };

    window.addEventListener(
      'pointermove',
      (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        cursorGlow.style.opacity = '1';
        setParallaxVars(e.clientX, e.clientY);
        if (!raf) raf = window.requestAnimationFrame(paint);
      },
      { passive: true }
    );

    window.addEventListener(
      'pointerleave',
      () => {
        cursorGlow.style.opacity = '0';
      },
      { passive: true }
    );
  } else {
    // Still set default parallax vars for consistent layout
    pointerNX = 0;
    pointerNY = 0;
    root.style.setProperty('--mx', '0px');
    root.style.setProperty('--my', '0px');
  }

  // Scroll parallax (Saturn)
  let scrollRaf = 0;
  const updateScrollParallax = () => {
    const y = window.scrollY || 0;
    // Negative means Saturn gently floats upward as you scroll down
    const parallax = Math.max(-140, Math.min(80, -y * 0.06));
    root.style.setProperty('--scroll-parallax', `${parallax.toFixed(1)}px`);
    scrollRaf = 0;
  };

  if (!prefersReducedMotion) {
    window.addEventListener(
      'scroll',
      () => {
        if (!scrollRaf) scrollRaf = window.requestAnimationFrame(updateScrollParallax);
      },
      { passive: true }
    );
  }
  updateScrollParallax();

  /* ---------------------------
     Mobile navigation
  ---------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  const setNavOpen = (open) => {
    if (!navToggle || !navLinks) return;
    navLinks.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => setNavOpen(!navLinks.classList.contains('is-open')));

    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setNavOpen(false));
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    });

    window.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!navLinks.classList.contains('is-open')) return;
      if (navLinks.contains(target) || navToggle.contains(target)) return;
      setNavOpen(false);
    });
  }

  /* ---------------------------
     Active nav highlight
  ---------------------------- */
  const navItems = Array.from(document.querySelectorAll('.nav__link'));
  const sections = Array.from(document.querySelectorAll('[data-section]'));

  const setActiveNav = (id) => {
    navItems.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
  };

  if (sections.length && navItems.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        // Pick the most visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!visible) return;
        setActiveNav(visible.target.id);
      },
      { threshold: [0.4, 0.55, 0.7] }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------------------------
     Scroll reveal
  ---------------------------- */
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------
     Roles typing effect
  ---------------------------- */
  const roleEl = document.getElementById('role-typed');
  const roles = [
    'Mobile Developer',
    'iOS Developer',
    'Android Developer',
    'Desktop Application Developer',
    'Web Developer'
  ];

  if (roleEl) {
    if (prefersReducedMotion) {
      roleEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const text = roles[roleIndex];
        const speed = deleting ? 36 : 84;
        const pause = 1100;

        roleEl.textContent = text.slice(0, charIndex);

        if (!deleting) {
          charIndex += 1;
          if (charIndex > text.length) {
            deleting = true;
            window.setTimeout(tick, pause);
            return;
          }
        } else {
          charIndex -= 1;
          if (charIndex < 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            charIndex = 0;
          }
        }

        window.setTimeout(tick, speed);
      };

      tick();
    }
  }

  /* ---------------------------
     Contact form (Formspree)
  ---------------------------- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const successEl = document.getElementById('form-success');
  const successClose = document.getElementById('form-success-close');
  const submitBtn = document.getElementById('contact-submit');
  const submitLabel = submitBtn?.querySelector('.btn__label');

  const setStatus = (type, message) => {
    if (!statusEl) return;
    statusEl.dataset.type = type;
    statusEl.textContent = message;
  };

  const setInvalid = (field, invalid) => {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
    field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  };

  const emailLooksValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);

  const validate = () => {
    if (!form) return { ok: false, firstInvalid: null };
    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const message = form.querySelector('textarea[name="message"]');

    const nameVal = (name?.value || '').trim();
    const emailVal = (email?.value || '').trim();
    const msgVal = (message?.value || '').trim();

    let firstInvalid = null;

    // reset
    [name, email, message].forEach((f) => f && setInvalid(f, false));

    if (!nameVal || nameVal.length < 2) {
      firstInvalid = firstInvalid || name;
      name && setInvalid(name, true);
    }
    if (!emailVal || !emailLooksValid(emailVal)) {
      firstInvalid = firstInvalid || email;
      email && setInvalid(email, true);
    }
    if (!msgVal || msgVal.length < 10) {
      firstInvalid = firstInvalid || message;
      message && setInvalid(message, true);
    }

    if (firstInvalid) return { ok: false, firstInvalid };
    return { ok: true, firstInvalid: null };
  };

  const setSending = (sending) => {
    if (submitBtn) submitBtn.disabled = sending;
    if (submitLabel) submitLabel.textContent = sending ? 'Sending…' : 'Send Message';
    if (form) form.setAttribute('aria-busy', sending ? 'true' : 'false');
  };

  const showSuccess = () => {
    if (!form) return;
    form.classList.add('is-success');
    if (successEl) successEl.setAttribute('aria-hidden', 'false');
    setStatus('success', 'Message sent successfully.');
  };

  const hideSuccess = () => {
    if (!form) return;
    form.classList.remove('is-success');
    if (successEl) successEl.setAttribute('aria-hidden', 'true');
  };

  if (successClose) {
    successClose.addEventListener('click', hideSuccess);
  }

  if (form) {
    // Clear field error state as user types
    form.addEventListener('input', (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        target.setAttribute('aria-invalid', 'false');
      }
    });

    form.addEventListener('submit', async (e) => {
      const { ok, firstInvalid } = validate();
      if (!ok) {
        e.preventDefault();
        setStatus('error', 'Please fill all fields correctly (name, email, message).');
        firstInvalid?.focus();
        return;
      }

      const canAjax =
        (window.location.protocol === 'http:' || window.location.protocol === 'https:') && typeof fetch === 'function';

      // IMPORTANT: If opened via file://, keep default form submit (Formspree still works).
      if (!canAjax) {
        setStatus('info', 'Sending…');
        setSending(true);
        // allow normal submit navigation
        return;
      }

      e.preventDefault();
      setSending(true);
      setStatus('info', 'Sending…');

      try {
        const response = await fetch(form.action, {
          method: form.method || 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          form.reset();
          showSuccess();
        } else {
          setStatus('error', 'Something went wrong. Please try again, or contact me directly.');
        }
      } catch (err) {
        setStatus('error', 'Network error. Please try again, or contact me directly.');
      } finally {
        setSending(false);
      }
    });
  }

  /* ---------------------------
     Saturn (Three.js)
  ---------------------------- */
  const saturnCanvas = document.getElementById('saturn-canvas');
  const saturnWrap = document.getElementById('saturn-wrap');

  const initSaturn3D = ({ animate }) => {
    const THREE = window.THREE;
    if (!THREE || !saturnCanvas || !saturnWrap) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: saturnCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    if ('useLegacyLights' in renderer) renderer.useLegacyLights = false;
    if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    if ('outputEncoding' in renderer && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0.0, 0.12, 6.2);

    const ambient = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff2d6, 2.25);
    sun.position.set(3.4, 2.2, 4.3);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x7dd3fc, 0.55);
    rim.position.set(-4.6, 0.4, -2.2);
    scene.add(rim);

    const saturn = new THREE.Group();
    saturn.rotation.set(THREE.MathUtils.degToRad(8), THREE.MathUtils.degToRad(-18), THREE.MathUtils.degToRad(-10));
    scene.add(saturn);

    const applyColorSpace = (tex) => {
      if (!tex) return;
      if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      if ('encoding' in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    };

    const createSaturnTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Base gradient
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, '#c9b59b');
      bg.addColorStop(0.22, '#d9c3a5');
      bg.addColorStop(0.5, '#cdb395');
      bg.addColorStop(0.72, '#d7c0a3');
      bg.addColorStop(1, '#bea182');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Soft bands + noise (procedural, realistic-ish)
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = img.data;
      const w = canvas.width;
      const h = canvas.height;

      const rand = (seed) => {
        // deterministic-ish hash (fast)
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };

      for (let y = 0; y < h; y += 1) {
        const fy = y / h;
        const band =
          Math.sin(fy * Math.PI * 10.2) * 0.06 +
          Math.sin(fy * Math.PI * 22.8 + 1.4) * 0.03 +
          Math.sin(fy * Math.PI * 46.0 + 0.2) * 0.012;

        for (let x = 0; x < w; x += 1) {
          const i = (y * w + x) * 4;
          const fx = x / w;
          const n = (rand(x * 12.9898 + y * 78.233) - 0.5) * 0.06;
          const v = band + n + Math.sin((fx + fy) * Math.PI * 2.0) * 0.006;

          data[i + 0] = Math.max(0, Math.min(255, data[i + 0] + v * 255 * 0.65));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + v * 255 * 0.5));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + v * 255 * 0.3));
        }
      }

      ctx.putImageData(img, 0, 0);

      // Slight blur using scaled redraw for a smoother, photographic feel
      ctx.globalAlpha = 0.22;
      for (let k = 0; k < 2; k += 1) {
        ctx.drawImage(canvas, -2, 0, w + 4, h);
        ctx.drawImage(canvas, 2, 0, w - 4, h);
      }
      ctx.globalAlpha = 1;

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      applyColorSpace(tex);
      return tex;
    };

    const createRingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const img = ctx.createImageData(canvas.width, canvas.height);
      const data = img.data;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(cx, cy);

      // Geometry uses inner/outer radii; keep texture aligned with our chosen ring radii.
      const inner = 1.65 / 2.75; // innerRadius / outerRadius
      const outer = 1.0;

      const rand = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };

      for (let y = 0; y < h; y += 1) {
        const dy = y - cy;
        for (let x = 0; x < w; x += 1) {
          const dx = x - cx;
          const r = Math.sqrt(dx * dx + dy * dy) / maxR;
          const i = (y * w + x) * 4;

          if (r < inner || r > outer) {
            data[i + 3] = 0;
            continue;
          }

          // Ring banding: mix stripes + noise, fade at edges
          const t = (r - inner) / (outer - inner);
          const stripes =
            Math.sin(t * Math.PI * 22.0) * 0.12 +
            Math.sin(t * Math.PI * 58.0 + 1.7) * 0.06 +
            (rand(x * 0.07 + y * 0.11) - 0.5) * 0.09;

          const edgeFade = Math.min(1, Math.min(t * 6, (1 - t) * 4));
          const base = 0.75 + stripes;

          const rCol = 180 + base * 42;
          const gCol = 176 + base * 40;
          const bCol = 170 + base * 34;
          const a = Math.max(0, Math.min(255, 255 * edgeFade * (0.78 + stripes * 0.35)));

          data[i + 0] = Math.max(0, Math.min(255, rCol));
          data[i + 1] = Math.max(0, Math.min(255, gCol));
          data[i + 2] = Math.max(0, Math.min(255, bCol));
          data[i + 3] = a;
        }
      }

      ctx.putImageData(img, 0, 0);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      applyColorSpace(tex);
      return tex;
    };

    const planetMat = new THREE.MeshStandardMaterial({
      roughness: 1.0,
      metalness: 0.0,
      map: createSaturnTexture()
    });

    const planet = new THREE.Mesh(new THREE.SphereGeometry(1.35, 80, 80), planetMat);
    saturn.add(planet);

    // Subtle atmosphere glow
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.41, 80, 80),
      new THREE.MeshBasicMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      })
    );
    saturn.add(atmo);

    const ringGroup = new THREE.Group();
    ringGroup.rotation.set(THREE.MathUtils.degToRad(63), 0, THREE.MathUtils.degToRad(-18));
    saturn.add(ringGroup);

    const ringGeo = new THREE.RingGeometry(1.65, 2.75, 192);
    const ringMat = new THREE.MeshStandardMaterial({
      roughness: 1.0,
      metalness: 0.0,
      transparent: true,
      opacity: 0.98,
      alphaTest: 0.22,
      side: THREE.DoubleSide,
      map: createRingTexture()
    });

    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.z = Math.PI * 0.2;
    ringGroup.add(ring);

    const ringGlow = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    ringGlow.scale.setScalar(1.02);
    ringGroup.add(ringGlow);

    // Optional: replace procedural textures with real files if present
    const loader = new THREE.TextureLoader();
    loader.load(
      'assets/textures/saturn_color.jpg',
      (tex) => {
        applyColorSpace(tex);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;
        planetMat.map = tex;
        planetMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    loader.load(
      'assets/textures/saturn_ring.png',
      (tex) => {
        applyColorSpace(tex);
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;
        ringMat.map = tex;
        ringMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    loader.load(
      'assets/textures/saturn_normal.jpg',
      (tex) => {
        planetMat.normalMap = tex;
        planetMat.normalScale = new THREE.Vector2(0.35, 0.35);
        planetMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    let width = 1;
    let height = 1;
    const resize = () => {
      const rect = saturnWrap.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => resize());
      ro.observe(saturnWrap);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }

    const target = { rx: 0, ry: 0 };
    const current = { rx: 0, ry: 0 };

    if (supportsHover && !prefersReducedMotion) {
      window.addEventListener(
        'pointermove',
        () => {
          target.ry = pointerNX * 0.6;
          target.rx = -pointerNY * 0.35;
        },
        { passive: true }
      );
    }

    const clock = new THREE.Clock();
    const render = () => renderer.render(scene, camera);

    const animateFrame = () => {
      const dt = Math.min(0.033, clock.getDelta());
      const t = clock.elapsedTime;

      // Slow, smooth motion (as requested)
      planet.rotation.y += dt * 0.18;
      ringGroup.rotation.z += dt * 0.03;
      saturn.position.y = Math.sin(t * 0.45) * 0.08;

      // Micro-parallax
      current.rx += (target.rx - current.rx) * 0.06;
      current.ry += (target.ry - current.ry) * 0.06;
      saturn.rotation.x = THREE.MathUtils.degToRad(8) + current.rx;
      saturn.rotation.y = THREE.MathUtils.degToRad(-18) + current.ry;

      render();
      window.requestAnimationFrame(animateFrame);
    };

    render();
    if (animate) window.requestAnimationFrame(animateFrame);
  };

  if (saturnCanvas && saturnWrap && window.THREE) {
    initSaturn3D({ animate: !prefersReducedMotion });
  }

  /* ---------------------------
     Starfield (canvas)
  ---------------------------- */
  const canvas = document.getElementById('starfield');
  const ctx = canvas?.getContext?.('2d');

  if (canvas && ctx) {
    const dpr = () => Math.min(2, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;
    let stars = [];

    const makeSprite = (r, g, b) => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const gtx = c.getContext('2d');
      if (!gtx) return c;
      const grad = gtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,0.95)');
      grad.addColorStop(0.16, `rgba(${r},${g},${b},0.9)`);
      grad.addColorStop(0.55, `rgba(${r},${g},${b},0.22)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      gtx.fillStyle = grad;
      gtx.fillRect(0, 0, 64, 64);
      return c;
    };

    const sprites = [
      makeSprite(255, 255, 255), // white
      makeSprite(125, 211, 252), // blue
      makeSprite(196, 181, 253), // purple
      makeSprite(253, 230, 138) // warm
    ];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const ratio = dpr();
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(220, Math.floor((width * height) / 3800));
      stars = new Array(count).fill(0).map(() => {
        const depth = Math.pow(Math.random(), 1.8); // more far stars
        const spritePick = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          d: depth, // 0..1 (0 near, 1 far)
          s: Math.random() * 1.2 + 0.35, // base size
          a: Math.random() * 0.5 + 0.22,
          t: Math.random() * 0.9 + 0.1,
          p: Math.random() * Math.PI * 2,
          vy: (Math.random() * 0.28 + 0.05) * (0.35 + (1 - depth) * 0.8),
          vx: (Math.random() - 0.5) * 0.06,
          sprite: spritePick < 0.72 ? 0 : spritePick < 0.86 ? 1 : spritePick < 0.95 ? 2 : 3
        };
      });
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (const s of stars) {
        s.p += 0.02;
        const twinkle = s.a + Math.sin(s.p + time * 0.001) * 0.22 * s.t;
        ctx.globalAlpha = Math.max(0.08, Math.min(1, twinkle));

        const parallaxX = pointerNX * 64 * (1 - s.d);
        const parallaxY = pointerNY * 52 * (1 - s.d);
        const px = s.x + parallaxX;
        const py = s.y + parallaxY;

        const scale = s.s * (0.55 + (1 - s.d) * 0.65);
        const size = scale * 14;
        ctx.drawImage(sprites[s.sprite], px - size / 2, py - size / 2, size, size);

        // Slow drift
        s.y += s.vy;
        s.x += s.vx;
        if (s.y > height + 2) s.y = -2;
        if (s.x > width + 2) s.x = -2;
        if (s.x < -2) s.x = width + 2;
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      if (!prefersReducedMotion) window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (!prefersReducedMotion) window.requestAnimationFrame(draw);
    else draw(0);
  }
})();
