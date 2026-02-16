//  ===================================
//  MINIMORPHIC — Login Page [JS]
//  ===================================

const API_URL = "https://script.google.com/macros/s/AKfycbwEokJ3RVL6IKByVeuC5ukEegO2gxH6d06iAjhKGIJdW1-xEkU-rOgERxiIAW3WfbEZNw/exec";

// Check if user is already logged in
const session = localStorage.getItem("mm_session");
if (session) {
    try {
        const s = JSON.parse(session);
        if (s.time && Date.now() - s.time < 24 * 60 * 60 * 1000) {
            window.location = "../transition/transitionIndex.html";
        } else {
            localStorage.removeItem("mm_session");
        }
    } catch {
        localStorage.removeItem("mm_session");
    }
}

const eyes = document.querySelectorAll(".eye");
const bars = document.querySelectorAll(".bar");

let mode = "idle";
let peeking = false;

// Eye tracking
document.addEventListener("mousemove", e => {
    if (mode !== "idle" && mode !== "tracking") return;
    eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const angle = Math.atan2(dy, dx);
        const move = 3.5;
        eye.style.transform =
            `translate(${Math.cos(angle) * move}px, ${Math.sin(angle) * move}px)`;
    });
});

// Login form focus
document.getElementById("loginUser")?.addEventListener("focus", () => {
    mode = "typingUser";
    bars.forEach(b => b.style.transform = "translateY(-10px) scale(1.05)");
});

document.getElementById("loginPass")?.addEventListener("focus", () => {
    if (!peeking) {
        mode = "typingPass";
        eyes.forEach(e => e.style.transform = "translateX(-6px)");
        bars.forEach(b => b.style.transform = "translateY(6px) scale(0.97)");
    }
});

// Create form focus
document.getElementById("createUser")?.addEventListener("focus", () => {
    mode = "typingUser";
    bars.forEach(b => b.style.transform = "translateY(-10px) scale(1.05)");
});

document.getElementById("createDisplay")?.addEventListener("focus", () => {
    mode = "typingUser";
    bars.forEach(b => b.style.transform = "translateY(-8px) scale(1.03)");
});

document.getElementById("createEmail")?.addEventListener("focus", () => {
    mode = "typingUser";
    bars.forEach(b => b.style.transform = "translateY(-8px) scale(1.03)");
});

document.getElementById("createPass")?.addEventListener("focus", () => {
    if (!peeking) {
        mode = "typingPass";
        eyes.forEach(e => e.style.transform = "translateX(-6px)");
        bars.forEach(b => b.style.transform = "translateY(6px) scale(0.97)");
    }
});

document.getElementById("confirmPass")?.addEventListener("focus", () => {
    if (!peeking) {
        mode = "typingPass";
        eyes.forEach(e => e.style.transform = "translateX(-6px)");
        bars.forEach(b => b.style.transform = "translateY(6px) scale(0.97)");
    }
});

document.addEventListener("click", e => {
    if (!e.target.matches("input") && !e.target.matches(".toggle")) {
        mode = "tracking";
        bars.forEach(b => b.style.transform = "");
    }
});

// Login peek toggle
document.getElementById("loginPeek").onclick = () => {
    peeking = !peeking;
    const passInput = document.getElementById("loginPass");
    const peek = document.getElementById("loginPeek");
    passInput.type = peeking ? "text" : "password";
    peek.textContent = peeking ? "HIDE" : "SHOW";
    if (peeking) {
        mode = "peeking";
        eyes.forEach(e => e.style.transform = "translateX(5px)");
    } else {
        mode = "typingPass";
        eyes.forEach(e => e.style.transform = "translateX(-6px)");
    }
};

// Create peek toggle
document.getElementById("createPeek").onclick = () => {
    peeking = !peeking;
    const passInput = document.getElementById("createPass");
    const peek = document.getElementById("createPeek");
    passInput.type = peeking ? "text" : "password";
    peek.textContent = peeking ? "HIDE" : "SHOW";
    if (peeking) {
        mode = "peeking";
        eyes.forEach(e => e.style.transform = "translateX(5px)");
    } else {
        mode = "typingPass";
        eyes.forEach(e => e.style.transform = "translateX(-6px)");
    }
};

// Idle animation
setInterval(() => {
    if (mode !== "idle" && mode !== "tracking") return;
    bars.forEach((b, i) => {
        const offset = Math.sin(Date.now() / 900 + i * 0.8) * 3;
        b.style.transform = `translateY(${offset}px)`;
    });
}, 60);

