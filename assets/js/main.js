// Main Application Module - Cleaned Version
class BentoApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadMenuItems();
    this.updateCartDisplay();
  }

  setupEventListeners() {
    // 메뉴 필터
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterMenuItems(e.target.dataset.filter);
      });
    });

    // 스크롤 네비게이션
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // 모바일 메뉴 토글
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
      });
    }

    // 메뉴 아이템 클릭 이벤트 (장바구니 추가)
    document.addEventListener('click', (e) => {
      if (e.target.matches('.add-to-cart-btn')) {
        const menuItem = e.target.closest('.menu-item');
        if (menuItem) {
          const itemData = this.getMenuItemData(menuItem);
          if (typeof addToCart === 'function') {
            addToCart(itemData);
          }
        }
      }
    });
  }

  // 메뉴 아이템 로드
  loadMenuItems() {
    if (!window.dataManager) return;

    const menuGrid = document.getElementById('menu-items');
    if (!menuGrid) return;

    const menuItems = window.dataManager.getMenuItems();
    this.renderMenuItems(menuItems);
  }

  // 메뉴 아이템 렌더링
  renderMenuItems(items) {
    const menuGrid = document.getElementById('menu-items');
    if (!menuGrid) return;

    menuGrid.innerHTML = '';

    items.forEach(item => {
      const menuElement = this.createMenuElement(item);
      menuGrid.appendChild(menuElement);
    });
  }

  // 메뉴 요소 생성
  createMenuElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.dataset.category = item.category;

    div.innerHTML = `
      <div class="menu-image">
        <img src="${item.image || 'assets/images/default-bento.jpg'}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-content">
        <h3>${item.name}</h3>
        <p class="menu-description">${item.description}</p>
        <div class="menu-nutrition">
          <span>칼로리: ${item.nutrition.calories}kcal</span>
          <span>단백질: ${item.nutrition.protein}g</span>
        </div>
        <div class="menu-footer">
          <span class="menu-price">${item.price.toLocaleString()}원</span>
          <button class="btn btn-primary add-to-cart-btn">담기</button>
        </div>
      </div>
    `;

    return div;
  }

  // 메뉴 필터링
  filterMenuItems(category) {
    // 활성 버튼 업데이트
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');

    // 메뉴 아이템 필터링
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // 메뉴 아이템 데이터 추출
  getMenuItemData(menuElement) {
    const name = menuElement.querySelector('h3').textContent;
    const description = menuElement.querySelector('.menu-description').textContent;
    const priceText = menuElement.querySelector('.menu-price').textContent;
    const price = parseInt(priceText.replace(/[^0-9]/g, ''));
    const image = menuElement.querySelector('img').src;
    const category = menuElement.dataset.category;

    return {
      id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      price,
      image,
      category,
      nutrition: {
        calories: 400,
        protein: 25
      }
    };
  }

  // 장바구니 표시 업데이트
  updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.textContent = totalCount;
    cartCount.style.display = totalCount > 0 ? 'inline' : 'none';
  }
}

// DOM 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  // DataManager 로드 대기
  const initApp = () => {
    if (!window.dataManager) {
      setTimeout(initApp, 100);
      return;
    }
    
    window.bentoApp = new BentoApp();
  };
  
  initApp();
});

// 전역 함수들
window.showToast = function(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 5px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 100);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

// 장바구니 업데이트 시 카운트 업데이트
document.addEventListener('cartUpdated', () => {
  if (window.bentoApp) {
    window.bentoApp.updateCartDisplay();
  }
});
