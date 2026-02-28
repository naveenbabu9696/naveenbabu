const themeToggle = document.getElementById('themeToggle');
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
const yearEl = document.getElementById('year');
const projectsGrid = document.getElementById('projectsGrid');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const setTheme = (theme) => {
  const isLight = theme === 'light';
  document.documentElement.classList.toggle('light', isLight);
  localStorage.setItem('site-theme', theme);
};

const savedTheme = localStorage.getItem('site-theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  setTheme(savedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    setTheme(next);
  });
}

if (menuBtn && mainNav) {
  menuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

const renderProjects = (projects) => {
  if (!projectsGrid) {
    return;
  }

  if (!Array.isArray(projects) || projects.length === 0) {
    projectsGrid.innerHTML = '<p class="muted">No projects found.</p>';
    return;
  }

  projectsGrid.innerHTML = '';
  projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project';

    const techText = Array.isArray(project.tech) ? project.tech.join(', ') : '';
    const highlights = Array.isArray(project.highlights)
      ? `<ul>${project.highlights.map((item) => `<li>${item}</li>`).join('')}</ul>`
      : '';
    const href = project.live || project.repo;
    const action = href
      ? `<a href="${href}" target="_blank" rel="noopener" class="btn">View</a>`
      : '';

    card.innerHTML = `
      <h3>${project.title || ''}</h3>
      <p class="muted">${project.period || ''}</p>
      <p>${project.description || ''}</p>
      ${highlights}
      <p><strong>Tech:</strong> ${techText}</p>
      ${action}
    `;

    projectsGrid.appendChild(card);
  });
};

fetch('/projects.json')
  .then((response) => response.json())
  .then((data) => renderProjects(data))
  .catch(() => {
    if (projectsGrid) {
      projectsGrid.innerHTML = '<p class="muted">Unable to load projects right now.</p>';
    }
  });