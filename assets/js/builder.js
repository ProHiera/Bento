// Custom Builder Module
class CustomBuilder {
  constructor() {
    this.selectedIngredients = [];

    // Use global DataManager instance
    this.dataManager = window.dataManager || new DataManager();
    this.ingredients = this.dataManager.getIngredients();
    this.currentCategory = "base";

    console.log("CustomBuilder initialized");
    console.log("Available ingredients:", this.ingredients);

    this.setupEventListeners();
    this.loadIngredients();
  }

  setupEventListeners() {
    // Category buttons
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.switchCategory(e.target.dataset.category);
      });
    });

    // Add to cart button
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener(
        "click",
        this.addCustomBentoToCart.bind(this)
      );
    }
  }

  switchCategory(category) {
    this.currentCategory = category;

    // Update active button
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`[data-category="${category}"]`)
      .classList.add("active");

    // Load ingredients for the selected category
    this.loadIngredients();
  }

  loadIngredients() {
    const ingredientsGrid = document.getElementById("ingredients-grid");
    const categoryIngredients = this.ingredients[this.currentCategory] || [];

    console.log("Loading ingredients for category:", this.currentCategory);
    console.log("Ingredients found:", categoryIngredients.length);

    ingredientsGrid.innerHTML = "";

    if (categoryIngredients.length === 0) {
      ingredientsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
          <p>해당 카테고리에 재료가 없습니다.</p>
        </div>
      `;
      return;
    }

    categoryIngredients.forEach((ingredient) => {
      const ingredientElement = this.createIngredientElement(ingredient);
      ingredientsGrid.appendChild(ingredientElement);
    });

    console.log("Ingredients rendered successfully");
  }

  createIngredientElement(ingredient) {
    const div = document.createElement("div");
    div.className = "ingredient-item";
    div.dataset.ingredientId = ingredient.id;

    const isSelected = this.selectedIngredients.some(
      (item) => item.id === ingredient.id
    );
    if (isSelected) {
      div.classList.add("selected");
    }

    div.innerHTML = `
      ${this.renderIngredientIcon(ingredient.icon)}
      <div class="ingredient-name">${ingredient.name}</div>
      <div class="ingredient-nutrition">
        ${ingredient.nutrition.calories}kcal/100g
      </div>
      <div class="ingredient-price">${ingredient.pricePer100g.toLocaleString()}원/100g</div>
    `;

    div.addEventListener("click", () => {
      this.toggleIngredient(ingredient);
    });

    return div;
  }

  // Helper method to render ingredient icon (image or emoji)
  renderIngredientIcon(icon) {
    if (icon && icon.startsWith("http")) {
      return `<img src="${icon}" alt="재료 이미지" class="ingredient-icon" loading="lazy">`;
    } else if (icon && !icon.startsWith("http")) {
      return `<span class="ingredient-emoji" style="font-size: 2rem;">${icon}</span>`;
    } else {
      return `<div class="ingredient-no-image"></div>`;
    }
  }

  toggleIngredient(ingredient) {
    const existingIndex = this.selectedIngredients.findIndex(
      (item) => item.id === ingredient.id
    );

    if (existingIndex >= 0) {
      // Remove ingredient
      this.selectedIngredients.splice(existingIndex, 1);
    } else {
      // Add ingredient with default 100g
      this.selectedIngredients.push({
        ...ingredient,
        quantity: 100,
      });
    }

    this.updateSelectedIngredients();
    this.updateNutritionSummary();
    this.loadIngredients(); // Refresh to update selected state
  }

  updateSelectedIngredients() {
    const selectedContainer = document.getElementById("selected-ingredients");

    if (this.selectedIngredients.length === 0) {
      selectedContainer.innerHTML =
        '<p class="empty-state">재료를 선택해주세요</p>';
      return;
    }

    selectedContainer.innerHTML = "";

    this.selectedIngredients.forEach((ingredient) => {
      const ingredientDiv = document.createElement("div");
      ingredientDiv.className = "selected-ingredient";
      ingredientDiv.innerHTML = `
        <div class="ingredient-info">
          <span>${ingredient.icon} ${ingredient.name}</span>
        </div>
        <div class="ingredient-controls">
          <input type="number" 
                 class="quantity-input" 
                 value="${ingredient.quantity}" 
                 min="10" 
                 max="500" 
                 step="10"
                 onchange="builder.updateIngredientQuantity('${ingredient.id}', this.value)">
          <span>g</span>
          <button class="remove-btn" onclick="builder.removeIngredient('${ingredient.id}')">×</button>
        </div>
      `;

      selectedContainer.appendChild(ingredientDiv);
    });
  }

  updateIngredientQuantity(ingredientId, newQuantity) {
    const ingredient = this.selectedIngredients.find(
      (item) => item.id === ingredientId
    );
    if (ingredient) {
      ingredient.quantity = Math.max(
        10,
        Math.min(500, parseInt(newQuantity) || 100)
      );
      this.updateNutritionSummary();
    }
  }

  removeIngredient(ingredientId) {
    this.selectedIngredients = this.selectedIngredients.filter(
      (item) => item.id !== ingredientId
    );
    this.updateSelectedIngredients();
    this.updateNutritionSummary();
    this.loadIngredients(); // Refresh to update selected state
  }

  updateNutritionSummary() {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalPrice = 0;

    this.selectedIngredients.forEach((ingredient) => {
      const ratio = ingredient.quantity / 100;

      totalCalories += ingredient.nutrition.calories * ratio;
      totalProtein += ingredient.nutrition.protein * ratio;
      totalCarbs += ingredient.nutrition.carbs * ratio;
      totalFat += ingredient.nutrition.fat * ratio;
      totalPrice += ingredient.pricePer100g * ratio;
    });

    // Update display
    document.getElementById("total-calories").textContent = `${Math.round(
      totalCalories
    )} kcal`;
    document.getElementById("total-protein").textContent = `${
      Math.round(totalProtein * 10) / 10
    } g`;
    document.getElementById("total-carbs").textContent = `${
      Math.round(totalCarbs * 10) / 10
    } g`;
    document.getElementById("total-fat").textContent = `${
      Math.round(totalFat * 10) / 10
    } g`;
    document.getElementById("total-price").textContent = `${Math.round(
      totalPrice
    ).toLocaleString()}원`;

    // Save current build to localStorage for potential reuse
    this.saveBuild();
  }

  addCustomBentoToCart() {
    if (this.selectedIngredients.length === 0) {
      this.showMessage("재료를 선택해주세요.", "error");
      return;
    }

    // Calculate totals
    const nutrition = this.calculateTotalNutrition();
    const totalPrice = this.calculateTotalPrice();

    // Create custom bento item
    const customBento = {
      id: `custom-${Date.now()}`,
      name: "커스텀 도시락",
      description: this.generateDescription(),
      ingredients: [...this.selectedIngredients],
      nutrition,
      price: totalPrice,
      isCustom: true,
    };

    // Add to cart via main app
    if (window.app) {
      window.app.addToCart(customBento);
      this.showMessage("커스텀 도시락이 장바구니에 추가되었습니다!");
      this.clearBuild();
    }
  }

  calculateTotalNutrition() {
    let calories = 0,
      protein = 0,
      carbs = 0,
      fat = 0;

    this.selectedIngredients.forEach((ingredient) => {
      const ratio = ingredient.quantity / 100;
      calories += ingredient.nutrition.calories * ratio;
      protein += ingredient.nutrition.protein * ratio;
      carbs += ingredient.nutrition.carbs * ratio;
      fat += ingredient.nutrition.fat * ratio;
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
    };
  }

  calculateTotalPrice() {
    let totalPrice = 0;

    this.selectedIngredients.forEach((ingredient) => {
      const ratio = ingredient.quantity / 100;
      totalPrice += ingredient.pricePer100g * ratio;
    });

    return Math.round(totalPrice);
  }

  generateDescription() {
    const ingredientNames = this.selectedIngredients
      .slice(0, 3) // Show first 3 ingredients
      .map((ingredient) => ingredient.name);

    let description = ingredientNames.join(", ");

    if (this.selectedIngredients.length > 3) {
      description += ` 외 ${this.selectedIngredients.length - 3}가지`;
    }

    return description;
  }

  clearBuild() {
    this.selectedIngredients = [];
    this.updateSelectedIngredients();
    this.updateNutritionSummary();
    this.loadIngredients();
    localStorage.removeItem("leanbento_current_build");
  }

  saveBuild() {
    const buildData = {
      selectedIngredients: this.selectedIngredients,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("leanbento_current_build", JSON.stringify(buildData));
  }

  loadSavedBuild() {
    const savedBuild = localStorage.getItem("leanbento_current_build");
    if (savedBuild) {
      const buildData = JSON.parse(savedBuild);

      // Check if build is not too old (1 day)
      const savedDate = new Date(buildData.timestamp);
      const now = new Date();
      const hoursDiff = (now - savedDate) / (1000 * 60 * 60);

      if (hoursDiff <= 24) {
        this.selectedIngredients = buildData.selectedIngredients || [];
        this.updateSelectedIngredients();
        this.updateNutritionSummary();
        this.loadIngredients();
      }
    }
  }

  // Get nutrition analysis
  getNutritionAnalysis() {
    const nutrition = this.calculateTotalNutrition();

    // Get recommendations from nutrition calculator if available
    const savedNutritionPlan = localStorage.getItem("leanbento_nutrition_plan");
    let recommendations = null;

    if (savedNutritionPlan) {
      const plan = JSON.parse(savedNutritionPlan);
      recommendations = {
        calories: parseInt(plan.dietCalories.replace(/[^0-9]/g, "")),
        protein: parseInt(plan.protein.replace(/[^0-9]/g, "")),
        carbs: parseInt(plan.carbs.replace(/[^0-9]/g, "")),
        fat: parseInt(plan.fat.replace(/[^0-9]/g, "")),
      };
    }

    const analysis = {
      current: nutrition,
      recommendations,
      percentages: {},
    };

    if (recommendations) {
      analysis.percentages = {
        calories: Math.round(
          (nutrition.calories / recommendations.calories) * 100
        ),
        protein: Math.round(
          (nutrition.protein / recommendations.protein) * 100
        ),
        carbs: Math.round((nutrition.carbs / recommendations.carbs) * 100),
        fat: Math.round((nutrition.fat / recommendations.fat) * 100),
      };
    }

    return analysis;
  }

  showMessage(message, type = "success") {
    // Use the main app's notification system if available
    if (window.app && window.app.showNotification) {
      window.app.showNotification(message, type);
    } else {
      alert(message);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing CustomBuilder...");

  // Wait for DataManager to be available
  const initBuilder = () => {
    if (!window.dataManager) {
      console.log("Waiting for DataManager...");
      setTimeout(initBuilder, 100);
      return;
    }

    // Check if required elements exist
    const ingredientsGrid = document.getElementById("ingredients-grid");
    const categoryBtns = document.querySelectorAll(".category-btn");

    if (!ingredientsGrid) {
      console.error("ingredients-grid element not found!");
      return;
    }

    if (categoryBtns.length === 0) {
      console.error("category buttons not found!");
      return;
    }

    console.log("Required elements found, creating builder instance...");
    window.builder = new CustomBuilder();
    window.builder.loadSavedBuild();

    console.log("CustomBuilder initialization complete");
  };

  initBuilder();
});

export default CustomBuilder;
