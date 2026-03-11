// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'var(--white)';
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const pageLanguage = document.documentElement.lang || 'de';

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
    
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
    
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        console.log('Form submitted:', data);
    
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        if (pageLanguage.startsWith('en')) {
            successMessage.innerHTML = `
                <strong>Thank you for your message!</strong><br>
                I will get back to you shortly.
            `;
        } else {
            successMessage.innerHTML = `
                <strong>Vielen Dank für Ihre Nachricht!</strong><br>
                Ich werde mich in Kürze bei Ihnen melden.
            `;
        }
    
        // Replace form with success message
        this.innerHTML = '';
        this.appendChild(successMessage);
    
        // Optional: Reset after some time
        setTimeout(() => {
            location.reload();
        }, 5000);
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Sisyphus Mini-Game
const sisyphusCanvas = document.getElementById('sisyphusCanvas');
const gameStatus = document.getElementById('gameStatus');
const gameResetBtn = document.getElementById('gameResetBtn');

if (sisyphusCanvas && gameStatus && gameResetBtn) {
    const ctx = sisyphusCanvas.getContext('2d');
    const isEnglish = pageLanguage.startsWith('en');
    const rootStyles = getComputedStyle(document.documentElement);
    const colors = {
        primary: rootStyles.getPropertyValue('--primary').trim(),
        primaryLight: rootStyles.getPropertyValue('--primary-light').trim(),
        primaryDark: rootStyles.getPropertyValue('--primary-dark').trim(),
        secondary: rootStyles.getPropertyValue('--secondary').trim(),
        text: rootStyles.getPropertyValue('--text').trim(),
        textLight: rootStyles.getPropertyValue('--text-light').trim(),
        white: rootStyles.getPropertyValue('--white').trim()
    };

    const messages = {
        ready: isEnglish ? 'Press start and begin the climb.' : 'Drücke Start und beginne den Aufstieg.',
        pushing: isEnglish ? 'Keep pushing... step by step uphill.' : 'Weiter schieben... Schritt für Schritt bergauf.',
        exhausted: isEnglish ? 'He pauses, breathing hard...' : 'Er hält kurz erschöpft inne...',
        slipping: isEnglish ? 'Too slow — the boulder is slipping back.' : 'Zu langsam — der Stein rollt zurück.',
        won: isEnglish ? 'Summit reached — for one breath of glory.' : 'Gipfel erreicht — für einen Atemzug Ruhm.',
        tumbling: isEnglish ? 'It breaks loose! Boulder and Sisyphus are tumbling down!' : 'Der Stein bricht los! Stein und Sisyphus stürzen den Hang hinab!',
        crashed: isEnglish ? 'Crash at the bottom. Fate resets the climb...' : 'Aufprall im Tal. Das Schicksal setzt den Aufstieg zurück...'
    };

    const state = {
        started: false,
        won: false,
        progress: 0,
        pushing: false,
        idleTime: 0,
        pushSpeed: 0.2,
        rollbackSpeed: 0.065,
        rollbackIdleBoost: 0.12,
        lastTime: 0,
        stepPhase: 0,
        tumbleActive: false,
        tumbleTime: 0,
        tumbleVelocity: 0,
        boulderRotation: 0,
        manRotation: 0,
        crashTimer: 0,
        exhaustionTimer: 0,
        pushStreak: 0,
        nextExhaustAfter: 2.2,
        effortLevel: 0,
        pushBurstTimer: 0,
        pushBurstDuration: 0.52
    };

    function randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    function updateStatus(text) {
        if (gameStatus.textContent !== text) {
            gameStatus.textContent = text;
        }
    }

    function resetGame() {
        state.started = true;
        state.won = false;
        state.progress = 0;
        state.pushing = false;
        state.idleTime = 0;
        state.stepPhase = 0;
        state.tumbleActive = false;
        state.tumbleTime = 0;
        state.tumbleVelocity = 0;
        state.boulderRotation = 0;
        state.manRotation = 0;
        state.crashTimer = 0;
        state.exhaustionTimer = 0;
        state.pushStreak = 0;
        state.nextExhaustAfter = randomRange(1.7, 3.2);
        state.effortLevel = 0.15;
        state.pushBurstTimer = 0;
        updateStatus(messages.pushing);
    }

    function startTumble() {
        state.won = false;
        state.pushing = false;
        state.pushBurstTimer = 0;
        state.tumbleActive = true;
        state.tumbleTime = 0;
        state.tumbleVelocity = 0.3;
        updateStatus(messages.tumbling);
    }

    function setPushFromKey(event, active) {
        if (event.code === 'ArrowRight' || event.code === 'KeyD' || event.code === 'ArrowUp' || event.code === 'KeyW') {
            if (!state.tumbleActive && state.crashTimer <= 0) {
                if (active) {
                    if (!event.repeat) {
                        state.pushing = true;
                        state.pushBurstTimer = state.pushBurstDuration;
                    }
                } else {
                    state.pushing = false;
                    state.pushBurstTimer = 0;
                }
            }
            if (active && !state.started) {
                state.started = true;
            }
            event.preventDefault();
        }
    }

    function drawScene() {
        const w = sisyphusCanvas.width;
        const h = sisyphusCanvas.height;
        const boulderRadius = 24;

        ctx.clearRect(0, 0, w, h);

        const shakeX = state.tumbleActive ? Math.sin(state.tumbleTime * 90) * Math.min(10, 2 + state.tumbleTime * 11) : 0;
        ctx.save();
        ctx.translate(shakeX, 0);

        ctx.fillStyle = colors.white;
        ctx.fillRect(0, 0, w, h);

        const hillStartX = 70;
        const hillStartY = h - 55;
        const hillEndX = w - 120;
        const hillEndY = 75;

        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(hillStartX - 30, hillStartY + 20);
        ctx.lineTo(hillEndX + 55, hillEndY - 5);
        ctx.lineTo(w, hillEndY + 30);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = colors.secondary;
        ctx.fill();

        const progressX = hillStartX + (hillEndX - hillStartX) * state.progress;
        const progressY = hillStartY + (hillEndY - hillStartY) * state.progress;

        ctx.save();
        ctx.translate(progressX, progressY - 14);
        ctx.rotate(state.boulderRotation);
        ctx.beginPath();
        ctx.arc(0, 0, boulderRadius, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary;
        ctx.fill();
        ctx.restore();

        const isExhausted = state.exhaustionTimer > 0;
        const bodyTilt = state.pushing && !state.tumbleActive && !isExhausted ? -0.18 : -0.08;
        const tumbleOffsetX = state.tumbleActive ? -36 - Math.min(26, state.tumbleTime * 24) : -36;
        const tumbleOffsetY = state.tumbleActive ? 8 + Math.min(34, state.tumbleTime * 28) : 8;
        const bodyX = progressX + tumbleOffsetX;
        const bodyY = progressY + tumbleOffsetY;
        const legOffset = Math.sin(state.stepPhase) * 4;
        const bodyAngle = state.tumbleActive ? state.manRotation : bodyTilt;

        const boulderCenterX = progressX;
        const boulderCenterY = progressY - 14;
        const relBoulderX = boulderCenterX - bodyX;
        const relBoulderY = boulderCenterY - bodyY;
        const cosInv = Math.cos(-bodyAngle);
        const sinInv = Math.sin(-bodyAngle);
        const boulderLocalX = relBoulderX * cosInv - relBoulderY * sinInv;
        const boulderLocalY = relBoulderX * sinInv + relBoulderY * cosInv;

        function handOnBoulder(shoulderX, shoulderY) {
            const toCenterX = boulderLocalX - shoulderX;
            const toCenterY = boulderLocalY - shoulderY;
            const distance = Math.hypot(toCenterX, toCenterY) || 1;
            const reach = Math.max(0, distance - boulderRadius);
            return {
                x: shoulderX + (toCenterX / distance) * reach,
                y: shoulderY + (toCenterY / distance) * reach
            };
        }

        const shoulder1 = { x: 5, y: -10 };
        const shoulder2 = { x: 9, y: -8 };
        const hand1OnBall = handOnBoulder(shoulder1.x, shoulder1.y);
        const hand2OnBall = handOnBoulder(shoulder2.x, shoulder2.y);

        let hand1 = hand1OnBall;
        let hand2 = hand2OnBall;

        if (state.tumbleActive) {
            hand1 = { x: -12, y: -22 };
            hand2 = { x: 24, y: -18 };
        } else if (state.pushing && !isExhausted) {
            const leadArmOne = Math.sin(state.stepPhase * 0.9) >= 0;
            const recoil1 = { x: shoulder1.x + 8, y: shoulder1.y + 7 };
            const recoil2 = { x: shoulder2.x + 8, y: shoulder2.y + 7 };

            hand1 = leadArmOne ? hand1OnBall : recoil1;
            hand2 = leadArmOne ? recoil2 : hand2OnBall;
        }

        ctx.strokeStyle = colors.primaryDark;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.save();
        ctx.translate(bodyX, bodyY);
        ctx.rotate(bodyAngle);

        ctx.beginPath();
        ctx.arc(0, -26, 6, 0, Math.PI * 2);
        ctx.stroke();

        const sweatIntensity = Math.max(0, Math.min(1, state.effortLevel));
        const sweatThreshold = 0.42;
        const visibleSweat = Math.max(0, (sweatIntensity - sweatThreshold) / (1 - sweatThreshold));
        if (!state.tumbleActive && visibleSweat > 0) {
            const sweatDrops = Math.min(4, 1 + Math.floor(visibleSweat * 4));
            const sweatPulse = Math.sin(state.stepPhase * 1.35);
            ctx.fillStyle = colors.primaryLight || colors.primary;
            ctx.globalAlpha = 0.18 + visibleSweat * 0.6;

            for (let index = 0; index < sweatDrops; index += 1) {
                const side = index % 2 === 0 ? -1 : 1;
                const spreadX = 8 + index * 1.3;
                const fallY = 2 + ((state.stepPhase * 3.2 + index * 1.7) % 9);
                const wobbleX = sweatPulse * (0.7 + index * 0.15);
                ctx.beginPath();
                ctx.ellipse(side * spreadX + wobbleX, -26 + fallY, 1.7, 2.9, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(12, 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(shoulder1.x, shoulder1.y);
        ctx.lineTo(hand1.x, hand1.y);
        ctx.moveTo(shoulder2.x, shoulder2.y);
        ctx.lineTo(hand2.x, hand2.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(12, 2);
        ctx.lineTo(4, 24 + legOffset);
        ctx.moveTo(12, 2);
        ctx.lineTo(18, 24 - legOffset);
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(hillEndX + 30, hillEndY - 10);
        ctx.lineTo(hillEndX + 30, hillEndY - 45);
        ctx.strokeStyle = colors.textLight;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(hillEndX + 30, hillEndY - 45);
        ctx.lineTo(hillEndX + 14, hillEndY - 35);
        ctx.lineTo(hillEndX + 30, hillEndY - 25);
        ctx.closePath();
        ctx.fillStyle = colors.primaryDark;
        ctx.fill();

        const isDownhillTumble = state.tumbleActive && state.tumbleVelocity > 0.75 && state.progress < 0.97;
        if (isDownhillTumble) {
            const streakY = progressY - 36;
            ctx.strokeStyle = colors.textLight;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(progressX + 34, streakY);
            ctx.lineTo(progressX + 68, streakY - 7);
            ctx.moveTo(progressX + 38, streakY + 10);
            ctx.lineTo(progressX + 74, streakY + 3);
            ctx.stroke();
        }

        if (state.crashTimer > 0) {
            const flashStrength = Math.min(0.32, state.crashTimer * 0.28);
            ctx.fillStyle = `rgba(140, 30, 30, ${flashStrength})`;
            ctx.fillRect(0, 0, w, h);
        }

        ctx.fillStyle = colors.text;
        ctx.font = '500 14px Inter, sans-serif';
        ctx.fillText(`Progress: ${Math.round(state.progress * 100)}%`, 18, 24);
        ctx.restore();
    }

    function tick(time) {
        if (!state.lastTime) {
            state.lastTime = time;
        }

        const dt = Math.min((time - state.lastTime) / 1000, 0.05);
        state.lastTime = time;
        let targetEffort = state.started ? 0.18 : 0.06;

        if (state.crashTimer > 0) {
            state.crashTimer -= dt;
            if (state.crashTimer <= 0) {
                state.started = false;
                state.pushBurstTimer = 0;
                state.pushing = false;
                updateStatus(messages.ready);
            }
        }

        if (state.pushing && !state.tumbleActive && state.crashTimer <= 0) {
            state.pushBurstTimer -= dt;
            if (state.pushBurstTimer <= 0) {
                state.pushBurstTimer = 0;
                state.pushing = false;
            }
        }

        if (state.tumbleActive) {
            state.tumbleTime += dt;
            const tumbleAcceleration = 1.1 + Math.min(2.2, state.tumbleTime * 1.8);
            state.tumbleVelocity += tumbleAcceleration * dt;
            state.progress -= state.tumbleVelocity * dt;
            state.boulderRotation += (8 + state.tumbleVelocity * 5) * dt;
            state.manRotation += (12 + state.tumbleVelocity * 6) * dt;
            state.stepPhase += 18 * dt;
            targetEffort = 0.35;

            if (state.progress <= 0) {
                state.progress = 0;
                state.tumbleActive = false;
                state.started = false;
                state.pushing = false;
                state.pushBurstTimer = 0;
                state.idleTime = 0;
                state.crashTimer = 1.2;
                updateStatus(messages.crashed);
            }
        } else if (state.started && !state.won) {
            if (state.exhaustionTimer > 0) {
                state.exhaustionTimer -= dt;
                state.idleTime = 0;
                targetEffort = 0.72 + Math.min(0.24, state.progress * 0.24);
                if (state.pushing) {
                    state.stepPhase += 4 * dt;
                    updateStatus(messages.exhausted);
                } else {
                    updateStatus(messages.slipping);
                }
            } else if (state.pushing) {
                state.idleTime = 0;
                state.pushStreak += dt;
                const summitLoad = Math.pow(state.progress, 1.7);
                const climbResistance = 1 - Math.min(0.78, summitLoad * 0.78);
                const fatigueWave = 0.72 + 0.28 * Math.sin((state.stepPhase * 0.55) + (state.progress * 10));
                const effortWave = 0.9 + 0.2 * Math.sin((state.stepPhase * 0.18) + 0.6);
                const effectivePushSpeed = state.pushSpeed * climbResistance * fatigueWave * effortWave;
                const speedRatio = effectivePushSpeed / state.pushSpeed;
                targetEffort = Math.max(0.25, Math.min(1, 0.25 + (summitLoad * 0.55) + ((1 - speedRatio) * 0.45)));

                state.progress += Math.max(0.02, effectivePushSpeed) * dt;
                state.stepPhase += (9 + (effectivePushSpeed / state.pushSpeed) * 8) * dt;
                updateStatus(messages.pushing);

                if (state.pushStreak >= state.nextExhaustAfter) {
                    state.exhaustionTimer = randomRange(0.25, 0.55) + (summitLoad * 0.25);
                    state.pushStreak = 0;
                    state.nextExhaustAfter = Math.max(0.85, randomRange(1.8, 3.4) - (summitLoad * 1.1));
                }
            } else {
                state.idleTime += dt;
                state.pushStreak = 0;
                const idlePenalty = state.idleTime > 1.2 ? state.rollbackIdleBoost : 0;
                state.progress -= (state.rollbackSpeed + idlePenalty) * dt;
                targetEffort = 0.14;
                updateStatus(messages.slipping);
            }

            state.progress = Math.max(0, Math.min(1, state.progress));

            if (state.progress >= 1) {
                state.progress = 1;
                state.won = true;
                state.pushing = false;
                updateStatus(messages.won);
                startTumble();
            }
        }

        const effortLerp = Math.min(1, dt * 4.5);
        state.effortLevel += (targetEffort - state.effortLevel) * effortLerp;

        drawScene();
        requestAnimationFrame(tick);
    }

    gameResetBtn.addEventListener('click', resetGame);
    window.addEventListener('keydown', (event) => setPushFromKey(event, true));
    window.addEventListener('keyup', (event) => setPushFromKey(event, false));

    updateStatus(messages.ready);
    drawScene();
    requestAnimationFrame(tick);
}