// Password validation (live)
document.getElementById("createPass")?.addEventListener("input", e => {
    const pw = e.target.value;
    document.getElementById("req-length").className = pw.length >= 8 ? "valid" : "";
    document.getElementById("req-upper").className = /[A-Z]/.test(pw) ? "valid" : "";
    document.getElementById("req-lower").className = /[a-z]/.test(pw) ? "valid" : "";
    document.getElementById("req-number").className = /[0-9]/.test(pw) ? "valid" : "";
});

// Form switching
function showCreateAccount() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("createForm").style.display = "block";
    peeking = false;
    mode = "idle";
}

function showLogin() {
    document.getElementById("createForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    peeking = false;
    mode = "idle";
}

// ---- LOGIN ----
async function login() {
    const identifier = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value;
    const msgEl = document.getElementById("loginMsg");

    if (!identifier || !password) {
        msgEl.className = "msg error";
        msgEl.textContent = "Please fill in all fields";
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "login", identifier, password })
        });
        const data = await res.json();

        if (data.success) {
            localStorage.setItem("mm_session", JSON.stringify({
                user: data.user,
                displayName: data.displayName,
                time: Date.now()
            }));

            mode = "success";
            msgEl.className = "msg success";
            msgEl.textContent = "Access granted! Redirecting...";
            bars.forEach((b, i) => {
                setTimeout(() => b.style.transform = "translateY(-16px) scale(1.08)", i * 70);
            });
            setTimeout(() => window.location = "../transition/transitionIndex.html", 800);
        } else {
            mode = "error";
            msgEl.className = "msg error";
            msgEl.textContent = data.message || "Invalid credentials";
            bars.forEach(b => b.style.transform = "translateY(12px) scale(0.95)");
            setTimeout(() => { bars.forEach(b => b.style.transform = ""); mode = "idle"; }, 700);
        }
    } catch {
        msgEl.className = "msg error";
        msgEl.textContent = "Connection error. Please try again.";
    }
}

// ---- CREATE ACCOUNT ----
async function createAccount() {
    const username = document.getElementById("createUser").value.trim();
    const displayName = document.getElementById("createDisplay").value.trim();
    const email = document.getElementById("createEmail").value.trim();
    const password = document.getElementById("createPass").value;
    const confirmPassword = document.getElementById("confirmPass").value;
    const msgEl = document.getElementById("createMsg");

    if (!username || !displayName || !email || !password || !confirmPassword) {
        msgEl.className = "msg error";
        msgEl.textContent = "Please fill in all fields";
        return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        msgEl.className = "msg error";
        msgEl.textContent = "Username: 3-20 chars, letters/numbers/underscores only";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msgEl.className = "msg error";
        msgEl.textContent = "Please enter a valid email";
        return;
    }

    if (password !== confirmPassword) {
        msgEl.className = "msg error";
        msgEl.textContent = "Passwords do not match";
        return;
    }

    const pwOk = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
    if (!pwOk) {
        msgEl.className = "msg error";
        msgEl.textContent = "Password does not meet requirements";
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "create", username, displayName, email, password })
        });
        const data = await res.json();

        if (data.success) {
            mode = "success";
            msgEl.className = "msg success";
            msgEl.textContent = data.message || "Check your email to verify your account.";
            bars.forEach((b, i) => {
                setTimeout(() => b.style.transform = "translateY(-16px) scale(1.08)", i * 70);
            });
            setTimeout(() => {
                showLogin();
                document.getElementById("loginUser").value = username;
                msgEl.textContent = "";
            }, 1500);
        } else {
            msgEl.className = "msg error";
            msgEl.textContent = data.message || "Account creation failed";
        }
    } catch {
        msgEl.className = "msg error";
        msgEl.textContent = "Connection error. Please try again.";
    }
}

// Enter key
document.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        if (document.getElementById("loginForm").style.display !== "none") login();
        else createAccount();
    }
});

// Guest
function guestSignIn() {
    const msgEl = document.getElementById("loginMsg");
    try {
        localStorage.setItem("mm_session", JSON.stringify({
            user: "guest",
            guest: true,
            time: Date.now()
        }));
        if (msgEl) {
            msgEl.className = "msg success";
            msgEl.textContent = "Continuing as guest...";
        }
        setTimeout(() => window.location = "../transition/transitionIndex.html", 300);
    } catch {
        if (msgEl) {
            msgEl.className = "msg error";
            msgEl.textContent = "Unable to continue as guest.";
        }
    }
}