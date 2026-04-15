/*
  Space / Cosmos Portfolio — interactions
  v2 — Three.js removed; Saturn is now a pure CSS-animated image.
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
    pointerNX = 0;
    pointerNY = 0;
    root.style.setProperty('--mx', '0px');
    root.style.setProperty('--my', '0px');
  }

  // Scroll parallax (Saturn floats gently while scrolling)
  let scrollRaf = 0;
  const updateScrollParallax = () => {
    const y = window.scrollY || 0;
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

      if (!canAjax) {
        setStatus('info', 'Sending…');
        setSending(true);
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
      makeSprite(255, 255, 255),
      makeSprite(125, 211, 252),
      makeSprite(196, 181, 253),
      makeSprite(253, 230, 138)
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
        const depth = Math.pow(Math.random(), 1.8);
        const spritePick = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          d: depth,
          s: Math.random() * 1.2 + 0.35,
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
