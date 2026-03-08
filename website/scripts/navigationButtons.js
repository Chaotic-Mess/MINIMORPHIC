/*
   =============================================
   Navigation Buttons — Project Routes [JS]
   =============================================
*/

(function () {
    async function loadRoutes() {
        try {
            let routesPath = '../../routes.json';
            if (window.location.pathname.includes('/updates/')) {
                routesPath = '../routes.json';
            }
            
            const response = await fetch(routesPath);
            if (!response.ok) throw new Error('Routes not found');
            return await response.json();
        } catch (e) {
            console.warn('Navigation routes unavailable:', e);
            return null;
        }
    }

    function getCurrentPageUrl() {
        const pathname = window.location.pathname;
        // Match any project folder (DeskProject, SLATE, etc.) in the path
        const match = pathname.match(/\/(DeskProject|SLATE)\/(.*?)(?:\.html)?$/);
        if (match) {
            return match[2]; // Return path after project name (server may strip .html)
        }
        return null;
    }

    function getRelativeUrl(targetUrl, isFromUpdates) {
        // Make URL relative to current location
        if (isFromUpdates) {
            return '../' + targetUrl;
        } else {
            return '../../' + targetUrl;
        }
    }

    function populateNavigation(routes, currentUrl, isFromUpdates) {
        const sequence = routes.sequence;
        // Try to find the URL with and without .html extension
        let currentIndex = sequence.findIndex(item => item.url === currentUrl);
        if (currentIndex === -1) {
            // Try without .html extension or with .html added
            currentIndex = sequence.findIndex(item => 
                item.url.replace(/\.html$/, '') === currentUrl ||
                item.url === currentUrl + '.html'
            );
        }
        
        if (currentIndex === -1) {
            console.warn('Current URL not found in sequence:', currentUrl);
            return;
        }

        const prev = currentIndex > 0 ? sequence[currentIndex - 1] : null;
        const next = currentIndex < sequence.length - 1 ? sequence[currentIndex + 1] : null;

        // Populate prev button
        const prevBtn = document.querySelector('.nav-prev');
        if (prevBtn && prev) {
            const label = prev.type === 'step' ? `← ${prev.phaseTitle} · ${prev.title}` : `← ${prev.title}`;
            prevBtn.href = getRelativeUrl(prev.url, isFromUpdates);
            prevBtn.textContent = label;
            prevBtn.style.visibility = 'visible';
        } else if (prevBtn) {
            prevBtn.style.visibility = 'hidden';
        }

        // Populate hub button
        const hubBtn = document.querySelector('.nav-hub');
        if (hubBtn) {
            hubBtn.href = getRelativeUrl(routes.hub, isFromUpdates);
            hubBtn.textContent = '↑ Return to Hub';
            hubBtn.style.visibility = 'visible';
        }

        // Populate next button
        const nextBtn = document.querySelector('.nav-next');
        if (nextBtn && next) {
            const label = next.type === 'step' ? `${next.phaseTitle} · ${next.title} →` : `${next.title} →`;
            nextBtn.href = getRelativeUrl(next.url, isFromUpdates);
            nextBtn.textContent = label;
            nextBtn.style.visibility = 'visible';
        } else if (nextBtn) {
            nextBtn.style.visibility = 'hidden';
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const routes = await loadRoutes();
        if (!routes) return;

        const currentUrl = getCurrentPageUrl();
        if (!currentUrl) return;

        const isFromUpdates = window.location.pathname.includes('/updates/');
        populateNavigation(routes, currentUrl, isFromUpdates);
    });
})();
