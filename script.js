const config = {
    recipientName: "Luna Ameera Zalianty",
    targetAge: 18
};

const customPngIcons = [
    "foto/meong1.png",
    "foto/meong2.png"
];

const loadedPngImages = [];
customPngIcons.forEach(url => {
    const img = new Image();
    img.src = url;
    loadedPngImages.push(img);
});

const slides = document.querySelectorAll('.page-slide');
const dots = document.querySelectorAll('.slide-dots .dot, .dots-container .dot');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const typingName = document.getElementById('typing-name');
const counterAge = document.getElementById('counter-age');
const cakeBox = document.getElementById('cake-box');
const candleFlame = document.getElementById('candle-flame');
const cakeStatus = document.getElementById('cake-status');

let currentSlideIndex = 0;
let isMusicPlaying = false;
let isBlown = false;
let typingExecuted = false;
let counterExecuted = false;

// Audio Context for Luxury Beep / Chime Sound Effects
let audioCtx = null;
function playChime(freq = 523.25, type = 'sine', duration = 0.25) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Audio context not allowed without interaction
    }
}

function updateDots(index) {
    const allDots = document.querySelectorAll('.dots-container .dot');
    allDots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function goToPage(pageIndex) {
    if (pageIndex < 0 || pageIndex >= slides.length) return;

    playChime(440 + pageIndex * 60, 'triangle', 0.2);

    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = pageIndex;
    slides[currentSlideIndex].classList.add('active');

    updateDots(currentSlideIndex);

    // Slide 1: Hero Typing Effect & Button reset
    if (currentSlideIndex === 1) {
        resetBtnNo();
        if (!typingExecuted && typingName) {
            typingName.innerHTML = "";
            typeWriter(config.recipientName, 0);
            typingExecuted = true;
        }
    }

    // Slide 2: Age Counter Animation
    if (currentSlideIndex === 2 && !counterExecuted) {
        animateCounter(config.targetAge);
        counterExecuted = true;
        confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFF0B2', '#C084FC']
        });
    }

    // Celebratory Fireworks on specific milestone slides
    if (currentSlideIndex === 3 || currentSlideIndex === 5 || currentSlideIndex === 6) {
        launchFireworks();
    }
}

function prevPage() {
    if (currentSlideIndex > 0) {
        goToPage(currentSlideIndex - 1);
    } else {
        goToPage(slides.length - 1);
    }
}

function nextPage() {
    if (currentSlideIndex < slides.length - 1) {
        goToPage(currentSlideIndex + 1);
    } else {
        goToPage(0);
    }
}

document.getElementById('btn-start').addEventListener('click', () => {
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicToggle.classList.add('playing');
    }).catch(e => console.log("Audio play blocked by browser:", e));

    goToPage(1);
});

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        isMusicPlaying = false;
    } else {
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            isMusicPlaying = true;
        }).catch(e => {
            console.log("Audio playback error:", e);
        });
    }
});

const btnNo = document.getElementById('btn-no');
let isBtnNoFixed = false;

function resetBtnNo() {
    if (btnNo) {
        btnNo.style.position = 'relative';
        btnNo.style.left = 'auto';
        btnNo.style.top = 'auto';
        btnNo.style.margin = '0';
        btnNo.style.transform = 'none';
        isBtnNoFixed = false;
    }
}

