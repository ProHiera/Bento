// Reviews Page JavaScript
class ReviewsPage {
  constructor() {
    this.reviews = [];
    this.currentFilter = "all";
    this.init();
  }

  init() {
    this.loadReviews();
    this.setupEventListeners();
    this.setupAnimations();
  }

  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setFilter(e.target.dataset.rating);
      });
    });

    // Write review button
    document
      .getElementById("write-review-btn")
      ?.addEventListener("click", () => {
        this.openWriteReviewModal();
      });

    // Review form
    document.getElementById("review-form")?.addEventListener("submit", (e) => {
      this.handleReviewSubmit(e);
    });

    // Modal close
    document
      .querySelectorAll(".modal-close, [data-close-modal]")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          this.closeModal();
        });
      });
  }

  setupAnimations() {
    gsap.from(".review-stats .stat-item", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    gsap.from(".review-filters .filter-btn", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.3,
      ease: "power3.out",
    });
  }

  loadReviews() {
    // Sample reviews data
    this.reviews = [
      {
        id: 1,
        name: "김민수",
        rating: 5,
        title: "정말 만족스러운 도시락!",
        content:
          "영양소 계산이 정확하고 맛도 좋아요. 다이어트에 큰 도움이 되고 있습니다.",
        date: "2024-12-15",
        verified: true,
      },
      {
        id: 2,
        name: "이지은",
        rating: 5,
        title: "맞춤 재료 선택이 최고",
        content:
          "알레르기가 있어서 재료 선택이 중요한데, 세심하게 맞춤 설정할 수 있어서 좋아요.",
        date: "2024-12-14",
        verified: true,
      },
      {
        id: 3,
        name: "박준호",
        rating: 4,
        title: "배송이 빠르고 신선해요",
        content:
          "정기배송 서비스 이용 중인데 항상 신선한 상태로 배송되어 만족합니다.",
        date: "2024-12-13",
        verified: false,
      },
      {
        id: 4,
        name: "최수민",
        rating: 5,
        title: "영양사 상담이 도움돼요",
        content:
          "개인 맞춤 영양 상담을 받을 수 있어서 건강한 식단 관리에 큰 도움이 됩니다.",
        date: "2024-12-12",
        verified: true,
      },
      {
        id: 5,
        name: "정우진",
        rating: 4,
        title: "가격 대비 만족",
        content:
          "다른 도시락 서비스에 비해 가격도 합리적이고 품질도 좋아서 계속 이용하고 있어요.",
        date: "2024-12-11",
        verified: true,
      },
      {
        id: 6,
        name: "한소영",
        rating: 5,
        title: "다이어트 성공!",
        content:
          "3개월 동안 이용하면서 5kg 감량에 성공했어요. 영양 균형이 잘 맞춰져 있어요.",
        date: "2024-12-10",
        verified: true,
      },
    ];

    this.renderReviews();
  }

  setFilter(rating) {
    this.currentFilter = rating;

    // Update active filter button
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-rating="${rating}"]`).classList.add("active");

    this.renderReviews();
  }

  renderReviews() {
    const reviewsGrid = document.getElementById("reviews-grid");
    if (!reviewsGrid) return;

    let filteredReviews = this.reviews;
    if (this.currentFilter !== "all") {
      filteredReviews = this.reviews.filter(
        (review) => review.rating === parseInt(this.currentFilter)
      );
    }

    reviewsGrid.innerHTML = filteredReviews
      .map(
        (review) => `
      <div class="review-card glass-card">
        <div class="review-header">
          <div class="reviewer-info">
            <h4>${review.name}</h4>
            ${
              review.verified
                ? '<span class="verified-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg> 인증구매</span>'
                : ""
            }
          </div>
          <div class="review-rating">
            ${"⭐".repeat(review.rating)}
          </div>
        </div>
        <h3 class="review-title">${review.title}</h3>
        <p class="review-content">${review.content}</p>
        <div class="review-footer">
          <span class="review-date">${this.formatDate(review.date)}</span>
        </div>
      </div>
    `
      )
      .join("");

    // Animate new reviews
    gsap.from(".review-card", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  openWriteReviewModal() {
    document.getElementById("write-review-modal").classList.add("active");
  }

  closeModal() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.remove("active");
    });
  }

  handleReviewSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const rating = formData.get("rating");
    const name = document.getElementById("review-name").value;
    const title = document.getElementById("review-title").value;
    const content = document.getElementById("review-content").value;

    if (!rating) {
      alert("평점을 선택해주세요.");
      return;
    }

    // Add new review
    const newReview = {
      id: this.reviews.length + 1,
      name,
      rating: parseInt(rating),
      title,
      content,
      date: new Date().toISOString().split("T")[0],
      verified: false,
    };

    this.reviews.unshift(newReview);
    this.renderReviews();
    this.closeModal();

    // Reset form
    e.target.reset();

    // Show success message
    this.showNotification("후기가 성공적으로 등록되었습니다!", "success");
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ReviewsPage();
});
