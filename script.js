/* ═══════════════════════════════════════════════════════════
   Naveen Babu Chilukuri — Portfolio Script
   Theme toggle, mobile nav, scroll-reveal, active link,
   and project rendering from projects.json
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const themeToggle = $('#themeToggle');
  const menuBtn = $('#menuBtn');
  const mainNav = $('#mainNav');
  const yearEl = $('#year');
  const projectsGrid = $('#projectsGrid');

  // ── Year ────────────────────────────────────────────
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Theme ───────────────────────────────────────────
  const setTheme = (theme) => {
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('site-theme', theme);
  };

  const saved = localStorage.getItem('site-theme');
  if (saved === 'light' || saved === 'dark') setTheme(saved);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(document.documentElement.classList.contains('light') ? 'dark' : 'light');
    });
  }

  // ── Mobile Nav ──────────────────────────────────────
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
    mainNav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => mainNav.classList.remove('open'))
    );
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuBtn.contains(e.target)) {
        mainNav.classList.remove('open');
      }
    });
  }

  // ── Active Nav Link on Scroll ───────────────────────
  const sections = $$('section[id]');
  const navLinks = $$('.main-nav a');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach((s) => {
      const top = s.offsetTop;
      const height = s.offsetHeight;
      const id = s.getAttribute('id');
      navLinks.forEach((a) => {
        if (a.getAttribute('href') === '#' + id) {
          a.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
      });
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ── Scroll Reveal ───────────────────────────────────
  const revealElements = $$('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));

  // ── Render Projects ─────────────────────────────────
  const renderProjects = (projects) => {
    if (!projectsGrid) return;

    if (!Array.isArray(projects) || projects.length === 0) {
      projectsGrid.innerHTML = '<p style="color:var(--muted)">No projects found.</p>';
      return;
    }

    projectsGrid.innerHTML = '';

    projects.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'project-card reveal' + (i % 2 ? ' reveal-delay-1' : '');

      const techHtml = Array.isArray(p.tech)
        ? `<div class="project-tech">${p.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('')}</div>`
        : '';

      const highlightsHtml = Array.isArray(p.highlights)
        ? `<ul>${p.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>`
        : '';

      const href = p.live || p.repo;
      const linkHtml = href
        ? `<a href="${href}" target="_blank" rel="noopener" class="project-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Project
          </a>`
        : '';

      card.innerHTML = `
        <h3>${p.title || ''}</h3>
        ${p.period ? `<span class="project-period">${p.period}</span>` : ''}
        <p>${p.description || ''}</p>
        ${highlightsHtml}
        ${techHtml}
        ${linkHtml}
      `;

      projectsGrid.appendChild(card);

      // re-observe new reveal elements
      observer.observe(card);
    });
  };

  // Use relative path — critical for GitHub Pages sub-directory deployment
  fetch('projects.json')
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(renderProjects)
    .catch(() => {
      if (projectsGrid) {
        projectsGrid.innerHTML = '<p style="color:var(--muted)">Unable to load projects.</p>';
      }
    });
})();