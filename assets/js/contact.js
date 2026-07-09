document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');

    if (!form) return; // Only run on pages with the form

    const formStatus = document.getElementById('form-status');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const honeypotInput = document.getElementById('company-name');
    const submitButton = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Silently block automated submissions that fill the honeypot field
        if (honeypotInput && honeypotInput.value.trim()) {
            form.reset();
            return;
        }

        // Reset previous validation messages
        document.querySelectorAll('.error-msg').forEach(el => {
            el.textContent = '';
        });

        formStatus.textContent = '';
        formStatus.style.color = '';

        let isValid = true;

        if (!nameInput.value.trim()) {
            document.getElementById('name-error').textContent =
                getTranslation('err_name');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailInput.value.trim())) {
            document.getElementById('email-error').textContent =
                getTranslation('err_email');
            isValid = false;
        }

        if (!subjectInput.value.trim()) {
            document.getElementById('subject-error').textContent =
                getTranslation('err_subject');
            isValid = false;
        }

        if (!messageInput.value.trim()) {
            document.getElementById('message-error').textContent =
                getTranslation('err_message');
            isValid = false;
        }

        if (!isValid) return;

        const endpoint = CONFIG.FORMSPREE_ENDPOINT;

        if (!endpoint) {
            formStatus.textContent = getTranslation('form_unconfigured');
            formStatus.style.color = '#EF4444';
            return;
        }

        try {
            if (submitButton) {
                submitButton.disabled = true;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    subject: subjectInput.value.trim(),
                    message: messageInput.value.trim()
                })
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            formStatus.textContent = getTranslation('form_success');
            formStatus.style.color = '#10B981';
            form.reset();
        } catch (error) {
            formStatus.textContent = getTranslation('form_error');
            formStatus.style.color = '#EF4444';
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });

    function getTranslation(key) {
        const lang = document.documentElement.getAttribute('lang') || 'ar';
        return translations[lang]?.[key] || '';
    }
});
