document.addEventListener('DOMContentLoaded', () => {

    function getAccentColor() {
        return getComputedStyle(document.documentElement).getPropertyValue('--accent-acid').trim() || '#ccff00';
    }

    const textToType = "Websites. Graphics. Videos. Support.";
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

            // FIX: Lock scrolling on both body and html to cover mobile behavior
            document.body.classList.add('no-scroll');
            document.documentElement.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');

            // FIX: Safely unlock scroll
            document.body.classList.remove('no-scroll');
            document.documentElement.classList.remove('no-scroll');

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
    // UPGRADED STAGGERED SCROLL OBSERVER
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Triggers slightly before the item hits the bottom of the screen
        threshold: 0.05 // Drops from 15% to 5% so tall elements trigger reliably
    };

    const observer = new IntersectionObserver((entries, observer) => {
        let delayCounter = 0; // Creates the waterfall stagger effect

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply a slight delay to each item that enters the screen at the same time
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delayCounter * 100);

                delayCounter++;
                observer.unobserve(entry.target);
            }
        });

        // Reset the counter so the next scroll section behaves normally
        setTimeout(() => { delayCounter = 0; }, 100);

    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');

    // FIX: Wait for the brutalist doors to open (4.5s) before triggering the fade-ins!
    // This ensures the items slide up while the user is actually looking at them.
    setTimeout(() => {
        fadeElements.forEach(el => observer.observe(el));
    }, 4500);

    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        const ring = document.createElement('div');
        ring.classList.add('cursor-ring');
        document.body.appendChild(cursor);
        document.body.appendChild(ring);

        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.style.left = `${mouseX}px`; cursor.style.top = `${mouseY}px`;
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
            ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .option');

        interactiveElements.forEach(el => {
            // Do not activate the big dotted cursor ring on the top navigation
            if (el.closest('.site-topbar')) return;

            el.addEventListener('mouseenter', () => ring.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover-active'));
        });
    }


    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        });
    }

    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const heroSection = document.getElementById('home');

        setTimeout(() => {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            initNodes(); animateCanvas();
        }, 100);

        window.addEventListener('resize', () => {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            initNodes();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 1) - 0.5; this.speedY = (Math.random() * 1) - 0.5;
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = getAccentColor(); ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }
        function initNodes() {
            particlesArray = [];
            let numberOfNodes = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < numberOfNodes; i++) { particlesArray.push(new Particle()); }
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
                        ctx.globalAlpha = opacityValue; ctx.strokeStyle = themeColor; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }
        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); particlesArray[i].draw(); }
            connectNodes(); requestAnimationFrame(animateCanvas);
        }
    }

    const videoCanvas = document.getElementById('video-canvas');
    if (videoCanvas) {
        const vCtx = videoCanvas.getContext('2d');
        const videoSection = document.getElementById('video-showcase');
        const resizeVideoCanvas = () => { videoCanvas.width = videoSection.offsetWidth; videoCanvas.height = videoSection.offsetHeight; };
        setTimeout(resizeVideoCanvas, 100); window.addEventListener('resize', resizeVideoCanvas);

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
        const fontSize = 14; let columns = window.innerWidth / fontSize;
        let drops = []; for (let x = 0; x < columns; x++) drops[x] = 1;

        function drawDataRain() {
            const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
            vCtx.fillStyle = isLightMode ? 'rgba(240, 244, 248, 0.1)' : 'rgba(10, 10, 10, 0.1)';
            vCtx.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
            vCtx.fillStyle = getAccentColor(); vCtx.font = fontSize + 'px monospace';

            if (drops.length < videoCanvas.width / fontSize) {
                for (let x = drops.length; x < videoCanvas.width / fontSize; x++) drops[x] = 1;
            }
            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                vCtx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > videoCanvas.height && Math.random() > 0.975) { drops[i] = 0; }
                drops[i]++;
            }
            requestAnimationFrame(drawDataRain);
        }
        drawDataRain();
    }

    const contactCanvas = document.getElementById('contact-canvas');
    if (contactCanvas) {
        const cCtx = contactCanvas.getContext('2d');
        const contactSection = document.getElementById('contact');
        const resizeContactCanvas = () => { contactCanvas.width = contactSection.offsetWidth; contactCanvas.height = contactSection.offsetHeight; };
        setTimeout(resizeContactCanvas, 100); window.addEventListener('resize', resizeContactCanvas);

        let angle = 0;
        function drawRadar() {
            cCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
            const centerX = contactCanvas.width / 2; const centerY = contactCanvas.height / 2;
            const radius = Math.min(centerX, centerY) - 20; const themeColor = getAccentColor();

            cCtx.strokeStyle = themeColor; cCtx.globalAlpha = 0.3; cCtx.lineWidth = 1;
            for (let i = 1; i <= 4; i++) { cCtx.beginPath(); cCtx.arc(centerX, centerY, radius * (i / 4), 0, Math.PI * 2); cCtx.stroke(); }
            cCtx.globalAlpha = 0.5; cCtx.beginPath(); cCtx.moveTo(centerX, centerY); cCtx.arc(centerX, centerY, radius, angle, angle + 0.2); cCtx.lineTo(centerX, centerY); cCtx.fillStyle = themeColor; cCtx.fill();
            cCtx.globalAlpha = 0.2; cCtx.beginPath(); cCtx.moveTo(centerX - radius, centerY); cCtx.lineTo(centerX + radius, centerY); cCtx.moveTo(centerX, centerY - radius); cCtx.lineTo(centerX, centerY + radius); cCtx.stroke();
            angle += 0.02; if (angle > Math.PI * 2) angle = 0;
            requestAnimationFrame(drawRadar);
        }
        drawRadar();
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const form = e.target;
            const data = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'TRANSMITTING...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    form.reset();
                    submitBtn.textContent = 'TRANSMISSION SENT';
                    submitBtn.style.color = '#ccff00';
                    submitBtn.style.borderColor = '#ccff00';

                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.color = '';
                        submitBtn.style.borderColor = '';
                    }, 4000);
                } else {
                    submitBtn.textContent = 'SYSTEM ERROR - RETRY';
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 4000);
                }
            } catch (error) {
                submitBtn.textContent = 'NETWORK FAILURE';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 4000);
            }
        });
    }

});

