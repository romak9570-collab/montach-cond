// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if ((window.scrollY || window.pageYOffset || 0) > 50) {
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

// ===== CONTACT MODAL =====
const contactModal = document.getElementById('contact-modal');
const contactBtn = document.getElementById('contact-btn');
const modalClose = document.getElementById('modal-close');
const tgBtn = document.getElementById('tg-btn');
const tgNote = document.getElementById('tg-note');

function openContactModal() {
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeContactModal() {
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

contactBtn.addEventListener('click', openContactModal);
modalClose.addEventListener('click', closeContactModal);

contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        closeContactModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});

// Telegram: пока нет username/ссылки — показываем подсказку вместо нерабочей ссылки
tgBtn.addEventListener('click', () => {
    tgNote.classList.add('visible');
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

// ===== COST CALCULATOR =====
const calcInstall = document.getElementById('calc-install');
const calcExtra = document.getElementById('calc-extra');
const calcRoute = document.getElementById('calc-route');
const calcInstallPrice = document.getElementById('calc-install-price');
const calcExtraPrice = document.getElementById('calc-extra-price');
const calcRoutePrice = document.getElementById('calc-route-price');
const calcTotal = document.getElementById('calc-total');

const PRICE_INSTALL = 12000;
const PRICE_EXTRA_METER = 2000;
const PRICE_ROUTE_METER = 2500;

function formatPrice(value) {
    return value.toLocaleString('ru-RU') + ' ₽';
}

function getMeters(outputEl) {
    const value = parseInt(outputEl.textContent.replace(/[^\d]/g, ''), 10);
    return isNaN(value) ? 0 : value;
}

function setMeters(outputEl, meters) {
    outputEl.textContent = meters + ' м';
}

function updateCalculator() {
    const installCost = calcInstall.checked ? PRICE_INSTALL : 0;
    const extraMeters = getMeters(calcExtra);
    const routeMeters = getMeters(calcRoute);
    const extraCost = extraMeters * PRICE_EXTRA_METER;
    const routeCost = routeMeters * PRICE_ROUTE_METER;
    const total = installCost + extraCost + routeCost;

    calcInstallPrice.textContent = formatPrice(installCost);
    calcExtraPrice.textContent = formatPrice(extraCost);
    calcRoutePrice.textContent = formatPrice(routeCost);
    calcTotal.textContent = formatPrice(total);
}

calcInstall.addEventListener('change', updateCalculator);

document.querySelectorAll('.calc-step').forEach(btn => {
    btn.addEventListener('click', () => {
        const output = document.getElementById(btn.dataset.target);
        let meters = getMeters(output);
        const delta = parseInt(btn.dataset.step, 10) || 0;
        meters = Math.max(0, Math.min(100, meters + delta));
        setMeters(output, meters);
        updateCalculator();
    });
});

// Initial calculation
updateCalculator();

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

// ===== PHOTO LIGHTBOX (Наши работы) =====
const photoLightbox = document.getElementById('photo-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const worksImages = Array.from(document.querySelectorAll('.works-photo img'));

let currentPhotoIndex = 0;

function openPhotoLightbox(index) {
    const img = worksImages[index];
    if (!img) return;

    currentPhotoIndex = index;
    lightboxImg.src = img.getAttribute('src');
    lightboxImg.alt = img.getAttribute('alt') || '';
    const caption = img.closest('.work-card')
        ? img.closest('.work-card').querySelector('.work-caption')
        : null;
    lightboxCaption.textContent = caption ? caption.textContent : '';

    photoLightbox.classList.add('open');
    photoLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closePhotoLightbox() {
    photoLightbox.classList.remove('open');
    photoLightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function showNextPhoto() {
    openPhotoLightbox((currentPhotoIndex + 1) % worksImages.length);
}

function showPrevPhoto() {
    openPhotoLightbox((currentPhotoIndex - 1 + worksImages.length) % worksImages.length);
}

worksImages.forEach((img, i) => {
    img.addEventListener('click', () => openPhotoLightbox(i));
});

lightboxClose.addEventListener('click', closePhotoLightbox);
lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevPhoto();
});
lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextPhoto();
});

photoLightbox.addEventListener('click', (e) => {
    if (e.target === photoLightbox) {
        closePhotoLightbox();
    }
});

// Keyboard navigation (arrows + Esc) inside lightbox
document.addEventListener('keydown', (e) => {
    if (!photoLightbox.classList.contains('open')) return;

    if (e.key === 'Escape') {
        closePhotoLightbox();
    } else if (e.key === 'ArrowRight') {
        showNextPhoto();
    } else if (e.key === 'ArrowLeft') {
        showPrevPhoto();
    }
});