// Default Avatar SVG (Base64)
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDIxdi0yYTRgNCAwIDAgMC00LTRINThhNCA0IDAgMCAwLTQgNHYyIj48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ij48L2NpcmNsZT48L3N2Zz4=';

document.addEventListener('DOMContentLoaded', () => {
    // Make sure storage is loaded
    if (typeof storage === 'undefined') {
        console.error('Storage object is not defined. Ensure storage.js is loaded first.');
        return;
    }

    initApp();
});

function initApp() {
    applyTheme();
    loadBackground();
    loadProfile();
    applySections();
    loadLinks();
    applyNameStyle();
    loadDecorations();
    loadGallery();
    loadVideos();
    initParticles();
    initScrollAnimations();
    initLightbox();
    applyCustomCSS();
}

function applyTheme() {
    const theme = storage.getTheme();
    if (theme) {
        const root = document.documentElement;
        if (theme.primaryColor) root.style.setProperty('--primary', theme.primaryColor);
        if (theme.secondaryColor) root.style.setProperty('--secondary', theme.secondaryColor);
        if (theme.accentColor) root.style.setProperty('--accent', theme.accentColor);
        if (theme.textColor) root.style.setProperty('--text', theme.textColor);
        if (theme.cardBg) root.style.setProperty('--card-bg', theme.cardBg);
        if (theme.cardBorder) root.style.setProperty('--card-border', theme.cardBorder);
        if (theme.borderRadius) root.style.setProperty('--radius', theme.borderRadius);
        if (theme.fontFamily) root.style.setProperty('font-family', theme.fontFamily);
    }
}

function loadBackground() {
    const bg = storage.getBackground();
    if (!bg) return;

    const bgGradient = document.getElementById('bg-gradient');
    const bgImage = document.getElementById('bg-image');
    const bgVideo = document.getElementById('bg-video');

    bgGradient.style.display = 'none';
    bgImage.style.display = 'none';
    bgVideo.style.display = 'none';

    if (bg.type === 'color' || bg.type === 'gradient') {
        bgGradient.style.display = 'block';
        bgGradient.style.background = bg.value;
    } else if (bg.type === 'image') {
        bgImage.style.display = 'block';
        bgImage.src = bg.value;
    } else if (bg.type === 'video') {
        bgVideo.style.display = 'block';
        bgVideo.src = bg.value;
    }
}

function loadProfile() {
    const profile = storage.getProfile();
    const avatarImg = document.getElementById('profile-avatar');
    const nameEl = document.getElementById('profile-name');
    const bioEl = document.getElementById('profile-bio');

    if (profile) {
        avatarImg.src = profile.avatar || defaultAvatar;
        nameEl.textContent = profile.name || 'Ahmad';
        bioEl.textContent = profile.bio || '';
        
        // Handle title elements if provided in sections
        const sections = storage.getSections() || {};
        const linksTitle = document.getElementById('links-title');
        const galleryTitle = document.getElementById('gallery-title');
        const videosTitle = document.getElementById('videos-title');
        
        if (linksTitle && sections.linksTitle) linksTitle.textContent = sections.linksTitle;
        if (galleryTitle && sections.galleryTitle) galleryTitle.textContent = sections.galleryTitle;
        if (videosTitle && sections.videosTitle) videosTitle.textContent = sections.videosTitle;
    }
}

function applyNameStyle() {
    if (!storage.getNameStyle) return;
    const ns = storage.getNameStyle();
    const nameEl = document.getElementById('profile-name');
    if (!nameEl || !ns) return;

    // Load custom Google Font
    if (ns.font) {
        const fontLink = document.createElement('link');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${ns.font.replace(/ /g, '+')}:wght@400;500;600;700;800;900&display=swap`;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        nameEl.style.fontFamily = `'${ns.font}', sans-serif`;
    }

    // Apply size, weight, spacing
    if (ns.fontSize) nameEl.style.fontSize = ns.fontSize;
    if (ns.fontWeight) nameEl.style.fontWeight = ns.fontWeight;
    if (ns.letterSpacing) nameEl.style.letterSpacing = ns.letterSpacing;

    // Set data attribute for glitch effect
    nameEl.setAttribute('data-text', nameEl.textContent);

    // Remove default gradient styling from CSS
    nameEl.style.background = 'none';
    nameEl.style.webkitBackgroundClip = 'unset';
    nameEl.style.webkitTextFillColor = 'unset';

    // Set color custom properties
    if (ns.gradientColors) {
        nameEl.style.setProperty('--name-color-1', ns.gradientColors[0] || '#7c3aed');
        nameEl.style.setProperty('--name-color-2', ns.gradientColors[1] || '#a855f7');
        nameEl.style.setProperty('--name-color-3', ns.gradientColors[2] || '#06b6d4');
    }

    // Apply effect class
    const effect = ns.effect || 'gradient';
    if (effect !== 'none') {
        nameEl.classList.add(`name-${effect}`);
    }

    // For gradient, apply custom gradient
    if (effect === 'gradient' && ns.gradientColors) {
        const angle = ns.gradientAngle || 135;
        const colors = ns.gradientColors;
        nameEl.style.background = `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
        nameEl.style.webkitBackgroundClip = 'text';
        nameEl.style.webkitTextFillColor = 'transparent';
        nameEl.style.backgroundClip = 'text';
    }

    // Apply text animation
    if (ns.animation && ns.animation !== 'none') {
        nameEl.classList.add(`name-anim-${ns.animation}`);
    }

    // Apply text shadow
    if (ns.textShadowColor && ns.textShadowBlur) {
        nameEl.style.textShadow = `0 0 ${ns.textShadowBlur} ${ns.textShadowColor}`;
    }
}

