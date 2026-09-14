(() => {
  'use strict';

  const header = document.getElementById('site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const toast = document.getElementById('prototype-toast');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ------------------------------------------------
  // Header
  // ------------------------------------------------
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 42);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // ------------------------------------------------
  // Mobile menu
  // ------------------------------------------------
  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  };

  const openMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation menu');
    mobileMenu.hidden = false;
    document.body.classList.add('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : openMenu();
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040) closeMenu();
  }, { passive: true });

  // ------------------------------------------------
  // Prototype feedback for any intentionally unfinished links
  // ------------------------------------------------
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  };

  document.querySelectorAll('[data-prototype-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('This supporting function remains scheduled for a later build stage.');
    });
  });

  // ------------------------------------------------
  // Living Light Hero
  // ------------------------------------------------
  const hero = document.getElementById('hero');
  const range = document.getElementById('lightline-range');
  const stageButtons = [...document.querySelectorAll('[data-light-stage]')];
  const contextLabel = document.getElementById('living-context');
  const timeStatus = document.getElementById('living-time-status');
  const cta = document.getElementById('living-cta');
  const ctaLabel = document.getElementById('living-cta-label');
  const conditionNote = document.getElementById('living-condition');
  const canvas = document.getElementById('firefly-canvas');


  // ------------------------------------------------
  // Visitor guide print / save action
  // ------------------------------------------------
  document.querySelectorAll('[data-print-guide]').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });

  if (!hero || !range) return;

  const stateCopy = {
    day: {
      context: 'MANGROVE KAYAK',
      time: 'DAYLIGHT',
      condition: 'Availability depends on low/high tide conditions and resulting water depth.',
      aria: 'Daylight'
    },
    golden: {
      context: 'GOLDEN HOUR',
      time: 'GOLDEN HOUR',
      condition: '',
      aria: 'Golden hour'
    },
    night: {
      context: 'FIREFLY BOARDWALK · NIGHT KAYAK',
      time: 'AFTER DARK',
      condition: '',
      aria: 'After dark'
    }
  };

  let fireflyIntensity = 0;
  let currentStage = 'day';

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const getStage = (progress) => {
    if (progress < 0.34) return 'day';
    if (progress < 0.68) return 'golden';
    return 'night';
  };

  const updateStageUI = (stage) => {
    if (stage === currentStage && contextLabel?.textContent === stateCopy[stage].context) {
      return;
    }

    currentStage = stage;
    const copy = stateCopy[stage];

    if (contextLabel) contextLabel.textContent = copy.context;
    if (timeStatus) timeStatus.textContent = copy.time;
    if (ctaLabel) ctaLabel.textContent = 'BOOK YOUR EXPERIENCE';
    if (cta) cta.href = 'booking.html';
    if (conditionNote) {
      const conditionText = conditionNote.querySelector('span');
      conditionNote.hidden = !copy.condition;
      if (conditionText) conditionText.textContent = copy.condition;
    }

    range.setAttribute('aria-valuetext', copy.aria);

    stageButtons.forEach((button) => {
      const active = button.dataset.stageName === stage;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const setLight = (value) => {
    const raw = clamp(Number(value) / 100);
    const percent = raw * 100;

    // Three authentic scenes overlap softly instead of snapping.
    const day = clamp(1 - raw * 1.55);
    const golden = clamp(1 - Math.abs(raw - 0.50) * 2.05);
    const night = clamp((raw - 0.34) / 0.66);

    hero.style.setProperty('--scene-day', day.toFixed(3));
    hero.style.setProperty('--scene-golden', golden.toFixed(3));
    hero.style.setProperty('--scene-night', night.toFixed(3));
    hero.style.setProperty('--lightline-progress', `${percent.toFixed(1)}%`);

    // Fireflies begin faintly around golden hour and build into night.
    fireflyIntensity = clamp((raw - 0.30) / 0.70);

    const stage = getStage(raw);
    updateStageUI(stage);

    range.value = String(Math.round(percent));
  };

  // ------------------------------------------------
  // Living Light autoplay
  //
  // Wix Studio portability note:
  // This uses only plain DOM events, requestAnimationFrame, timers,
  // IntersectionObserver and matchMedia. The same behavior can be
  // moved into a Wix Custom Element / Velo implementation without
  // relying on an external animation library.
  // ------------------------------------------------
  const autoStops = [8, 50, 92];
  const AUTO_HOLD_MS = 6800;
  const AUTO_TRANSITION_MS = 1900;
  const AUTO_RESUME_MS = 12000;

  let autoTimer = 0;
  let resumeTimer = 0;
  let lightRaf = 0;
  let autoHeroVisible = true;
  let autoPageVisible = !document.hidden;
  let heroHasFocus = false;

  const clearAutoTimer = () => {
    window.clearTimeout(autoTimer);
    autoTimer = 0;
  };

  const clearResumeTimer = () => {
    window.clearTimeout(resumeTimer);
    resumeTimer = 0;
  };

  const stopLightTransition = () => {
    if (lightRaf) cancelAnimationFrame(lightRaf);
    lightRaf = 0;
  };

  const closestStopIndex = (value) => {
    let bestIndex = 0;
    let bestDistance = Infinity;

    autoStops.forEach((stop, index) => {
      const distance = Math.abs(stop - value);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  };

  const canAutoPlay = () =>
    !reduceMotion.matches &&
    autoHeroVisible &&
    autoPageVisible &&
    !heroHasFocus;

  const easeInOutCubic = (t) =>
    t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const animateLightTo = (target, duration, onComplete) => {
    stopLightTransition();

    const start = Number(range.value);
    const startedAt = performance.now();

    const tick = (now) => {
      if (!canAutoPlay()) {
        lightRaf = 0;
        return;
      }

      const elapsed = now - startedAt;
      const progress = clamp(elapsed / duration);
      const eased = easeInOutCubic(progress);
      const nextValue = start + (target - start) * eased;

      setLight(nextValue);

      if (progress < 1) {
        lightRaf = requestAnimationFrame(tick);
      } else {
        lightRaf = 0;
        setLight(target);
        onComplete?.();
      }
    };

    lightRaf = requestAnimationFrame(tick);
  };

  const scheduleAutoAdvance = (delay = AUTO_HOLD_MS) => {
    clearAutoTimer();
    if (!canAutoPlay()) return;

    autoTimer = window.setTimeout(() => {
      autoTimer = 0;
      if (!canAutoPlay()) return;

      const currentValue = Number(range.value);
      const currentIndex = closestStopIndex(currentValue);
      const targetIndex = (currentIndex + 1) % autoStops.length;
      const target = autoStops[targetIndex];

      animateLightTo(target, AUTO_TRANSITION_MS, () => {
        scheduleAutoAdvance();
      });
    }, delay);
  };

  const pauseAutoplayForInteraction = () => {
    clearAutoTimer();
    clearResumeTimer();
    stopLightTransition();

    resumeTimer = window.setTimeout(() => {
      resumeTimer = 0;
      scheduleAutoAdvance(900);
    }, AUTO_RESUME_MS);
  };

  const syncAutoplay = () => {
    if (!canAutoPlay()) {
      clearAutoTimer();
      stopLightTransition();
      return;
    }

    if (!autoTimer && !lightRaf && !resumeTimer) {
      scheduleAutoAdvance();
    }
  };

  range.addEventListener('input', (event) => {
    pauseAutoplayForInteraction();
    setLight(event.currentTarget.value);
  });

  range.addEventListener('pointerdown', pauseAutoplayForInteraction);
  range.addEventListener('keydown', pauseAutoplayForInteraction);

  stageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      pauseAutoplayForInteraction();
      const value = Number(button.dataset.lightStage || 0);
      setLight(value);
      range.focus({ preventScroll: true });
    });
  });

  hero.addEventListener('focusin', () => {
    heroHasFocus = true;
    clearAutoTimer();
    stopLightTransition();
  });

  hero.addEventListener('focusout', () => {
    window.setTimeout(() => {
      heroHasFocus = hero.contains(document.activeElement);
      if (!heroHasFocus) {
        clearResumeTimer();
        resumeTimer = window.setTimeout(() => {
          resumeTimer = 0;
          syncAutoplay();
        }, AUTO_RESUME_MS);
      }
    }, 0);
  });

  setLight(range.value);
  scheduleAutoAdvance();

  // ------------------------------------------------
  // Fireflies
  // Decorative interface effect — not documentary wildlife footage.
  // Their intensity now follows the Living Light slider.
  // ------------------------------------------------
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let rafId = 0;
  let lastTime = 0;
  let running = false;
  let heroVisible = true;
  let pageVisible = !document.hidden;

  const sprites = [];

  const makeSprite = (size, core, halo) => {
    const sprite = document.createElement('canvas');
    const spriteDpr = 2;
    sprite.width = size * spriteDpr;
    sprite.height = size * spriteDpr;

    const sctx = sprite.getContext('2d');
    const c = sprite.width / 2;
    const gradient = sctx.createRadialGradient(c, c, 0, c, c, c);

    gradient.addColorStop(0, core);
    gradient.addColorStop(0.15, 'rgba(255,255,210,.94)');
    gradient.addColorStop(0.42, halo);
    gradient.addColorStop(1, 'rgba(210,255,104,0)');

    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, sprite.width, sprite.height);

    return sprite;
  };

  sprites.push(
    makeSprite(24, 'rgba(255,255,225,1)', 'rgba(225,255,108,.48)'),
    makeSprite(31, 'rgba(255,252,205,1)', 'rgba(214,247,103,.40)'),
    makeSprite(38, 'rgba(255,250,193,1)', 'rgba(235,255,129,.34)')
  );

  const particleCount = () => {
    if (reduceMotion.matches) return Math.min(7, Math.max(3, Math.round(width / 210)));
    if (width < 560) return 10;
    if (width < 900) return 16;
    if (width < 1280) return 24;
    return 34;
  };

  const resetParticle = (particle, anywhere = false) => {
    const mostlyRight = Math.random() < 0.82;

    particle.x = mostlyRight
      ? width * (0.42 + Math.random() * 0.56)
      : width * (0.12 + Math.random() * 0.78);

    particle.y = height * (0.17 + Math.random() * 0.68);

    if (!anywhere) {
      particle.x = width + Math.random() * 24;
    }

    particle.size = 0.45 + Math.random() * 0.72;
    particle.sprite = Math.floor(Math.random() * sprites.length);
    particle.alpha = 0.22 + Math.random() * 0.58;
    particle.phase = Math.random() * Math.PI * 2;
    particle.pulse = 0.0007 + Math.random() * 0.0016;
    particle.flicker = 0.0026 + Math.random() * 0.0044;
    particle.vx = (-0.002 - Math.random() * 0.008) * width;
    particle.vy = (-0.0014 + Math.random() * 0.0028) * height;
    particle.drift = 5 + Math.random() * 14;
    particle.driftRate = 0.00018 + Math.random() * 0.00036;
    particle.seed = Math.random() * 1000;
    particle.lifeOffset = Math.random() * 5000;
  };

  const rebuildParticles = () => {
    particles = Array.from({ length: particleCount() }, () => {
      const particle = {};
      resetParticle(particle, true);
      return particle;
    });
  };

  const resizeCanvas = () => {
    const rect = hero.getBoundingClientRect();

    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    rebuildParticles();

    if (reduceMotion.matches) {
      renderStatic();
    }
  };

  const drawParticle = (particle, time) => {
    if (fireflyIntensity <= 0.01) return;

    const pulse = (Math.sin(time * particle.pulse + particle.phase) + 1) * 0.5;
    const flicker = (Math.sin(time * particle.flicker + particle.seed) + 1) * 0.5;
    const life = (Math.sin((time + particle.lifeOffset) * 0.00027) + 1) * 0.5;

    const visibility = 0.15 + (pulse * 0.56 + flicker * 0.18 + life * 0.11);
    const alpha = Math.min(
      0.90,
      particle.alpha * visibility * fireflyIntensity
    );

    if (alpha < 0.015) return;

    const sprite = sprites[particle.sprite];
    const renderSize = sprite.width / 2 * particle.size;

    ctx.globalAlpha = alpha;
    ctx.drawImage(
      sprite,
      particle.x - renderSize / 2,
      particle.y - renderSize / 2,
      renderSize,
      renderSize
    );

    ctx.globalAlpha = Math.min(1, alpha * 1.35);
    ctx.fillStyle = '#fffbc7';
    ctx.beginPath();
    ctx.arc(
      particle.x,
      particle.y,
      Math.max(0.65, 1.05 * particle.size),
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  const renderStatic = () => {
    ctx.clearRect(0, 0, width, height);

    const staticTime = 1500;
    particles.forEach((particle) => drawParticle(particle, staticTime));

    ctx.globalAlpha = 1;
  };

  const frame = (time) => {
    if (!running) return;

    const dt = Math.min(32, Math.max(0, time - lastTime || 16));
    lastTime = time;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.vx * (dt / 1000);
      particle.y += particle.vy * (dt / 1000);
      particle.y += Math.sin(time * particle.driftRate + particle.seed) * particle.drift * (dt / 1000);
      particle.x += Math.cos(time * particle.driftRate * 0.72 + particle.phase) * (particle.drift * 0.42) * (dt / 1000);

      if (
        particle.x < -28 ||
        particle.y < -30 ||
        particle.y > height + 30
      ) {
        resetParticle(particle, false);
        particle.y = height * (0.17 + Math.random() * 0.68);
      }

      drawParticle(particle, time);
    });

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(frame);
  };

  const shouldAnimate = () =>
    !reduceMotion.matches &&
    pageVisible &&
    heroVisible;

  const syncAnimation = () => {
    if (shouldAnimate()) {
      if (!running) {
        running = true;
        lastTime = 0;
        rafId = requestAnimationFrame(frame);
      }
    } else {
      if (running) {
        running = false;
        cancelAnimationFrame(rafId);
      }
      renderStatic();
    }
  };

  const heroObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        heroVisible = entries[0]?.isIntersecting ?? true;
        autoHeroVisible = heroVisible;
        syncAnimation();
        syncAutoplay();
      }, { threshold: 0.08 })
    : null;

  heroObserver?.observe(hero);

  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    autoPageVisible = pageVisible;
    syncAnimation();
    syncAutoplay();
  });

  const handleMotionChange = () => {
    rebuildParticles();
    if (reduceMotion.matches) {
      clearAutoTimer();
      clearResumeTimer();
      stopLightTransition();
    }
    syncAnimation();
    syncAutoplay();
  };

  if (typeof reduceMotion.addEventListener === 'function') {
    reduceMotion.addEventListener('change', handleMotionChange);
  } else if (typeof reduceMotion.addListener === 'function') {
    reduceMotion.addListener(handleMotionChange);
  }

  let resizeTimer;

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resizeCanvas();
      syncAnimation();
    }, 120);
  }, { passive: true });

  resizeCanvas();
  syncAnimation();
})();