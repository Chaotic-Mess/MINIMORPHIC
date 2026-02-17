/* 
   ===================================
   MINIMORPHIC — Collection Page [JS]
   ===================================
*/

// CAD-referenced 3D model data — projects: 2026 Desk, SLATE
const models = [
    {
        id: 1,
        title: "IR-Sensor Cover [V1]",
        project: "desk-2026",
        projectName: "2026 Desk",
        date: "2026-01-12",
        dateFormatted: "Jan 12, 2026",
        description: "Infrared sensor protective cover for the sit/stand desk's proximity detection system. Designed for FDM printing with snap-fit attachment points. Located in CAD/DESK-PROJECT-2026.",
        image: null,
        vertices: "4,218",
        faces: "8,392",
        materials: "1",
        fileSize: "0.8 MB",
        modelFile: "../../CAD/DESK-PROJECT-2026/IR-Sensor%20Cover%20%5BV1%5D.stl",
        projectLink: "../client/projects/DeskProject/phases/phaseOne/stepThree.html#CAD-IRCover"
    },
    {
        id: 2,
        title: "Monitor Arm Bracket",
        project: "desk-2026",
        projectName: "2026 Desk",
        date: "2026-01-18",
        dateFormatted: "Jan 18, 2026",
        description: "Custom bracket for triple-monitor mount interfacing with the L-shaped desk frame. Reinforced geometry for three 27\" displays with integrated cable routing channels.",
        image: null,
        vertices: "11,340",
        faces: "22,568",
        materials: "2",
        fileSize: "2.1 MB",
        projectLink: "../client/projects/DeskProject/hub.html"
    },
    {
        id: 3,
        title: "HDMI Switch Enclosure",
        project: "desk-2026",
        projectName: "2026 Desk",
        date: "2026-01-25",
        dateFormatted: "Jan 25, 2026",
        description: "Custom enclosure for the 3-input HDMI switching module. Features ventilation slots, LED light pipes, and a front-panel button cutout for source selection.",
        image: null,
        vertices: "7,856",
        faces: "15,624",
        materials: "2",
        fileSize: "1.4 MB",
        projectLink: "../client/projects/DeskProject/hub.html"
    },
    {
        id: 4,
        title: "Cable Management Tray",
        project: "desk-2026",
        projectName: "2026 Desk",
        date: "2026-02-01",
        dateFormatted: "Feb 1, 2026",
        description: "Under-desk cable management tray with segmented compartments. Mounts via rail system and accommodates power strips, USB hubs, and excess cable lengths.",
        image: null,
        vertices: "5,912",
        faces: "11,780",
        materials: "1",
        fileSize: "1.1 MB",
        projectLink: "../client/projects/DeskProject/hub.html"
    },
    {
        id: 5,
        title: "Sit/Stand Actuator Mount",
        project: "desk-2026",
        projectName: "2026 Desk",
        date: "2026-02-08",
        dateFormatted: "Feb 8, 2026",
        description: "Mounting bracket for linear actuators driving the sit/stand mechanism. Designed for load distribution across the L-shaped frame junction point.",
        image: null,
        vertices: "9,478",
        faces: "18,892",
        materials: "3",
        fileSize: "1.9 MB",
        projectLink: "../client/projects/DeskProject/hub.html"
    },
    {
        id: 6,
        title: "Chassis Bottom Panel",
        project: "slate",
        projectName: "SLATE",
        date: "2025-11-15",
        dateFormatted: "Nov 15, 2025",
        description: "Bottom chassis panel for the custom laptop build. Includes intake ventilation patterns, rubber foot mounting points, and access panels for storage bays.",
        image: null,
        vertices: "22,340",
        faces: "44,612",
        materials: "2",
        fileSize: "4.8 MB",
        projectLink: "../client/projects/SLATE/hub.html"
    },
    {
        id: 7,
        title: "Keyboard Plate",
        project: "slate",
        projectName: "SLATE",
        date: "2025-12-02",
        dateFormatted: "Dec 2, 2025",
        description: "CNC-machined keyboard mounting plate for mechanical key switches. Acoustically dampened design with integrated flex cuts for improved typing feel.",
        image: null,
        vertices: "16,782",
        faces: "33,458",
        materials: "1",
        fileSize: "3.6 MB",
        projectLink: "../client/projects/SLATE/hub.html"
    },
    {
        id: 8,
        title: "Display Hinge Assembly",
        project: "slate",
        projectName: "SLATE",
        date: "2025-12-18",
        dateFormatted: "Dec 18, 2025",
        description: "Dual-axis hinge mechanism for the laptop display. Features controlled friction torque and internal cable routing channel for the display ribbon cable.",
        image: null,
        vertices: "14,256",
        faces: "28,490",
        materials: "4",
        fileSize: "3.2 MB",
        projectLink: "../client/projects/SLATE/hub.html"
    },
    {
        id: 9,
        title: "Display Bezel",
        project: "slate",
        projectName: "SLATE",
        date: "2026-01-05",
        dateFormatted: "Jan 5, 2026",
        description: "Thin-profile display bezel with webcam cutout and microphone ports. Designed for injection molding with uniform wall thickness throughout.",
        image: null,
        vertices: "18,924",
        faces: "37,806",
        materials: "2",
        fileSize: "4.1 MB",
        projectLink: "../client/projects/SLATE/hub.html"
    }
];

