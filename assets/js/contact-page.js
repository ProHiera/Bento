// Contact Page JavaScript - Cleaned Version
class ContactPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Contact form
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        this.handleContactSubmit(e);
      });
    }
  }

  handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // 유효성 검사
    if (!data.name || !data.email || !data.subject || !data.message) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    if (!data.privacy) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    // 문의 저장 (로컬 스토리지)
    this.saveContact(data);
    
    // 성공 메시지
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    
    // 폼 초기화
    e.target.reset();
  }

  saveContact(data) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const newContact = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    contacts.unshift(newContact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }
}

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  new ContactPage();
});
