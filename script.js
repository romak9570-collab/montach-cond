// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.card, .section-head');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ===== PHONE INPUT MASK =====
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length === 0) {
        e.target.value = '';
        return;
    }
    if (value.startsWith('8')) {
        value = '7' + value.slice(1);
    }
    if (value.startsWith('9')) {
        value = '7' + value;
    }
    if (!value.startsWith('7')) {
        value = '7' + value;
    }

    let formatted = '+7';
    if (value.length > 1) {
        formatted += ' (' + value.slice(1, 4);
    }
    if (value.length >= 4) {
        formatted += ') ' + value.slice(4, 7);
    }
    if (value.length >= 7) {
        formatted += '-' + value.slice(7, 9);
    }
    if (value.length >= 9) {
        formatted += '-' + value.slice(9, 11);
    }

    e.target.value = formatted;
});

// ===== FORM VALIDATION & SUBMIT =====
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');

function showError(input, message) {
    input.classList.add('error');
    input.setAttribute('data-error', message);
}

function clearError(input) {
    input.classList.remove('error');
    input.removeAttribute('data-error');
}

function validateForm() {
    let isValid = true;

    // Name validation
    if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Введите имя');
        isValid = false;
    } else {
        clearError(nameInput);
    }

    // Phone validation
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
        showError(phoneInput, 'Введите полный номер телефона');
        isValid = false;
    } else {
        clearError(phoneInput);
    }

    return isValid;
}

// Clear error on input
[nameInput, phoneInput].forEach(input => {
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            clearError(input);
        }
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
        // Show first error message
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
        return;
    }

    // Simulate successful submission
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');

    console.log('Заявка отправлена:', { name, phone });

    // Replace form with success message
    form.innerHTML = `
        <div class="form-success">
            <div class="success-icon">✅</div>
            <h3>Спасибо, ${name.trim()}!</h3>
            <p>Ваша заявка принята. Мы перезвоним вам в течение 15 минут.</p>
        </div>
    `;
});