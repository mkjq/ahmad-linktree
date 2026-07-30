document.addEventListener('DOMContentLoaded', () => {
    // --- Auth System ---
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('login-password');
    const togglePassword = document.getElementById('toggle-password');
    const logoutBtn = document.getElementById('btn-logout');

    // Check auth status on load
    if (storage.isAuthenticated()) {
        showDashboard();
    } else {
        showLogin();
    }

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.className = type === 'password' ? 'fas fa-eye eye-toggle' : 'fas fa-eye-slash eye-toggle';
    });

    // Login Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = passwordInput.value;
        if (storage.checkPassword(pwd)) {
            storage.createSession();
            showDashboard();
            showToast('تم تسجيل الدخول بنجاح', 'success');
        } else {
            const loginCard = document.querySelector('.login-card');
            loginCard.classList.remove('shake');
            void loginCard.offsetWidth; // trigger reflow
            loginCard.classList.add('shake');
            showToast('كلمة المرور غير صحيحة', 'error');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        storage.logout();
        showLogin();
        showToast('تم تسجيل الخروج', 'info');
    });

    function showLogin() {
        loginScreen.style.display = 'flex';
        dashboard.style.display = 'none';
        passwordInput.value = '';
    }

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        initDashboard();
    }

    function reloadPreview() {
        const iframe = document.getElementById('preview-iframe');
        if (iframe) {
            iframe.src = iframe.src;
        }
    }

    // --- Toast Notifications ---
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        if (message.includes('تم') || type === 'success') {
            reloadPreview();
        }
        
        // Remove after 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Utility: File to Base64 ---
    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // --- Dashboard Core ---
    function initDashboard() {
        initNavigation();
        loadProfile();
        
        const btnRefresh = document.getElementById('btn-refresh-preview');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', reloadPreview);
        }
        loadLinks();
        loadGallery();
        loadVideos();
        loadBackground();
        loadTheme();
        loadNameStyle();
        loadDecorations();
        loadSettings();
    }

    // --- Navigation ---
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.section');
        const mobileToggle = document.getElementById('mobile-nav-toggle');
        const sidebar = document.querySelector('.sidebar');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                
                // Update active states
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                sections.forEach(sec => sec.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
                
                // Close sidebar on mobile
                if(window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        });

        if(mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
        
        const previewToggle = document.getElementById('mobile-preview-toggle');
        const previewPane = document.getElementById('preview-pane');
        if (previewToggle && previewPane) {
            previewToggle.addEventListener('click', () => {
                previewPane.classList.toggle('open');
            });
            
            previewPane.addEventListener('click', (e) => {
                if (e.target === previewPane) {
                    previewPane.classList.remove('open');
                }
            });
        }
    }

    // --- Profile Section ---
    function loadProfile() {
        const profile = storage.getProfile();
        document.getElementById('prof-name').value = profile.name || '';
        document.getElementById('prof-nameAr').value = profile.nameAr || '';
        document.getElementById('prof-bio').value = profile.bio || '';
        document.getElementById('prof-showNameAr').checked = profile.showNameAr !== false;
        
        if (profile.avatar) {
            document.getElementById('avatar-preview').src = profile.avatar;
            document.getElementById('avatar-preview').style.display = 'inline-block';
        }

        const avatarInput = document.getElementById('prof-avatar-upload');
        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const base64 = await fileToBase64(file);
                document.getElementById('avatar-preview').src = base64;
                document.getElementById('avatar-preview').style.display = 'inline-block';
                document.getElementById('prof-avatar-base64').value = base64;
            }
        });

        document.getElementById('profile-form').onsubmit = (e) => {
            e.preventDefault();
            const updates = {
                name: document.getElementById('prof-name').value,
                nameAr: document.getElementById('prof-nameAr').value,
                bio: document.getElementById('prof-bio').value,
                showNameAr: document.getElementById('prof-showNameAr').checked
            };
            const avatarBase64 = document.getElementById('prof-avatar-base64').value;
            if(avatarBase64) {
                updates.avatar = avatarBase64;
            }
            storage.updateProfile(updates);
            showToast('تم حفظ الملف الشخصي', 'success');
        };
    }

    // --- Links Section ---
    function loadLinks() {
        renderLinksList();

        document.getElementById('btn-add-link').onclick = () => {
            openLinkModal();
        };

        document.getElementById('link-form').onsubmit = (e) => {
            e.preventDefault();
            const id = document.getElementById('link-id').value;
            const linkData = {
                title: document.getElementById('link-title').value,
                url: document.getElementById('link-url').value,
                icon: document.getElementById('link-icon').value,
                color: document.getElementById('link-color').value,
            };

            if (id) {
                storage.updateLink(id, linkData);
                showToast('تم تحديث الرابط', 'success');
            } else {
                storage.addLink(linkData);
                showToast('تم إضافة الرابط', 'success');
            }
            closeModal('link-modal');
            renderLinksList();
        };
    }

    function renderLinksList() {
        const links = storage.getLinks();
        const container = document.getElementById('links-list');
        container.innerHTML = '';
        
        links.forEach(link => {
            const el = document.createElement('div');
            el.className = 'item-card';
            el.innerHTML = `
                <div class="item-drag" title="اسحب للترتيب"><i class="fas fa-grip-vertical"></i></div>
                <div class="item-info">
                    <div class="item-icon" style="color: ${link.color || '#fff'}"><i class="${link.icon || 'fas fa-link'}"></i></div>
                    <div class="item-details">
                        <h4>${link.title}</h4>
                        <p>${link.url}</p>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-icon btn-outline toggle-link" data-id="${link.id}" title="${link.active ? 'إخفاء' : 'إظهار'}">
                        <i class="fas ${link.active ? 'fa-eye' : 'fa-eye-slash'}"></i>
                    </button>
                    <button class="btn btn-icon btn-outline edit-link" data-id="${link.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-icon btn-danger delete-link" data-id="${link.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            container.appendChild(el);
        });

        // Attach events
        document.querySelectorAll('.edit-link').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const l = storage.getLinks().find(x => x.id === id);
                if(l) openLinkModal(l);
            }
        });
        document.querySelectorAll('.delete-link').forEach(btn => {
            btn.onclick = () => {
                if(confirm('هل أنت متأكد من حذف هذا الرابط؟')) {
                    storage.deleteLink(btn.getAttribute('data-id'));
                    renderLinksList();
                    showToast('تم الحذف', 'info');
                }
            }
        });
        document.querySelectorAll('.toggle-link').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const l = storage.getLinks().find(x => x.id === id);
                storage.updateLink(id, {active: !l.active});
                renderLinksList();
            }
        });
    }

    function openLinkModal(link = null) {
        document.getElementById('link-id').value = link ? link.id : '';
        document.getElementById('link-title').value = link ? link.title : '';
        document.getElementById('link-url').value = link ? link.url : '';
        document.getElementById('link-icon').value = link ? link.icon : 'fas fa-link';
        document.getElementById('link-color').value = link && link.color ? link.color : '#ffffff';
        document.getElementById('link-modal').classList.add('active');
        
        if (!window.quickIconsBound) {
            document.querySelectorAll('.quick-icon-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.getElementById('link-icon').value = btn.getAttribute('data-icon');
                    document.getElementById('link-color').value = btn.getAttribute('data-color');
                });
            });
            window.quickIconsBound = true;
        }
    }

    // --- Gallery Section ---
    function loadGallery() {
        renderGalleryList();
        
        const fileInput = document.getElementById('gallery-upload');
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if(file) {
                const base64 = await fileToBase64(file);
                storage.addGalleryItem({ src: base64, caption: '' });
                renderGalleryList();
                showToast('تمت إضافة الصورة', 'success');
            }
        };
    }

    function renderGalleryList() {
        const items = storage.getGallery();
        const container = document.getElementById('gallery-grid');
        container.innerHTML = '';
        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'gallery-item';
            el.innerHTML = `
                <img src="${item.src}" alt="${item.caption}">
                <div class="gallery-actions">
                    <button class="btn btn-icon btn-danger del-gallery" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(el);
        });
        document.querySelectorAll('.del-gallery').forEach(btn => {
            btn.onclick = () => {
                if(confirm('حذف الصورة؟')) {
                    storage.deleteGalleryItem(btn.getAttribute('data-id'));
                    renderGalleryList();
                }
            }
        });
    }

    // --- Videos Section ---
    function loadVideos() {
        renderVideosList();
        document.getElementById('video-form').onsubmit = (e) => {
            e.preventDefault();
            const url = document.getElementById('video-url').value;
            const title = document.getElementById('video-title').value;
            const type = url.includes('youtube.com') || url.includes('youtu.be') ? 'youtube' : 'direct';
            
            storage.addVideo({ url, title, type });
            showToast('تمت إضافة الفيديو', 'success');
            document.getElementById('video-url').value = '';
            document.getElementById('video-title').value = '';
            renderVideosList();
        };
    }

    function renderVideosList() {
        const videos = storage.getVideos();
        const container = document.getElementById('videos-list');
        container.innerHTML = '';
        videos.forEach(v => {
            const el = document.createElement('div');
            el.className = 'item-card';
            el.innerHTML = `
                <div class="item-info">
                    <div class="item-icon" style="background: #ef4444; color: white;">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <div class="item-details">
                        <h4>${v.title}</h4>
                        <p>${v.url}</p>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-icon btn-danger del-video" data-id="${v.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            container.appendChild(el);
        });
        document.querySelectorAll('.del-video').forEach(btn => {
            btn.onclick = () => {
                if(confirm('حذف الفيديو؟')) {
                    storage.deleteVideo(btn.getAttribute('data-id'));
                    renderVideosList();
                }
            }
        });
    }

    // --- Background Section ---
    function loadBackground() {
        const bg = storage.getBackground();
        const typeSelect = document.getElementById('bg-type');
        typeSelect.value = bg.type;
        
        document.getElementById('bg-value').value = bg.value || '';
        document.getElementById('bg-overlay').value = bg.overlay || '0.5';
        document.getElementById('bg-blur').value = bg.blur || '0';

        document.getElementById('bg-form').onsubmit = (e) => {
            e.preventDefault();
            storage.updateBackground({
                type: typeSelect.value,
                value: document.getElementById('bg-value').value,
                overlay: document.getElementById('bg-overlay').value,
                blur: document.getElementById('bg-blur').value
            });
            showToast('تم حفظ الخلفية', 'success');
        };
    }

    // --- Theme Section ---
    function loadTheme() {
        const presets = {
            'blood': {
                primary: '#dc2626', secondary: '#991b1b', 
                bgValue: 'linear-gradient(135deg, #0f0000 0%, #320000 100%)',
                font: 'Tajawal', effect: 'blood', animation: 'glow-pulse'
            },
            'neon': {
                primary: '#ec4899', secondary: '#8b5cf6', 
                bgValue: 'linear-gradient(135deg, #0f0728 0%, #1e0b36 100%)',
                font: 'Orbitron', effect: 'neon', animation: 'glow-pulse'
            },
            'gold': {
                primary: '#eab308', secondary: '#ca8a04', 
                bgValue: 'linear-gradient(135deg, #0f0d05 0%, #1c1808 100%)',
                font: 'Righteous', effect: 'gold', animation: 'float'
            },
            'space': {
                primary: '#3b82f6', secondary: '#8b5cf6', 
                bgValue: 'linear-gradient(135deg, #050b14 0%, #0a192f 100%)',
                font: 'Poppins', effect: 'galaxy', animation: 'float'
            },
            'ice': {
                primary: '#06b6d4', secondary: '#3b82f6', 
                bgValue: 'linear-gradient(135deg, #03131a 0%, #0a2533 100%)',
                font: 'Montserrat', effect: 'ice', animation: 'none'
            }
        };

        document.querySelectorAll('.preset-card').forEach(card => {
            card.addEventListener('click', () => {
                const p = presets[card.getAttribute('data-preset')];
                if (p) {
                    storage.updateTheme({
                        primaryColor: p.primary,
                        secondaryColor: p.secondary,
                        cardBg: '#16161f',
                        textColor: '#e2e8f0',
                        borderRadius: '16px',
                        glowEffect: true
                    });
                    document.getElementById('theme-primary').value = p.primary;
                    document.getElementById('theme-secondary').value = p.secondary;
                    
                    storage.updateBackground({
                        type: 'gradient',
                        value: p.bgValue,
                        overlay: '0.5',
                        blur: '0'
                    });
                    
                    storage.updateNameStyle({
                        font: p.font,
                        effect: p.effect,
                        gradientColors: [p.primary, p.secondary, '#ffffff'],
                        gradientAngle: 135,
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        letterSpacing: '2px',
                        animation: p.animation
                    });
                    
                    showToast('تم تطبيق القالب بنجاح!', 'success');
                    
                    if (document.getElementById('ns-font')) {
                        document.getElementById('ns-font').value = p.font;
                        document.getElementById('ns-effect').value = p.effect;
                        document.getElementById('ns-animation').value = p.animation;
                        if(typeof updateNamePreview === 'function') updateNamePreview();
                    }
                }
            });
        });

        const t = storage.getTheme();
        document.getElementById('theme-primary').value = t.primaryColor;
        document.getElementById('theme-secondary').value = t.secondaryColor;
        document.getElementById('theme-bg').value = t.cardBg;
        document.getElementById('theme-text').value = t.textColor;
        document.getElementById('theme-radius').value = t.borderRadius.replace('px','');
        document.getElementById('theme-glow').checked = t.glowEffect;

        document.getElementById('theme-form').onsubmit = (e) => {
            e.preventDefault();
            storage.updateTheme({
                primaryColor: document.getElementById('theme-primary').value,
                secondaryColor: document.getElementById('theme-secondary').value,
                cardBg: document.getElementById('theme-bg').value,
                textColor: document.getElementById('theme-text').value,
                borderRadius: document.getElementById('theme-radius').value + 'px',
                glowEffect: document.getElementById('theme-glow').checked
            });
            showToast('تم حفظ الثيم', 'success');
        };
    }

    // --- Name Style Section ---
    function loadNameStyle() {
        const ns = storage.getNameStyle();
        if (!ns) return;
        
        document.getElementById('ns-font').value = ns.font || 'Tajawal';
        document.getElementById('ns-effect').value = ns.effect || 'gradient';
        document.getElementById('ns-color1').value = ns.gradientColors?.[0] || '#7c3aed';
        document.getElementById('ns-color2').value = ns.gradientColors?.[1] || '#a855f7';
        document.getElementById('ns-color3').value = ns.gradientColors?.[2] || '#06b6d4';
        document.getElementById('ns-size').value = ns.fontSize || '2.5rem';
        document.getElementById('ns-weight').value = ns.fontWeight || '800';
        document.getElementById('ns-spacing').value = ns.letterSpacing || '2px';
        document.getElementById('ns-animation').value = ns.animation || 'none';
        document.getElementById('ns-angle').value = ns.gradientAngle || 135;
        document.getElementById('ns-angle-val').textContent = (ns.gradientAngle || 135) + '°';

        // Angle slider live update
        document.getElementById('ns-angle').addEventListener('input', function() {
            document.getElementById('ns-angle-val').textContent = this.value + '°';
            updateNamePreview();
        });

        // Live preview on change
        ['ns-font', 'ns-effect', 'ns-color1', 'ns-color2', 'ns-color3', 'ns-size', 'ns-weight', 'ns-spacing', 'ns-animation'].forEach(id => {
            document.getElementById(id).addEventListener('input', updateNamePreview);
            document.getElementById(id).addEventListener('change', updateNamePreview);
        });

        updateNamePreview();

        document.getElementById('namestyle-form').onsubmit = (e) => {
            e.preventDefault();
            storage.updateNameStyle({
                font: document.getElementById('ns-font').value,
                effect: document.getElementById('ns-effect').value,
                gradientColors: [
                    document.getElementById('ns-color1').value,
                    document.getElementById('ns-color2').value,
                    document.getElementById('ns-color3').value
                ],
                gradientAngle: parseInt(document.getElementById('ns-angle').value),
                fontSize: document.getElementById('ns-size').value,
                fontWeight: document.getElementById('ns-weight').value,
                letterSpacing: document.getElementById('ns-spacing').value,
                animation: document.getElementById('ns-animation').value
            });
            showToast('تم حفظ تخصيص الاسم', 'success');
        };
    }

    function updateNamePreview() {
        const preview = document.getElementById('ns-preview-text');
        if (!preview) return;
        const font = document.getElementById('ns-font').value;
        const effect = document.getElementById('ns-effect').value;
        const c1 = document.getElementById('ns-color1').value;
        const c2 = document.getElementById('ns-color2').value;
        const c3 = document.getElementById('ns-color3').value;
        const size = document.getElementById('ns-size').value;
        const weight = document.getElementById('ns-weight').value;
        const spacing = document.getElementById('ns-spacing').value;
        const angle = document.getElementById('ns-angle').value;

        // Load font dynamically
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700;800;900&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        preview.style.fontFamily = `'${font}', sans-serif`;
        preview.style.fontSize = size;
        preview.style.fontWeight = weight;
        preview.style.letterSpacing = spacing;
        preview.setAttribute('data-text', preview.textContent);

        // Reset styles
        preview.className = '';
        preview.style.background = '';
        preview.style.webkitBackgroundClip = '';
        preview.style.webkitTextFillColor = '';
        preview.style.color = '';
        preview.style.textShadow = '';
        preview.style.filter = '';

        // Apply effect
        const effectClass = effect !== 'none' ? `name-${effect}` : '';
        if (effectClass) preview.classList.add(effectClass);

        // Set CSS custom properties for colors
        preview.style.setProperty('--name-color-1', c1);
        preview.style.setProperty('--name-color-2', c2);
        if (effect === 'gradient') {
            preview.style.background = `linear-gradient(${angle}deg, ${c1}, ${c2}, ${c3})`;
            preview.style.webkitBackgroundClip = 'text';
            preview.style.webkitTextFillColor = 'transparent';
        }
    }

    // --- Decorations Section ---
    function loadDecorations() {
        renderDecoList();
        document.getElementById('deco-form').onsubmit = (e) => {
            e.preventDefault();
            const deco = {
                type: document.getElementById('deco-type').value,
                content: document.getElementById('deco-content').value,
                x: parseInt(document.getElementById('deco-x').value),
                y: parseInt(document.getElementById('deco-y').value),
                size: parseInt(document.getElementById('deco-size').value),
                rotation: parseInt(document.getElementById('deco-rotation').value),
                color: document.getElementById('deco-color').value,
                opacity: parseFloat(document.getElementById('deco-opacity').value),
                animation: document.getElementById('deco-anim').value
            };
            storage.addDecoration(deco);
            showToast('تمت إضافة العنصر', 'success');
            renderDecoList();
            document.getElementById('deco-content').value = '';
        };
    }

    function renderDecoList() {
        const items = storage.getDecorations();
        const container = document.getElementById('deco-list');
        container.innerHTML = '';
        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'item-card';
            let preview = '';
            if (item.type === 'icon') preview = `<i class="${item.content}" style="color:${item.color};font-size:1.5rem;"></i>`;
            else if (item.type === 'emoji') preview = `<span style="font-size:1.5rem;">${item.content}</span>`;
            else if (item.type === 'text') preview = `<span style="color:${item.color};">${item.content}</span>`;
            else if (item.type === 'image') preview = `<img src="${item.content}" style="width:30px;height:30px;object-fit:cover;border-radius:4px;">`;
            
            el.innerHTML = `
                <div class="item-info">
                    <div class="item-icon">${preview}</div>
                    <div class="item-details">
                        <h4>${item.type === 'icon' ? item.content : (item.content.substring(0, 30))}</h4>
                        <p>X: ${item.x}% | Y: ${item.y}% | Size: ${item.size}px</p>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-icon btn-danger del-deco" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            container.appendChild(el);
        });
        document.querySelectorAll('.del-deco').forEach(btn => {
            btn.onclick = () => {
                if (confirm('حذف العنصر؟')) {
                    storage.deleteDecoration(btn.getAttribute('data-id'));
                    renderDecoList();
                    showToast('تم الحذف', 'info');
                }
            };
        });
    }

    // --- Settings Section ---
    function loadSettings() {
        const s = storage.getSettings();
        const sec = storage.getSections();
        
        document.getElementById('set-particles').checked = s.particlesEnabled;
        document.getElementById('set-scroll').checked = s.scrollAnimations;
        document.getElementById('set-css').value = s.customCSS || '';

        document.getElementById('set-show-links').checked = sec.showLinks !== false;
        document.getElementById('set-show-gallery').checked = sec.showGallery !== false;
        document.getElementById('set-show-videos').checked = sec.showVideos !== false;

        document.getElementById('settings-form').onsubmit = (e) => {
            e.preventDefault();
            storage.updateSettings({
                particlesEnabled: document.getElementById('set-particles').checked,
                scrollAnimations: document.getElementById('set-scroll').checked,
                customCSS: document.getElementById('set-css').value
            });
            storage.updateSections({
                showLinks: document.getElementById('set-show-links').checked,
                showGallery: document.getElementById('set-show-gallery').checked,
                showVideos: document.getElementById('set-show-videos').checked,
            });
            showToast('تم حفظ الإعدادات', 'success');
        };

        // Export
        document.getElementById('btn-export').onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(storage.exportData());
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "linktree_backup.json");
            dlAnchorElem.click();
        };

        // Reset
        document.getElementById('btn-reset').onclick = () => {
            if(confirm('تحذير: سيتم مسح جميع البيانات والعودة للوضع الافتراضي. هل أنت متأكد؟')) {
                storage.resetData();
                showToast('تم إعادة الضبط', 'info');
                setTimeout(() => location.reload(), 1000);
            }
        };
    }

    // --- Global Modal Close ---
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.onclick = () => {
            btn.closest('.modal').classList.remove('active');
        }
    });
    window.closeModal = (id) => {
        document.getElementById(id).classList.remove('active');
    };
});
