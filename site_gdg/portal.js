document.addEventListener('DOMContentLoaded', () => {
    const backToLogin = document.querySelector('#backToLogin');
    const openSignin = document.querySelector('#openSignin');
    const inPageLinks = document.querySelectorAll('a[href^="#"]');

    const goToLogin = () => {
        window.location.href = 'index.html';
    };

    if (backToLogin) backToLogin.addEventListener('click', goToLogin);
    if (openSignin) openSignin.addEventListener('click', goToLogin);

    inPageLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    const squaresZone = document.querySelector('.squares-zone');
    if (squaresZone) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        squaresZone.classList.add('text-in');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.35 });

            observer.observe(squaresZone);
        } else {
            squaresZone.classList.add('text-in');
        }
    }
});

