//  ===================================
//  MINIMORPHIC — Login Page [JS]
//  ===================================

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
const enterBtn = document.querySelector("button");

let mode = "idle";
let time = 0;

// Eye tracking
document.addEventListener("mousemove", e => {
    if (mode !== "idle" && mode !== "tracking" && mode !== "hover") return;
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

// Button hover - make blobs excited
enterBtn?.addEventListener("mouseenter", () => {
    if (mode === "idle" || mode === "tracking") {
        mode = "hover";
    }
});

enterBtn?.addEventListener("mouseleave", () => {
    if (mode === "hover") {
        mode = "idle";
    }
});

// Main animation loop
setInterval(() => {
    time += 0.016; // ~60fps
    
    if (mode === "idle") {
        // Cute idle animation - floating & bouncing
        bars.forEach((b, i) => {
            const baseOffset = i * 0.5;
            const bounce = Math.sin(time * 2 + baseOffset) * 4;
            const float = Math.cos(time * 0.8 + baseOffset) * 2;
            const wobble = Math.sin(time * 3 + baseOffset) * 2;
            const scale = 0.98 + Math.sin(time * 1.5 + baseOffset) * 0.05;
            
            b.style.transform = `translateY(${bounce + float}px) translateX(${wobble}px) scale(${scale})`;
        });
    } else if (mode === "hover") {
        // Excited animation - jumping & spinning
        bars.forEach((b, i) => {
            const jump = Math.abs(Math.sin(time * 3 + i * 0.8)) * 8;
            const spin = Math.sin(time * 2.5 + i) * 15;
            const scale = 1.02 + Math.sin(time * 2 + i * 0.6) * 0.08;
            
            b.style.transform = `translateY(-${jump}px) rotate(${spin}deg) scale(${scale})`;
        });
    } else if (mode === "tracking") {
        // Subtle movement while tracking
        bars.forEach((b, i) => {
            const subtle = Math.sin(time * 1 + i * 0.3) * 1;
            b.style.transform = `translateY(${subtle}px)`;
        });
    }
}, 16);

// Guest
function guestSignIn() {
    try {
        localStorage.setItem("mm_session", JSON.stringify({
            user: "guest",
            guest: true,
            time: Date.now()
        }));
        mode = "success";
        bars.forEach((b, i) => {
            setTimeout(() => b.style.transform = "translateY(-16px) scale(1.08)", i * 70);
        });
        setTimeout(() => window.location = "../transition/transitionIndex.html", 800);
    } catch {
        console.error("Unable to continue as guest.");
    }
}