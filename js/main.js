// ============================================================
//  CROWNS KITCHEN — main.js
// ============================================================

// ── 1. SCROLL NAV ────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── 2. HAMBURGER MENU ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
      }
    });
  }

  // ── 3. ACTIVE NAV LINK ──────────────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') ||
        (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── 4. MENU FILTER ──────────────────────────────────────────
  const filterPills = document.querySelectorAll('.filter-pill');
  const menuCards = document.querySelectorAll('.menu-card');

  if (filterPills.length) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const cat = pill.dataset.filter;
        menuCards.forEach(card => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ── 5. FORM TOASTS ──────────────────────────────────────────
  function showToast(message) {
    let toast = document.getElementById('ck-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ck-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✓ Message sent! We\'ll get back to you within 24 hours.');
      contactForm.reset();
    });
  }

  // Reservation form
  const reservationForm = document.getElementById('reservation-form');
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✓ Reservation request received! We\'ll confirm via WhatsApp within 2 hours.');
      reservationForm.reset();
    });
  }

  // ── 6. NEWSLETTER ───────────────────────────────────────────
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (!isValidEmail(emailInput.value)) {
        showToast('Please enter a valid email address.');
        return;
      }
      showToast('🎉 You\'re in! Check your email for your 15% off code.');
      newsletterForm.reset();
    });
  }

  // ── 7. SET MIN DATE ON DATE INPUTS ──────────────────────────
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = today;
  });
});
