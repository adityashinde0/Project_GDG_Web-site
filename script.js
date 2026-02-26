document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const modal = document.querySelector('#loginModal');
    const openButtons = document.querySelectorAll('#openLogin, #openLoginHero');
    const closeButton = document.querySelector('#closeLogin');
    const skipForNowButton = document.querySelector('#skipForNow');
    const signupForm = document.querySelector('#signupForm');
    const googleLoginButton = document.querySelector('#googleLoginBtn');
    const microsoftLoginButton = document.querySelector('#microsoftLoginBtn');
    const githubLoginButton = document.querySelector('#githubLoginBtn');
    const alreadySignIn = document.querySelector('#alreadySignIn');

    const AUTH_CONFIG = {
        baseUrl: 'http://localhost:5000',
        googlePath: '/auth/google/start',
        microsoftPath: '/auth/microsoft/start'
    };

    const authUrl = (path) => `${AUTH_CONFIG.baseUrl}${path}`;

    const openModal = () => {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const startLogin = (providerPath) => {
        window.location.href = authUrl(providerPath);
    };

    openButtons.forEach((button) => {
        button.addEventListener('click', openModal);
    });

    closeButton.addEventListener('click', closeModal);

    skipForNowButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'portal.html';
    });

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        closeModal();
    });

    googleLoginButton.addEventListener('click', () => startLogin(AUTH_CONFIG.googlePath));
    microsoftLoginButton.addEventListener('click', () => startLogin(AUTH_CONFIG.microsoftPath));
    githubLoginButton.addEventListener('click', () => {
        window.alert('GitHub sign in will be added next.');
    });
    alreadySignIn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal();
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 8) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
