// Subscription Planner Module
class SubscriptionPlanner {
  constructor() {
    this.weeklyMeals = {};
    this.currentWeek = this.getCurrentWeek();
    this.setupEventListeners();
    this.initializeWeekGrid();
    this.loadSavedPlan();
  }

  setupEventListeners() {
    // Week navigation
    document.getElementById("prev-week").addEventListener("click", () => {
      this.navigateWeek(-1);
    });

    document.getElementById("next-week").addEventListener("click", () => {
      this.navigateWeek(1);
    });

    // Subscription options
    document
      .getElementById("delivery-cycle")
      .addEventListener("change", this.updateSubscriptionSummary.bind(this));
    document
      .getElementById("delivery-time")
      .addEventListener("change", this.updateSubscriptionSummary.bind(this));

    // Start subscription button
    document
      .getElementById("start-subscription")
      .addEventListener("click", this.startSubscription.bind(this));
  }

  getCurrentWeek() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }

  navigateWeek(direction) {
    this.currentWeek += direction;
    this.updateWeekDisplay();
    this.initializeWeekGrid();
  }

  updateWeekDisplay() {
    const weekLabel = document.getElementById("current-week");
    const year = new Date().getFullYear();
    weekLabel.textContent = `${year}년 ${this.currentWeek}주차`;
  }

  initializeWeekGrid() {
    const weekGrid = document.getElementById("week-grid");
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    weekGrid.innerHTML = "";

    days.forEach((day, index) => {
      const daySlot = this.createDaySlot(day, index);
      weekGrid.appendChild(daySlot);
    });

    this.updateSubscriptionSummary();
  }

  createDaySlot(dayName, dayIndex) {
    const slot = document.createElement("div");
    slot.className = "day-slot";
    slot.dataset.day = dayIndex;

    const weekKey = `${this.currentWeek}-${dayIndex}`;
    const meal = this.weeklyMeals[weekKey];

    if (meal) {
      slot.classList.add("has-meal");
      slot.innerHTML = `
        <div class="day-name">${dayName}</div>
        <div class="meal-preview">
          <div class="meal-name">${meal.name}</div>
          <div class="meal-calories">${meal.nutrition.calories}kcal</div>
          <div class="meal-price">${meal.price.toLocaleString()}원</div>
        </div>
        <button class="remove-meal-btn" onclick="planner.removeMeal(${dayIndex})">×</button>
      `;
    } else {
      slot.innerHTML = `
        <div class="day-name">${dayName}</div>
        <div class="add-meal-text">+ 도시락 추가</div>
      `;
    }

    // Add click handler for adding meals
    if (!meal) {
      slot.addEventListener("click", () => {
        this.showMealSelector(dayIndex);
      });
    }

    // Make droppable
    this.makeDragDroppable(slot, dayIndex);

    return slot;
  }

  makeDragDroppable(slot, dayIndex) {
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("drag-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("drag-over");
    });

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("drag-over");

      const mealData = e.dataTransfer.getData("text/plain");
      if (mealData) {
        try {
          const meal = JSON.parse(mealData);
          this.addMealToDay(dayIndex, meal);
        } catch (error) {
          console.error("Error parsing dropped meal data:", error);
        }
      }
    });
  }

  showMealSelector(dayIndex) {
    // Create modal for meal selection
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
      <div class="modal-content glass-card" style="max-width: 800px;">
        <div class="modal-header">
          <h3>도시락 선택</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="meal-selector-tabs">
            <button class="tab-btn active" data-tab="menu">메뉴</button>
            <button class="tab-btn" data-tab="custom">커스텀</button>
          </div>
          <div class="meal-options" id="meal-options">
            <!-- Meal options will be loaded here -->
          </div>
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

    // Setup tab switching
    modal.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        modal
          .querySelectorAll(".tab-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.loadMealOptions(e.target.dataset.tab, modal, dayIndex);
      });
    });

    // Load initial meal options
    this.loadMealOptions("menu", modal, dayIndex);
  }

  loadMealOptions(tab, modal, dayIndex) {
    const mealOptions = modal.querySelector("#meal-options");

    if (tab === "menu") {
      // Load regular menu items
      const menuItems = this.getMenuItems();
      mealOptions.innerHTML = "";

      menuItems.forEach((item) => {
        const mealCard = document.createElement("div");
        mealCard.className = "meal-option-card";
        mealCard.innerHTML = `
          <div class="meal-image">${item.image}</div>
          <div class="meal-info">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <div class="meal-nutrition">
              ${item.nutrition.calories}kcal | 
              단백질 ${item.nutrition.protein}g | 
              ${item.price.toLocaleString()}원
            </div>
          </div>
        `;

        mealCard.addEventListener("click", () => {
          this.addMealToDay(dayIndex, item);
          document.body.removeChild(modal);
        });

        mealOptions.appendChild(mealCard);
      });
    } else if (tab === "custom") {
      // Show option to create custom meal
      mealOptions.innerHTML = `
        <div class="custom-meal-option">
          <div class="custom-meal-info">
            <h4>커스텀 도시락 만들기</h4>
            <p>원하는 재료를 직접 선택하여 나만의 도시락을 만드세요</p>
            <button class="btn btn-primary" onclick="this.goToBuilder()">빌더로 이동</button>
          </div>
        </div>
      `;
    }
  }

  goToBuilder() {
    // Close modal and navigate to builder
    document.querySelector(".modal.active").remove();
    document.getElementById("builder").scrollIntoView({ behavior: "smooth" });
  }

  addMealToDay(dayIndex, meal) {
    const weekKey = `${this.currentWeek}-${dayIndex}`;
    this.weeklyMeals[weekKey] = meal;

    this.savePlan();
    this.initializeWeekGrid();
    this.updateSubscriptionSummary();
  }

  removeMeal(dayIndex) {
    const weekKey = `${this.currentWeek}-${dayIndex}`;
    delete this.weeklyMeals[weekKey];

    this.savePlan();
    this.initializeWeekGrid();
    this.updateSubscriptionSummary();
  }

  updateSubscriptionSummary() {
    const currentWeekMeals = this.getCurrentWeekMeals();
    const totalMeals = currentWeekMeals.length;
    const totalCost = currentWeekMeals.reduce(
      (sum, meal) => sum + meal.price,
      0
    );

    document.getElementById("weekly-count").textContent = `${totalMeals}개`;
    document.getElementById(
      "weekly-cost"
    ).textContent = `${totalCost.toLocaleString()}원`;
  }

  getCurrentWeekMeals() {
    const meals = [];
    for (let i = 0; i < 7; i++) {
      const weekKey = `${this.currentWeek}-${i}`;
      if (this.weeklyMeals[weekKey]) {
        meals.push(this.weeklyMeals[weekKey]);
      }
    }
    return meals;
  }

  startSubscription() {
    const currentWeekMeals = this.getCurrentWeekMeals();

    if (currentWeekMeals.length === 0) {
      this.showMessage("먼저 도시락을 선택해주세요.", "error");
      return;
    }

    const deliveryCycle = document.getElementById("delivery-cycle").value;
    const deliveryTime = document.getElementById("delivery-time").value;

    const subscriptionData = {
      meals: currentWeekMeals,
      cycle: deliveryCycle,
      time: deliveryTime,
      startDate: this.getWeekStartDate(),
      weeklyPlan: this.weeklyMeals,
      totalCost: currentWeekMeals.reduce((sum, meal) => sum + meal.price, 0),
    };

    // Save subscription
    this.saveSubscription(subscriptionData);

    // Show confirmation
    this.showSubscriptionConfirmation(subscriptionData);
  }

  getWeekStartDate() {
    const now = new Date();
    const currentDay = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDay + 1);
    return monday.toISOString().split("T")[0];
  }

  showSubscriptionConfirmation(subscriptionData) {
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
      <div class="modal-content glass-card">
        <div class="modal-header">
          <h3>구독 신청 완료</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="subscription-confirmation">
            <div class="confirmation-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <h4>구독이 성공적으로 신청되었습니다!</h4>
            <div class="subscription-details">
              <div class="detail-item">
                <span>주간 도시락 수:</span>
                <span>${subscriptionData.meals.length}개</span>
              </div>
              <div class="detail-item">
                <span>배송 주기:</span>
                <span>${this.getCycleText(subscriptionData.cycle)}</span>
              </div>
              <div class="detail-item">
                <span>배송 시간:</span>
                <span>${this.getTimeText(subscriptionData.time)}</span>
              </div>
              <div class="detail-item">
                <span>주간 비용:</span>
                <span>${subscriptionData.totalCost.toLocaleString()}원</span>
              </div>
              <div class="detail-item">
                <span>첫 배송일:</span>
                <span>${subscriptionData.startDate}</span>
              </div>
            </div>
            <p class="confirmation-note">
              구독 관리는 마이페이지에서 하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".modal-close").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  getCycleText(cycle) {
    const cycles = {
      weekly: "매주",
      biweekly: "격주",
      monthly: "매월",
    };
    return cycles[cycle] || cycle;
  }

  getTimeText(time) {
    const times = {
      morning: "오전 (9-12시)",
      afternoon: "오후 (1-6시)",
      evening: "저녁 (6-9시)",
    };
    return times[time] || time;
  }

  savePlan() {
    const planData = {
      weeklyMeals: this.weeklyMeals,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("leanbento_weekly_plan", JSON.stringify(planData));
  }

  loadSavedPlan() {
    const savedPlan = localStorage.getItem("leanbento_weekly_plan");
    if (savedPlan) {
      const planData = JSON.parse(savedPlan);
      this.weeklyMeals = planData.weeklyMeals || {};
      this.initializeWeekGrid();
    }
  }

  saveSubscription(subscriptionData) {
    const subscriptions =
      JSON.parse(localStorage.getItem("leanbento_subscriptions")) || [];
    subscriptions.push({
      ...subscriptionData,
      id: Date.now(),
      status: "active",
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem(
      "leanbento_subscriptions",
      JSON.stringify(subscriptions)
    );
  }

  getMenuItems() {
    // Return sample menu items - in real app, this would come from API
    return [
      {
        id: 1,
        name: "단백질 파워 도시락",
        description: "닭가슴살, 브로콜리, 현미밥의 완벽한 조합",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        nutrition: { calories: 450, protein: 35, carbs: 40, fat: 12 },
        price: 8500,
      },
      {
        id: 2,
        name: "채식주의자 도시락",
        description: "신선한 채소와 퀴노아로 만든 건강한 한 끼",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        nutrition: { calories: 320, protein: 15, carbs: 45, fat: 8 },
        price: 7500,
      },
      {
        id: 3,
        name: "저탄수화물 도시락",
        description: "탄수화물을 줄이고 단백질과 채소를 늘린 도시락",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        nutrition: { calories: 380, protein: 40, carbs: 15, fat: 18 },
        price: 9000,
      },
      {
        id: 4,
        name: "균형 도시락",
        description: "모든 영양소가 균형잡힌 표준 도시락",
        image:
          "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        nutrition: { calories: 420, protein: 25, carbs: 35, fat: 15 },
        price: 8000,
      },
    ];
  }

  // Get subscription analytics
  getSubscriptionAnalytics() {
    const subscriptions =
      JSON.parse(localStorage.getItem("leanbento_subscriptions")) || [];
    const currentWeekMeals = this.getCurrentWeekMeals();

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter((s) => s.status === "active")
        .length,
      weeklyMealsCount: currentWeekMeals.length,
      weeklyCalories: currentWeekMeals.reduce(
        (sum, meal) => sum + meal.nutrition.calories,
        0
      ),
      weeklyCost: currentWeekMeals.reduce((sum, meal) => sum + meal.price, 0),
      avgMealPrice:
        currentWeekMeals.length > 0
          ? currentWeekMeals.reduce((sum, meal) => sum + meal.price, 0) /
            currentWeekMeals.length
          : 0,
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
  window.planner = new SubscriptionPlanner();
});

export default SubscriptionPlanner;