// ==========================================
// 12. MOTHERBOARD TRACE SCROLL TRACKER
// ==========================================
const traceFill = document.getElementById('trace-fill');
const circuitContainer = document.querySelector('.circuit-container');
const circuitBlocks = document.querySelectorAll('.circuit-block'); // Selects all nodes

if (traceFill && circuitContainer) {
    window.addEventListener('scroll', () => {
        // Get the container's position relative to the viewport
        const rect = circuitContainer.getBoundingClientRect();

        // Calculate how far the center of the screen has traveled down the container
        const viewportCenter = window.innerHeight / 2;
        let fillPercentage = 0;
        let distanceCovered = 0;

        if (rect.top <= viewportCenter) {
            // Determine the exact pixel distance the line has drawn
            distanceCovered = viewportCenter - rect.top;
            fillPercentage = (distanceCovered / rect.height) * 100;

            // Cap the line values between 0% and 100%
            if (fillPercentage > 100) fillPercentage = 100;
            if (fillPercentage < 0) fillPercentage = 0;

            // Light up the nodes as the line passes them
            circuitBlocks.forEach(block => {
                // Calculate the exact center point of each hexagon node
                const nodeTriggerPoint = block.offsetTop + (block.offsetHeight / 2);

                // If the drawn line passes the hexagon, add the active glow
                if (distanceCovered >= nodeTriggerPoint) {
                    block.classList.add('active');
                } else {
                    block.classList.remove('active');
                }
            });
        }

        // Apply the height to the neon line
        traceFill.style.height = `${fillPercentage}%`;
    });
}

// ==========================================
// 13. CERTIFICATE MODAL VIEWER & ZOOM
// ==========================================
window.openCert = function (imageSrc, titleText) {
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('cert-modal-img');
    const modalTitle = document.getElementById('cert-modal-title');

    // Inject the image and the custom title
    modalImg.src = imageSrc;
    modalTitle.innerText = "VERIFIED LOG // " + titleText;

    // Always reset zoom when opening a new certificate
    modalImg.classList.remove('zoomed');

    // Show the modal
    modal.classList.add('active');

    // Apply the CSS scroll lock class
    document.body.classList.add('no-scroll');
};

window.closeCert = function (event) {
    // ONLY close if they clicked the dark background or the [X] button
    if (event.target.id === 'cert-modal' || event.target.id === 'cert-close-btn') {
        const modal = document.getElementById('cert-modal');
        modal.classList.remove('active');

        // Remove the CSS scroll lock class
        document.body.classList.remove('no-scroll');
    }
};
/* ==========================================
   PREMIUM LOGO + SYSTEM OVERRIDE SPLIT
   ========================================== */
window.addEventListener("load", () => {
    const loader = document.getElementById("logo-loader");

    // Step 1: Wait 4.5s for the draw-in, green blinks, and final RED flash
    setTimeout(() => {
        loader.classList.add("split-active");
    }, 4500);

    // Step 2: Wait for the doors to finish flying open, then kill the loader code
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 5500);
});

// ==========================================
// LIVE SYSTEM CLOCK (MANILA TIMEZONE)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    function updateSystemClock() {
        const clockElement = document.getElementById('live-clock');
        if (!clockElement) return;

        // Kukunin ang kasalukuyang oras
        const now = new Date();

        // Naka-lock sa Philippine Time (Asia/Manila)
        const options = {
            timeZone: 'Asia/Manila',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };

        const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
        clockElement.textContent = timeString;
    }

    // Patakbuhin agad para hindi "00:00:00" ang unang makikita
    updateSystemClock();
    setInterval(updateSystemClock, 1000);
});

// ==========================================
// RESUME MODAL VIEWER
// ==========================================
window.openResumeModal = function () {
    const modal = document.getElementById('resume-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
    } else {
        console.error("ERROR: Could not find <div id='resume-modal'> in the HTML.");
    }
};

window.closeResumeModal = function (event) {
    if (event.target.id === 'resume-modal' || event.target.id === 'resume-close-btn') {
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }
};

