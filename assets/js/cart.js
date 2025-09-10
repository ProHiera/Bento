// Cart and Checkout Module
class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("leanbento_cart")) || [];
    this.membershipLevel = this.getMembershipLevel();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Checkout button
    const checkoutBtn = document.getElementById("checkout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", this.proceedToCheckout.bind(this));
    }
  }

  getMembershipLevel() {
    // Get membership from localStorage or default to BASIC
    const userData = JSON.parse(localStorage.getItem("leanbento_user")) || {};
    return userData.membership || { level: "BASIC", discount: 0 };
  }

  calculateDiscount(subtotal) {
    const discountRates = {
      BASIC: 0,
      SILVER: 0.05, // 5% discount
      GOLD: 0.1, // 10% discount
      PLATINUM: 0.15, // 15% discount
    };

    const discountRate = discountRates[this.membershipLevel.level] || 0;
    return Math.round(subtotal * discountRate);
  }

  calculateDeliveryFee(subtotal) {
    // Free delivery for orders over 30,000 won or for GOLD+ members
    if (
      subtotal >= 30000 ||
      ["GOLD", "PLATINUM"].includes(this.membershipLevel.level)
    ) {
      return 0;
    }
    return 3000;
  }

  updateCartSummary() {
    const subtotal = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = this.calculateDiscount(subtotal);
    const deliveryFee = this.calculateDeliveryFee(subtotal - discount);
    const total = subtotal - discount + deliveryFee;

    // Update display
    document.getElementById(
      "cart-subtotal"
    ).textContent = `${subtotal.toLocaleString()}원`;
    document.getElementById(
      "cart-delivery"
    ).textContent = `${deliveryFee.toLocaleString()}원`;
    document.getElementById(
      "cart-total"
    ).textContent = `${total.toLocaleString()}원`;

    // Show discount if applicable
    this.updateDiscountDisplay(discount);
  }

  updateDiscountDisplay(discount) {
    const cartSummary = document.querySelector(".cart-summary");

    // Remove existing discount row
    const existingDiscount = cartSummary.querySelector(".discount-row");
    if (existingDiscount) {
      existingDiscount.remove();
    }

    // Add discount row if there's a discount
    if (discount > 0) {
      const discountRow = document.createElement("div");
      discountRow.className = "summary-row discount-row";
      discountRow.style.color = "var(--primary-green)";
      discountRow.innerHTML = `
        <span>${this.membershipLevel.level} 멤버십 할인</span>
        <span>-${discount.toLocaleString()}원</span>
      `;

      // Insert before total row
      const totalRow = cartSummary.querySelector(".summary-row.total");
      cartSummary.insertBefore(discountRow, totalRow);
    }
  }

  proceedToCheckout() {
    if (this.cart.length === 0) {
      this.showMessage("장바구니가 비어있습니다.", "error");
      return;
    }

    this.showCheckoutModal();
  }

  showCheckoutModal() {
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
      <div class="modal-content glass-card" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <h3>주문하기</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="checkout-form" class="checkout-form">
            <!-- Order Summary -->
            <div class="checkout-section">
              <h4>주문 요약</h4>
              <div class="order-items">
                ${this.generateOrderSummaryHTML()}
              </div>
            </div>

            <!-- Delivery Information -->
            <div class="checkout-section">
              <h4>배송 정보</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>받는 분</label>
                  <input type="text" id="delivery-name" required>
                </div>
                <div class="form-group">
                  <label>연락처</label>
                  <input type="tel" id="delivery-phone" required>
                </div>
              </div>
              <div class="form-group">
                <label>주소</label>
                <input type="text" id="delivery-address" placeholder="도로명 주소" required>
              </div>
              <div class="form-group">
                <input type="text" id="delivery-address-detail" placeholder="상세 주소">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>배송 날짜</label>
                  <input type="date" id="delivery-date" min="${this.getMinDeliveryDate()}" required>
                </div>
                <div class="form-group">
                  <label>배송 시간</label>
                  <select id="delivery-time" required>
                    <option value="">선택하세요</option>
                    <option value="morning">오전 (9-12시)</option>
                    <option value="afternoon">오후 (1-6시)</option>
                    <option value="evening">저녁 (6-9시)</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>배송 요청사항</label>
                <textarea id="delivery-notes" rows="3" placeholder="배송 시 요청사항을 입력해주세요"></textarea>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="checkout-section">
              <h4>결제 정보</h4>
              <div class="payment-methods">
                <label class="payment-method">
                  <input type="radio" name="payment-method" value="card" checked>
                  <span>신용카드</span>
                </label>
                <label class="payment-method">
                  <input type="radio" name="payment-method" value="transfer">
                  <span>계좌이체</span>
                </label>
                <label class="payment-method">
                  <input type="radio" name="payment-method" value="phone">
                  <span>휴대폰 결제</span>
                </label>
              </div>
            </div>

            <!-- Final Summary -->
            <div class="checkout-section">
              <div class="final-summary glass-card" style="padding: 1rem;">
                ${this.generateFinalSummaryHTML()}
              </div>
            </div>

            <!-- Terms Agreement -->
            <div class="checkout-section">
              <div class="terms-agreement">
                <label class="checkbox-label">
                  <input type="checkbox" id="terms-agree" required>
                  <span>주문 내용을 확인했으며, 이용약관 및 개인정보처리방침에 동의합니다.</span>
                </label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full">결제하기</button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup modal events
    modal.querySelector(".modal-close").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    // Setup form submission
    modal.querySelector("#checkout-form").addEventListener("submit", (e) => {
      this.handleCheckoutSubmission(e, modal);
    });

    // Pre-fill user information if available
    this.prefillUserInformation();
  }

  generateOrderSummaryHTML() {
    return this.cart
      .map(
        (item) => `
      <div class="order-item">
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-quantity">×${item.quantity}</span>
        </div>
        <div class="item-price">${(
          item.price * item.quantity
        ).toLocaleString()}원</div>
      </div>
    `
      )
      .join("");
  }

  generateFinalSummaryHTML() {
    const subtotal = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = this.calculateDiscount(subtotal);
    const deliveryFee = this.calculateDeliveryFee(subtotal - discount);
    const total = subtotal - discount + deliveryFee;

    let html = `
      <div class="summary-row">
        <span>상품금액</span>
        <span>${subtotal.toLocaleString()}원</span>
      </div>
    `;

    if (discount > 0) {
      html += `
        <div class="summary-row" style="color: var(--primary-green);">
          <span>${this.membershipLevel.level} 멤버십 할인</span>
          <span>-${discount.toLocaleString()}원</span>
        </div>
      `;
    }

    html += `
      <div class="summary-row">
        <span>배송비</span>
        <span>${deliveryFee.toLocaleString()}원</span>
      </div>
      <div class="summary-row total" style="font-weight: 600; font-size: 1.2rem; border-top: 1px solid var(--glass-border); padding-top: 0.5rem; margin-top: 0.5rem;">
        <span>총 결제금액</span>
        <span style="color: var(--primary-green);">${total.toLocaleString()}원</span>
      </div>
    `;

    return html;
  }

  getMinDeliveryDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  prefillUserInformation() {
    const userData = JSON.parse(localStorage.getItem("leanbento_user")) || {};

    if (userData.name) {
      const nameInput = document.getElementById("delivery-name");
      if (nameInput) nameInput.value = userData.name;
    }

    if (userData.phone) {
      const phoneInput = document.getElementById("delivery-phone");
      if (phoneInput) phoneInput.value = userData.phone;
    }

    if (userData.address) {
      const addressInput = document.getElementById("delivery-address");
      if (addressInput) addressInput.value = userData.address;
    }
  }

  handleCheckoutSubmission(e, modal) {
    e.preventDefault();

    // Validate form
    if (!this.validateCheckoutForm()) {
      return;
    }

    // Collect form data
    const orderData = this.collectOrderData();

    // Simulate payment processing
    this.processPayment(orderData)
      .then(() => {
        // Success - save order and clear cart
        this.saveOrder(orderData);
        this.clearCart();

        // Close checkout modal
        document.body.removeChild(modal);

        // Show success modal
        this.showOrderSuccessModal(orderData);
      })
      .catch((error) => {
        this.showMessage(
          "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
          "error"
        );
      });
  }

  validateCheckoutForm() {
    const requiredFields = [
      "delivery-name",
      "delivery-phone",
      "delivery-address",
      "delivery-date",
      "delivery-time",
    ];

    for (const fieldId of requiredFields) {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        field.focus();
        this.showMessage("모든 필수 항목을 입력해주세요.", "error");
        return false;
      }
    }

    // Validate terms agreement
    const termsAgree = document.getElementById("terms-agree");
    if (!termsAgree.checked) {
      this.showMessage("이용약관에 동의해주세요.", "error");
      return false;
    }

    return true;
  }

  collectOrderData() {
    const subtotal = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = this.calculateDiscount(subtotal);
    const deliveryFee = this.calculateDeliveryFee(subtotal - discount);
    const total = subtotal - discount + deliveryFee;

    return {
      orderId: this.generateOrderId(),
      items: [...this.cart],
      delivery: {
        name: document.getElementById("delivery-name").value,
        phone: document.getElementById("delivery-phone").value,
        address: document.getElementById("delivery-address").value,
        addressDetail: document.getElementById("delivery-address-detail").value,
        date: document.getElementById("delivery-date").value,
        time: document.getElementById("delivery-time").value,
        notes: document.getElementById("delivery-notes").value,
      },
      payment: {
        method: document.querySelector('input[name="payment-method"]:checked')
          .value,
        subtotal,
        discount,
        deliveryFee,
        total,
      },
      membershipLevel: this.membershipLevel.level,
      orderDate: new Date().toISOString(),
      status: "pending",
    };
  }

  generateOrderId() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `LB${dateStr}${randomStr}`;
  }

  async processPayment(orderData) {
    // Simulate payment processing delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject(new Error("Payment failed"));
        }
      }, 2000);
    });
  }

  saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem("leanbento_orders")) || [];
    orders.push(orderData);
    localStorage.setItem("leanbento_orders", JSON.stringify(orders));
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem("leanbento_cart");

    // Update cart display in main app
    if (window.app) {
      window.app.cart = [];
      window.app.updateCartDisplay();
    }
  }

  showOrderSuccessModal(orderData) {
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
      <div class="modal-content glass-card">
        <div class="modal-header">
          <h3>주문 완료</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="order-success">
            <div class="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <h4>주문이 성공적으로 완료되었습니다!</h4>
            <div class="order-details">
              <div class="detail-item">
                <span>주문번호:</span>
                <span class="order-id">${orderData.orderId}</span>
              </div>
              <div class="detail-item">
                <span>결제금액:</span>
                <span>${orderData.payment.total.toLocaleString()}원</span>
              </div>
              <div class="detail-item">
                <span>배송 예정일:</span>
                <span>${orderData.delivery.date}</span>
              </div>
              <div class="detail-item">
                <span>배송 시간:</span>
                <span>${this.getDeliveryTimeText(
                  orderData.delivery.time
                )}</span>
              </div>
            </div>
            <p class="success-note">
              주문 상태는 마이페이지에서 확인하실 수 있습니다.<br>
              맛있는 도시락으로 건강한 하루 되세요!
            </p>
            <div class="success-actions">
              <button class="btn btn-secondary" onclick="this.closeModal()">확인</button>
              <button class="btn btn-primary" onclick="this.goToMyPage()">마이페이지</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup modal events
    modal.querySelector(".modal-close").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    // Add methods to window for button handlers
    window.closeModal = () => {
      document.body.removeChild(modal);
    };

    window.goToMyPage = () => {
      document.body.removeChild(modal);
      // Navigate to my page (would be implemented in main app)
      this.showMessage("마이페이지 기능은 추후 구현 예정입니다.");
    };
  }

  getDeliveryTimeText(time) {
    const times = {
      morning: "오전 (9-12시)",
      afternoon: "오후 (1-6시)",
      evening: "저녁 (6-9시)",
    };
    return times[time] || time;
  }

  // Get order history
  getOrderHistory() {
    return JSON.parse(localStorage.getItem("leanbento_orders")) || [];
  }

  // Calculate user statistics
  getUserStats() {
    const orders = this.getOrderHistory();

    return {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.payment.total, 0),
      avgOrderValue:
        orders.length > 0
          ? orders.reduce((sum, order) => sum + order.payment.total, 0) /
            orders.length
          : 0,
      lastOrderDate:
        orders.length > 0
          ? new Date(
              Math.max(...orders.map((order) => new Date(order.orderDate)))
            ).toLocaleDateString()
          : null,
    };
  }

  showMessage(message, type = "success") {
    if (window.app && window.app.showNotification) {
      window.app.showNotification(message, type);
    } else {
      alert(message);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cartManager = new CartManager();
});

export default CartManager;
