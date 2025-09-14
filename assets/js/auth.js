// 인증 관리 JavaScript
class AuthManager {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
    this.init();
  }

  init() {
    this.updateAuthUI();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 로그아웃 버튼
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }
  }

  // 인증 UI 업데이트
  updateAuthUI() {
    const loginLink = document.getElementById("login-link");
    const mypageLink = document.getElementById("mypage-link");
    const logoutBtn = document.getElementById("logout-btn");

    if (this.currentUser) {
      // 로그인 상태
      if (loginLink) loginLink.style.display = "none";
      if (mypageLink) {
        mypageLink.style.display = "inline";
        mypageLink.textContent = `${this.currentUser.name}님`;
      }
      if (logoutBtn) logoutBtn.style.display = "inline";
    } else {
      // 비로그인 상태
      if (loginLink) loginLink.style.display = "inline";
      if (mypageLink) mypageLink.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  }

  // 로그인
  login(email, password) {
    // 실제 서비스에서는 서버 API 호출
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        loginDate: new Date().toISOString(),
      };
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
      this.updateAuthUI();
      return { success: true, user: this.currentUser };
    } else {
      return {
        success: false,
        message: "이메일 또는 비밀번호가 잘못되었습니다.",
      };
    }
  }

  // 회원가입
  register(userData) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 이메일 중복 확인
    const existingUser = users.find((u) => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: "이미 등록된 이메일입니다." };
    }

    // 새 사용자 추가
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      joinDate: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, message: "회원가입이 완료되었습니다." };
  }

  // 로그아웃
  logout() {
    if (confirm("로그아웃 하시겠습니까?")) {
      this.currentUser = null;
      localStorage.removeItem("currentUser");
      this.updateAuthUI();

      // 홈으로 이동
      if (
        window.location.pathname !== "/index.html" &&
        !window.location.pathname.endsWith("/")
      ) {
        window.location.href = "index.html";
      }
    }
  }

  // 로그인 확인
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // 현재 사용자 정보 가져오기
  getCurrentUser() {
    return this.currentUser;
  }

  // 사용자 정보 업데이트
  updateUserProfile(userData) {
    if (!this.currentUser)
      return { success: false, message: "로그인이 필요합니다." };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.id === this.currentUser.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem("users", JSON.stringify(users));

      this.currentUser = { ...this.currentUser, ...userData };
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));

      this.updateAuthUI();
      return { success: true, message: "프로필이 업데이트되었습니다." };
    }

    return { success: false, message: "사용자 정보를 찾을 수 없습니다." };
  }
}

// 전역 AuthManager 인스턴스
window.authManager = new AuthManager();

// 페이지 접근 권한 확인
function requireAuth() {
  if (!window.authManager.isLoggedIn()) {
    if (
      confirm("로그인이 필요한 페이지입니다. 로그인 페이지로 이동하시겠습니까?")
    ) {
      window.location.href = "login.html";
    } else {
      window.location.href = "index.html";
    }
    return false;
  }
  return true;
}

// 폼 유효성 검사
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validatePhone(phone) {
  const phonePattern = /^[\d-\s\(\)]{10,}$/;
  return phonePattern.test(phone);
}
