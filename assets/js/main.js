// Main Application Module
class LeanBentoApp {
  constructor() {
    this.currentUser = null;
    this.cart = JSON.parse(localStorage.getItem("leanbento_cart")) || [];
    this.filterDebounceTimer = null; // for search debounce
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.initHeroSlider();
    this.updateCartDisplay();
    // Force menu data refresh and load
    if (window.dataManager) {
      console.log("DataManager found, forcing menu refresh...");
      window.dataManager.resetMenuData();
    }
    // Initial menu load - use direct loadMenuItems for guaranteed display
    this.loadMenuItems();
    this.loadReviews();
    this.initIngredientGather();
  }

  initIngredientGather() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;
    const section = document.querySelector("#ingredient-gather");
    if (!section) return;
    const pieces = section.querySelectorAll(".ingredient-piece");
    const bowl = section.querySelector(".bowl");
    if (!pieces.length || !bowl) return;

    const bowlRect = () => bowl.getBoundingClientRect();

    pieces.forEach((el, i) => {
      const dx = parseFloat(el.dataset.x || Math.random() * 160 - 80);
      const dy = parseFloat(el.dataset.y || Math.random() * 120 - 60);
      const s = parseFloat(el.dataset.scale || 0.6 + Math.random() * 0.5);
      const rot = Math.random() * 80 - 40;
      // 초기 퍼짐 상태 세팅
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: dx * 3,
        y: dy * 3,
        scale: s * 0.4,
        rotate: rot * 2,
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.to(
        el,
        {
          opacity: 1,
          duration: 0.15,
          ease: "power1.out",
        },
        0
      )
        .to(
          el,
          {
            x: dx * 1.4,
            y: dy * 1.4,
            scale: s * 0.85,
            rotate: rot * 1.2,
            ease: "power2.out",
          },
          0.15
        )
        .to(
          el,
          {
            x: dx * 0.65,
            y: dy * 0.45,
            scale: s,
            rotate: rot * 0.6,
            ease: "power2.inOut",
          },
          0.45
        )
        .to(
          el,
          {
            // 최종적으로 그릇 중앙 쪽으로 약간 모임
            x: dx * 0.25,
            y: dy * 0.15 + i * 2,
            scale: s * 0.9,
            rotate: rot * 0.3,
            ease: "power3.out",
          },
          0.7
        );
    });

