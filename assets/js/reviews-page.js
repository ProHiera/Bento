// Reviews Page JavaScript - Cleaned Version
class ReviewsPage {
  constructor() {
    this.reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    this.currentFilter = "all";
    this.init();
  }

  init() {
    this.loadSampleReviews();
    this.setupEventListeners();
    this.renderReviews();
  }

  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setFilter(e.target.dataset.rating);
      });
    });

    // Write review button
    const writeBtn = document.getElementById("write-review-btn");
    if (writeBtn) {
      writeBtn.addEventListener("click", () => {
        this.openWriteReviewModal();
      });
    }

    // Review form
    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", (e) => {
        this.handleReviewSubmit(e);
      });
    }

    // Modal close
    document.querySelectorAll(".modal-close, [data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.closeModal();
      });
    });
  }

  loadSampleReviews() {
    if (this.reviews.length === 0) {
      this.reviews = [
        {
          id: '1',
          name: '김영희',
          rating: 5,
          title: '정말 맛있어요!',
          content: '재료가 신선하고 영양 균형이 잘 맞춰져 있어서 매우 만족합니다.',
          date: '2025-01-10'
        },
        {
          id: '2',
          name: '박민수',
          rating: 4,
          title: '만족스러운 도시락',
          content: '배송도 빠르고 맛도 좋습니다. 다음에도 주문할 예정이에요.',
          date: '2025-01-08'
        },
        {
          id: '3',
          name: '이지수',
          rating: 5,
          title: '건강한 한 끼',
          content: '다이어트 중인데 칼로리 계산도 정확하고 포만감도 좋아요.',
          date: '2025-01-05'
        }
      ];
      localStorage.setItem('reviews', JSON.stringify(this.reviews));
    }
  }

  setFilter(rating) {
    this.currentFilter = rating;
    
    // 활성 버튼 업데이트
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-rating="${rating}"]`).classList.add('active');
    
    this.renderReviews();
  }

  renderReviews() {
    const reviewsGrid = document.getElementById('reviews-grid');
    if (!reviewsGrid) return;

    let filteredReviews = this.reviews;
    if (this.currentFilter !== 'all') {
      filteredReviews = this.reviews.filter(review => 
        review.rating === parseInt(this.currentFilter)
      );
    }

    reviewsGrid.innerHTML = '';

    if (filteredReviews.length === 0) {
      reviewsGrid.innerHTML = `
        <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
          <p>해당 평점의 후기가 없습니다.</p>
        </div>
      `;
      return;
    }

    filteredReviews.forEach(review => {
      const reviewElement = this.createReviewElement(review);
      reviewsGrid.appendChild(reviewElement);
    });
  }

  createReviewElement(review) {
    const div = document.createElement('div');
    div.className = 'review-item';
    
    const stars = '⭐'.repeat(review.rating);
    
    div.innerHTML = `
      <div class="review-header">
        <h4>${review.name}</h4>
        <div class="review-rating">${stars}</div>
        <span class="review-date">${review.date}</span>
      </div>
      <h5 class="review-title">${review.title}</h5>
      <p class="review-content">${review.content}</p>
    `;

    return div;
  }

  openWriteReviewModal() {
    const modal = document.getElementById('write-review-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  closeModal() {
    const modal = document.getElementById('write-review-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  handleReviewSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!data.name || !data.rating || !data.title || !data.content) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    const newReview = {
      id: Date.now().toString(),
      name: data.name,
      rating: parseInt(data.rating),
      title: data.title,
      content: data.content,
      date: new Date().toLocaleDateString('ko-KR')
    };
    
    this.reviews.unshift(newReview);
    localStorage.setItem('reviews', JSON.stringify(this.reviews));
    
    this.renderReviews();
    this.closeModal();
    
    alert('후기가 등록되었습니다!');
    e.target.reset();
  }
}

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  new ReviewsPage();
});
