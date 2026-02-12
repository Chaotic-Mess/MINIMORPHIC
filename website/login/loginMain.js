// Check if user is already logged in
const session = localStorage.getItem("mm_session");
if (session) {
    try {
        const parsedSession = JSON.parse(session);
        const sessionAge = Date.now() - parsedSession.time;
        if (sessionAge < 24 * 60 * 60 * 1000) {
            window.location = "../client/clientIndex.html";
        } else {
            // Session expired, remove it 
            localStorage.removeItem("mm_session");
        }
    } catch (e) {
        // Invalid session, remove it
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

// Login form interactions
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

// Create form interactions
document.getElementById("createUser")?.addEventListener("focus", () => {
    mode = "typingUser";
    bars.forEach(b => b.style.transform = "translateY(-10px) scale(1.05)");
});

document.getElementById("createPass")?.addEventListener("focus", () => {
    if (!peeking) {
        mode = "typingPass";
        eyes.forEach(e => e.style.transform = "translateX(-6px)");
        bars.forEach(b => b.style.transform = "translateY(6px) scale(0.97)");
    }
});

document.getElementById("createEmail")?.addEventListener("focus", () => {
    mode = "typingUser";
    bars.forEach(b => b.style.transform = "translateY(-8px) scale(1.03)");
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

// Password validation
document.getElementById("createPass")?.addEventListener("input", e => {
    const password = e.target.value;

    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };

    document.getElementById("req-length").className = checks.length ? "valid" : "";
    document.getElementById("req-upper").className = checks.upper ? "valid" : "";
    document.getElementById("req-lower").className = checks.lower ? "valid" : "";
    document.getElementById("req-number").className = checks.number ? "valid" : "";
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

// Login function
async function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;
    const msgEl = document.getElementById("loginMsg");

    if (!username || !password) {
        msgEl.className = "msg error";
        msgEl.textContent = "Please fill in all fields";
        return;
    }

    try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbwEokJ3RVL6IKByVeuC5ukEegO2gxH6d06iAjhKGIJdW1-xEkU-rOgERxiIAW3WfbEZNw/exec", {
            method: "POST",
            body: JSON.stringify({ username, password, action: "login" })
        });

        const data = await res.json();

        if (data.success) {
            const session = {
                user: username,
                time: Date.now()
            };

            localStorage.setItem("mm_session", JSON.stringify(session));

            mode = "success";
            msgEl.className = "msg success";
            msgEl.textContent = "Access granted! Redirecting...";

            bars.forEach((b, i) => {
                setTimeout(() => {
                    b.style.transform = "translateY(-16px) scale(1.08)";
                }, i * 70);
            });

            setTimeout(() => window.location = "../client/clientIndex.html", 800);

        } else {
            mode = "error";
            msgEl.className = "msg error";
            msgEl.textContent = data.message || "Invalid credentials";

            bars.forEach(b => b.style.transform = "translateY(12px) scale(0.95)");

            setTimeout(() => {
                bars.forEach(b => b.style.transform = "");
                mode = "idle";
            }, 700);
        }
    } catch (err) {
        msgEl.className = "msg error";
        msgEl.textContent = "Connection error. Please try again.";
    }
}

// Create account function
async function createAccount() {
    const username = document.getElementById("createUser").value;
    const email = document.getElementById("createEmail").value;
    const password = document.getElementById("createPass").value;
    const confirmPassword = document.getElementById("confirmPass").value;
    const msgEl = document.getElementById("createMsg");

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        msgEl.className = "msg error";
        msgEl.textContent = "Please fill in all fields";
        return;
    }

    if (password !== confirmPassword) {
        msgEl.className = "msg error";
        msgEl.textContent = "Passwords do not match";
        return;
    }

    const passwordValid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);

    if (!passwordValid) {
        msgEl.className = "msg error";
        msgEl.textContent = "Password does not meet requirements";
        return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
        msgEl.className = "msg error";
        msgEl.textContent = "Please enter a valid email";
        return;
    }

    try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbwEokJ3RVL6IKByVeuC5ukEegO2gxH6d06iAjhKGIJdW1-xEkU-rOgERxiIAW3WfbEZNw/exec", {
            method: "POST",
            body: JSON.stringify({ username, email, password, action: "create" })
        });

        const data = await res.json();

        if (data.success) {
            mode = "success";
            msgEl.className = "msg success";
            msgEl.textContent = "Check your email to verify your account.";

            bars.forEach((b, i) => {
                setTimeout(() => {
                    b.style.transform = "translateY(-16px) scale(1.08)";
                }, i * 70);
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
    } catch (err) {
        msgEl.className = "msg error";
        msgEl.textContent = "Connection error. Please try again." + err.message;
    }
}

// Allow Enter key to submit
document.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        if (document.getElementById("loginForm").style.display !== "none") {
            login();
        } else {
            createAccount();
        }
    }
});

// Guest sign-in: create a lightweight guest session and redirect
function guestSignIn() {
    const msgEl = document.getElementById("loginMsg");
    const session = {
        user: "Guest",
        guest: true,
        time: Date.now()
    };

    try {
        localStorage.setItem("mm_session", JSON.stringify(session));
    } catch (e) {
        // ignore localStorage errors
    }

    mode = "success";
    if (msgEl) {
        msgEl.className = "msg success";
        msgEl.textContent = "Continuing as Guest...";
    }

    bars.forEach((b, i) => {
        setTimeout(() => {
            b.style.transform = "translateY(-16px) scale(1.08)";
        }, i * 70);
    });

    setTimeout(() => window.location = "../client/clientIndex.html", 700);
}