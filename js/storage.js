/**
 * Ahmad LinkTree - Storage Manager
 * Handles all data persistence via localStorage
 */

const STORAGE_KEY = 'ahmad_linktree_data';
const AUTH_KEY = 'ahmad_linktree_auth';

const defaultData = {
  profile: {
    name: 'Ahmad',
    nameAr: 'أحمد',
    bio: '✨ Welcome to my world',
    avatar: '',
    showNameAr: true
  },
  links: [
    {
      id: 'link-1',
      title: 'Instagram',
      url: 'https://instagram.com/',
      icon: 'fab fa-instagram',
      color: '#E4405F',
      active: true,
      order: 0
    },
    {
      id: 'link-2',
      title: 'Twitter / X',
      url: 'https://x.com/',
      icon: 'fab fa-x-twitter',
      color: '#1DA1F2',
      active: true,
      order: 1
    },
    {
      id: 'link-3',
      title: 'YouTube',
      url: 'https://youtube.com/',
      icon: 'fab fa-youtube',
      color: '#FF0000',
      active: true,
      order: 2
    },
    {
      id: 'link-4',
      title: 'TikTok',
      url: 'https://tiktok.com/',
      icon: 'fab fa-tiktok',
      color: '#ff0050',
      active: true,
      order: 3
    },
    {
      id: 'link-5',
      title: 'Snapchat',
      url: 'https://snapchat.com/',
      icon: 'fab fa-snapchat',
      color: '#FFFC00',
      active: true,
      order: 4
    }
  ],
  gallery: [],
  videos: [],
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    imageUrl: '',
    videoUrl: '',
    overlay: 0.4,
    blur: 0
  },
  theme: {
    primaryColor: '#7c3aed',
    secondaryColor: '#a855f7',
    accentColor: '#06b6d4',
    textColor: '#ffffff',
    cardBg: 'rgba(255, 255, 255, 0.07)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    fontFamily: "'Tajawal', 'Inter', sans-serif",
    borderRadius: '16px',
    glowEffect: true
  },
  sections: {
    showLinks: true,
    showGallery: true,
    showVideos: true,
    linksTitle: '',
    galleryTitle: '📸 معرض الصور',
    videosTitle: '🎬 فيديوهات'
  },
  settings: {
    password: 'ahmad2026',
    sessionDuration: 86400000,
    particlesEnabled: true,
    scrollAnimations: true,
    customCSS: ''
  },
  nameStyle: {
    font: 'Tajawal',
    effect: 'gradient',
    gradientColors: ['#7c3aed', '#a855f7', '#06b6d4'],
    gradientAngle: 135,
    fontSize: '2.5rem',
    fontWeight: '800',
    letterSpacing: '2px',
    textTransform: 'none',
    textShadowColor: 'rgba(124, 58, 237, 0.5)',
    textShadowBlur: '20px',
    animation: 'none',
    customFont: ''
  },
  decorations: []
};

class AhmadStorage {
  constructor() {
    this.data = this._load();
  }

