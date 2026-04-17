/*
  Space / Cosmos Portfolio — interactions (simplified)
  - Roles typing effect
  - Scroll reveal + active nav
  - Contact form validation + Formspree submit
*/

(() => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Loader */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    if (!loader) return;
    loader.classList.add('is-hidden');
    window.setTimeout(() => loader.remove(), 900);
  });

  /* Typing roles */
  const roles = ['Mobile Developer', 'Web Developer', 'Desktop Developer', 'UI/UX Designer'];
  const roleEl = document.getElementById('role-typed');
  if (roleEl && !prefersReducedMotion) {
    let roleI = 0;
    let charI = 0;
    let isDeleting = false;

    const typeSpeed = 90;
    const deleteSpeed = 50;
    const pauseEnd = 1600;
    const pauseStart = 400;

    function typeRole() {
      const current = roles[roleI];
      if (isDeleting) {
        roleEl.textContent = current.substring(0, charI);
        charI--;
        if (charI < 0) {
          isDeleting = false;
          roleI = (roleI + 1) % roles.length;
          setTimeout(typeRole, pauseStart);
          return;
        }
        setTimeout(typeRole, deleteSpeed);
      } else {
        roleEl.textContent = current.substring(0, charI + 1);
        charI++;
        if (charI === current.length) {
          isDeleting = true;
          setTimeout(typeRole, pauseEnd);
          return;
        }
        setTimeout(typeRole, typeSpeed);
      }
    }
    typeRole();
  } else if (roleEl) {
    roleEl.textContent = roles[0];
  }

  /* Nav */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('is-open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      });
    });
  }

  /* Scroll reveal */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* Active section nav */
  const sections = document.querySelectorAll('[data-section]');
  const navItems = document.querySelectorAll('.nav__link');

  if (sections.length && navItems.length && 'IntersectionObserver' in window) {
    const navObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            navItems.forEach((link) => {
              const href = link.getAttribute('href').substring(1);
              link.classList.toggle('active', href === entry.target.id);
            });
          }
        });
      },
      { threshold: [0.4], rootMargin: '-15% 0px -15% 0px' }
    );
    sections.forEach((s) => navObs.observe(s));
  }

  /* Contact form */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const successOverlay = document.getElementById('form-success');
  const successClose = document.getElementById('form-success-close');

  if (form && statusEl) {
    form.addEventListener('submit', async (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }

      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      statusEl.textContent = 'Sending…';
      statusEl.className = 'form-status loading';

      try {
        const formData = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.reset();
          statusEl.textContent = '';
          statusEl.className = 'form-status';
          if (successOverlay) {
            successOverlay.setAttribute('aria-hidden', 'false');
            successOverlay.classList.add('is-visible');
          }
        } else {
          statusEl.textContent = 'Error. Please try again.';
          statusEl.className = 'form-status error';
        }
      } catch (err) {
        statusEl.textContent = 'Network error. Try again.';
        statusEl.className = 'form-status error';
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    if (successClose && successOverlay) {
      successClose.addEventListener('click', () => {
        successOverlay.setAttribute('aria-hidden', 'true');
        successOverlay.classList.remove('is-visible');
      });
    }
  }
})();
