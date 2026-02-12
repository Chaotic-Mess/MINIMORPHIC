let selectedIndex = 0;
const menuItems = document.querySelectorAll('.menu-item');
const loader = document.getElementById('loader');
const mainContainer = document.getElementById('mainContainer');

// Loading animation
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            mainContainer.classList.add('visible');
            updateSelection();
        }, 500);
    }, 2000);
});

// Update visual selection
function updateSelection() {
    menuItems.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Navigate selection
function navigate(direction) {
    selectedIndex = (selectedIndex + direction + menuItems.length) % menuItems.length;
    updateSelection();
}

// Go to selected page
function confirmSelection() {
    const selected = menuItems[selectedIndex];
    const link = selected.getAttribute('data-link');
    if (link && link !== '#') {
        // Add exit animation
        mainContainer.style.opacity = '0';
        mainContainer.style.transform = 'scale(1.1)';
        setTimeout(() => {
            window.location.href = link;
        }, 300);
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(1);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        confirmSelection();
    }
});

// Mouse navigation
menuItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        selectedIndex = index;
        updateSelection();
    });

    item.addEventListener('click', () => {
        selectedIndex = index;
        updateSelection();
        setTimeout(confirmSelection, 100);
    });
});

// Center circle click
const centerCircle = document.querySelector('.center-circle');
if (centerCircle) {
    centerCircle.addEventListener('click', () => {
        confirmSelection();
    });
}