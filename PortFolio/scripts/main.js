/* Main Script - Portfolio Personnel */
// translations is now available globally via window.translations

document.addEventListener('DOMContentLoaded', () => {
    // === Gestion du Thème (Dark/Light) ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // === Gestion des Langues ===
    const langSelect = document.getElementById('lang-select');
    const savedLang = localStorage.getItem('lang') || 'fr';

    // Fonction pour appliquer la langue
    const setLanguage = (lang) => {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.'); // ex: 'nav.home' -> ['nav', 'home']

            let translation = translations[lang];
            keys.forEach(k => {
                if (translation) translation = translation[k];
            });

            if (translation) {
                element.textContent = translation;
            }
        });

        // Gestion de la direction (RTL pour Arabe)
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.lang = lang;
        }

        localStorage.setItem('lang', lang);
    };

    // === Gestion du Menu Mobile ===
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }



    // === Gestion du Modal des Projets ===
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    const closeModalBtns = document.querySelectorAll('.close-modal, .btn-close-modal');
    const detailBtns = document.querySelectorAll('.btn-details');

    let currentProject = null;

    const openModal = (projectId) => {
        currentProject = projectId;
        const lang = langSelect.value;
        const projectData = translations[lang].projects[projectId];

        if (projectData) {
            modalTitle.textContent = projectData.title;
            modalBody.textContent = projectData.fullDesc;
        }

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden'; // Empêcher le scroll
    };

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    };

    detailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // === Filtrage des Projets ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                    // Animation reset
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Initialisation

    if (langSelect) {
        langSelect.value = savedLang;
        setLanguage(savedLang);

        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            setLanguage(lang);

            // Si le modal est ouvert, mettre à jour son contenu
            if (modal.classList.contains('show') && currentProject) {
                const projectData = translations[lang].projects[currentProject];
                if (projectData) {
                    modalTitle.textContent = projectData.title;
                    modalBody.textContent = projectData.fullDesc;
                }
            }
        });
    }
});
