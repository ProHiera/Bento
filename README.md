# LeanBento - 맞춤형 다이어트 도시락 웹앱

## 🎯 프로젝트 개요

LeanBento는 사용자가 서브웨이처럼 재료를 하나씩 선택하여 맞춤형 도시락을 만들 수 있는 다이어트 전문 웹앱입니다. 실시간 영양소 계산, 주간 구독 서비스, 멤버십 시스템 등을 제공합니다.

## ✨ 주요 기능

### 🍱 커스텀 빌더

- 서브웨이 스타일의 재료 선택 시스템
- 실시간 칼로리/탄단지 자동 합산
- 슬라이더를 통한 g 단위 조절
- 가격 자동 계산 (`price = (pricePer100g * gram)/100`)

### 📊 영양 계산기

- BMR/TDEE 계산 (Mifflin-St Jeor 공식 사용)
- 개인 맞춤 매크로 영양소 권장량 제공
- 다이어트 목표에 따른 칼로리 조정

### 📅 구독 플래너

- 주간 7칸 드래그&드롭 식단 계획
- 정기배송 옵션 (매주/격주/매월)
- 배송 시간대 선택

### 🛒 장바구니 & 주문

- 멤버십 등급별 할인 시스템
- 상세한 주문 폼과 배송 정보 입력
- 결제 전 주문 요약 미리보기

### 🌗 다크모드 & 테마

- 글래스모피즘 디자인
- 자동/수동 다크모드 전환
- 시스템 테마 감지

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary Green**: `#18A05E` (허브그린)
- **Mint Green**: `#7BDCB5` (민트)
- **Charcoal**: `#0F172A` (차콜)
- **White**: `#FFFFFF` (미니멀 화이트)

### UI 특징

- **글래스모피즘**: 반투명 배경과 블러 효과
- **16px 라운드**: 모든 요소에 일관된 border-radius
- **부드러운 애니메이션**: GSAP를 활용한 진입/전환 효과
- **반응형 디자인**: 모바일부터 데스크톱까지 완벽 지원

## 🛠 기술 스택

### Frontend

- **HTML5**: 시맨틱 마크업
- **CSS3**: SCSS 스타일 (Tailwind 미사용)
- **JavaScript (ES6+)**: 모듈화된 순수 자바스크립트
- **GSAP**: 고급 애니메이션
- **LocalStorage**: 클라이언트 사이드 데이터 저장

### Backend (추후 연동 예정)

- **Java 11** + **Tomcat 9**
- **Spring MVC 5** + **Thymeleaf 3**
- **MyBatis 3** + **MySQL 8**
- **WAR** 배포 아카이브

## 📁 프로젝트 구조

```
Bento/
├── index.html              # 메인 HTML 파일
├── assets/
│   ├── css/
│   │   ├── main.css        # 메인 스타일시트
│   │   └── components.css  # 컴포넌트 스타일
│   └── js/
│       ├── main.js         # 메인 애플리케이션
│       ├── theme.js        # 테마 관리
│       ├── nutrition.js    # 영양 계산기
│       ├── builder.js      # 커스텀 빌더
│       ├── subscription.js # 구독 플래너
│       ├── cart.js         # 장바구니 & 결제
│       └── data.js         # 데이터 관리
└── README.md
```

## 🚀 실행 방법

1. **파일 다운로드**

   ```bash
   # 프로젝트 폴더로 이동
   cd Bento
   ```

2. **로컬 서버 실행**

   ```bash
   # Python 사용
   python -m http.server 8000

   # 또는 Node.js live-server 사용
   npx live-server

   # 또는 VS Code Live Server 확장 사용
   ```

3. **브라우저 접속**
   ```
   http://localhost:8000
   ```

## 📱 주요 페이지

### 1. 홈페이지

- Hero 섹션과 주요 기능 소개
- CTA 버튼을 통한 빌더로 직접 이동

### 2. 메뉴 & 필터

- 카테고리별 도시락 메뉴
- 칼로리/영양소 범위 필터
- 실시간 필터링

### 3. 커스텀 빌더

- 재료 카테고리 (기본/단백질/채소/탄수화물/소스)
- 선택된 재료 목록과 수량 조절
- 실시간 영양정보 & 가격 계산

### 4. 구독 플래너

- 주간 캘린더 형태의 식단 계획
- 드래그&드롭으로 도시락 배치
- 구독 옵션 설정

### 5. 영양 계산기

- 개인정보 입력 (성별, 나이, 키, 몸무게, 활동량)
- BMR/TDEE 자동 계산
- 맞춤 매크로 영양소 제공

## 🔧 핵심 기능 구현

### 영양소 자동 계산

```javascript
// 재료별 100g 기준 영양정보 × 사용자 선택 g
const ratio = selectedGram / 100;
const calories = ingredient.nutrition.calories * ratio;
const protein = ingredient.nutrition.protein * ratio;
```

### 가격 계산

```javascript
// 가격 = (100g당 가격 × 선택한 g) / 100
const price = (ingredient.pricePer100g * selectedGram) / 100;
```

### 멤버십 할인

```javascript
const discountRates = {
  BASIC: 0, // 0% 할인
  SILVER: 0.05, // 5% 할인
  GOLD: 0.1, // 10% 할인
  PLATINUM: 0.15, // 15% 할인
};
```

## 🎮 사용자 인터랙션

### 1. 재료 선택

- 카테고리 버튼으로 재료 그룹 변경
- 재료 클릭으로 선택/해제
- 슬라이더로 g 단위 조절

### 2. 필터링

- 범위 슬라이더로 칼로리/영양소 필터
- 드롭다운으로 카테고리 선택
- 실시간 필터 적용

### 3. 테마 변경

- 상단 버튼으로 라이트/다크 모드 전환
- 시스템 설정 자동 감지
- 사용자 선택 기억

## 🗄 데이터 저장

### LocalStorage 사용

- `leanbento_cart`: 장바구니 데이터
- `leanbento_theme`: 테마 설정
- `leanbento_nutrition_plan`: 영양 계획
- `leanbento_weekly_plan`: 주간 식단
- `leanbento_user`: 사용자 정보
- `leanbento_orders`: 주문 내역
- `leanbento_subscriptions`: 구독 정보

### 샘플 데이터

- 30+ 재료 데이터 (카테고리별 분류)
- 6개 사전 제작 메뉴
- 고객 후기 데이터
- 영양정보 및 가격 정보

## 🌐 반응형 디자인

### 브레이크포인트

- **Desktop**: 1024px+
- **Tablet**: 768px ~ 1023px
- **Mobile**: ~ 767px

### 모바일 최적화

- 햄버거 메뉴
- 터치 친화적 인터페이스
- 세로 스크롤 최적화
- 모바일 전용 레이아웃

## 🔮 향후 계획

### 백엔드 연동

- Spring Boot API 서버 구축
- MySQL 데이터베이스 연동
- 실시간 재고 관리
- 결제 시스템 연동

### 추가 기능

- AI 기반 식단 추천
- 소셜 로그인 (카카오, 네이버)
- 배송 추적 시스템
- 커뮤니티 기능

### 성능 최적화

- 이미지 최적화
- 코드 스플리팅
- PWA 기능 추가
- CDN 적용

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.

## 👨‍💻 개발자

프론트엔드 개발 전문가가 React/Vue.js 없이 순수 HTML/CSS/JavaScript로 구현한 모던 웹앱입니다.

---

**LeanBento** - 건강한 식단 관리의 새로운 시작 🥗
