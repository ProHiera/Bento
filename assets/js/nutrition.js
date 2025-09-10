// Nutrition Calculator Module
class NutritionCalculator {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const calculateBtn = document.getElementById("calculate-nutrition");
    if (calculateBtn) {
      calculateBtn.addEventListener(
        "click",
        this.calculateNutrition.bind(this)
      );
    }
  }

  calculateNutrition() {
    // Get form values
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = parseInt(document.getElementById("age").value);
    const height = parseInt(document.getElementById("height").value);
    const weight = parseInt(document.getElementById("weight").value);
    const targetWeight = parseInt(
      document.getElementById("target-weight").value
    );
    const activityLevel = parseFloat(
      document.getElementById("activity-level").value
    );

    // Validation
    if (
      !gender ||
      !age ||
      !height ||
      !weight ||
      !targetWeight ||
      !activityLevel
    ) {
      this.showError("모든 필드를 입력해주세요.");
      return;
    }

    if (age < 10 || age > 100) {
      this.showError("올바른 나이를 입력해주세요.");
      return;
    }

    if (height < 100 || height > 250) {
      this.showError("올바른 키를 입력해주세요.");
      return;
    }

    if (weight < 30 || weight > 300) {
      this.showError("올바른 체중을 입력해주세요.");
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    const bmr = this.calculateBMR(gender.value, age, height, weight);

    // Calculate TDEE
    const tdee = bmr * activityLevel;

    // Calculate diet calories (20% deficit for weight loss)
    const dietCalories = Math.round(tdee * 0.8);

    // Calculate macronutrients
    const macros = this.calculateMacros(dietCalories, weight, targetWeight);

    // Display results
    this.displayResults(bmr, tdee, dietCalories, macros);
  }

  calculateBMR(gender, age, height, weight) {
    if (gender === "male") {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  }

  calculateMacros(calories, currentWeight, targetWeight) {
    // Protein: 1.2-2.0g per kg of target body weight (use 1.6g)
    const protein = Math.round(targetWeight * 1.6);
    const proteinCalories = protein * 4;

    // Fat: 25-30% of total calories (use 25%)
    const fatCalories = Math.round(calories * 0.25);
    const fat = Math.round(fatCalories / 9);

    // Carbs: remaining calories
    const remainingCalories = calories - proteinCalories - fatCalories;
    const carbs = Math.round(remainingCalories / 4);

    return { protein, carbs, fat };
  }

  displayResults(bmr, tdee, dietCalories, macros) {
    // Update result elements
    document.getElementById(
      "bmr-result"
    ).textContent = `${bmr.toLocaleString()} kcal`;
    document.getElementById("tdee-result").textContent = `${Math.round(
      tdee
    ).toLocaleString()} kcal`;
    document.getElementById(
      "diet-calories"
    ).textContent = `${dietCalories.toLocaleString()} kcal`;
    document.getElementById(
      "recommended-protein"
    ).textContent = `${macros.protein}g`;
    document.getElementById(
      "recommended-carbs"
    ).textContent = `${macros.carbs}g`;
    document.getElementById("recommended-fat").textContent = `${macros.fat}g`;

    // Add animation to results
    this.animateResults();
  }

  animateResults() {
    const resultItems = document.querySelectorAll(".result-item");

    gsap.fromTo(
      resultItems,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }

  showError(message) {
    // Create temporary error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText = `
      background: #ef4444;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
    `;
    errorDiv.textContent = message;

    // Find the calculate button and insert error after it
    const calculateBtn = document.getElementById("calculate-nutrition");
    calculateBtn.parentNode.appendChild(errorDiv);

    // Remove error after 3 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 3000);
  }

  // Get nutrition recommendations based on user goals
  getNutritionRecommendations(bmr, tdee, goal = "weight-loss") {
    const recommendations = {
      "weight-loss": {
        calories: Math.round(tdee * 0.8),
        description: "체중 감량을 위한 칼로리 제한",
      },
      maintenance: {
        calories: Math.round(tdee),
        description: "현재 체중 유지를 위한 칼로리",
      },
      "muscle-gain": {
        calories: Math.round(tdee * 1.1),
        description: "근육 증가를 위한 칼로리 증가",
      },
    };

    return recommendations[goal] || recommendations["weight-loss"];
  }

  // Calculate daily water intake recommendation
  calculateWaterIntake(weight, activityLevel) {
    // Base water intake: 35ml per kg of body weight
    let waterIntake = weight * 35;

    // Add 500ml for each hour of exercise
    if (activityLevel >= 1.55) {
      waterIntake += 500;
    }
    if (activityLevel >= 1.725) {
      waterIntake += 500;
    }

    return Math.round(waterIntake);
  }

  // Export nutrition data for meal planning
  exportNutritionData() {
    const results = {
      bmr: document.getElementById("bmr-result").textContent,
      tdee: document.getElementById("tdee-result").textContent,
      dietCalories: document.getElementById("diet-calories").textContent,
      protein: document.getElementById("recommended-protein").textContent,
      carbs: document.getElementById("recommended-carbs").textContent,
      fat: document.getElementById("recommended-fat").textContent,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage for use in other modules
    localStorage.setItem("leanbento_nutrition_plan", JSON.stringify(results));

    return results;
  }

  // Load saved nutrition data
  loadSavedNutritionData() {
    const savedData = localStorage.getItem("leanbento_nutrition_plan");
    if (savedData) {
      const data = JSON.parse(savedData);

      // Check if data is not too old (7 days)
      const savedDate = new Date(data.timestamp);
      const now = new Date();
      const daysDiff = (now - savedDate) / (1000 * 60 * 60 * 24);

      if (daysDiff <= 7) {
        return data;
      }
    }
    return null;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new NutritionCalculator();
});

export default NutritionCalculator;
