/* ═══════════════════════════════════════════════════════
   MINIMORPHIC — Hub Controller
   ═══════════════════════════════════════════════════════ */

// ── Session guard ──────────────────────────────────────
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

// ── Project data ───────────────────────────────────────
const PROJECTS = [
  {
    id:    'slate',
    title: 'SLATE',
    desc:  'My custom laptop build. Designing the whole thing from scratch.',
    icon:  '💻',
    status:'active',
    url:   '../client/projects/SLATE/hub.html'
  },
  {
    id:    'desk',
    title: '2026 Desk',
    desc:  'L-shaped sit/stand desk with HDMI switching for three monitors.',
    icon:  '🖥️',
    status:'active',
    url:   '../client/projects/DeskProject/hub.html'
  }
  // Add more projects here and the radial layout auto-adjusts
];

// ── DOM refs ───────────────────────────────────────────
const intro      = document.getElementById('intro');
const hub        = document.getElementById('hub');
const selector   = document.getElementById('selector');
const hubCircle  = document.getElementById('hubCircle');
const preview    = document.getElementById('preview');
const prevTitle  = document.getElementById('previewTitle');
const prevDesc   = document.getElementById('previewDesc');
const prevCta    = document.getElementById('previewCta');
const exitOv     = document.getElementById('exitOverlay');
const userBadge  = document.getElementById('userBadge');
const logoutBtn  = document.getElementById('logoutBtn');

// ── State ──────────────────────────────────────────────
let selected = 0;
let cards    = [];
let connectors = [];

// ── Build radial cards ─────────────────────────────────
function buildCards(){
  const n = PROJECTS.length;
  const radius = Math.min(selector.offsetWidth, selector.offsetHeight) * 0.38;
  const startAngle = -Math.PI/2; // top

  PROJECTS.forEach((proj,i)=>{
    const angle = startAngle + (2*Math.PI/n)*i;

    // connector line
    const conn = document.createElement('div');
    conn.className = 'connector';
    const connLen = radius - 70;
    conn.style.width = connLen + 'px';
    conn.style.transform = `rotate(${angle}rad)`;
    conn.style.left = '50%';
    conn.style.top  = '50%';
    selector.appendChild(conn);
    connectors.push(conn);

    // card
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.index = i;
    card.innerHTML = `
      <div class="card-icon" style="background:${proj.status==='active'?'rgba(183,223,170,.12)':'rgba(158,205,230,.1)'}">${proj.icon}</div>
      <div class="card-title">${proj.title}</div>
      <div class="card-desc">${proj.desc}</div>
      <span class="card-status ${proj.status}">${proj.status}</span>
    `;

    // position around the circle
    const cx = 50 + Math.cos(angle)*((radius/selector.offsetWidth)*100);
    const cy = 50 + Math.sin(angle)*((radius/selector.offsetHeight)*100);
    card.style.left = cx + '%';
    card.style.top  = cy + '%';

    selector.appendChild(card);
    cards.push(card);

    // stagger reveal
    setTimeout(()=> card.classList.add('placed'), 150*i);

    // mouse events
    card.addEventListener('mouseenter',()=>{ selected=i; updateSelection(); });
    card.addEventListener('click',()=>{ selected=i; updateSelection(); openProject(); });
  });
}

// ── Selection ──────────────────────────────────────────
function updateSelection(){
  cards.forEach((c,i)=>{
    c.classList.toggle('selected', i===selected);
  });
  connectors.forEach((c,i)=>{
    c.classList.toggle('active', i===selected);
  });
  document.querySelectorAll('.orbit').forEach(o=> o.classList.add('glow'));

  const proj = PROJECTS[selected];
  prevTitle.textContent = proj.title;
  prevDesc.textContent  = proj.desc;
  preview.classList.add('show');
}

// ── Open project ───────────────────────────────────────
function openProject(){
  const proj = PROJECTS[selected];
  if(!proj.url || proj.url==='#') return;

  exitOv.classList.add('go');
  setTimeout(()=>{ window.location.href = proj.url; }, 450);
}

// ── Keyboard ───────────────────────────────────────────
document.addEventListener('keydown', e=>{
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){
    e.preventDefault();
    selected = (selected+1) % PROJECTS.length;
    updateSelection();
  } else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){
    e.preventDefault();
    selected = (selected-1+PROJECTS.length) % PROJECTS.length;
    updateSelection();
  } else if(e.key==='Enter'){
    e.preventDefault();
    openProject();
  }
});

// Center circle click
hubCircle.addEventListener('click', openProject);
prevCta.addEventListener('click', openProject);

// ── User badge & logout ────────────────────────────────
if(window.MM_USER){
  userBadge.textContent = '// signed in as ' + window.MM_USER;
}
logoutBtn.addEventListener('click',()=>{
  localStorage.removeItem('mm_session');
  sessionStorage.removeItem('mm_animations_played');
  localStorage.removeItem('mm_current_project');
  window.location.href = '../index.html';
});

// ── Boot sequence ──────────────────────────────────────
window.addEventListener('load',()=>{
  // Has the intro already played this session?
  const introPlayed = sessionStorage.getItem('mm_intro_played');
  const introDuration = introPlayed ? 0 : 3400;

  if(introPlayed) intro.classList.add('done');

  setTimeout(()=>{
    intro.classList.add('done');
    sessionStorage.setItem('mm_intro_played','1');
    hub.classList.add('visible');
    buildCards();
    updateSelection();
  }, introDuration);
});