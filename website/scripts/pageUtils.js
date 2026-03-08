/*
   =============================================
   MINIMORPHIC — Shared Page Utilities [JS]
   =============================================
*/

(function () {

    // ── Fade animation handler ────────────────
    const KEY = 'mm_animations_played';

    function getStore() {
        try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch { return {}; }
    }

    function setStore(s) {
        sessionStorage.setItem(KEY, JSON.stringify(s));
    }

    function genId(el, i) {
        if (el.dataset.animId) return el.dataset.animId;
        const path = location.pathname;
        const base = (el.id || el.className || el.tagName).toString().replace(/\s+/g, '_');
        const raw = `${path}::${base}::${i}`;
        const id = btoa(encodeURIComponent(raw));
        el.dataset.animId = id;
        return id;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const store = getStore();
        document.querySelectorAll('.fade').forEach((el, i) => {
            const id = genId(el, i);
            if (store[id]) {
                el.classList.add('no-animation');
            } else {
                const s = getStore(); s[id] = true; setStore(s);
            }
        });

        // ── Blob orbit handler ────────────────
        // Works on every .shopping-section on the page
        document.querySelectorAll('.shopping-section').forEach(section => {
            const blobs = section.querySelectorAll('.blob');
            const productCards = section.querySelectorAll('.product-card');
            const charGroup = section.querySelector('.char-group');
            if (!blobs.length || !productCards.length || !charGroup) return;

            let isOverSection = false;
            let orbitAngle = 0;
            let targetCard = null;

            section.addEventListener('mouseenter', () => {
                isOverSection = true;
                blobs.forEach(blob => { blob.style.animation = 'none'; });
            });

            section.addEventListener('mouseleave', () => {
                isOverSection = false;
                targetCard = null;
                blobs.forEach(blob => {
                    blob.style.animation = '';
                    blob.style.transform = '';
                });
            });

            section.addEventListener('mousemove', e => {
                if (!isOverSection) return;
                let nearest = null;
                let minDist = Infinity;
                productCards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const dist = Math.hypot(
                        e.clientX - (rect.left + rect.width / 2),
                        e.clientY - (rect.top + rect.height / 2)
                    );
                    if (dist < minDist) { minDist = dist; nearest = card; }
                });
                targetCard = nearest;
            });

            const animateBlobs = () => {
                if (isOverSection && targetCard) {
                    orbitAngle += 0.008;
                    const cardRect = targetCard.getBoundingClientRect();
                    const charRect = charGroup.getBoundingClientRect();
                    const cardCX = cardRect.left + cardRect.width / 2;
                    const cardCY = cardRect.top + cardRect.height / 2;
                    const charCX = charRect.left + charRect.width / 2;
                    const charCY = charRect.top + charRect.height / 2;
                    blobs.forEach((blob, i) => {
                        const r = 50 + i * 12;
                        const a = orbitAngle + i * Math.PI / 2;
                        blob.style.transform = `translate(${cardCX - charCX + Math.cos(a) * r}px, ${cardCY - charCY + Math.sin(a) * r * 0.4}px)`;
                    });
                }
                requestAnimationFrame(animateBlobs);
            };
            animateBlobs();
        });
    });

})();
