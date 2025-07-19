// Gestion du thème dynamique pour toutes les pages
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Détecter la préférence système
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        // Récupérer le thème sauvegardé ou utiliser la préférence système
        const savedTheme = localStorage.getItem('cv-pro-theme') || systemTheme;
        
        this.setTheme(savedTheme);
        this.createBackgroundAnimation();
        this.bindEvents();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cv-pro-theme', theme);
        
        // Mettre à jour l'icône du bouton
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Actualiser l'animation de fond
        this.updateBackgroundAnimation();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    createBackgroundAnimation() {
        // Supprimer les animations existantes
        const existingAnimations = document.querySelectorAll('.background-animation');
        existingAnimations.forEach(el => el.remove());

        // Créer le conteneur d'animation
        const animationContainer = document.createElement('div');
        animationContainer.className = 'background-animation';
        document.body.appendChild(animationContainer);

        this.updateBackgroundAnimation();
    }

    updateBackgroundAnimation() {
        const container = document.querySelector('.background-animation');
        if (!container) return;

        container.innerHTML = '';

        if (this.currentTheme === 'dark') {
            // Créer des étoiles dynamiques multicolores pour le mode sombre
            const starColors = [
                { color: '#60a5fa', glow: '#60a5fa' },    // Bleu
                { color: '#fbbf24', glow: '#fbbf24' },    // Jaune
                { color: '#a78bfa', glow: '#a78bfa' },    // Violet
                { color: '#34d399', glow: '#34d399' },    // Vert
                { color: '#f472b6', glow: '#f472b6' },    // Rose
                { color: '#ffffff', glow: '#ffffff' }      // Blanc
            ];

            for (let i = 0; i < 80; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // Taille variable des étoiles
                const size = Math.random() * 4 + 1;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                
                // Couleur aléatoire
                const colorIndex = Math.floor(Math.random() * starColors.length);
                const selectedColor = starColors[colorIndex];
                star.style.background = selectedColor.color;
                star.style.boxShadow = `0 0 ${size * 3}px ${selectedColor.glow}`;
                
                // Position aléatoire
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                
                // Animation aléatoire
                star.style.animationDelay = Math.random() * 4 + 's';
                star.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                container.appendChild(star);
            }

            // Ajouter quelques météores occasionnels
            for (let i = 0; i < 3; i++) {
                const meteor = document.createElement('div');
                meteor.className = 'meteor';
                meteor.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: #ffffff;
                    border-radius: 50%;
                    top: ${Math.random() * 50}%;
                    left: ${Math.random() * 100}%;
                    animation: meteorFall ${Math.random() * 3 + 2}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                    box-shadow: 0 0 10px #ffffff, -100px 0 20px rgba(255,255,255,0.3);
                `;
                container.appendChild(meteor);
            }

        } else {
            // Créer des particules améliorées pour le mode jour
            for (let i = 0; i < 40; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const size = Math.random() * 8 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.background = `hsl(${220 + Math.random() * 40}, 70%, 60%)`;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
                
                container.appendChild(particle);
            }

            // Ajouter des nuages plus réalistes
            for (let i = 0; i < 8; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                cloud.style.left = Math.random() * 100 + '%';
                cloud.style.top = Math.random() * 70 + '%';
                cloud.style.animationDelay = Math.random() * 20 + 's';
                cloud.style.opacity = Math.random() * 0.3 + 0.1;
                container.appendChild(cloud);
            }
        }
    }

    bindEvents() {
        // Écouter les changements de préférence système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('cv-pro-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Navigation fluide
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupStickyNavigation();
        this.setupFormState();
    }

    setupSmoothScrolling() {
        // Scroll fluide pour les liens internes
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupStickyNavigation() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-bg');
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.backdropFilter = 'blur(10px)';
            }

            // Cacher/montrer la navbar lors du scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    setupFormState() {
        // Sauvegarder l'état du formulaire entre les pages
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const formId = form.id || 'default-form';
            
            // Restaurer les données sauvegardées
            this.restoreFormData(form, formId);
            
            // Sauvegarder lors des changements
            form.addEventListener('input', () => {
                this.saveFormData(form, formId);
            });
        });
    }

    saveFormData(form, formId) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem(`cv-pro-form-${formId}`, JSON.stringify(data));
    }

    restoreFormData(form, formId) {
        const savedData = localStorage.getItem(`cv-pro-form-${formId}`);
        if (savedData) {
            const data = JSON.parse(savedData);
            
            Object.keys(data).forEach(key => {
                const element = form.querySelector(`[name="${key}"]`);
                if (element) {
                    element.value = data[key];
                }
            });
        }
    }
}

// Variables globales
let themeManager;
let navigationManager;

// Fonction globale pour le toggle (appelée par le bouton)
function toggleTheme() {
    if (themeManager) {
        themeManager.toggleTheme();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    navigationManager = new NavigationManager();
});

// Améliorer les animations au chargement de la page
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Animation d'apparition progressive des éléments
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

    // Observer les sections pour l'animation
    document.querySelectorAll('.feature-card, .template-card, .testimonial, .cv-example').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