    // Bowl subtle rise / parallax
    gsap.fromTo(
      bowl,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 40%",
          scrub: true,
        },
      }
    );
  }

  setupEventListeners() {
    // Navigation
    this.setupNavigation();

    // Modals
    this.setupModals();

    // Theme toggle
    document
      .getElementById("theme-toggle")
      .addEventListener("click", this.toggleTheme.bind(this));

    // Cart
    document
      .getElementById("cart-btn")
      .addEventListener("click", this.openCart.bind(this));

    // Filtering / pills / advanced controls
    this.setupFiltering();

    // Hero CTA
    const startBuilderBtn = document.getElementById("start-builder");
    if (startBuilderBtn) {
      startBuilderBtn.addEventListener("click", () => {
        document
          .getElementById("builder")
          .scrollIntoView({ behavior: "smooth" });
      });
    }

    // Contact form
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", this.handleContactForm.bind(this));
    }

    // Login/Register forms
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", this.handleLogin.bind(this));
    }

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", this.handleRegister.bind(this));
    }

    // Range sliders (legacy – still updates value bubbles)
    this.setupRangeSliders();
  }

  // Initialize GSAP animations
  initializeAnimations() {
    if (typeof gsap !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Animate hero content
      gsap.from(".hero-text", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power2.out",
      });

      // Animate menu items when they come into view
      gsap.from(".menu-item", {
        scrollTrigger: {
          trigger: ".menu-grid",
          start: "top 80%",
        },
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }

  // Setup range sliders
  setupRangeSliders() {
    // Initialize range slider values
    const ranges = ["calorie-min", "calorie-max", "protein-min", "protein-max"];
    ranges.forEach((id) => {
      const input = document.getElementById(id);
      const span = document.getElementById(id + "-value");
      if (input && span) {
        span.textContent = input.value;
      }
    });
  }

  // --- Filtering System (pills + advanced) ---
  setupFiltering() {
    const pills = document.querySelectorAll(".filters__pill");
    const searchInput = document.getElementById("menuSearch");
    const advToggle = document.querySelector(".filters__more");
    const advPanel = document.getElementById("advFilters");
    const suggestionsBox = document.getElementById("menuSuggestions");

    // Build suggestions source from current menu items
    const baseItems = window.dataManager
      ? window.dataManager.getMenuItems()
      : [];
    this.menuNames = baseItems.map((i) => i.name);

    // Pill single-select behaviour
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const already = pill.getAttribute("aria-pressed") === "true";
        pills.forEach((p) => p.setAttribute("aria-pressed", "false"));
        pill.setAttribute("aria-pressed", already ? "false" : "true");
        this.filterAndRenderMenu();
      });
    });

    // Search (debounced + suggestions)
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        clearTimeout(this.filterDebounceTimer);
        this.updateSuggestions(e.target.value, suggestionsBox);
        this.filterDebounceTimer = setTimeout(() => {
          this.filterAndRenderMenu();
        }, 160);
      });
      searchInput.addEventListener("keydown", (e) => {
        if (!suggestionsBox || suggestionsBox.hidden) return;
        const items = Array.from(suggestionsBox.querySelectorAll("li"));
        const currentIndex = items.findIndex(
          (li) => li.getAttribute("aria-selected") === "true"
        );
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = (currentIndex + 1) % items.length;
          items.forEach((li) => li.removeAttribute("aria-selected"));
          items[next].setAttribute("aria-selected", "true");
          searchInput.value = items[next].textContent;
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = (currentIndex - 1 + items.length) % items.length;
          items.forEach((li) => li.removeAttribute("aria-selected"));
          items[prev].setAttribute("aria-selected", "true");
          searchInput.value = items[prev].textContent;
        } else if (e.key === "Enter") {
          if (currentIndex >= 0) {
            e.preventDefault();
            suggestionsBox.hidden = true;
            this.filterAndRenderMenu();
          }
        } else if (e.key === "Escape") {
          suggestionsBox.hidden = true;
        }
      });
      document.addEventListener("click", (e) => {
        if (!suggestionsBox) return;
        if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
          suggestionsBox.hidden = true;
        }
      });
    }

    // Advanced disclosure
    if (advToggle && advPanel) {
      advToggle.addEventListener("click", () => {
        const expanded = advToggle.getAttribute("aria-expanded") === "true";
        advToggle.setAttribute("aria-expanded", String(!expanded));
        advPanel.hidden = expanded;
      });
    }

    // Range inputs - simple approach
    const rangeInputs = [
      "calorie-min",
      "calorie-max",
      "protein-min",
      "protein-max",
      "carbs-max",
      "fat-max",
    ]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    rangeInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        const id = e.target.id;
        const span = document.getElementById(id + "-value");
        if (span) {
          span.textContent = e.target.value;
          console.log(`Updated ${id} to ${e.target.value}`);
        }

        this.enforceDualRangeLogic();
      });
      input.addEventListener("change", () => this.filterAndRenderMenu());
    });
  }

  updateSuggestions(value, box) {
    if (!box) return;
    const term = value.trim().toLowerCase();
    if (!term) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const matches = this.menuNames
      .filter((n) => n.toLowerCase().includes(term))
      .slice(0, 8);
    if (matches.length === 0) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.innerHTML = matches
      .map(
        (m, i) =>
          `<li role="option" ${i === 0 ? 'aria-selected="true"' : ""}>${m}</li>`
      )
      .join("");
    box.hidden = false;
    box.querySelectorAll("li").forEach((li) => {
      li.addEventListener("mousedown", (e) => {
        // mousedown to fire before blur
        const searchInput = document.getElementById("menuSearch");
        searchInput.value = li.textContent;
        box.hidden = true;
        this.filterAndRenderMenu();
      });
    });
  }

  enforceDualRangeLogic() {
    const cMin = document.getElementById("calorie-min");
    const cMax = document.getElementById("calorie-max");
    const pMin = document.getElementById("protein-min");
    const pMax = document.getElementById("protein-max");

    if (cMin && cMax && parseInt(cMin.value) > parseInt(cMax.value)) {
      cMin.value = cMax.value;
      const span = document.getElementById("calorie-min-value");
      if (span) span.textContent = cMin.value;
    }
    if (pMin && pMax && parseInt(pMin.value) > parseInt(pMax.value)) {
      pMin.value = pMax.value;
      const span = document.getElementById("protein-min-value");
      if (span) span.textContent = pMin.value;
    }
  }

  filterAndRenderMenu() {
    const dataManager = window.dataManager;
    if (!dataManager) {
      console.log("DataManager not available");
      return;
    }

    const menuGrid = document.getElementById("menu-grid");
    if (!menuGrid) {
      console.log("menu-grid not found");
      return;
    }

    console.log("Filtering and rendering menu...");

    // Selected category (pill with aria-pressed=true)
    const activePill = document.querySelector(
      '.filters__pill[aria-pressed="true"]'
    );
    const category = activePill ? activePill.dataset.filter : "";

    // Ranges / limits
    const calorieMinEl = document.getElementById("calorie-min");
    const calorieMaxEl = document.getElementById("calorie-max");
    const proteinMinEl = document.getElementById("protein-min");
    const proteinMaxEl = document.getElementById("protein-max");
    const carbsMaxEl = document.getElementById("carbs-max");
    const fatMaxEl = document.getElementById("fat-max");
    const searchInput = document.getElementById("menuSearch");

    const filters = {};
    if (category) filters.category = category; // empty means all

    // DataManager supports calorieRange & proteinRange
    if (calorieMinEl && calorieMaxEl) {
      const min = parseInt(calorieMinEl.value, 10);
      const max = parseInt(calorieMaxEl.value, 10);
      if (!isNaN(min) && !isNaN(max)) filters.calorieRange = { min, max };
    }
    if (proteinMinEl && proteinMaxEl) {
      const min = parseInt(proteinMinEl.value, 10);
      const max = parseInt(proteinMaxEl.value, 10);
      if (!isNaN(min) && !isNaN(max)) filters.proteinRange = { min, max };
    }

    let items = dataManager.getMenuItems(filters);
    console.log("Initial filtered items:", items.length);

    // Additional client-side max filters (carbs, fat)
    const carbsMax = carbsMaxEl ? parseInt(carbsMaxEl.value, 10) : null;
    const fatMax = fatMaxEl ? parseInt(fatMaxEl.value, 10) : null;

    if (!isNaN(carbsMax)) {
      items = items.filter((i) => i.nutrition.carbs <= carbsMax);
    }
    if (!isNaN(fatMax)) {
      items = items.filter((i) => i.nutrition.fat <= fatMax);
    }

    // Search filtering (case-insensitive across name, description, tags)
    const q = (searchInput?.value || "").trim().toLowerCase();
    if (q) {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          (i.tags && i.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    console.log("Final filtered items:", items.length);

    // Render
    menuGrid.innerHTML = "";
    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "조건에 맞는 메뉴가 없습니다.";
      menuGrid.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      const el = this.createMenuItemElement(item);
      menuGrid.appendChild(el);
    });

    console.log("Menu items rendered to DOM");
  }

  // --- Existing code below (loadMenuItems kept for backward compatibility) ---
  // Hero Slider
  initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    let currentSlide = 0;

    const nextSlide = () => {
      const currentSlideElement = slides[currentSlide];
      const nextSlideIndex = (currentSlide + 1) % slides.length;
      const nextSlideElement = slides[nextSlideIndex];

      // GSAP 애니메이션으로 부드러운 전환
      gsap
        .timeline()
        .to(currentSlideElement, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        })
        .set(currentSlideElement, { className: "hero-slide" })
        .set(nextSlideElement, { className: "hero-slide active" })
        .fromTo(
          nextSlideElement,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: "power2.inOut",
          },
          0.5
        )
        .fromTo(
          nextSlideElement.querySelector("img"),
          { scale: 1.1 },
          {
            scale: 1,
            duration: 8,
            ease: "power2.out",
          },
          0.5
        );

      currentSlide = nextSlideIndex;
    };

    // 자동 슬라이드 (6초마다)
    setInterval(nextSlide, 6000);

    // 첫 번째 슬라이드 초기화
    slides[0].classList.add("active");
    gsap.fromTo(
      slides[0].querySelector("img"),
      { scale: 1.1 },
      {
        scale: 1,
        duration: 8,
        ease: "power2.out",
      }
    );
  }

  // Menu System (backward compatibility – now routed through filterAndRenderMenu)
  loadMenuItems() {
    const menuGrid = document.getElementById("menu-grid");
    const dataManager = window.dataManager;

    if (!dataManager || !menuGrid) {
      console.log("Missing dataManager or menuGrid");
      return;
    }

    const menuItems = dataManager.getMenuItems();
    console.log("Loading menu items:", menuItems.length);

    menuGrid.innerHTML = "";

    menuItems.forEach((item) => {
      const menuElement = this.createMenuItemElement(item);
      menuGrid.appendChild(menuElement);
    });

    console.log("Menu items loaded successfully");
  }

  getMenuItems() {
    const dataManager = window.dataManager;
    return dataManager.getMenuItems();
  }

  createMenuItemElement(item) {
    const div = document.createElement("div");
    div.className = "menu-item glass-card";
    div.innerHTML = `
      ${this.renderMenuImage(item.image)}
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="menu-nutrition">
        <div>칼로리: ${item.nutrition.calories}kcal</div>
        <div>단백질: ${item.nutrition.protein}g</div>
        <div>탄수화물: ${item.nutrition.carbs}g</div>
        <div>지방: ${item.nutrition.fat}g</div>
      </div>
      <div class="menu-price">${item.price.toLocaleString()}원</div>
    `;

    div.addEventListener("click", () => {
      this.addToCart(item);
    });

    return div;
  }

  // Helper method to render menu image (image or emoji)
  renderMenuImage(image) {
    if (image.startsWith("http")) {
      return `<img src="${image}" alt="메뉴 이미지" class="menu-image" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
              <div class="menu-emoji" style="display:none;"></div>`;
    } else {
      return `<div class="menu-emoji">${image}</div>`;
    }
  }

  applyMenuFilters() {
    /* deprecated – use filterAndRenderMenu */
  }

  // Cart System
  addToCart(item) {
    const existingItem = this.cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...item,
        quantity: 1,
      });
    }

    this.saveCart();
    this.updateCartDisplay();
    this.showNotification(`${item.name}이(가) 장바구니에 추가되었습니다.`);
  }

  removeFromCart(itemId) {
    this.cart = this.cart.filter((item) => item.id !== itemId);
    this.saveCart();
    this.updateCartDisplay();
    this.updateCartModal();
  }

  updateCartQuantity(itemId, quantity) {
    const item = this.cart.find((cartItem) => cartItem.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartModal();
      }
    }
  }

  updateCartDisplay() {
    const cartCount = document.getElementById("cart-count");
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCount.textContent = totalItems;

    // Show/hide badge based on item count
    if (totalItems > 0) {
      cartCount.classList.add("visible");
    } else {
      cartCount.classList.remove("visible");
    }
  }

  openCart() {
    this.updateCartModal();
    this.openModal("cart-modal");
  }

  updateCartModal() {
    const cartItems = document.getElementById("cart-items");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    if (this.cart.length === 0) {
      cartItems.innerHTML =
        '<p class="empty-state">장바구니가 비어있습니다.</p>';
      cartSubtotal.textContent = "0원";
      cartTotal.textContent = "3,000원";
      return;
    }

    let subtotal = 0;

    this.cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.description}</p>
        </div>
        <div class="cart-item-controls">
          <input type="number" value="${item.quantity}" min="1" 
                 onchange="app.updateCartQuantity(${item.id}, this.value)">
          <span class="cart-item-price">${itemTotal.toLocaleString()}원</span>
          <button class="remove-btn" onclick="app.removeFromCart(${
            item.id
          })">×</button>
        </div>
      `;

      cartItems.appendChild(cartItem);
    });

    const deliveryFee = subtotal >= 30000 ? 0 : 3000;
    const total = subtotal + deliveryFee;

    cartSubtotal.textContent = `${subtotal.toLocaleString()}원`;
    document.getElementById(
      "cart-delivery"
    ).textContent = `${deliveryFee.toLocaleString()}원`;
    cartTotal.textContent = `${total.toLocaleString()}원`;
  }

  saveCart() {
    localStorage.setItem("leanbento_cart", JSON.stringify(this.cart));
  }

  // Reviews System
  loadReviews() {
    const reviewsGrid = document.getElementById("reviews-grid");
    const reviews = this.getReviews();

    reviewsGrid.innerHTML = "";

    reviews.forEach((review) => {
      const reviewElement = this.createReviewElement(review);
      reviewsGrid.appendChild(reviewElement);
    });
  }

  getReviews() {
    return [
      {
        id: 1,
        name: "김민수",
        rating: 5,
        text: "정말 맛있고 영양소 계산이 정확해요! 다이어트에 큰 도움이 되고 있습니다.",
        date: "2024-01-15",
      },
      {
        id: 2,
        name: "박지영",
        rating: 5,
        text: "커스텀 빌더가 너무 좋아요. 서브웨이처럼 재료를 직접 선택할 수 있어서 만족도가 높습니다.",
        date: "2024-01-10",
      },
      {
        id: 3,
        name: "이준호",
        rating: 4,
        text: "배송도 빠르고 포장도 깔끔해요. 정기구독 서비스 덕분에 식단 관리가 편해졌습니다.",
        date: "2024-01-08",
      },
    ];
  }

  createReviewElement(review) {
    const div = document.createElement("div");
    div.className = "review-item glass-card";

    // Create star rating using SVG icons
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
      const filled = i < review.rating;
      starsHtml += `<svg width="16" height="16" viewBox="0 0 24 24" fill="${
        filled ? "currentColor" : "none"
      }" stroke="currentColor" stroke-width="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>`;
    }
    const initial = review.name.charAt(0);

    div.innerHTML = `
      <div class="review-header">
        <div class="review-avatar">${initial}</div>
        <div class="review-info">
          <h4>${review.name}</h4>
          <div class="review-rating">${starsHtml}</div>
        </div>
      </div>
      <p class="review-text">${review.text}</p>
    `;

    return div;
  }

  // Form Handlers
  handleContactForm(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("contact-name").value,
      email: document.getElementById("contact-email").value,
      type: document.getElementById("inquiry-type").value,
      message: document.getElementById("contact-message").value,
    };

    // Simulate form submission
    this.showNotification(
      "문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다."
    );
    document.getElementById("contact-form").reset();
  }

  handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Simulate login
    this.currentUser = { email, name: "사용자" };
    this.updateLoginState();
    this.closeModal("login-modal");
    this.showNotification("로그인 되었습니다.");
  }

  handleRegister(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("register-name").value,
      email: document.getElementById("register-email").value,
      password: document.getElementById("register-password").value,
      confirmPassword: document.getElementById("register-password-confirm")
        .value,
    };

    if (formData.password !== formData.confirmPassword) {
      this.showNotification("비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    // Simulate registration
    this.currentUser = { email: formData.email, name: formData.name };
    this.updateLoginState();
    this.closeModal("register-modal");
    this.showNotification("회원가입이 완료되었습니다.");
  }

  updateLoginState() {
    const loginBtn = document.getElementById("login-btn");
    const userIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>`;

    if (this.currentUser) {
      loginBtn.innerHTML = userIcon;
      loginBtn.title = `${this.currentUser.name} (로그아웃하려면 클릭)`;
      loginBtn.style.background = "var(--mint-green)";
      loginBtn.onclick = () => this.logout();
    } else {
      loginBtn.innerHTML = userIcon;
      loginBtn.title = "로그인";
      loginBtn.style.background = "var(--primary-green)";
      loginBtn.onclick = () => this.openModal("login-modal");
    }
  }

  logout() {
    this.currentUser = null;
    this.updateLoginState();
    this.showNotification("로그아웃 되었습니다.");
  }

  // Navigation
  setupNavigation() {
    const hamburger = document.getElementById("hamburger");
    const gnbList = document.getElementById("gnbList");

    if (hamburger && gnbList) {
      hamburger.addEventListener("click", () => {
        const isOpen = gnbList.classList.contains("is-open");
        gnbList.classList.toggle("is-open", !isOpen);
        hamburger.classList.toggle("is-active", !isOpen);
        hamburger.setAttribute("aria-expanded", String(!isOpen));
      });
    }
  }

  // Modals
  setupModals() {
    // Modal close functionality
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modalId = btn.getAttribute("data-modal");
        if (modalId) {
          this.closeModal(modalId);
        }
      });
    });

    // Close modal when clicking outside
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  // Open modal
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  // Close modal
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  }

  // Toggle theme
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("leanbento_theme", newTheme);

    // Update theme toggle icon
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon =
      newTheme === "dark"
        ? '<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/><circle cx="12" cy="12" r="5"/>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${themeIcon}</svg>`;
  }

  // Utility Methods
  showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === "error" ? "#ef4444" : "var(--primary-green)"};
      color: white;
      border-radius: var(--border-radius);
      box-shadow: var(--glass-shadow);
      z-index: 3000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Initialize theme from localStorage
  initializeTheme() {
    const savedTheme = localStorage.getItem("leanbento_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon =
      savedTheme === "dark"
        ? '<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/><circle cx="12" cy="12" r="5"/>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${themeIcon}</svg>`;
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Force reset localStorage and reinitialize data
  console.log("Forcing data refresh...");
  localStorage.removeItem("leanbento_menu_items");

  // Wait for DataManager to be available
  const initApp = () => {
    if (!window.dataManager) {
      console.log("Waiting for DataManager...");
      setTimeout(initApp, 50);
      return;
    }

    console.log("DataManager available, initializing LeanBentoApp...");
    window.app = new LeanBentoApp();
    window.app.initializeTheme();
  };

  initApp();
});

// Export for use in other modules
export default LeanBentoApp;