  _load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return this._mergeDefaults(parsed);
      }
    } catch (e) {
      console.warn('[Storage] Failed to load data:', e);
    }
    return JSON.parse(JSON.stringify(defaultData));
  }

  _mergeDefaults(saved) {
    const merged = JSON.parse(JSON.stringify(defaultData));
    for (const key in saved) {
      if (key in merged) {
        if (Array.isArray(saved[key])) {
          merged[key] = saved[key];
        } else if (typeof saved[key] === 'object' && saved[key] !== null) {
          merged[key] = { ...merged[key], ...saved[key] };
        } else {
          merged[key] = saved[key];
        }
      }
    }
    return merged;
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      return true;
    } catch (e) {
      console.error('[Storage] Failed to save:', e);
      return false;
    }
  }

  _generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /* ── Profile ── */
  getProfile() { return { ...this.data.profile }; }
  updateProfile(updates) {
    Object.assign(this.data.profile, updates);
    this.save();
  }

  /* ── Links ── */
  getLinks(activeOnly = false) {
    let links = [...this.data.links].sort((a, b) => a.order - b.order);
    if (activeOnly) links = links.filter(l => l.active);
    return links;
  }
  addLink(link) {
    link.id = this._generateId();
    link.order = this.data.links.length;
    if (link.active === undefined) link.active = true;
    this.data.links.push(link);
    this.save();
    return link;
  }
  updateLink(id, updates) {
    const link = this.data.links.find(l => l.id === id);
    if (link) {
      Object.assign(link, updates);
      this.save();
      return true;
    }
    return false;
  }
  deleteLink(id) {
    this.data.links = this.data.links.filter(l => l.id !== id);
    this.save();
  }
  reorderLinks(orderedIds) {
    orderedIds.forEach((id, index) => {
      const link = this.data.links.find(l => l.id === id);
      if (link) link.order = index;
    });
    this.save();
  }

  /* ── Gallery ── */
  getGallery() { return [...this.data.gallery]; }
  addGalleryItem(item) {
    item.id = this._generateId();
    this.data.gallery.push(item);
    this.save();
    return item;
  }
  updateGalleryItem(id, updates) {
    const item = this.data.gallery.find(g => g.id === id);
    if (item) {
      Object.assign(item, updates);
      this.save();
      return true;
    }
    return false;
  }
  deleteGalleryItem(id) {
    this.data.gallery = this.data.gallery.filter(g => g.id !== id);
    this.save();
  }

  /* ── Videos ── */
  getVideos() { return [...this.data.videos]; }
  addVideo(video) {
    video.id = this._generateId();
    this.data.videos.push(video);
    this.save();
    return video;
  }
  updateVideo(id, updates) {
    const video = this.data.videos.find(v => v.id === id);
    if (video) {
      Object.assign(video, updates);
      this.save();
      return true;
    }
    return false;
  }
  deleteVideo(id) {
    this.data.videos = this.data.videos.filter(v => v.id !== id);
    this.save();
  }

  /* ── Background ── */
  getBackground() { return { ...this.data.background }; }
  updateBackground(updates) {
    Object.assign(this.data.background, updates);
    this.save();
  }

  /* ── Theme ── */
  getTheme() { return { ...this.data.theme }; }
  updateTheme(updates) {
    Object.assign(this.data.theme, updates);
    this.save();
  }

  /* ── Sections ── */
  getSections() { return { ...this.data.sections }; }
  updateSections(updates) {
    Object.assign(this.data.sections, updates);
    this.save();
  }

  /* ── Settings ── */
  getSettings() { return { ...this.data.settings }; }
  updateSettings(updates) {
    Object.assign(this.data.settings, updates);
    this.save();
  }

  /* ── Authentication ── */
  checkPassword(input) {
    return input === this.data.settings.password;
  }
  createSession() {
    const expiry = Date.now() + this.data.settings.sessionDuration;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ expiry, token: this._generateId() }));
  }
  isAuthenticated() {
    try {
      const session = JSON.parse(localStorage.getItem(AUTH_KEY));
      if (session && session.expiry > Date.now()) return true;
      localStorage.removeItem(AUTH_KEY);
      return false;
    } catch {
      return false;
    }
  }
  logout() {
    localStorage.removeItem(AUTH_KEY);
  }

  /* ── Export / Import ── */
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.data = this._mergeDefaults(data);
      this.save();
      return true;
    } catch (e) {
      console.error('[Storage] Import failed:', e);
      return false;
    }
  }
  resetData() {
    this.data = JSON.parse(JSON.stringify(defaultData));
    this.save();
    localStorage.removeItem(AUTH_KEY);
  }

  /* ── Name Style ── */
  getNameStyle() { return { ...this.data.nameStyle }; }
  updateNameStyle(updates) {
    Object.assign(this.data.nameStyle, updates);
    this.save();
  }

  /* ── Decorations ── */
  getDecorations() { return [...this.data.decorations]; }
  addDecoration(item) {
    item.id = this._generateId();
    this.data.decorations.push(item);
    this.save();
    return item;
  }
  updateDecoration(id, updates) {
    const item = this.data.decorations.find(d => d.id === id);
    if (item) {
      Object.assign(item, updates);
      this.save();
      return true;
    }
    return false;
  }
  deleteDecoration(id) {
    this.data.decorations = this.data.decorations.filter(d => d.id !== id);
    this.save();
  }

  /* ── All Data ── */
  getAllData() {
    return JSON.parse(JSON.stringify(this.data));
  }
}

// Global singleton
const storage = new AhmadStorage();