function loadDecorations() {
    if (!storage.getDecorations) return;
    const decos = storage.getDecorations();
    if (!decos || decos.length === 0) return;

    // Remove existing decorations
    document.querySelectorAll('.decoration-element').forEach(el => el.remove());

    decos.forEach(deco => {
        const el = document.createElement('div');
        el.className = 'decoration-element';
        el.style.left = deco.x + '%';
        el.style.top = deco.y + '%';
        el.style.fontSize = deco.size + 'px';
        el.style.color = deco.color || '#a855f7';
        el.style.opacity = deco.opacity || 0.7;
        el.style.transform = `rotate(${deco.rotation || 0}deg)`;

        // Content based on type
        if (deco.type === 'icon') {
            el.innerHTML = `<i class="${deco.content}"></i>`;
        } else if (deco.type === 'emoji') {
            el.textContent = deco.content;
        } else if (deco.type === 'text') {
            el.textContent = deco.content;
        } else if (deco.type === 'image') {
            el.style.width = deco.size + 'px';
            el.style.height = deco.size + 'px';
            el.innerHTML = `<img src="${deco.content}" alt="decoration">`;
        }

        // Animation
        if (deco.animation && deco.animation !== 'none') {
            el.classList.add(`deco-anim-${deco.animation}`);
        }

        document.body.appendChild(el);
    });
}

function applySections() {
    const sections = storage.getSections();
    if (!sections) return;

    const linksSection = document.getElementById('links-section');
    const gallerySection = document.getElementById('gallery-section');
    const videosSection = document.getElementById('videos-section');

    if (linksSection) linksSection.style.display = sections.showLinks !== false ? 'flex' : 'none';
    if (gallerySection) gallerySection.style.display = sections.showGallery ? 'flex' : 'none';
    if (videosSection) videosSection.style.display = sections.showVideos ? 'flex' : 'none';
}

function loadLinks() {
    const links = storage.getLinks(true); // true = active only
    const container = document.getElementById('links-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (links && links.length > 0) {
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'link-card glass-card';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            
            // Allow custom colors per link if defined in storage
            if (link.color) {
                a.style.borderColor = link.color;
            }

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'link-icon-wrapper';
            
            if (link.icon) {
                const icon = document.createElement('i');
                icon.className = link.icon;
                iconWrapper.appendChild(icon);
            }

            const content = document.createElement('div');
            content.className = 'link-content';
            
            const title = document.createElement('div');
            title.className = 'link-title';
            title.textContent = link.title;
            
            content.appendChild(title);
            
            a.appendChild(iconWrapper);
            a.appendChild(content);
            container.appendChild(a);
        });
    }
}

function loadGallery() {
    const gallery = storage.getGallery();
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (gallery && gallery.length > 0) {
        gallery.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item glass-card';
            
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.caption || 'Gallery Image';
            img.loading = 'lazy';
            
            div.appendChild(img);
            
            if (item.caption) {
                const overlay = document.createElement('div');
                overlay.className = 'gallery-overlay';
                
                const caption = document.createElement('div');
                caption.className = 'gallery-caption';
                caption.textContent = item.caption;
                
                overlay.appendChild(caption);
                div.appendChild(overlay);
            }
            
            // Add Lightbox interaction
            div.addEventListener('click', () => openLightbox(item.src));
            
            grid.appendChild(div);
        });
    }
}

function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function loadVideos() {
    const videos = storage.getVideos();
    const grid = document.getElementById('videos-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (videos && videos.length > 0) {
        videos.forEach(item => {
            const card = document.createElement('div');
            card.className = 'video-card glass-card';
            
            const container = document.createElement('div');
            container.className = 'video-container';
            
            const ytID = extractYouTubeID(item.url);
            
            if (ytID) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${ytID}`;
                iframe.title = item.title || 'YouTube Video';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                container.appendChild(iframe);
            } else {
                const video = document.createElement('video');
                video.src = item.url;
                video.controls = true;
                container.appendChild(video);
            }
            
            card.appendChild(container);
            
            if (item.title) {
                const title = document.createElement('div');
                title.className = 'video-title';
                title.textContent = item.title;
                card.appendChild(title);
            }
            
            grid.appendChild(card);
        });
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    
    if (!lightbox || !lightboxImg) return;
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Expose open function globally
    window.openLightbox = function(url) {
        lightboxImg.src = url;
        lightbox.classList.add('active');
    };
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation runs once
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.animate-in').forEach(el => {
        observer.observe(el);
    });
}

function applyCustomCSS() {
    const settings = storage.getSettings ? storage.getSettings() : {};
    if (settings && settings.customCSS) {
        const container = document.getElementById('custom-css-container');
        if (container) {
            container.innerHTML = `<style>${settings.customCSS}</style>`;
        }
    }
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particlesArray = [];
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = 'rgba(124, 58, 237, 0.4)'; // Primary color with opacity
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    function init() {
        particlesArray = [];
        const numParticles = Math.min(Math.floor(window.innerWidth * window.innerHeight / 15000), 100);
        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function handleParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 - distance/1000})`; // Accent color
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}
