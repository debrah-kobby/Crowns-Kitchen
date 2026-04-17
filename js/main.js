// ============================================================
//  CROWNS KITCHEN — main.js
// ============================================================

// scroll nav
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
}

// ── UTILITY ──────────────────────────────────────────────────

function generateOrderCode() {
  const prefix = "CK";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = prefix + "-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function showToast(message) {
  let toast = document.getElementById("ck-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "ck-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Save order/catering record to localStorage
function saveOrderRecord(code, data) {
  try {
    const orders = JSON.parse(localStorage.getItem("ck_orders") || "{}");
    orders[code] = {
      ...data,
      timestamp: new Date().toISOString(),
      status: "Received",
    };
    localStorage.setItem("ck_orders", JSON.stringify(orders));
  } catch (e) {
    // localStorage unavailable — silently continue
  }
}

// ── CONFIRMATION MODAL ────────────────────────────────────────

function showConfirmationModal(orderCode, isCatering) {
  const existing = document.getElementById("ck-confirm-modal");
  if (existing) existing.remove();
  const existingOverlay = document.getElementById("ck-confirm-overlay");
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = "ck-confirm-overlay";
  overlay.className = "ck-order-overlay ck-overlay-active";

  const modal = document.createElement("div");
  modal.id = "ck-confirm-modal";
  modal.className = "ck-order-modal ck-modal-open";

  const label = isCatering ? "Catering Request" : "Your Order";
  const icon = isCatering ? "🍽️" : "🎉";

  modal.innerHTML = `
    <div class="ck-modal-inner" style="text-align: center; padding-bottom: 48px;">
      <button class="ck-modal-close" id="ck-confirm-close" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div style="font-size: 2.5rem; margin-bottom: 1rem;">${icon}</div>
      <span class="ck-modal-eyebrow">${label} Received</span>
      <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--charcoal); margin: 0.5rem 0 0.25rem;">
        ${isCatering ? "We'll be in touch!" : "Order confirmed!"}
      </h2>
      <p style="font-size: 0.88rem; color: var(--grey); margin-bottom: 1.75rem; line-height: 1.6;">
        ${
          isCatering
            ? "Our catering team will review your request and contact you within 24 hours."
            : "We've received your order and will start preparing it shortly."
        }
      </p>

      <div class="ck-code-box">
        <p class="ck-code-label">Your ${isCatering ? "reference" : "order"} code</p>
        <div class="ck-code-display" id="ck-generated-code">${orderCode}</div>
        <button class="ck-copy-btn" id="ck-copy-code">
          <i class="fa-regular fa-copy"></i> Copy Code
        </button>
      </div>

      <a href="order-status.html" class="ck-check-status-link">
        <i class="fa-solid fa-magnifying-glass"></i> Check order status
      </a>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  document.getElementById("ck-confirm-close").addEventListener("click", () => {
    modal.remove();
    overlay.remove();
    document.body.style.overflow = "";
  });
  overlay.addEventListener("click", () => {
    modal.remove();
    overlay.remove();
    document.body.style.overflow = "";
  });

  document.getElementById("ck-copy-code").addEventListener("click", () => {
    navigator.clipboard
      .writeText(orderCode)
      .then(() => {
        showToast("✓ Code copied to clipboard!");
      })
      .catch(() => {
        showToast("Your code: " + orderCode);
      });
  });
}

// ── COMING SOON MODAL (Jumia / Bolt Food) ─────────────────────

function showComingSoonModal(platform) {
  const existing = document.getElementById("ck-soon-modal");
  if (existing) existing.remove();
  const existingOverlay = document.getElementById("ck-soon-overlay");
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = "ck-soon-overlay";
  overlay.className = "ck-order-overlay ck-overlay-active";

  const modal = document.createElement("div");
  modal.id = "ck-soon-modal";
  modal.className = "ck-order-modal ck-modal-open";

  modal.innerHTML = `
    <div class="ck-modal-inner" style="text-align: center; padding-bottom: 48px;">
      <button class="ck-modal-close" id="ck-soon-close" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div style="font-size: 2.5rem; margin-bottom: 1rem;">🚀</div>
      <span class="ck-modal-eyebrow">Coming Soon</span>
      <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--charcoal); margin: 0.5rem 0 0.25rem;">
        We're joining ${platform}!
      </h2>
      <p style="font-size: 0.88rem; color: var(--grey); margin-bottom: 1.75rem; line-height: 1.6; max-width: 360px; margin-left: auto; margin-right: auto;">
        Crowns Kitchen will be live on ${platform} very soon. Save this exclusive first-timer code — use it the moment we go live for <strong>15% off</strong> your first order!
      </p>

      <div class="ck-code-box">
        <p class="ck-code-label">Your first-timer discount code</p>
        <div class="ck-code-display">CROWNS15</div>
        <button class="ck-copy-btn" id="ck-soon-copy">
          <i class="fa-regular fa-copy"></i> Save Code
        </button>
      </div>

      <p class="ck-modal-note" style="margin-top: 1.25rem;">
        Valid on your first order on <strong>${platform}</strong> when we launch. Follow us on social media to know the moment we go live!
      </p>

      <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.25rem;">
        <a href="#" style="color: var(--primary); font-size: 1.25rem;"><i class="fab fa-instagram"></i></a>
        <a href="#" style="color: var(--primary); font-size: 1.25rem;"><i class="fab fa-facebook-f"></i></a>
        <a href="#" style="color: var(--primary); font-size: 1.25rem;"><i class="fab fa-tiktok"></i></a>
        <a href="https://wa.me/233277786772" style="color: #25d366; font-size: 1.25rem;"><i class="fab fa-whatsapp"></i></a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  document.getElementById("ck-soon-close").addEventListener("click", () => {
    modal.remove();
    overlay.remove();
    document.body.style.overflow = "";
  });
  overlay.addEventListener("click", () => {
    modal.remove();
    overlay.remove();
    document.body.style.overflow = "";
  });
  document.getElementById("ck-soon-copy").addEventListener("click", () => {
    navigator.clipboard
      .writeText("CROWNS15")
      .then(() => {
        showToast("✓ Discount code saved!");
      })
      .catch(() => {
        showToast("Your code: CROWNS15");
      });
  });
}

// ── CATERING MODAL ────────────────────────────────────────────

function showCateringModal() {
  const existing = document.getElementById("ck-catering-modal");
  if (existing) existing.remove();
  const existingOverlay = document.getElementById("ck-catering-overlay");
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = "ck-catering-overlay";
  overlay.className = "ck-order-overlay ck-overlay-active";

  const modal = document.createElement("div");
  modal.id = "ck-catering-modal";
  modal.className = "ck-order-modal ck-modal-open";

  const today = new Date().toISOString().split("T")[0];

  modal.innerHTML = `
    <div class="ck-modal-inner" style="padding-bottom: 48px;">
      <button class="ck-modal-close" id="ck-catering-close" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="ck-modal-item-summary">
        <span class="ck-modal-eyebrow">Catering Request</span>
        <p class="ck-modal-item-name">Get a Quote</p>
        <p style="font-size: 0.82rem; color: var(--grey); margin-top: 0.25rem; line-height: 1.6;">
          Fill in your event details and our team will get back to you within 24 hours.
        </p>
      </div>
      <div class="ck-modal-divider"></div>
      <form id="ck-catering-form" class="ck-order-form" novalidate>
        <div class="ck-form-row">
          <div class="ck-field">
            <label class="ck-label">Your Name</label>
            <input type="text" id="ck-cat-name" class="ck-input" placeholder="Full name" required />
          </div>
          <div class="ck-field">
            <label class="ck-label">Phone Number</label>
            <input type="tel" id="ck-cat-phone" class="ck-input" placeholder="024 000 0000" required />
          </div>
        </div>
        <div class="ck-field ck-field-full">
          <label class="ck-label">Email Address</label>
          <input type="email" id="ck-cat-email" class="ck-input" placeholder="your@email.com" />
        </div>
        <div class="ck-form-row">
          <div class="ck-field">
            <label class="ck-label">Event Type</label>
            <select id="ck-cat-event" class="ck-input ck-select">
              <option value="">Select type</option>
              <option value="corporate">Corporate / Office</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday Party</option>
              <option value="funeral">Funeral / Wake</option>
              <option value="conference">Conference</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="ck-field">
            <label class="ck-label">Number of Guests</label>
            <input type="number" id="ck-cat-guests" class="ck-input" placeholder="e.g. 50" min="5" />
          </div>
        </div>
        <div class="ck-form-row">
          <div class="ck-field">
            <label class="ck-label">Event Date</label>
            <input type="date" id="ck-cat-date" class="ck-input" min="${today}" />
          </div>
          <div class="ck-field">
            <label class="ck-label">Event Location</label>
            <input type="text" id="ck-cat-location" class="ck-input" placeholder="Area / venue" />
          </div>
        </div>
        <div class="ck-field ck-field-full">
          <label class="ck-label">Menu Preferences <span class="ck-optional">(optional)</span></label>
          <textarea id="ck-cat-notes" class="ck-input ck-textarea" rows="3"
            placeholder="Local dishes, continental, dietary needs, specific requests..."></textarea>
        </div>
        <button type="submit" class="ck-order-submit" style="background: var(--primary);">
          Submit Catering Request <i class="fa-solid fa-paper-plane"></i>
        </button>
        <p class="ck-modal-note">
          No payment required. We'll contact you to discuss your menu and confirm pricing.
        </p>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  document.getElementById("ck-catering-close").addEventListener("click", () => {
    modal.remove();
    overlay.remove();
    document.body.style.overflow = "";
  });
  overlay.addEventListener("click", () => {
    modal.remove();
    overlay.remove();
    document.body.style.overflow = "";
  });

  document
    .getElementById("ck-catering-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("ck-cat-name").value.trim();
      const phone = document.getElementById("ck-cat-phone").value.trim();
      if (!name || !phone) {
        showToast("Please fill in your name and phone number.");
        return;
      }

      const code = generateOrderCode();
      saveOrderRecord(code, {
        type: "catering",
        name,
        phone,
        email: document.getElementById("ck-cat-email").value.trim(),
        eventType: document.getElementById("ck-cat-event").value,
        guests: document.getElementById("ck-cat-guests").value,
        date: document.getElementById("ck-cat-date").value,
        location: document.getElementById("ck-cat-location").value.trim(),
        notes: document.getElementById("ck-cat-notes").value.trim(),
      });

      modal.remove();
      overlay.remove();
      document.body.style.overflow = "";
      showConfirmationModal(code, true);
    });
}

// ── DOM READY ─────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // hamburger
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      mobileNav.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("open");
      }
    });
  }

  // active nav link
  const page = window.location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll(".navbar-links a, .mobile-nav a")
    .forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href === page ||
        (page === "" && href === "index.html") ||
        (page === "index.html" && href === "index.html")
      ) {
        link.classList.add("active");
      }
    });

  // menu filter
  const filterPills = document.querySelectorAll(".filter-pill");
  const menuCards = document.querySelectorAll(".menu-card");
  if (filterPills.length) {
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        filterPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        const cat = pill.dataset.filter;
        menuCards.forEach((card) => {
          card.classList.toggle(
            "hidden",
            cat !== "all" && card.dataset.category !== cat,
          );
        });
      });
    });
  }

  // contact form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("✓ Message sent! We'll get back to you within 24 hours.");
      contactForm.reset();
    });
  }

  // reservation form
  const reservationForm = document.getElementById("reservation-form");
  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast(
        "✓ Reservation request received! We'll confirm via WhatsApp within 2 hours.",
      );
      reservationForm.reset();
    });
  }

  // newsletter
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (!isValidEmail(emailInput.value)) {
        showToast("Please enter a valid email address.");
        return;
      }
      showToast("🎉 You're in! Check your email for your 15% off code.");
      newsletterForm.reset();
    });
  }

  // date inputs min
  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.min = today;
  });

  // delivery platform buttons
  document.querySelectorAll(".delivery-card .btn-primary").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".delivery-card");
      const platform = card.querySelector("h3").textContent.trim();
      showComingSoonModal(platform);
    });
  });

  // catering quote buttons — match by text content
  document.querySelectorAll("a").forEach((link) => {
    if (link.textContent.trim().toLowerCase() === "get a catering quote") {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        showCateringModal();
      });
    }
  });

  // ── ORDER MODAL ───────────────────────────────────────────

  const orderModal = document.getElementById("ck-order-modal");
  const orderModalOverlay = document.getElementById("ck-order-overlay");
  const orderCloseBtn = document.getElementById("ck-order-close");
  const orderForm = document.getElementById("ck-order-form");
  const orderItemName = document.getElementById("ck-order-item-name");
  const orderItemPrice = document.getElementById("ck-order-item-price");
  const orderDeliveryBtn = document.getElementById("ck-delivery-btn");
  const orderPickupBtn = document.getElementById("ck-pickup-btn");
  const deliveryFields = document.getElementById("ck-delivery-fields");
  const pickupFields = document.getElementById("ck-pickup-fields");
  const orderTypeInput = document.getElementById("ck-order-type");

  if (!orderModal) return;

  document.querySelectorAll(".btn-order-this").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".menu-card");
      const name = card.querySelector(".menu-card-name").textContent.trim();
      const price = card.querySelector(".menu-price").textContent.trim();

      orderItemName.textContent = name;
      orderItemPrice.textContent = price;

      orderForm.reset();
      orderTypeInput.value = "delivery";
      orderDeliveryBtn.classList.add("ck-type-active");
      orderPickupBtn.classList.remove("ck-type-active");
      deliveryFields.style.display = "flex";
      pickupFields.style.display = "none";

      orderModal.classList.add("ck-modal-open");
      orderModalOverlay.classList.add("ck-overlay-active");
      document.body.style.overflow = "hidden";
    });
  });

  function closeOrderModal() {
    orderModal.classList.remove("ck-modal-open");
    orderModalOverlay.classList.remove("ck-overlay-active");
    document.body.style.overflow = "";
  }

  orderCloseBtn.addEventListener("click", closeOrderModal);
  orderModalOverlay.addEventListener("click", closeOrderModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOrderModal();
  });

  orderDeliveryBtn.addEventListener("click", () => {
    orderTypeInput.value = "delivery";
    orderDeliveryBtn.classList.add("ck-type-active");
    orderPickupBtn.classList.remove("ck-type-active");
    deliveryFields.style.display = "flex";
    pickupFields.style.display = "none";
  });

  orderPickupBtn.addEventListener("click", () => {
    orderTypeInput.value = "pickup";
    orderPickupBtn.classList.add("ck-type-active");
    orderDeliveryBtn.classList.remove("ck-type-active");
    pickupFields.style.display = "flex";
    deliveryFields.style.display = "none";
  });

  // submit → save to localStorage → show confirmation code
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("ck-customer-name").value.trim();
    const phone = document.getElementById("ck-customer-phone").value.trim();

    if (!name || !phone) {
      showToast("Please fill in your name and phone number.");
      return;
    }

    const type = orderTypeInput.value;
    const item = orderItemName.textContent;
    const price = orderItemPrice.textContent;
    const address =
      type === "delivery"
        ? document.getElementById("ck-delivery-address").value.trim()
        : null;
    const branch =
      type === "pickup"
        ? document.getElementById("ck-pickup-branch").value
        : null;
    const notes = document.getElementById("ck-order-notes").value.trim();

    const code = generateOrderCode();
    saveOrderRecord(code, {
      type: "order",
      item,
      price,
      name,
      phone,
      orderType: type,
      address: address || null,
      branch: branch || null,
      notes: notes || null,
    });

    closeOrderModal();
    setTimeout(() => showConfirmationModal(code, false), 400);
  });
});
