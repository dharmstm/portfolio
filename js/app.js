document.addEventListener('DOMContentLoaded', () => {
    // === Preloader ===
    const preloader = document.getElementById('preloader');
    const hidePreloader = () => setTimeout(() => preloader.classList.add('hidden'), 2200);
    window.addEventListener('load', hidePreloader);
    setTimeout(() => preloader.classList.add('hidden'), 3500);

    // === Cyber Grid Background ===
    const canvas = document.getElementById('cyberGrid');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, particles = [];

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 1.5 + 0.5;
                this.alpha = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 245, 212, ${this.alpha})`;
                ctx.fill();
            }
        }

        const count = Math.min(80, Math.floor(w * h / 15000));
        for (let i = 0; i < count; i++) particles.push(new Particle());

        function drawGrid() {
            ctx.strokeStyle = 'rgba(0, 245, 212, 0.02)';
            ctx.lineWidth = 0.5;
            const spacing = 80;
            for (let x = 0; x < w; x += spacing) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y < h; y += spacing) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 245, 212, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            drawGrid();
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animate);
        }
        animate();
    }

    // === Typing Animation ===
    const typedEl = document.getElementById('typedText');
    if (typedEl) {
        const words = ['Cybersecurity Engineer', 'Penetration Tester', 'Security Researcher', 'Bug Hunter', 'VAPT Specialist', 'Ethical Hacker'];
        let wi = 0, ci = 0, deleting = false;

        function type() {
            const word = words[wi];
            typedEl.textContent = deleting ? word.substring(0, ci - 1) : word.substring(0, ci + 1);
            ci = deleting ? ci - 1 : ci + 1;

            let speed = deleting ? 35 : 70;
            if (!deleting && ci === word.length) { speed = 2200; deleting = true; }
            else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; speed = 500; }
            setTimeout(type, speed);
        }
        type();
    }

    // === Navbar Scroll ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // === Hamburger ===
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // === Active Nav on Scroll ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    function setActiveNav() {
        const y = window.scrollY + 120;
        sections.forEach(sec => {
            const top = sec.offsetTop, h = sec.offsetHeight, id = sec.getAttribute('id');
            if (y >= top && y < top + h) {
                navLinks.forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === '#' + id) l.classList.add('active');
                });
            }
        });
    }
    window.addEventListener('scroll', setActiveNav);

    // === Scroll Reveal ===
    function revealOnScroll() {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.88) el.classList.add('active');
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // === Counter Animation ===
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let counterDone = false;
    function animateCounters() {
        if (counterDone) return;
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;
        if (statsSection.getBoundingClientRect().top < window.innerHeight) {
            counterDone = true;
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.count);
                let current = 0;
                const step = Math.ceil(target / 40);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(timer); }
                    counter.textContent = current;
                }, 50);
            });
        }
    }
    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // === Back to Top ===
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Resize Reset ===
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