// Color schemes for placeholders
const placeholderGradients = [
    'linear-gradient(135deg, #f4a6b4 0%, #e88b9a 100%)',
    'linear-gradient(135deg, #b8daf0 0%, #9ecde6 100%)',
    'linear-gradient(135deg, #c9e8bd 0%, #b7dfaa 100%)',
    'linear-gradient(135deg, #f7d4a8 0%, #f2c28f 100%)'
];

let currentFilter = 'all';
let currentModel = null;

// Three.js viewer state
let threeLoaded = false;
let THREE_NS = null;
let OrbitControlsClass, STLLoaderClass;
let STLExporterClass, OBJExporterClass, GLTFExporterClass;
let viewerScene = null, viewerCamera = null, viewerRenderer = null;
let viewerControls = null, viewerMesh = null, viewerGridHelper = null;
let viewerAnimId = null, wireframeEnabled = false, gridEnabled = true;
let defaultCameraPos = null, defaultControlsTarget = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // If embedded in the transition hub, rendering is triggered by transitionMain.js
    if (!document.getElementById('hub')) {
        renderModels();
    }
});

// Render all model cards
function renderModels() {
    const grid = document.getElementById('masonryGrid');
    grid.innerHTML = '';
    
    models.forEach((model, index) => {
        const card = createModelCard(model, index);
        grid.appendChild(card);
    });
}

