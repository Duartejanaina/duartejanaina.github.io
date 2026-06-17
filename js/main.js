(function () {
  'use strict';

  // ── Animated grid background ──
  const canvas = document.getElementById('grid-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, frame = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function drawGrid() {
      ctx.clearRect(0, 0, w, h);
      const spacing = 48;
      const offset = (frame * 0.15) % spacing;

      ctx.strokeStyle = 'rgba(45, 140, 240, 0.06)';
      ctx.lineWidth = 1;

      for (let x = -spacing + offset; x < w + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = -spacing + offset; y < h + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // subtle data points
      for (let i = 0; i < 12; i++) {
        const px = ((i * 137 + frame * 0.3) % w);
        const py = ((i * 89 + frame * 0.2) % h);
        ctx.fillStyle = `rgba(0, 212, 170, ${0.15 + 0.1 * Math.sin(frame * 0.02 + i)})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      frame++;
      requestAnimationFrame(drawGrid);
    }

    resize();
    drawGrid();
    window.addEventListener('resize', resize);
  }

  // ── Mobile nav ──
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Counter animation ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target).toLocaleString('pt-BR');
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('pt-BR') + suffix;
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.counter').forEach((c) => counterObserver.observe(c));

  // ── Mini bar charts in metric cards ──
  document.querySelectorAll('.metric-chart').forEach((chart) => {
    const values = chart.dataset.values.split(',').map(Number);
    const max = Math.max(...values);
    values.forEach((v) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = '0%';
      chart.appendChild(bar);
      requestAnimationFrame(() => {
        bar.style.height = `${(v / max) * 100}%`;
      });
    });
  });

  // ── Scroll reveal ──
  const revealTargets = document.querySelectorAll(
    '.section-header, .metric-card, .stack-group, .project-card, .pub-item, .contact-card, .about-grid p'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
})();
