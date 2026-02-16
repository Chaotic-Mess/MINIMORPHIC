// ===================================
// MINIMORPHIC — Subscription Client
// ===================================

const MM_API = "https://script.google.com/macros/s/AKfycbwEokJ3RVL6IKByVeuC5ukEegO2gxH6d06iAjhKGIJdW1-xEkU-rOgERxiIAW3WfbEZNw/exec";

function getSession_() {
    try { return JSON.parse(localStorage.getItem("mm_session")) || null; }
    catch { return null; }
}

function isLoggedIn_() {
    const s = getSession_();
    return s && s.user && s.user !== "guest" && !s.guest;
}

async function apiPost_(action, data) {
    const res = await fetch(MM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data })
    });
    return res.json();
}

// ---- CTA state ----

function setCTASubscribed_() {
    document.querySelectorAll(".cta-section").forEach(sec => {
        sec.innerHTML = `
            <h2>You're subscribed</h2>
            <p>You'll get notified when there's something new.</p>
            <span class="btn" style="opacity:.7;cursor:default;">Subscribed &#10003;</span>
            <br><br>
            <a href="#" style="font-size:13px;color:#a89080;" onclick="unsubscribeFromUpdates();return false;">Unsubscribe</a>`;
    });
}

function setCTAUnsubscribed_() {
    document.querySelectorAll(".cta-section").forEach(sec => {
        sec.innerHTML = `
            <h2>Want to follow along?</h2>
            <p>I post updates when there's something worth sharing.</p>
            <a href="#" class="btn" onclick="subscribeToUpdates();return false;">Subscribe to Updates</a>`;
    });
}

// ---- Subscribe ----

async function subscribeToUpdates() {
    try {
        let data;
        if (isLoggedIn_()) {
            data = await apiPost_("subscribe", { username: getSession_().user });
        } else {
            const email = (prompt("Enter your email to subscribe:") || "").trim();
            if (!email) return;
            data = await apiPost_("subscribe", { email });
        }
        if (data.success) setCTASubscribed_();
        else alert(data.message || "Unable to subscribe");
    } catch (err) {
        console.error(err);
        alert("Network error. Please try again later.");
    }
}

// ---- Unsubscribe ----

async function unsubscribeFromUpdates() {
    try {
        let data;
        if (isLoggedIn_()) {
            data = await apiPost_("unsubscribe", { username: getSession_().user });
        } else {
            const email = (prompt("Enter your email to unsubscribe:") || "").trim();
            if (!email) return;
            data = await apiPost_("unsubscribe", { email });
        }
        if (data.success) setCTAUnsubscribed_();
        else alert(data.message || "Unable to unsubscribe");
    } catch (err) {
        console.error(err);
        alert("Network error. Please try again later.");
    }
}

window.subscribeToUpdates = subscribeToUpdates;
window.unsubscribeFromUpdates = unsubscribeFromUpdates;

// ---- Check prefs on load ----

document.addEventListener("DOMContentLoaded", async () => {
    if (!isLoggedIn_()) return;
    try {
        const data = await apiPost_("get_user_prefs", { username: getSession_().user });
        if (data && data.subscribed) setCTASubscribed_();
    } catch { /* silent */ }
});
