gsap.registerPlugin(ScrollTrigger, TextPlugin);

const honeycombCanvas = document.getElementById('honeycomb-canvas');
const ctx = honeycombCanvas.getContext('2d');
let hexagons = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    honeycombCanvas.width = window.innerWidth;
    honeycombCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

class Hexagon {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * honeycombCanvas.width;
        this.y = Math.random() * honeycombCanvas.height;
        this.size = Math.random() * 30 + 10;
        this.alpha = Math.random() * 0.08 + 0.02;
        this.baseAlpha = this.alpha;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.005;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
        this.pulsePhase += this.pulseSpeed;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
            this.alpha = this.baseAlpha + (1 - dist / 200) * 0.15;
        } else {
            this.alpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.02;
        }

        if (this.x < -50 || this.x > honeycombCanvas.width + 50 ||
            this.y < -50 || this.y > honeycombCanvas.height + 50) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();

        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = this.size * Math.cos(angle);
            const py = this.size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }

        ctx.closePath();
        ctx.strokeStyle = `rgba(245, 166, 35, ${this.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }
}

for (let i = 0; i < 40; i++) {
    hexagons.push(new Hexagon());
}

function animateCanvas() {
    ctx.clearRect(0, 0, honeycombCanvas.width, honeycombCanvas.height);
    hexagons.forEach(h => {
        h.update();
        h.draw();
    });
    requestAnimationFrame(animateCanvas);
}

animateCanvas();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
    .from('#hero-logo', {
        scale: 0,
        rotation: -180,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
    })
    .from('#title-line-1', {
        y: 60,
        opacity: 0,
        duration: 0.8,
    }, '-=0.6')
    .from('#title-line-2', {
        y: 40,
        opacity: 0,
        duration: 0.8,
    }, '-=0.5')
    .from('#hero-desc', {
        y: 30,
        opacity: 0,
        duration: 0.6,
    }, '-=0.4')
    .from('#hero-actions .btn', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
    }, '-=0.3')
    .from('#hero-cron', {
        y: 20,
        opacity: 0,
        duration: 0.6,
    }, '-=0.2')
    .from('#scroll-hint', {
        opacity: 0,
        duration: 1,
    }, '-=0.1');

gsap.to('#hero-logo', {
    y: -10,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
});

const cronExpressions = [
    { expr: '0 9 * * 1-5', result: '每个工作日 9:00 提醒' },
    { expr: '0 0/5 * * * ?', result: '每 5 分钟执行一次' },
    { expr: '0 0 12 * * ?', result: '每天中午 12:00' },
    { expr: '25 9 * * 1-5', result: '工作日 9:25 晨会' },
    { expr: '0 10 * * 5', result: '每周五 10:00' },
    { expr: '0 0 0 1 * ?', result: '每月 1 日午夜' },
];

let cronIndex = 0;
const cronExprEl = document.getElementById('cron-expr');
const cronResultEl = document.getElementById('cron-result');

function cycleCron() {
    cronIndex = (cronIndex + 1) % cronExpressions.length;
    const { expr, result } = cronExpressions[cronIndex];

    gsap.to(cronExprEl, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
            cronExprEl.textContent = expr;
            gsap.to(cronExprEl, { opacity: 1, y: 0, duration: 0.3 });
        }
    });

    gsap.to(cronResultEl, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        delay: 0.1,
        onComplete: () => {
            cronResultEl.textContent = result;
            gsap.to(cronResultEl, { opacity: 1, y: 0, duration: 0.3 });
        }
    });
}

setInterval(cycleCron, 3000);

gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        rotation: i % 2 === 0 ? -3 : 3,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
    });
});

gsap.utils.toArray('.guide-step').forEach((step, i) => {
    const numberEl = step.querySelector('.step-number');
    const contentEl = step.querySelector('.step-content');
    const visualEl = step.querySelector('.step-visual');

    gsap.from(step, {
        scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        },
        opacity: 0,
        x: i % 2 === 0 ? -40 : 40,
        duration: 0.8,
        ease: 'power3.out',
    });

    if (numberEl) {
        gsap.from(numberEl, {
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            scale: 0,
            rotation: 180,
            duration: 0.6,
            delay: 0.2,
            ease: 'back.out(1.7)',
        });
    }
});

gsap.utils.toArray('.guide-connector').forEach((conn) => {
    gsap.from(conn, {
        scrollTrigger: {
            trigger: conn,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.4,
        ease: 'power2.out',
    });
});

gsap.utils.toArray('.cron-field').forEach((field, i) => {
    gsap.from(field, {
        scrollTrigger: {
            trigger: '.cron-structure',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.5,
        delay: i * 0.1,
        ease: 'back.out(1.7)',
    });
});

gsap.utils.toArray('.cron-table-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
    });
});

gsap.utils.toArray('.cron-table-card tbody tr').forEach((row, i) => {
    gsap.from(row, {
        scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
        },
        x: -30,
        opacity: 0,
        duration: 0.4,
        delay: i * 0.05,
        ease: 'power2.out',
    });
});

gsap.from('.cron-tools', {
    scrollTrigger: {
        trigger: '.cron-tools',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
});

gsap.from('.cta-title', {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
    },
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: 'elastic.out(1, 0.5)',
});

gsap.from('.cta-desc', {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
});

gsap.from('.cta-actions', {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.4,
});

gsap.from('.cta-note', {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
    },
    opacity: 0,
    duration: 0.6,
    delay: 0.6,
});

const ctaBtn = document.querySelector('.cta-actions .btn-primary');
if (ctaBtn) {
    gsap.to(ctaBtn, {
        boxShadow: '0 0 40px rgba(245, 166, 35, 0.4)',
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: 'sine.inOut',
    });
}

gsap.utils.toArray('.section-header').forEach((header) => {
    const tag = header.querySelector('.section-tag');
    const title = header.querySelector('.section-title');
    const subtitle = header.querySelector('.section-subtitle');

    gsap.from(tag, {
        scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
    });

    gsap.from(title, {
        scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        delay: 0.1,
    });

    gsap.from(subtitle, {
        scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
    });
});

gsap.from('.footer-content', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%',
        toggleActions: 'play none none reverse',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
});

const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.03,
            duration: 0.3,
            ease: 'power2.out',
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
        });
    });
});

const toolLinks = document.querySelectorAll('.tool-link');
toolLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            scale: 1.05,
            duration: 0.2,
        });
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            scale: 1,
            duration: 0.2,
        });
    });
});

const cronFields = document.querySelectorAll('.field-block');
cronFields.forEach(block => {
    block.addEventListener('mouseenter', () => {
        gsap.to(block, {
            scale: 1.15,
            duration: 0.3,
            ease: 'back.out(1.7)',
        });
    });

    block.addEventListener('mouseleave', () => {
        gsap.to(block, {
            scale: 1,
            duration: 0.3,
        });
    });
});
