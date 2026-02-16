// client/Subscription.js
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwEokJ3RVL6IKByVeuC5ukEegO2gxH6d06iAjhKGIJdW1-xEkU-rOgERxiIAW3WfbEZNw/exec";

async function subscribeToUpdates() {
    const email = (prompt('Enter your email to subscribe to updates:') || '').trim();
    if (!email) return alert('Subscription cancelled');

    try {
        const res = await fetch(WEBAPP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'subscribe_update', email })
        });

        const data = await res.json();
        if (data.success) alert(data.message || 'Subscribed — thanks!');
        else alert(data.message || 'Unable to subscribe');
    } catch (err) {
        console.error(err);
        alert('Network error. Please try again later.');
    }
}

async function unsubscribeFromUpdates() {
    const email = (prompt('Enter your email to unsubscribe:') || '').trim();
    if (!email) return alert('Unsubscribe cancelled');

    try {
        const res = await fetch(WEBAPP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'unsubscribe_update', email })
        });

        const data = await res.json();
        if (data.success) alert(data.message || 'Unsubscribed');
        else alert(data.message || 'Unable to unsubscribe');
    } catch (err) {
        console.error(err);
        alert('Network error. Please try again later.');
    }
}

// Expose on window for inline handlers
window.subscribeToUpdates = subscribeToUpdates;
window.unsubscribeFromUpdates = unsubscribeFromUpdates;
