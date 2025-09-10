// Contact Page JavaScript
class ContactPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupAnimations();
    this.setupFAQ();
  }

  setupEventListeners() {
    // Contact form
    document.getElementById("contact-form")?.addEventListener("submit", (e) => {
      this.handleContactSubmit(e);
    });

    // FAQ items
    document.querySelectorAll(".faq-question").forEach((question) => {
      question.addEventListener("click", (e) => {
        this.toggleFAQ(e.target.closest(".faq-item"));
      });
    });
  }

  setupAnimations() {
    // Page header animation
    gsap.from(".page-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".page-subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out",
    });

    // Contact form animation
    gsap.from(".contact-form", {
      x: -50,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
      ease: "power3.out",
    });

    // Contact info animation
    gsap.from(".contact-info", {
      x: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: "power3.out",
    });

    // Contact items stagger animation
    gsap.from(".contact-item", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.8,
      ease: "power3.out",
    });
  }

  setupFAQ() {
    // Initialize FAQ state
    document.querySelectorAll(".faq-item").forEach((item) => {
      const answer = item.querySelector(".faq-answer");
      answer.style.maxHeight = "0";
    });
  }

  toggleFAQ(faqItem) {
    const answer = faqItem.querySelector(".faq-answer");
    const isActive = faqItem.classList.contains("active");

    // Close all other FAQ items
    document.querySelectorAll(".faq-item").forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove("active");
        const otherAnswer = item.querySelector(".faq-answer");
        otherAnswer.style.maxHeight = "0";
      }
    });

    // Toggle current FAQ item
    if (isActive) {
      faqItem.classList.remove("active");
      answer.style.maxHeight = "0";
    } else {
      faqItem.classList.add("active");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  }

  handleContactSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const contactData = {
      name:
        formData.get("name") || document.getElementById("contact-name").value,
      email:
        formData.get("email") || document.getElementById("contact-email").value,
      phone:
        formData.get("phone") ||
        document.getElementById("contact-phone")?.value,
      category:
        formData.get("category") ||
        document.getElementById("contact-category")?.value,
      subject:
        formData.get("subject") ||
        document.getElementById("contact-subject")?.value,
      message:
        formData.get("message") ||
        document.getElementById("contact-message").value,
      privacy:
        formData.get("privacy") ||
        document.getElementById("contact-privacy")?.checked,
    };

    // Validation
    if (!contactData.name || !contactData.email || !contactData.message) {
      this.showNotification("필수 항목을 모두 입력해주세요.", "error");
      return;
    }

    if (!this.isValidEmail(contactData.email)) {
      this.showNotification("올바른 이메일 주소를 입력해주세요.", "error");
      return;
    }

    if (document.getElementById("contact-privacy") && !contactData.privacy) {
      this.showNotification("개인정보 수집 및 이용에 동의해주세요.", "error");
      return;
    }

    // Simulate form submission
    this.submitContact(contactData);
  }

  async submitContact(contactData) {
    // Show loading state
    const submitBtn = document.querySelector(
      '#contact-form button[type="submit"]'
    );
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "전송 중...";
    submitBtn.disabled = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      this.showNotification(
        "문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.",
        "success"
      );

      // Reset form
      document.getElementById("contact-form").reset();

      // Log contact data (in real app, this would be sent to server)
      console.log("Contact submission:", contactData);
    } catch (error) {
      this.showNotification(
        "전송 중 오류가 발생했습니다. 다시 시도해주세요.",
        "error"
      );
    } finally {
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => {
      notification.remove();
    });

    const iconSvg =
      type === "success"
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>'
        : type === "error"
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">
          ${iconSvg}
        </span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    // Add styles if not already present
    if (!document.querySelector(".notification-styles")) {
      const styles = document.createElement("style");
      styles.className = "notification-styles";
      styles.textContent = `
        .notification {
          position: fixed;
          top: 100px;
          right: 20px;
          z-index: 10000;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateX(400px);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          max-width: 400px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .notification.success {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
          color: #16a34a;
        }
        
        .notification.error {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #dc2626;
        }
        
        .notification.info {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
          color: #2563eb;
        }
        
        .notification.show {
          transform: translateX(0);
          opacity: 1;
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .notification-icon {
          font-size: 1.2rem;
        }
        
        .notification-message {
          font-weight: 500;
          font-size: 0.9rem;
          line-height: 1.4;
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add("show");
    });

    // Auto remove
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 400);
    }, 5000);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ContactPage();
});
