/* 
   =======================================
   MINIMORPHIC — Transition Controller [JS]
   =======================================
*/

//  Session guard 
(function(){
  const raw = localStorage.getItem('mm_session');
  if(!raw){ window.location.href='../index.html'; return; }
  try{
    const s = JSON.parse(raw);
    const MAX = 12*60*60*1000;
    if(!s.time || Date.now()-s.time>MAX){
      localStorage.removeItem('mm_session');
      window.location.href='../index.html'; return;
    }
    window.MM_USER = s.user || 'guest';
  }catch{
    localStorage.removeItem('mm_session');
    window.location.href='../index.html';
  }
})();

//  Project data 
const PROJECTS = [
  {
    id:    'slate',
    title: 'SLATE',
    desc:  'My custom laptop build. Designing the whole thing from scratch.',
    icon:  '',
    status:'paused',
    url:   '../client/projects/SLATE/hub.html'
  },
  {
    id:    'desk',
    title: '2026 Desk',
    desc:  'L-shaped sit/stand desk with HDMI switching for three monitors.',
    icon:  '',
    status:'active',
    url:   '../client/projects/DeskProject/hub.html'
  }
  // Add more projects here
];

//  DOM refs 
const intro      = document.getElementById('intro');
const hub        = document.getElementById('hub');
const container  = document.getElementById('projectsContainer');
const exitOv     = document.getElementById('exitOverlay');
const userBadge  = document.getElementById('userBadge');
const logoutBtn  = document.getElementById('logoutBtn');

//  State 
let selected = 0;
let projectItems = [];

//  Build project list 
function buildProjects(){
  PROJECTS.forEach((proj, i) => {
    const item = document.createElement('div');
    item.className = 'project-item';
    item.dataset.index = i;
    item.innerHTML = `
      <div class="project-header">
        <div class="project-icon">${proj.icon}</div>
        <div class="project-title">${proj.title}</div>
        <span class="project-status ${proj.status}">${proj.status}</span>
      </div>
      <div class="project-desc">${proj.desc}</div>
    `;

    container.appendChild(item);
    projectItems.push(item);

    // Stagger animation
    setTimeout(() => item.classList.add('show'), 100 * i);

    // Click to select and open
    item.addEventListener('click', () => {
      selected = i;
      updateSelection();
      setTimeout(openProject, 200);
    });

    // Hover to preview
    item.addEventListener('mouseenter', () => {
      selected = i;
      updateSelection();
    });
  });
}

// Selection 
function updateSelection(){
  projectItems.forEach((item, i) => {
    item.classList.toggle('selected', i === selected);
  });
}

//  Open project 
function openProject(){
  const proj = PROJECTS[selected];
  if(!proj.url || proj.url === '#') return;

  exitOv.classList.add('go');
  setTimeout(() => { window.location.href = proj.url; }, 450);
}

//  Keyboard navigation 
document.addEventListener('keydown', e => {
  if(e.key === 'ArrowDown'){
    e.preventDefault();
    selected = (selected + 1) % PROJECTS.length;
    updateSelection();
  } else if(e.key === 'ArrowUp'){
    e.preventDefault();
    selected = (selected - 1 + PROJECTS.length) % PROJECTS.length;
    updateSelection();
  } else if(e.key === 'Enter'){
    e.preventDefault();
    openProject();
  }
});

//  User badge & logout 
if(window.MM_USER){
  userBadge.textContent = '// ' + window.MM_USER.toUpperCase();
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('mm_session');
  sessionStorage.removeItem('mm_intro_played');
  localStorage.removeItem('mm_current_project');
  window.location.href = '../index.html';
});

//  Boot sequence 
window.addEventListener('load', () => {
  const introPlayed = sessionStorage.getItem('mm_intro_played');
  const introDuration = introPlayed ? 0 : 3200;

  if(introPlayed) intro.classList.add('done');

  setTimeout(() => {
    intro.classList.add('done');
    sessionStorage.setItem('mm_intro_played', '1');
    hub.classList.add('visible');
    buildProjects();
    updateSelection();
    if(typeof renderModels === 'function') renderModels();
  }, introDuration);
});