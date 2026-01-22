// Basic interactivity: theme toggle, mobile menu and projects rendering
const themeToggle = document.getElementById('themeToggle');
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

themeToggle.addEventListener('click', ()=>{
  document.documentElement.classList.toggle('light');
  const isLight = document.documentElement.classList.contains('light');
  localStorage.setItem('site-theme', isLight? 'light':'dark');
});

menuBtn.addEventListener('click', ()=>{
  mainNav.classList.toggle('open');
});

// load projects from projects.json
fetch('/projects.json').then(r=>r.json()).then(list=>{
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  list.forEach(p=>{
    const div = document.createElement('article');
    div.className = 'project';
    div.innerHTML = `<h3>${p.title}</h3><p>${p.description}</p><p><strong>Tech:</strong> ${p.tech.join(', ')}</p><p><a href="${p.live||p.repo}" target="_blank" rel="noopener" class="btn">View</a></p>`;
    grid.appendChild(div);
  })
}).catch(()=>{
  document.getElementById('projectsGrid').innerHTML = '<p class="muted">No projects found.</p>'
});

// restore theme
(function(){
  const t = localStorage.getItem('site-theme');
  if(t==='light') document.documentElement.classList.add('light');
})();