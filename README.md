# 자판기 구현 프로젝트
### 버전: v0.0.1

이 프로젝트는 자판기의 동작을 구현했습니다. 현금 결제와 카드 결제가 가능하며, 거스름돈 반환, 일정시간 이상 동작 없을 시 자동 취소 등의 기능을 구현했습니다.

다이어그램 -> public/diagram.png
앱 -> src/App.tsx

를 봐주시면 됩니다.

컴포넌트를 분리해서 짜려고 했으나 계속 일정이 있는 관계로 프로젝트 작업 시간이 무척 촉박하여 상세하게 나누지는 못했습니다ㅜㅜ
또한 오류 상황을 최대한 많이 반영하려고 했지만, 실제 자판기의 하드웨어적 예외상황(동전이 아닌 것을 넣는다던가, 자판기를 두드려서 고장내는 등)은 논외라 생각하여 포함하지 않았습니다.


## 다이어그램

![image](https://github.com/user-attachments/assets/c27a1458-31af-41b7-8489-88a81a6e946e)

## 주요 기능

### 결제

- **현금 결제**: 100원, 500원, 1000원, 5000원, 10000원 현금 투입 가능
- **카드 결제**
- **자동 거스름돈 계산**: 가장 큰 단위의 현금부터 순서대로 거스름돈 자동 계산
- **잔액 부족 시 자동 반환**: 가장 싼 물품보다 잔액이 적으면 자동으로 거스름돈 반환

### 상품 관리

- **재고 관리**: 구매 시 자동으로 재고 차감
- **품절 상태**: 재고가 없을 때 "품절" 표시
- **상품 출구**: 구매한 상품이 출구에 표시

### 타이머 시스템

- **타임아웃 자동 반환**: 사용자가 1분 이상 활동하지 않으면 자동으로 카드 결제 취소 및 현금 반환
- **사용자 활동 감지**: 각각의 버튼 클릭 시마다 자동으로 반환 타이머 리셋

## 기술 스택

- **Frontend**: React 19.1.1
- **Language**: TypeScript 4.9.5
- **Styling**: Tailwind CSS 3.4.17
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **PostCSS**: 8.5.6 + autoprefixer 10.4.21

## 🚀 설치 및 실행 방법

### 필수 요구사항

- Node.js 16.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone [repository-url]
cd jungwun-vending-machine

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

## 📁 프로젝트 구조

```
jungwun-vending-machine/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.css              # 메인 스타일시트
│   ├── App.tsx              # 메인 컴포넌트 (자판기 로직)
│   ├── index.css            # Tailwind CSS 임포트
│   ├── index.tsx            # React 앱 진입점
│   └── reportWebVitals.ts   # 성능 측정
├── tailwind.config.js       # Tailwind CSS 설정
├── postcss.config.js        # PostCSS 설정
├── package.json
└── README.md
```

## 🎯 주요 상태 관리

### 상태 변수

- `insertedAmount`: 투입된 현금 금액
- `items`: 상품 목록 (이름, 가격, 재고, ID)
- `change`: 거스름돈 정보 (총액, 화폐별 개수)
- `boughtItems`: 구매한 상품 목록
- `isCardPayment`: 카드 결제 모드 여부

### 인터페이스

```typescript
interface itemData {
  name: string;
  amount: number;
  price: number;
  id: number;
}

interface changeData {
  totalAmount: number;
  amountList: {
    cash: number;
    amount: number;
  }[];
}
```
