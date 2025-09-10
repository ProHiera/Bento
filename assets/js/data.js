// Data Management Module
class DataManager {
  constructor() {
    this.initializeData();
    // Temporarily force refresh menu data for salmon avocado bowl image fix
    localStorage.removeItem("leanbento_menu_items");
    this.initializeMenuItems();
  }

  initializeData() {
    // Initialize sample data if not exists
    if (!localStorage.getItem("leanbento_ingredients")) {
      this.initializeIngredients();
    }

    if (!localStorage.getItem("leanbento_menu_items")) {
      this.initializeMenuItems();
    }

    if (!localStorage.getItem("leanbento_reviews")) {
      this.initializeReviews();
    }
  }

  initializeIngredients() {
    const ingredients = {
      base: [
        {
          id: "brown-rice",
          name: "현미밥",
          icon: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 112, protein: 2.6, carbs: 23, fat: 0.9 },
          pricePer100g: 800,
          category: "base",
          description: "건강한 현미로 만든 밥",
          allergens: ["글루텐"],
          origin: "국산",
        },
        {
          id: "white-rice",
          name: "백미밥",
          icon: "https://images.unsplash.com/photo-1550461716-dbf266b2a8a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
          pricePer100g: 700,
          category: "base",
          description: "부드러운 백미밥",
          allergens: ["글루텐"],
          origin: "국산",
        },
        {
          id: "quinoa",
          name: "퀴노아",
          icon: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
          pricePer100g: 2000,
          category: "base",
          description: "슈퍼푸드 퀴노아",
          allergens: [],
          origin: "볼리비아",
        },
        {
          id: "sweet-potato",
          name: "고구마",
          icon: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
          pricePer100g: 1200,
          category: "base",
          description: "달콤한 고구마",
          allergens: [],
          origin: "국산",
        },
      ],
      protein: [
        {
          id: "chicken-breast",
          name: "닭가슴살",
          icon: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
          pricePer100g: 2500,
          category: "protein",
          description: "신선한 닭가슴살",
          allergens: [],
          origin: "국산",
        },
        {
          id: "salmon",
          name: "연어",
          icon: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 208, protein: 20, carbs: 0, fat: 13 },
          pricePer100g: 4000,
          category: "protein",
          description: "오메가3 풍부한 연어",
          allergens: ["생선"],
          origin: "노르웨이",
        },
        {
          id: "tofu",
          name: "두부",
          icon: "https://images.unsplash.com/photo-1600452160091-b4bf2a5bb37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
          pricePer100g: 1000,
          category: "protein",
          description: "부드러운 두부",
          allergens: ["대두"],
          origin: "국산",
        },
        {
          id: "eggs",
          name: "계란",
          icon: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
          pricePer100g: 1500,
          category: "protein",
          description: "신선한 계란",
          allergens: ["계란"],
          origin: "국산",
        },
        {
          id: "beef",
          name: "소고기",
          icon: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 250, protein: 26, carbs: 0, fat: 15 },
          pricePer100g: 5000,
          category: "protein",
          description: "프리미엄 소고기",
          allergens: [],
          origin: "한우",
        },
      ],
      vegetable: [
        {
          id: "broccoli",
          name: "브로콜리",
          icon: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
          pricePer100g: 800,
          category: "vegetable",
          description: "비타민 C 풍부한 브로콜리",
          allergens: [],
          origin: "국산",
        },
        {
          id: "spinach",
          name: "시금치",
          icon: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          pricePer100g: 600,
          category: "vegetable",
          description: "철분 풍부한 시금치",
          allergens: [],
          origin: "국산",
        },
        {
          id: "carrot",
          name: "당근",
          icon: "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
          pricePer100g: 500,
          category: "vegetable",
          description: "베타카로틴 풍부한 당근",
          allergens: [],
          origin: "국산",
        },
        {
          id: "bell-pepper",
          name: "파프리카",
          icon: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 31, protein: 1, carbs: 7, fat: 0.3 },
          pricePer100g: 1200,
          category: "vegetable",
          description: "알록달록 파프리카",
          allergens: [],
          origin: "국산",
        },
        {
          id: "cucumber",
          name: "오이",
          icon: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 16, protein: 0.7, carbs: 4, fat: 0.1 },
          pricePer100g: 400,
          category: "vegetable",
          description: "아삭한 오이",
          allergens: [],
          origin: "국산",
        },
        {
          id: "tomato",
          name: "토마토",
          icon: "https://images.unsplash.com/photo-1546470427-e5380b6d8e25?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
          pricePer100g: 700,
          category: "vegetable",
          description: "신선한 토마토",
          allergens: [],
          origin: "국산",
        },
      ],
      carb: [
        {
          id: "pasta",
          name: "파스타",
          icon: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
          pricePer100g: 1000,
          category: "carb",
          description: "듀럼밀 파스타",
          allergens: ["글루텐"],
          origin: "이탈리아",
        },
        {
          id: "bread",
          name: "통밀빵",
          icon: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 247, protein: 13, carbs: 41, fat: 4.2 },
          pricePer100g: 1500,
          category: "carb",
          description: "건강한 통밀빵",
          allergens: ["글루텐"],
          origin: "국산",
        },
        {
          id: "potato",
          name: "감자",
          icon: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
          pricePer100g: 600,
          category: "carb",
          description: "담백한 감자",
          allergens: [],
          origin: "국산",
        },
      ],
      sauce: [
        {
          id: "olive-oil",
          name: "올리브오일",
          icon: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 884, protein: 0, carbs: 0, fat: 100 },
          pricePer100g: 3000,
          category: "sauce",
          description: "엑스트라 버진 올리브오일",
          allergens: [],
          origin: "스페인",
        },
        {
          id: "balsamic",
          name: "발사믹식초",
          icon: "https://images.unsplash.com/photo-1506368083636-6defb67639a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 88, protein: 0.5, carbs: 17, fat: 0 },
          pricePer100g: 2500,
          category: "sauce",
          description: "이탈리아 발사믹식초",
          allergens: [],
          origin: "이탈리아",
        },
        {
          id: "sesame-oil",
          name: "참기름",
          icon: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 884, protein: 0, carbs: 0, fat: 100 },
          pricePer100g: 4000,
          category: "sauce",
          description: "고소한 참기름",
          allergens: ["참깨"],
          origin: "국산",
        },
        {
          id: "soy-sauce",
          name: "간장",
          icon: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          nutrition: { calories: 8, protein: 1.3, carbs: 0.8, fat: 0 },
          pricePer100g: 800,
          category: "sauce",
          description: "진간장",
          allergens: ["대두"],
          origin: "국산",
        },
      ],
    };

    localStorage.setItem("leanbento_ingredients", JSON.stringify(ingredients));
  }

  initializeMenuItems() {
    const menuItems = [
      {
        id: 1,
        name: "단백질 파워 도시락",
        description: "닭가슴살, 브로콜리, 현미밥의 완벽한 조합",
        category: "protein",
        image:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        nutrition: {
          calories: 450,
          protein: 35,
          carbs: 40,
          fat: 12,
          fiber: 8,
          sodium: 680,
        },
        price: 8500,
        ingredients: ["chicken-breast", "broccoli", "brown-rice"],
        tags: ["고단백", "저지방", "다이어트"],
        preparationTime: 15,
        popularity: 95,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
      },
      {
        id: 2,
        name: "채식주의자 도시락",
        description: "신선한 채소와 퀴노아로 만한 건강한 한 끼",
        category: "vegetarian",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        nutrition: {
          calories: 320,
          protein: 15,
          carbs: 45,
          fat: 8,
          fiber: 12,
          sodium: 420,
        },
        price: 7500,
        ingredients: ["quinoa", "spinach", "tomato", "bell-pepper"],
        tags: ["채식", "비건", "글루텐프리"],
        preparationTime: 12,
        popularity: 78,
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
      },
      {
        id: 3,
        name: "저탄수화물 도시락",
        description: "탄수화물을 줄이고 단백질과 채소를 늘린 도시락",
        category: "low-carb",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        nutrition: {
          calories: 380,
          protein: 40,
          carbs: 15,
          fat: 18,
          fiber: 6,
          sodium: 750,
        },
        price: 9000,
        ingredients: ["beef", "broccoli", "spinach"],
        tags: ["저탄수", "케토", "고단백"],
        preparationTime: 18,
        popularity: 82,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
      },
      {
        id: 4,
        name: "균형 도시락",
        description: "모든 영양소가 균형잡힌 건강한 도시락",
        category: "balanced",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        nutrition: {
          calories: 420,
          protein: 25,
          carbs: 35,
          fat: 15,
          fiber: 9,
          sodium: 620,
        },
        price: 8000,
        ingredients: ["chicken-breast", "sweet-potato", "carrot", "broccoli"],
        tags: ["균형식", "표준"],
        preparationTime: 15,
        popularity: 88,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
      },
      {
        id: 5,
        name: "연어 아보카도 볼",
        description: "오메가3 풍부한 연어와 아보카도 조합",
        category: "protein",
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        nutrition: {
          calories: 480,
          protein: 28,
          carbs: 25,
          fat: 28,
          fiber: 10,
          sodium: 590,
        },
        price: 12000,
        ingredients: ["salmon", "quinoa", "cucumber"],
        tags: ["프리미엄", "오메가3", "건강"],
        preparationTime: 20,
        popularity: 91,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
      },
      {
        id: 6,
        name: "비건 단백질 볼",
        description: "두부와 채소로 만든 건강한 비건 도시락",
        category: "vegetarian",
        image:
          "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        nutrition: {
          calories: 290,
          protein: 18,
          carbs: 35,
          fat: 10,
          fiber: 14,
          sodium: 480,
        },
        price: 7000,
        ingredients: ["tofu", "quinoa", "spinach", "carrot"],
        tags: ["비건", "저칼로리", "고섬유"],
        preparationTime: 14,
        popularity: 73,
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
      },
    ];

    localStorage.setItem("leanbento_menu_items", JSON.stringify(menuItems));
  }

  initializeReviews() {
    const reviews = [
      {
        id: 1,
        name: "김민수",
        rating: 5,
        text: "정말 맛있고 영양소 계산이 정확해요! 다이어트에 큰 도움이 되고 있습니다. 배송도 빠르고 포장도 깔끔해서 만족합니다.",
        date: "2024-01-15",
        menuItem: "단백질 파워 도시락",
        verified: true,
        helpful: 23,
      },
      {
        id: 2,
        name: "박지영",
        rating: 5,
        text: "커스텀 빌더가 너무 좋아요. 서브웨이처럼 재료를 직접 선택할 수 있어서 만족도가 높습니다. 알러지가 있는 저에게는 정말 유용한 기능이에요.",
        date: "2024-01-10",
        menuItem: "채식주의자 도시락",
        verified: true,
        helpful: 18,
      },
      {
        id: 3,
        name: "이준호",
        rating: 4,
        text: "배송도 빠르고 포장도 깔끔해요. 정기구독 서비스 덕분에 식단 관리가 편해졌습니다. 가격 대비 만족도가 높아요.",
        date: "2024-01-08",
        menuItem: "균형 도시락",
        verified: true,
        helpful: 15,
      },
      {
        id: 4,
        name: "최수연",
        rating: 5,
        text: "영양 계산기로 제 몸에 맞는 칼로리를 계산하고, 그에 맞는 도시락을 주문할 수 있어서 정말 편리해요. 3개월 구독 중인데 체중이 5kg 줄었어요!",
        date: "2024-01-05",
        menuItem: "저탄수화물 도시락",
        verified: true,
        helpful: 31,
      },
      {
        id: 5,
        name: "정우진",
        rating: 4,
        text: "연어 도시락이 정말 맛있어요. 가격이 조금 비싸긴 하지만 퀄리티를 생각하면 합리적인 것 같습니다. 멤버십 할인도 있어서 좋아요.",
        date: "2024-01-03",
        menuItem: "연어 아보카도 볼",
        verified: true,
        helpful: 12,
      },
      {
        id: 6,
        name: "강민정",
        rating: 5,
        text: "비건 도시락을 찾기 어려웠는데 여기서 해결했어요. 단백질도 충분하고 맛도 좋습니다. 다크모드 UI도 예뻐요!",
        date: "2024-01-01",
        menuItem: "비건 단백질 볼",
        verified: true,
        helpful: 9,
      },
    ];

    localStorage.setItem("leanbento_reviews", JSON.stringify(reviews));
  }

  // Get ingredients by category
  getIngredients(category = null) {
    const ingredients =
      JSON.parse(localStorage.getItem("leanbento_ingredients")) || {};

    if (category) {
      return ingredients[category] || [];
    }

    return ingredients;
  }

  // Get menu items with filtering
  getMenuItems(filters = {}) {
    const menuItems =
      JSON.parse(localStorage.getItem("leanbento_menu_items")) || [];

    let filteredItems = [...menuItems];

    // Filter by category
    if (filters.category) {
      filteredItems = filteredItems.filter(
        (item) => item.category === filters.category
      );
    }

    // Filter by dietary restrictions
    if (filters.isVegetarian) {
      filteredItems = filteredItems.filter((item) => item.isVegetarian);
    }

    if (filters.isVegan) {
      filteredItems = filteredItems.filter((item) => item.isVegan);
    }

    if (filters.isGlutenFree) {
      filteredItems = filteredItems.filter((item) => item.isGlutenFree);
    }

    // Filter by nutrition ranges
    if (filters.calorieRange) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.nutrition.calories >= filters.calorieRange.min &&
          item.nutrition.calories <= filters.calorieRange.max
      );
    }

    if (filters.proteinRange) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.nutrition.protein >= filters.proteinRange.min &&
          item.nutrition.protein <= filters.proteinRange.max
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.price >= filters.priceRange.min &&
          item.price <= filters.priceRange.max
      );
    }

    // Sort by criteria
    if (filters.sortBy) {
      filteredItems.sort((a, b) => {
        switch (filters.sortBy) {
          case "popularity":
            return b.popularity - a.popularity;
          case "price_low":
            return a.price - b.price;
          case "price_high":
            return b.price - a.price;
          case "calories_low":
            return a.nutrition.calories - b.nutrition.calories;
          case "calories_high":
            return b.nutrition.calories - a.nutrition.calories;
          case "protein_high":
            return b.nutrition.protein - a.nutrition.protein;
          default:
            return 0;
        }
      });
    }

    return filteredItems;
  }

  // Get reviews with filtering
  getReviews(filters = {}) {
    const reviews = JSON.parse(localStorage.getItem("leanbento_reviews")) || [];

    let filteredReviews = [...reviews];

    // Filter by rating
    if (filters.minRating) {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating >= filters.minRating
      );
    }

    // Filter by menu item
    if (filters.menuItem) {
      filteredReviews = filteredReviews.filter(
        (review) => review.menuItem === filters.menuItem
      );
    }

    // Filter verified only
    if (filters.verifiedOnly) {
      filteredReviews = filteredReviews.filter((review) => review.verified);
    }

    // Sort by criteria
    if (filters.sortBy) {
      filteredReviews.sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return new Date(b.date) - new Date(a.date);
          case "oldest":
            return new Date(a.date) - new Date(b.date);
          case "highest_rating":
            return b.rating - a.rating;
          case "most_helpful":
            return b.helpful - a.helpful;
          default:
            return 0;
        }
      });
    } else {
      // Default sort by newest
      filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filteredReviews;
  }

  // Get nutrition facts for an ingredient
  getIngredientNutrition(ingredientId, quantity = 100) {
    const allIngredients = this.getIngredients();

    let ingredient = null;
    for (const category in allIngredients) {
      ingredient = allIngredients[category].find(
        (item) => item.id === ingredientId
      );
      if (ingredient) break;
    }

    if (!ingredient) return null;

    const ratio = quantity / 100;

    return {
      calories: Math.round(ingredient.nutrition.calories * ratio),
      protein: Math.round(ingredient.nutrition.protein * ratio * 10) / 10,
      carbs: Math.round(ingredient.nutrition.carbs * ratio * 10) / 10,
      fat: Math.round(ingredient.nutrition.fat * ratio * 10) / 10,
      fiber: ingredient.nutrition.fiber
        ? Math.round(ingredient.nutrition.fiber * ratio * 10) / 10
        : 0,
      sodium: ingredient.nutrition.sodium
        ? Math.round(ingredient.nutrition.sodium * ratio)
        : 0,
    };
  }

  // Add new review
  addReview(reviewData) {
    const reviews = this.getReviews();
    const newReview = {
      id: Date.now(),
      ...reviewData,
      date: new Date().toISOString().split("T")[0],
      verified: false,
      helpful: 0,
    };

    reviews.unshift(newReview);
    localStorage.setItem("leanbento_reviews", JSON.stringify(reviews));

    return newReview;
  }

  // Get popular ingredients
  getPopularIngredients(limit = 5) {
    const allIngredients = this.getIngredients();
    const ingredientsList = [];

    for (const category in allIngredients) {
      ingredientsList.push(...allIngredients[category]);
    }

    // Sort by a popularity score (could be based on usage in orders)
    return ingredientsList
      .sort(
        (a, b) =>
          b.nutrition.protein +
          b.nutrition.calories / 10 -
          (a.nutrition.protein + a.nutrition.calories / 10)
      )
      .slice(0, limit);
  }

  // Get nutrition recommendations based on user profile
  getNutritionRecommendations(userProfile) {
    const { age, gender, weight, height, activityLevel, goal } = userProfile;

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevel;

    let targetCalories;
    switch (goal) {
      case "lose":
        targetCalories = tdee * 0.8; // 20% deficit
        break;
      case "gain":
        targetCalories = tdee * 1.1; // 10% surplus
        break;
      default:
        targetCalories = tdee; // maintenance
    }

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(weight * 1.6), // 1.6g per kg
      carbs: Math.round((targetCalories * 0.4) / 4), // 40% of calories
      fat: Math.round((targetCalories * 0.25) / 9), // 25% of calories
      fiber: Math.round(25 + (targetCalories - 2000) / 100), // Base 25g + adjustment
    };
  }

  // Search functionality
  search(query, type = "all") {
    const results = {
      menuItems: [],
      ingredients: [],
      reviews: [],
    };

    const searchTerm = query.toLowerCase();

    if (type === "all" || type === "menu") {
      const menuItems = this.getMenuItems();
      results.menuItems = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (type === "all" || type === "ingredients") {
      const allIngredients = this.getIngredients();
      const ingredientsList = [];

      for (const category in allIngredients) {
        ingredientsList.push(...allIngredients[category]);
      }

      results.ingredients = ingredientsList.filter(
        (ingredient) =>
          ingredient.name.toLowerCase().includes(searchTerm) ||
          ingredient.description.toLowerCase().includes(searchTerm)
      );
    }

    if (type === "all" || type === "reviews") {
      const reviews = this.getReviews();
      results.reviews = reviews.filter(
        (review) =>
          review.text.toLowerCase().includes(searchTerm) ||
          review.menuItem.toLowerCase().includes(searchTerm)
      );
    }

    return results;
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    const keys = [
      "leanbento_ingredients",
      "leanbento_menu_items",
      "leanbento_reviews",
      "leanbento_cart",
      "leanbento_orders",
      "leanbento_subscriptions",
      "leanbento_user",
      "leanbento_theme",
      "leanbento_nutrition_plan",
      "leanbento_weekly_plan",
    ];

    keys.forEach((key) => localStorage.removeItem(key));
    this.initializeData();
  }

  // Force refresh menu data for image fixes
  resetMenuData() {
    localStorage.removeItem("leanbento_menu_items");
    this.initializeMenuItems();
  }
}

// Initialize data manager
window.dataManager = new DataManager();

export default DataManager;
