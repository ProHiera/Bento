// 장바구니 관리 JavaScript
class CartManager {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cartItems")) || [];
    this.init();
  }

  init() {
    this.renderCartItems();
    this.updateCartSummary();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 주문하기 버튼
    const orderBtn = document.getElementById("proceed-order");
    if (orderBtn) {
      orderBtn.addEventListener("click", () => this.proceedToOrder());
    }

    // 전체 삭제 버튼
    document.addEventListener("click", (e) => {
      if (e.target.matches(".clear-cart")) {
        this.clearCart();
      }
    });
  }

  // 장바구니 아이템 렌더링
  renderCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCart = document.getElementById("empty-cart");
    const cartSummary = document.getElementById("cart-summary");

    if (this.items.length === 0) {
      if (emptyCart) emptyCart.style.display = "block";
      if (cartSummary) cartSummary.style.display = "none";
      return;
    }

    if (emptyCart) emptyCart.style.display = "none";
    if (cartSummary) cartSummary.style.display = "block";

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = this.generateCartItemsHTML();
    }

    this.attachItemEventListeners();
  }

  // 장바구니 아이템 HTML 생성
  generateCartItemsHTML() {
    return `
            <div class="cart-header">
                <h3>장바구니 아이템 (${this.items.length})</h3>
                <button class="clear-cart btn-text">전체 삭제</button>
            </div>
            ${this.items.map((item) => this.generateItemHTML(item)).join("")}
        `;
  }

  // 개별 아이템 HTML 생성
  generateItemHTML(item) {
    const totalPrice = item.price * item.quantity;
    return `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${
                      item.image || "assets/images/default-bento.jpg"
                    }" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-description">${item.description || ""}</p>
                    ${
                      item.ingredients
                        ? `<p class="item-ingredients">재료: ${item.ingredients.join(
                            ", "
                          )}</p>`
                        : ""
                    }
                    <p class="item-price">${item.price.toLocaleString()}원</p>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn decrease" data-id="${
                          item.id
                        }">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn increase" data-id="${
                          item.id
                        }">+</button>
                    </div>
                    <p class="item-total">${totalPrice.toLocaleString()}원</p>
                    <button class="remove-item" data-id="${
                      item.id
                    }">삭제</button>
                </div>
            </div>
        `;
  }

  // 아이템 이벤트 리스너 연결
  attachItemEventListeners() {
    // 수량 증가/감소
    document.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = e.target.dataset.id;
        const action = e.target.classList.contains("increase")
          ? "increase"
          : "decrease";
        this.updateQuantity(itemId, action);
      });
    });

    // 아이템 삭제
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = e.target.dataset.id;
        this.removeItem(itemId);
      });
    });
  }

  // 수량 업데이트
  updateQuantity(itemId, action) {
    const itemIndex = this.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    if (action === "increase") {
      this.items[itemIndex].quantity++;
    } else if (action === "decrease") {
      if (this.items[itemIndex].quantity > 1) {
        this.items[itemIndex].quantity--;
      } else {
        this.removeItem(itemId);
        return;
      }
    }

    this.saveCart();
    this.renderCartItems();
    this.updateCartSummary();
  }

  // 아이템 삭제
  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.saveCart();
    this.renderCartItems();
    this.updateCartSummary();
  }

  // 장바구니 비우기
  clearCart() {
    if (confirm("장바구니를 비우시겠습니까?")) {
      this.items = [];
      this.saveCart();
      this.renderCartItems();
      this.updateCartSummary();
    }
  }

  // 주문 요약 업데이트
  updateCartSummary() {
    const subtotalElement = document.getElementById("cart-subtotal");
    const deliveryElement = document.getElementById("cart-delivery");
    const totalElement = document.getElementById("cart-total");

    const subtotal = this.calculateSubtotal();
    const deliveryFee = this.calculateDeliveryFee(subtotal);
    const total = subtotal + deliveryFee;

    if (subtotalElement)
      subtotalElement.textContent = `${subtotal.toLocaleString()}원`;
    if (deliveryElement)
      deliveryElement.textContent = `${deliveryFee.toLocaleString()}원`;
    if (totalElement) totalElement.textContent = `${total.toLocaleString()}원`;
  }

  // 소계 계산
  calculateSubtotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // 배송비 계산
  calculateDeliveryFee(subtotal) {
    return subtotal >= 20000 ? 0 : 3000;
  }

  // 주문하기
  async proceedToOrder() {
    if (this.items.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    }

    // 로그인 확인
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      if (
        confirm(
          "주문하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        window.location.href = "login.html";
      }
      return;
    }

    this.showOrderModal();
  }

  // 주문 모달 표시
  showOrderModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal-content order-modal">
                <div class="modal-header">
                    <h3>주문 확인</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${this.generateOrderSummaryHTML()}
                    <div class="delivery-info-form">
                        <h4>배송 정보</h4>
                        <div class="form-group">
                            <label>배송 주소</label>
                            <input type="text" id="delivery-address" placeholder="배송받을 주소를 입력하세요" required>
                        </div>
                        <div class="form-group">
                            <label>연락처</label>
                            <input type="tel" id="delivery-phone" placeholder="연락처를 입력하세요" required>
                        </div>
                        <div class="form-group">
                            <label>요청사항</label>
                            <textarea id="delivery-note" placeholder="배송 요청사항 (선택사항)"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary cancel-order">취소</button>
                    <button class="btn btn-primary confirm-order">주문 확정</button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // 모달 이벤트 리스너
    modal.querySelector(".modal-close").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.querySelector(".cancel-order").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.querySelector(".confirm-order").addEventListener("click", () => {
      this.confirmOrder(modal);
    });

    // 모달 배경 클릭시 닫기
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  // 주문 요약 HTML 생성
  generateOrderSummaryHTML() {
    const subtotal = this.calculateSubtotal();
    const deliveryFee = this.calculateDeliveryFee(subtotal);
    const total = subtotal + deliveryFee;

    return `
            <div class="order-summary">
                <h4>주문 내역</h4>
                <div class="order-items">
                    ${this.items
                      .map(
                        (item) => `
                        <div class="order-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>${(
                              item.price * item.quantity
                            ).toLocaleString()}원</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="order-totals">
                    <div class="total-row">
                        <span>상품 금액</span>
                        <span>${subtotal.toLocaleString()}원</span>
                    </div>
                    <div class="total-row">
                        <span>배송비</span>
                        <span>${deliveryFee.toLocaleString()}원</span>
                    </div>
                    <div class="total-row final-total">
                        <span>총 결제 금액</span>
                        <span>${total.toLocaleString()}원</span>
                    </div>
                </div>
            </div>
        `;
  }

  // 주문 확정
  async confirmOrder(modal) {
    const address = document.getElementById("delivery-address").value.trim();
    const phone = document.getElementById("delivery-phone").value.trim();
    const note = document.getElementById("delivery-note").value.trim();

    if (!address || !phone) {
      alert("배송 주소와 연락처는 필수 입력사항입니다.");
      return;
    }

    const orderData = {
      id: this.generateOrderId(),
      items: [...this.items],
      subtotal: this.calculateSubtotal(),
      deliveryFee: this.calculateDeliveryFee(this.calculateSubtotal()),
      total:
        this.calculateSubtotal() +
        this.calculateDeliveryFee(this.calculateSubtotal()),
      delivery: {
        address,
        phone,
        note,
      },
      orderDate: new Date().toISOString(),
      status: "pending",
    };

    try {
      // 주문 처리 시뮬레이션
      await this.processOrder(orderData);

      // 주문 성공
      this.saveOrder(orderData);
      this.clearCartAfterOrder();
      document.body.removeChild(modal);
      this.showSuccessMessage(orderData);
    } catch (error) {
      alert("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Order processing error:", error);
    }
  }

  // 주문 ID 생성
  generateOrderId() {
    return (
      "ORD" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
    );
  }

  // 주문 처리 (시뮬레이션)
  async processOrder(orderData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(orderData);
      }, 1000);
    });
  }

  // 주문 저장
  saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    orders.unshift(orderData);
    localStorage.setItem("orderHistory", JSON.stringify(orders));
  }

  // 주문 후 장바구니 비우기
  clearCartAfterOrder() {
    this.items = [];
    this.saveCart();
    this.renderCartItems();
    this.updateCartSummary();
  }

  // 성공 메시지 표시
  showSuccessMessage(orderData) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal-content success-modal">
                <div class="modal-header">
                    <h3>주문 완료! 🎉</h3>
                </div>
                <div class="modal-body">
                    <div class="success-content">
                        <div class="success-icon">✅</div>
                        <h4>주문이 성공적으로 접수되었습니다</h4>
                        <p>주문번호: <strong>${orderData.id}</strong></p>
                        <p>예상 배송시간: 30-60분</p>
                        <p>총 결제 금액: <strong>${orderData.total.toLocaleString()}원</strong></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="window.location.href='index.html'">홈으로 가기</button>
                    <button class="btn btn-secondary" onclick="window.location.href='mypage.html'">주문 내역 보기</button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // 3초 후 자동으로 홈으로 이동
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  }

  // 장바구니 저장
  saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(this.items));
    this.updateCartCount();
  }

  // 장바구니 수량 업데이트 (헤더)
  updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      const totalCount = this.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      cartCountElement.textContent = totalCount;
      cartCountElement.style.display = totalCount > 0 ? "inline" : "none";
    }
  }
}

// 장바구니에 아이템 추가하는 전역 함수
function addToCart(item) {
  const items = JSON.parse(localStorage.getItem("cartItems")) || [];

  // 기존 아이템이 있는지 확인
  const existingItemIndex = items.findIndex(
    (cartItem) => cartItem.id === item.id
  );

  if (existingItemIndex !== -1) {
    // 기존 아이템이 있으면 수량 증가
    items[existingItemIndex].quantity += 1;
  } else {
    // 새 아이템 추가
    items.push({
      ...item,
      quantity: 1,
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(items));

  // 장바구니 수량 업데이트
  updateCartCount();

  // 성공 메시지 표시
  showToast("장바구니에 추가되었습니다! 🛒");
}

// 장바구니 수량 업데이트 전역 함수
function updateCartCount() {
  const items = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    const totalCount = items.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalCount;
    cartCountElement.style.display = totalCount > 0 ? "inline" : "none";
  }
}

// 토스트 메시지 표시
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(toast);

  // 애니메이션
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 100);

  // 3초 후 제거
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 페이지 로드 시 CartManager 초기화
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-items")) {
    window.cartManager = new CartManager();
  }

  // 헤더 장바구니 수량 업데이트
  updateCartCount();
});