// Create individual model card
function createModelCard(model, index) {
    const card = document.createElement('div');
    card.className = 'model-card';
    card.dataset.project = model.project;
    card.dataset.title = model.title.toLowerCase();
    card.onclick = () => openModal(model);
    
    const gradientIndex = index % placeholderGradients.length;
    const gradient = placeholderGradients[gradientIndex];
    
    card.innerHTML = `
        <div class="card-image">
            ${model.image ? 
                `<img src="${model.image}" alt="${model.title}">` :
                `<div class="image-placeholder" style="background: ${gradient};">3D</div>`
            }
        </div>
        <div class="card-content">
            <h3 class="card-title">${model.title}</h3>
            <div class="card-meta">
                <span class="card-project">${model.projectName}</span>
                <span class="card-date">${model.dateFormatted}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Open modal with model details
function openModal(model) {
    currentModel = model;
    const modal = document.getElementById('modelModal');
    
    // Populate modal content
    document.getElementById('modalTitle').textContent = model.title;
    document.getElementById('modalProject').textContent = model.projectName;
    document.getElementById('modalDate').textContent = model.dateFormatted;
    document.getElementById('modalDescription').textContent = model.description;
    document.getElementById('modalVertices').textContent = model.vertices;
    document.getElementById('modalFaces').textContent = model.faces;
    document.getElementById('modalMaterials').textContent = model.materials;
    document.getElementById('modalSize').textContent = model.fileSize;
    document.getElementById('modalProjectLink').href = model.projectLink;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Initialize 3D viewer
    initViewer(model);
}

// Close modal
function closeModal() {
    disposeViewer();
    const modal = document.getElementById('modelModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModel = null;
}

// Filter by project
function filterByProject(project) {
    currentFilter = project;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter cards
    const cards = document.querySelectorAll('.model-card');
    cards.forEach(card => {
        if (project === 'all' || card.dataset.project === project) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Search/filter models
function filterModels() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.model-card');
    
    cards.forEach(card => {
        const title = card.dataset.title;
        const project = card.dataset.project;
        const matchesSearch = title.includes(searchTerm);
        const matchesFilter = currentFilter === 'all' || project === currentFilter;
        
        if (matchesSearch && matchesFilter) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// ==========================================
// THREE.JS 3D VIEWER ENGINE
// ==========================================

// Load Three.js modules on demand via import map
async function ensureThreeJS() {
    if (threeLoaded) return;
    THREE_NS = await import('three');
    const [ctrlMod, stlLoadMod, stlExpMod, objExpMod, gltfExpMod] = await Promise.all([
        import('three/addons/controls/OrbitControls.js'),
        import('three/addons/loaders/STLLoader.js'),
        import('three/addons/exporters/STLExporter.js'),
        import('three/addons/exporters/OBJExporter.js'),
        import('three/addons/exporters/GLTFExporter.js')
    ]);
    OrbitControlsClass = ctrlMod.OrbitControls;
    STLLoaderClass = stlLoadMod.STLLoader;
    STLExporterClass = stlExpMod.STLExporter;
    OBJExporterClass = objExpMod.OBJExporter;
    GLTFExporterClass = gltfExpMod.GLTFExporter;
    threeLoaded = true;
}

// Initialize 3D viewer inside the modal
async function initViewer(model) {
    const container = document.getElementById('modelViewer');
    if (!container) return;

    container.innerHTML =
        '<div class="viewer-placeholder"><div class="viewer-icon">\u27F3</div><p>Loading 3D engine\u2026</p></div>';

    try {
        await ensureThreeJS();
    } catch (err) {
        container.innerHTML =
            '<div class="viewer-placeholder"><div class="viewer-icon" style="animation:none">\u2715</div><p>Failed to load 3D engine</p></div>';
        return;
    }

    // Bail out if modal was closed while loading
    const modal = document.getElementById('modelModal');
    if (!modal || !modal.classList.contains('active')) return;

    container.innerHTML = '';
    const T = THREE_NS;

    // Scene
    viewerScene = new T.Scene();
    viewerScene.background = new T.Color(0xf9f3eb);

    // Camera
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 400;
    viewerCamera = new T.PerspectiveCamera(45, w / h, 0.1, 2000);
    viewerCamera.position.set(50, 50, 50);

    // Renderer
    viewerRenderer = new T.WebGLRenderer({ antialias: true });
    viewerRenderer.setSize(w, h);
    viewerRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    viewerRenderer.shadowMap.enabled = true;
    viewerRenderer.toneMapping = T.ACESFilmicToneMapping;
    viewerRenderer.toneMappingExposure = 1.2;
    container.appendChild(viewerRenderer.domElement);

    // Controls
    viewerControls = new OrbitControlsClass(viewerCamera, viewerRenderer.domElement);
    viewerControls.enableDamping = true;
    viewerControls.dampingFactor = 0.08;
    viewerControls.minDistance = 2;
    viewerControls.maxDistance = 500;

    // Lighting
    viewerScene.add(new T.AmbientLight(0xffffff, 0.6));
    const sun = new T.DirectionalLight(0xffffff, 1.0);
    sun.position.set(60, 100, 60);
    sun.castShadow = true;
    viewerScene.add(sun);
    const fill = new T.DirectionalLight(0xd4a574, 0.3);
    fill.position.set(-40, 60, -40);
    viewerScene.add(fill);
    viewerScene.add(new T.HemisphereLight(0xffffff, 0xe8ddd0, 0.4));

    // Grid helper
    viewerGridHelper = new T.GridHelper(100, 20, 0xddd0c3, 0xe8ddd0);
    viewerScene.add(viewerGridHelper);
    gridEnabled = true;
    wireframeEnabled = false;

    // Load geometry
    if (model.modelFile) {
        await loadSTLModel(model);
    } else {
        createProceduralModel(model);
    }

    // Fit camera to model
    if (viewerMesh) fitCameraToObject(viewerMesh);

    defaultCameraPos = viewerCamera.position.clone();
    defaultControlsTarget = viewerControls.target.clone();

    // Render loop
    (function animate() {
        viewerAnimId = requestAnimationFrame(animate);
        if (viewerControls) viewerControls.update();
        if (viewerRenderer && viewerScene && viewerCamera)
            viewerRenderer.render(viewerScene, viewerCamera);
    })();

    // Responsive resize
    const ro = new ResizeObserver(() => {
        if (!viewerRenderer || !viewerCamera) return;
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        if (cw && ch) {
            viewerCamera.aspect = cw / ch;
            viewerCamera.updateProjectionMatrix();
            viewerRenderer.setSize(cw, ch);
        }
    });
    ro.observe(container);
    container._ro = ro;
}

// Load an STL file into the scene
function loadSTLModel(model) {
    const T = THREE_NS;
    return new Promise((resolve) => {
        new STLLoaderClass().load(
            model.modelFile,
            (geometry) => {
                geometry.computeVertexNormals();
                geometry.center();
                const mat = new T.MeshStandardMaterial({
                    color: 0xd4a574, metalness: 0.15, roughness: 0.55
                });
                viewerMesh = new T.Mesh(geometry, mat);
                viewerMesh.castShadow = true;
                viewerMesh.receiveShadow = true;
                viewerScene.add(viewerMesh);
                resolve();
            },
            undefined,
            () => { createProceduralModel(model); resolve(); }
        );
    });
}

// Generate representative procedural geometry per model
function createProceduralModel(model) {
    const T = THREE_NS;
    const mat  = new T.MeshStandardMaterial({ color: 0xd4a574, metalness: 0.15, roughness: 0.55 });
    const dark = new T.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 1 });
    const metal = new T.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.3 });
    const g = new T.Group();

    switch (model.id) {
        case 1: { // IR-Sensor Cover (fallback)
            viewerMesh = new T.Mesh(new T.CylinderGeometry(8, 10, 5, 32), mat);
            break;
        }
        case 2: { // Monitor Arm Bracket
            g.add(new T.Mesh(new T.BoxGeometry(4, 30, 8), mat));
            const arm = new T.Mesh(new T.BoxGeometry(20, 4, 8), mat);
            arm.position.set(8, -13, 0); g.add(arm);
            const tip = new T.Mesh(new T.BoxGeometry(4, 12, 8), mat);
            tip.position.set(18, -7, 0); g.add(tip);
            for (let y = -8; y <= 8; y += 8) {
                const ring = new T.Mesh(new T.TorusGeometry(1.5, 0.4, 8, 24), metal);
                ring.position.set(0, y, 4.1); g.add(ring);
            }
            viewerMesh = g; break;
        }
        case 3: { // HDMI Switch Enclosure
            g.add(new T.Mesh(new T.BoxGeometry(24, 6, 14), mat));
            const btn = new T.Mesh(new T.TorusGeometry(1.5, 0.3, 8, 24), metal);
            btn.position.set(-8, 0, 7.1); g.add(btn);
            for (let i = -8; i <= 8; i += 2) {
                const v = new T.Mesh(new T.BoxGeometry(1, 0.5, 8), dark);
                v.position.set(i, 3.1, 0); g.add(v);
            }
            viewerMesh = g; break;
        }
        case 4: { // Cable Management Tray
            g.add(new T.Mesh(new T.BoxGeometry(40, 1, 12), mat));
            const w1 = new T.Mesh(new T.BoxGeometry(40, 5, 1), mat);
            w1.position.set(0, 2.5, 5.5); g.add(w1);
            const w2 = new T.Mesh(new T.BoxGeometry(40, 5, 1), mat);
            w2.position.set(0, 2.5, -5.5); g.add(w2);
            [-10, 10].forEach(x => {
                const d = new T.Mesh(new T.BoxGeometry(1, 4, 12), mat);
                d.position.set(x, 2, 0); g.add(d);
            });
            viewerMesh = g; break;
        }
        case 5: { // Sit/Stand Actuator Mount
            g.add(new T.Mesh(new T.BoxGeometry(16, 2, 16), mat));
            [-5, 5].forEach(x => {
                const s = new T.Mesh(new T.BoxGeometry(3, 18, 3), mat);
                s.position.set(x, 10, -5); g.add(s);
            });
            const bar = new T.Mesh(new T.CylinderGeometry(1.5, 1.5, 14, 16), mat);
            bar.rotation.z = Math.PI / 2;
            bar.position.set(0, 16, -5); g.add(bar);
            viewerMesh = g; break;
        }
        case 6: { // Chassis Bottom Panel
            g.add(new T.Mesh(new T.BoxGeometry(36, 1.5, 24), mat));
            const fm = new T.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });
            [[-14,-10],[-14,10],[14,-10],[14,10]].forEach(([x,z]) => {
                const f = new T.Mesh(new T.CylinderGeometry(1.5, 1.8, 1, 16), fm);
                f.position.set(x, -1.25, z); g.add(f);
            });
            for (let x = -10; x <= 10; x += 3) {
                for (let z = -6; z <= 6; z += 3) {
                    const dk = dark.clone(); dk.side = T.DoubleSide;
                    const h = new T.Mesh(new T.CircleGeometry(0.6, 8), dk);
                    h.rotation.x = -Math.PI / 2;
                    h.position.set(x, -0.74, z); g.add(h);
                }
            }
            viewerMesh = g; break;
        }
        case 7: { // Keyboard Plate
            g.add(new T.Mesh(new T.BoxGeometry(32, 1.5, 12), mat));
            const hm = dark.clone(); hm.side = T.DoubleSide;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 12; c++) {
                    const sq = new T.Mesh(new T.PlaneGeometry(1.4, 1.4), hm);
                    sq.rotation.x = -Math.PI / 2;
                    sq.position.set(-13.5 + c * 2.3, 0.76, -3.5 + r * 2.3);
                    g.add(sq);
                }
            }
            viewerMesh = g; break;
        }
        case 8: { // Display Hinge Assembly
            const barrel = new T.Mesh(new T.CylinderGeometry(3, 3, 8, 24), mat);
            barrel.rotation.z = Math.PI / 2; g.add(barrel);
            const a1 = new T.Mesh(new T.BoxGeometry(2, 12, 3), mat);
            a1.position.set(-3, -6, 0); a1.rotation.z = 0.1; g.add(a1);
            const a2 = new T.Mesh(new T.BoxGeometry(2, 12, 3), mat);
            a2.position.set(3, 6, 0); a2.rotation.z = 0.1; g.add(a2);
            const washer = new T.Mesh(new T.TorusGeometry(2.5, 0.5, 8, 24), metal);
            washer.rotation.y = Math.PI / 2; g.add(washer);
            viewerMesh = g; break;
        }
        case 9: { // Display Bezel
            const tp = new T.Mesh(new T.BoxGeometry(32, 1.5, 1.5), mat);
            tp.position.y = 9.25; g.add(tp);
            const bt = new T.Mesh(new T.BoxGeometry(32, 1.5, 1.5), mat);
            bt.position.y = -9.25; g.add(bt);
            const lt = new T.Mesh(new T.BoxGeometry(1.5, 17, 1.5), mat);
            lt.position.x = -15.25; g.add(lt);
            const rt = new T.Mesh(new T.BoxGeometry(1.5, 17, 1.5), mat);
            rt.position.x = 15.25; g.add(rt);
            const cam = new T.Mesh(new T.CircleGeometry(0.5, 16), dark.clone());
            cam.material.side = T.DoubleSide;
            cam.position.set(0, 9.5, 0.76); g.add(cam);
            viewerMesh = g; break;
        }
        default:
            viewerMesh = new T.Mesh(new T.BoxGeometry(15, 15, 15), mat);
    }

    if (viewerMesh) {
        viewerMesh.castShadow = true;
        viewerScene.add(viewerMesh);
    }
}

// Fit camera to object bounds
function fitCameraToObject(obj) {
    const T = THREE_NS;
    const box = new T.Box3().setFromObject(obj);
    const size = box.getSize(new T.Vector3());
    const center = box.getCenter(new T.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const dist = maxDim / (2 * Math.tan((viewerCamera.fov * Math.PI / 180) / 2)) * 1.8;
    viewerCamera.position.set(
        center.x + dist * 0.6,
        center.y + dist * 0.5,
        center.z + dist * 0.6
    );
    viewerControls.target.copy(center);
    viewerControls.update();
}

// Clean up all viewer resources
function disposeViewer() {
    if (viewerAnimId) { cancelAnimationFrame(viewerAnimId); viewerAnimId = null; }
    const container = document.getElementById('modelViewer');
    if (container && container._ro) { container._ro.disconnect(); delete container._ro; }
    if (viewerControls) { viewerControls.dispose(); viewerControls = null; }
    if (viewerRenderer) { viewerRenderer.dispose(); viewerRenderer = null; }
    if (viewerScene) {
        viewerScene.traverse(o => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
                (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
            }
        });
        viewerScene = null;
    }
    viewerMesh = null;
    viewerGridHelper = null;
    viewerCamera = null;
    if (container) {
        container.innerHTML = '<div class="viewer-placeholder"><div class="viewer-icon">\u27F3</div><p>Interactive 3D viewer</p></div>';
    }
}

// Viewer controls
function resetView() {
    if (!viewerCamera || !viewerControls || !defaultCameraPos) return;
    viewerCamera.position.copy(defaultCameraPos);
    viewerControls.target.copy(defaultControlsTarget);
    viewerControls.update();
}

function toggleWireframe() {
    if (!viewerMesh) return;
    wireframeEnabled = !wireframeEnabled;
    viewerMesh.traverse(c => {
        if (c.isMesh && c.material) c.material.wireframe = wireframeEnabled;
    });
    const btns = document.querySelector('.viewer-controls');
    if (btns) btns.querySelectorAll('.control-btn')[1]?.classList.toggle('active', wireframeEnabled);
}

function toggleGrid() {
    if (!viewerGridHelper) return;
    gridEnabled = !gridEnabled;
    viewerGridHelper.visible = gridEnabled;
    const btns = document.querySelector('.viewer-controls');
    if (btns) btns.querySelectorAll('.control-btn')[2]?.classList.toggle('active', gridEnabled);
}

// Trigger a browser file download
function triggerDownload(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

// Download model in the requested format (STL, OBJ, GLTF, GLB)
async function downloadModel(format) {
    if (!currentModel || !viewerMesh) return;
    try { await ensureThreeJS(); } catch { return; }

    const T = THREE_NS;
    const name = currentModel.title.replace(/[^a-z0-9]/gi, '_');

    // If requesting STL and an original file exists, download it directly
    if (format === 'stl' && currentModel.modelFile) {
        try {
            const res = await fetch(currentModel.modelFile);
            if (res.ok) { triggerDownload(await res.blob(), name + '.stl'); return; }
        } catch (e) { /* fall through to exporter */ }
    }

    // Export from the loaded Three.js geometry
    const expScene = new T.Scene();
    expScene.add(viewerMesh.clone());

    switch (format) {
        case 'stl': {
            const d = new STLExporterClass().parse(expScene, { binary: true });
            triggerDownload(new Blob([d], { type: 'application/octet-stream' }), name + '.stl');
            break;
        }
        case 'obj': {
            const d = new OBJExporterClass().parse(expScene);
            triggerDownload(new Blob([d], { type: 'text/plain' }), name + '.obj');
            break;
        }
        case 'gltf': {
            const exp = new GLTFExporterClass();
            exp.parse(expScene, (d) => {
                const s = JSON.stringify(d, null, 2);
                triggerDownload(new Blob([s], { type: 'application/json' }), name + '.gltf');
            }, (e) => { console.error('GLTF export error:', e); }, { binary: false });
            break;
        }
        case 'glb': {
            const exp = new GLTFExporterClass();
            exp.parse(expScene, (d) => {
                triggerDownload(new Blob([d], { type: 'application/octet-stream' }), name + '.glb');
            }, (e) => { console.error('GLB export error:', e); }, { binary: true });
            break;
        }
        default:
            console.warn('Unsupported format:', format);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Close modal on outside click
document.getElementById('modelModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'modelModal') {
        closeModal();
    }
});