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
        projectLink: "../client/projects/DeskProject/hub.html"
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
}

// Close modal
function closeModal() {
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

// Viewer controls (placeholder functions)
function resetView() {
    console.log('Reset view');
    // In production, this would reset the 3D viewer camera
}

function toggleWireframe() {
    console.log('Toggle wireframe');
    // In production, this would toggle wireframe rendering
}

function toggleGrid() {
    console.log('Toggle grid');
    // In production, this would toggle reference grid
}

// Download model in specified format
function downloadModel(format) {
    if (!currentModel) return;
    
    console.log(`Downloading ${currentModel.title} as ${format.toUpperCase()}`);
    
    // In production, this would trigger actual file download
    // For now, just show feedback
    alert(`Downloading ${currentModel.title} as .${format.toUpperCase()}\n\nThis would trigger the actual download in production.`);
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