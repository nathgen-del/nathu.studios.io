// Wait for the HTML to fully load before running the scripts
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // SHARED UTILITY: GET CURRENT THEME COLOR
    // Used by all canvas animations to swap colors on theme change
    // ==========================================
    function getAccentColor() {
        return getComputedStyle(document.documentElement).getPropertyValue('--accent-acid').trim() || '#ccff00';
    }

    // ==========================================
    // 1. TYPING EFFECT LOGIC
    // ==========================================
    const textToType = "Design Meets Architecture..";
    const typewriterElement = document.getElementById('typewriter');

    if (typewriterElement) {
        let typeIndex = 0;
        typewriterElement.textContent = "";

        function typeWriter() {
            if (typeIndex < textToType.length) {
                typewriterElement.textContent += textToType.charAt(typeIndex);
                typeIndex++;
                const typingSpeed = Math.floor(Math.random() * (120 - 50 + 1)) + 50;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        typeWriter();
    }

    // ==========================================
    // 2. CAROUSEL LIGHTBOX LOGIC
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    if (lightbox && lightboxImg && closeBtn) {
        const allGalleryImages = Array.from(document.querySelectorAll('.masonry-item img'));
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            lightbox.classList.add('active');
            lightboxImg.src = allGalleryImages[currentIndex].src;
            lightboxImg.style.display = 'block';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        };

        allGalleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                openLightbox(index);
            });
        });

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
                lightboxImg.src = allGalleryImages[currentIndex].src;
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % allGalleryImages.length;
                lightboxImg.src = allGalleryImages[currentIndex].src;
            });
        }

        closeBtn.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper')) {
                closeLightbox();
            }
        });
    }

    // ==========================================
    // 3. SCROLL FADE-IN ANIMATION
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // ==========================================
    // 4. CERTIFICATE ACCORDION LOGIC
    // ==========================================
    const accordionOptions = document.querySelectorAll('.option');

    if (accordionOptions.length > 0) {
        accordionOptions.forEach(option => {
            option.addEventListener('click', () => {
                accordionOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            });
        });
    }

    // ==========================================
    // 5. CUSTOM CROSSHAIR LOGIC
    // ==========================================
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');

        const ring = document.createElement('div');
        ring.classList.add('cursor-ring');

        document.body.appendChild(cursor);
        document.body.appendChild(ring);

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .option');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover-active'));
        });
    }

    // ==========================================
    // 6. SYSTEM OVERRIDE (THEME TOGGLE)
    // ==========================================
    console.log("System Override Script: ONLINE");
    const toggleBtn = document.getElementById('global-theme-toggle');

    if (toggleBtn) {
        const root = document.documentElement;
        const label = toggleBtn.querySelector('.toggle-label');

        if (localStorage.getItem('theme') === 'light') {
            root.setAttribute('data-theme', 'light');
            if (label) label.textContent = 'STUDIO_MODE_ACTIVE';
        }

        toggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log("System Override: INITIATED");

            if (root.getAttribute('data-theme') === 'light') {
                root.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                if (label) label.textContent = 'SYSTEM_OVERRIDE';
            } else {
                root.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (label) label.textContent = 'STUDIO_MODE_ACTIVE';
            }
        });
    } else {
        console.error("System Override Script: ERROR - Button not found in HTML.");
    }

    // ==========================================
    // 7. SCROLL PROGRESS TRACKER LOGIC
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');

    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        });
    }

    // ==========================================
    // 8. LIVE DATA NODE BACKGROUND (HERO)
    // ==========================================
    const canvas = document.getElementById('hero-canvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const heroSection = document.getElementById('home');

        // Wrap the sizing in a tiny delay so the CSS 100vh kicks in first
        setTimeout(() => {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            initNodes();
            animateCanvas();
        }, 100);

        window.addEventListener('resize', () => {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            initNodes(); // Regenerate nodes to fit new size
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 1) - 0.5;
                this.speedY = (Math.random() * 1) - 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = getAccentColor();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initNodes() {
            particlesArray = [];
            let numberOfNodes = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < numberOfNodes; i++) {
                particlesArray.push(new Particle());
            }
        }

        function connectNodes() {
            let opacityValue = 1;
            const themeColor = getAccentColor();

            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 10000);
                        ctx.globalAlpha = opacityValue;
                        ctx.strokeStyle = themeColor;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connectNodes();
            requestAnimationFrame(animateCanvas);
        }
    }

    // ==========================================
    // 9. VERTICAL DATA RAIN (VIDEO SECTION)
    // ==========================================
    const videoCanvas = document.getElementById('video-canvas');

    if (videoCanvas) {
        const vCtx = videoCanvas.getContext('2d');
        const videoSection = document.getElementById('video-showcase');

        const resizeVideoCanvas = () => {
            videoCanvas.width = videoSection.offsetWidth;
            videoCanvas.height = videoSection.offsetHeight;
        };

        setTimeout(resizeVideoCanvas, 100);
        window.addEventListener('resize', resizeVideoCanvas);

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
        const fontSize = 14;
        let columns = window.innerWidth / fontSize; // Initial columns
        let drops = [];
        for (let x = 0; x < columns; x++) drops[x] = 1;

        function drawDataRain() {
            const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
            vCtx.fillStyle = isLightMode ? 'rgba(240, 244, 248, 0.1)' : 'rgba(10, 10, 10, 0.1)';
            vCtx.fillRect(0, 0, videoCanvas.width, videoCanvas.height);

            vCtx.fillStyle = getAccentColor();
            vCtx.font = fontSize + 'px monospace';

            // Ensure drops array matches current width if resized
            if (drops.length < videoCanvas.width / fontSize) {
                for (let x = drops.length; x < videoCanvas.width / fontSize; x++) drops[x] = 1;
            }

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                vCtx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > videoCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            requestAnimationFrame(drawDataRain);
        }
        drawDataRain();
    }

    // ==========================================
    // 10. COMM-LINK RADAR (CONTACT SECTION)
    // ==========================================
    const contactCanvas = document.getElementById('contact-canvas');

    if (contactCanvas) {
        const cCtx = contactCanvas.getContext('2d');
        const contactSection = document.getElementById('contact');

        const resizeContactCanvas = () => {
            contactCanvas.width = contactSection.offsetWidth;
            contactCanvas.height = contactSection.offsetHeight;
        };

        setTimeout(resizeContactCanvas, 100);
        window.addEventListener('resize', resizeContactCanvas);

        let angle = 0;

        function drawRadar() {
            cCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
            const centerX = contactCanvas.width / 2;
            const centerY = contactCanvas.height / 2;
            const radius = Math.min(centerX, centerY) - 20;
            const themeColor = getAccentColor();

            cCtx.strokeStyle = themeColor;
            cCtx.globalAlpha = 0.3;
            cCtx.lineWidth = 1;
            for (let i = 1; i <= 4; i++) {
                cCtx.beginPath();
                cCtx.arc(centerX, centerY, radius * (i / 4), 0, Math.PI * 2);
                cCtx.stroke();
            }

            cCtx.globalAlpha = 0.5;
            cCtx.beginPath();
            cCtx.moveTo(centerX, centerY);
            cCtx.arc(centerX, centerY, radius, angle, angle + 0.2);
            cCtx.lineTo(centerX, centerY);
            cCtx.fillStyle = themeColor;
            cCtx.fill();

            cCtx.globalAlpha = 0.2;
            cCtx.beginPath();
            cCtx.moveTo(centerX - radius, centerY);
            cCtx.lineTo(centerX + radius, centerY);
            cCtx.moveTo(centerX, centerY - radius);
            cCtx.lineTo(centerX, centerY + radius);
            cCtx.stroke();

            angle += 0.02;
            if (angle > Math.PI * 2) angle = 0;

            requestAnimationFrame(drawRadar);
        }
        drawRadar();
    }
});