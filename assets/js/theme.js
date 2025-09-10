// Theme Management Module
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || "light";
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
    this.setupSystemThemeDetection();
  }

  setupEventListeners() {
    // Theme toggle button
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", this.toggleTheme.bind(this));
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!this.hasUserPreference()) {
            this.applyTheme(e.matches ? "dark" : "light");
          }
        });
    }
  }

  setupSystemThemeDetection() {
    // Apply system theme if no user preference exists
    if (!this.hasUserPreference() && window.matchMedia) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      this.currentTheme = prefersDark ? "dark" : "light";
      this.applyTheme(this.currentTheme);
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.storeTheme(theme);
    this.updateThemeToggleButton();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // Add smooth transition for theme change
    document.documentElement.style.transition = "all 0.3s ease";

    // Remove transition after theme change completes
    setTimeout(() => {
      document.documentElement.style.transition = "";
    }, 300);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);

    // Trigger custom event for other modules
    this.dispatchThemeChangeEvent(theme);
  }

  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }

    const colors = {
      light: "#FFFFFF",
      dark: "#0F172A",
    };

    metaThemeColor.content = colors[theme] || colors.light;
  }

  updateThemeToggleButton() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      const iconData = {
        light: {
          icon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
          title: "다크모드로 변경",
        },
        dark: {
          icon: '<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/><circle cx="12" cy="12" r="5"/>',
          title: "라이트모드로 변경",
        },
      };

      const currentIcon = iconData[this.currentTheme];
      themeToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${currentIcon.icon}</svg>`;
      themeToggle.setAttribute("aria-label", currentIcon.title);
    }
  }

  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent("themeChanged", {
      detail: { theme },
    });
    document.dispatchEvent(event);
  }

  storeTheme(theme) {
    try {
      localStorage.setItem("leanbento_theme", theme);
    } catch (error) {
      console.warn("Failed to store theme preference:", error);
    }
  }

  getStoredTheme() {
    try {
      return localStorage.getItem("leanbento_theme");
    } catch (error) {
      console.warn("Failed to retrieve stored theme:", error);
      return null;
    }
  }

  hasUserPreference() {
    return this.getStoredTheme() !== null;
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Check if dark theme is active
  isDarkTheme() {
    return this.currentTheme === "dark";
  }

  // Get theme-appropriate colors
  getThemeColors() {
    const colors = {
      light: {
        primary: "#18A05E",
        secondary: "#7BDCB5",
        background: "#FFFFFF",
        surface: "#F8FAFC",
        text: "#0F172A",
        textSecondary: "#64748B",
      },
      dark: {
        primary: "#18A05E",
        secondary: "#7BDCB5",
        background: "#0F172A",
        surface: "#1E293B",
        text: "#F8FAFC",
        textSecondary: "#94A3B8",
      },
    };

    return colors[this.currentTheme] || colors.light;
  }

  // Apply theme to specific elements
  applyThemeToElement(element, customStyles = {}) {
    const colors = this.getThemeColors();

    const defaultStyles = {
      backgroundColor: colors.surface,
      color: colors.text,
      borderColor: colors.textSecondary + "20", // 20% opacity
      ...customStyles,
    };

    Object.assign(element.style, defaultStyles);
  }

  // Create theme-aware CSS custom properties
  setCSSCustomProperties() {
    const colors = this.getThemeColors();
    const root = document.documentElement;

    Object.entries(colors).forEach(([name, value]) => {
      root.style.setProperty(`--theme-${name}`, value);
    });
  }

  // Auto theme based on time of day
  enableAutoTheme() {
    const hour = new Date().getHours();
    const autoTheme = hour >= 18 || hour <= 6 ? "dark" : "light";

    if (this.currentTheme !== autoTheme) {
      this.setTheme(autoTheme);
    }

    // Set up interval to check time changes
    this.autoThemeInterval = setInterval(() => {
      const currentHour = new Date().getHours();
      const newAutoTheme =
        currentHour >= 18 || currentHour <= 6 ? "dark" : "light";

      if (this.currentTheme !== newAutoTheme) {
        this.setTheme(newAutoTheme);
      }
    }, 60000); // Check every minute
  }

  disableAutoTheme() {
    if (this.autoThemeInterval) {
      clearInterval(this.autoThemeInterval);
      this.autoThemeInterval = null;
    }
  }

  // Theme transition animations
  animateThemeTransition() {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${this.currentTheme === "dark" ? "#FFFFFF" : "#0F172A"};
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(overlay);

    // Animate overlay in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    // Change theme and animate out
    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    }, 150);
  }

  // Get theme preferences for different components
  getComponentTheme(component) {
    const themes = {
      navbar: {
        light: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(0, 0, 0, 0.1)",
        },
        dark: {
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
      },
      card: {
        light: {
          background: "rgba(255, 255, 255, 0.8)",
          borderColor: "rgba(0, 0, 0, 0.1)",
          shadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
        dark: {
          background: "rgba(30, 41, 59, 0.8)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          shadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      },
    };

    return themes[component]?.[this.currentTheme] || {};
  }

  // Save user's theme preferences
  saveThemePreferences(preferences) {
    const themePrefs = {
      theme: this.currentTheme,
      autoTheme: preferences.autoTheme || false,
      followSystem: preferences.followSystem || false,
      ...preferences,
    };

    try {
      localStorage.setItem(
        "leanbento_theme_preferences",
        JSON.stringify(themePrefs)
      );
    } catch (error) {
      console.warn("Failed to save theme preferences:", error);
    }
  }

  // Load user's theme preferences
  loadThemePreferences() {
    try {
      const preferences = localStorage.getItem("leanbento_theme_preferences");
      return preferences ? JSON.parse(preferences) : {};
    } catch (error) {
      console.warn("Failed to load theme preferences:", error);
      return {};
    }
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.themeManager = new ThemeManager();
});

// Export for use in other modules
export default ThemeManager;