if (btnNo) {
    const moveBtnNo = (e) => {
        if (e && (e.type === 'touchstart' || e.type === 'touchmove')) {
            e.preventDefault();
        }

        const padX = 25;
        const padY = 35;

        const btnWidth = btnNo.offsetWidth || 130;
        const btnHeight = btnNo.offsetHeight || 45;

        const minX = padX;
        const maxX = Math.max(minX + 10, window.innerWidth - btnWidth - padX);
        const minY = padY;
        const maxY = Math.max(minY + 10, window.innerHeight - btnHeight - padY);

        const currentRect = btnNo.getBoundingClientRect();
        const currentCenterX = currentRect.left + btnWidth / 2;
        const currentCenterY = currentRect.top + btnHeight / 2;

        let pointerX = currentCenterX;
        let pointerY = currentCenterY;

        if (e) {
            if (e.touches && e.touches.length > 0) {
                pointerX = e.touches[0].clientX;
                pointerY = e.touches[0].clientY;
            } else if (e.clientX !== undefined) {
                pointerX = e.clientX;
                pointerY = e.clientY;
            }
        }

        let newX, newY;
        let validPos = false;
        let attempts = 0;

        while (!validPos && attempts < 25) {
            attempts++;
            newX = Math.random() * (maxX - minX) + minX;
            newY = Math.random() * (maxY - minY) + minY;

            const distToPointer = Math.hypot(newX + btnWidth / 2 - pointerX, newY + btnHeight / 2 - pointerY);
            const distFromCurrent = Math.hypot(newX - currentRect.left, newY - currentRect.top);

            if (distToPointer > 140 && distFromCurrent > 80) {
                validPos = true;
            }
        }

        if (!validPos) {
            newX = pointerX < window.innerWidth / 2 ? maxX - Math.random() * 60 : minX + Math.random() * 60;
            newY = pointerY < window.innerHeight / 2 ? maxY - Math.random() * 60 : minY + Math.random() * 60;
        }

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        if (!isBtnNoFixed) {
            btnNo.style.position = 'fixed';
            btnNo.style.left = `${currentRect.left}px`;
            btnNo.style.top = `${currentRect.top}px`;
            btnNo.style.margin = '0';
            btnNo.style.zIndex = '99999';
            isBtnNoFixed = true;

            void btnNo.offsetHeight;
        }

        const randomAngle = (Math.random() * 20 - 10).toFixed(1);
        btnNo.style.left = `${newX}px`;
        btnNo.style.top = `${newY}px`;
        btnNo.style.opacity = '1';
        btnNo.style.visibility = 'visible';
        btnNo.style.display = 'inline-flex';
        btnNo.style.transform = `scale(1.08) rotate(${randomAngle}deg)`;

        setTimeout(() => {
            if (btnNo) {
                btnNo.style.transform = 'scale(1) rotate(0deg)';
            }
        }, 300);
    };

    document.addEventListener('mousemove', (e) => {
        if (currentSlideIndex !== 1 || !btnNo) return;
        const rect = btnNo.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

        if (distance < 110) {
            moveBtnNo(e);
        }
    });

    btnNo.addEventListener('mouseover', moveBtnNo);
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveBtnNo(e);
    });
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveBtnNo(e);
    }, { passive: false });
}

function typeWriter(text, i) {
    if (typingName && i < text.length) {
        typingName.innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(text, i + 1), 90);
    }
}

function animateCounter(target) {
    if (!counterAge) return;
    let current = 0;
    const duration = 1800;
    const stepTime = duration / target;

    const timer = setInterval(() => {
        current += 1;
        counterAge.innerText = current;
        playChime(300 + current * 25, 'sine', 0.08);
        if (current >= target) {
            clearInterval(timer);
        }
    }, stepTime);
}

if (cakeBox) {
    const blowCandle = () => {
        if (!isBlown) {
            if (candleFlame) candleFlame.classList.add('off');
            if (cakeStatus) cakeStatus.innerText = "Yey lilin udah ditiup! ❤️";
            isBlown = true;
            playChime(880, 'sine', 0.5);

            confetti({
                particleCount: 180,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#FFF0B2', '#AA771C', '#FFFFFF', '#9333EA', '#C084FC']
            });
        }
    };

    cakeBox.addEventListener('click', blowCandle);
    if (cakeStatus) cakeStatus.addEventListener('click', blowCandle);
}

function launchFireworks() {
    var duration = 2.5 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#D4AF37', '#FFF0B2', '#FFFFFF', '#9333EA']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#D4AF37', '#FFF0B2', '#FFFFFF', '#9333EA']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Particle Canvas Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const particleCount = 35;
const fallbackEmojis = ['✨', '💖', '⭐', '🎈', '🎉', '👑', '🎂', '🌸', '💫', '🎀', '🎁', '⚡'];

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.7 - 0.35;
        this.speedY = Math.random() * -0.8 - 0.25;
        this.opacity = Math.random() * 0.8 + 0.2;
        
        const rand = Math.random();
        if (rand < 0.45 && loadedPngImages.length > 0) {
            this.mode = 'png';
            this.img = loadedPngImages[Math.floor(Math.random() * loadedPngImages.length)];
            this.imgSize = Math.floor(Math.random() * 18 + 22);
        } else if (rand < 0.90) {
            this.mode = 'emoji';
            this.emoji = fallbackEmojis[Math.floor(Math.random() * fallbackEmojis.length)];
            this.fontSize = Math.floor(Math.random() * 12 + 16);
        } else {
            this.mode = 'dot';
        }
        
        this.color = Math.random() > 0.4 ? '#FFD700' : '#C084FC';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        if (this.mode === 'png' && this.img && this.img.complete && this.img.naturalWidth !== 0) {
            ctx.drawImage(this.img, this.x, this.y, this.imgSize, this.imgSize);
        } else if (this.mode === 'emoji') {
            ctx.font = `${this.fontSize}px sans-serif`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fillText(this.emoji, this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();
