document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#communityJoinForm');
    const message = document.querySelector('#formMessage');

    if (!form || !message) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            message.textContent = 'Please complete all fields with valid information.';
            message.style.color = '#b12222';
            form.reportValidity();
            return;
        }

        message.textContent = 'Thank you. Your community join request has been recorded.';
        message.style.color = '#1b6f44';
        form.reset();
    });
});
