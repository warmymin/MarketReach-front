# MarketReach Frontend

Next.js 기반의 마케팅 캠페인 관리 시스템 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React**
- **Zustand** (상태 관리)
- **Axios** (HTTP 클라이언트)

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지
│   ├── campaigns/    # 캠페인 관리 페이지
│   ├── customers/    # 고객 관리 페이지
│   ├── deliveries/   # 배송 관리 페이지
│   ├── targeting/    # 타겟팅 설정 페이지
│   └── settings/     # 설정 페이지
├── components/       # 재사용 가능한 컴포넌트
│   ├── ui/          # 기본 UI 컴포넌트
│   ├── Layout.tsx   # 레이아웃 컴포넌트
│   └── Sidebar.tsx  # 사이드바 컴포넌트
├── lib/             # 유틸리티 및 설정
│   └── api.ts       # API 클라이언트
├── store/           # 상태 관리
│   └── index.ts     # Zustand 스토어
└── types/           # TypeScript 타입 정의
    └── index.ts     # 공통 타입
```

## 주요 기능

- **대시보드**: 전체 시스템 현황 및 통계
- **캠페인 관리**: 캠페인 생성, 수정, 삭제, 조회
- **고객 관리**: 고객 정보 관리 및 조회
- **배송 관리**: 배송 상태 추적 및 관리
- **타겟팅**: 지역별 타겟팅 설정
- **설정**: 시스템 설정 및 사용자 관리

## 실행 방법

### 1. 사전 요구사항

- Node.js 18 이상 설치
- npm 또는 yarn 패키지 매니저

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

### 4. 애플리케이션 접속

- **개발 서버**: http://localhost:3000

## 환경 설정

### 환경 변수

`.env.local` 파일을 생성하여 환경 변수를 설정할 수 있습니다:

```env
# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# 환경 설정
NODE_ENV=development
```

### 백엔드 연결

프론트엔드가 백엔드 API와 통신하려면 백엔드 서버가 실행 중이어야 합니다:

```bash
# 백엔드 디렉토리에서
cd ../backend
./mvnw spring-boot:run
```

## 빌드 및 배포

### 개발 빌드

```bash
npm run build
npm start
```

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### 정적 내보내기 (선택사항)

```bash
npm run export
```

## 주요 페이지

### 대시보드 (`/`)
- 전체 시스템 현황
- 캠페인 성과 통계
- 최근 활동 요약

### 캠페인 관리 (`/campaigns`)
- 캠페인 목록 조회
- 새 캠페인 생성
- 캠페인 수정 및 삭제
- 캠페인 상태 관리

### 고객 관리 (`/customers`)
- 고객 목록 조회
- 고객 정보 관리
- 고객 검색 및 필터링

### 배송 관리 (`/deliveries`)
- 배송 상태 추적
- 배송 이력 조회
- 배송 통계

### 타겟팅 (`/targeting`)
- 지역별 타겟팅 설정
- 타겟팅 규칙 관리

### 설정 (`/settings`)
- 시스템 설정
- 사용자 프로필 관리

## 컴포넌트 구조

### UI 컴포넌트 (`src/components/ui/`)

- `Button.tsx`: 재사용 가능한 버튼 컴포넌트
- `Card.tsx`: 카드 레이아웃 컴포넌트
- `Input.tsx`: 입력 필드 컴포넌트
- `Toast.tsx`: 알림 메시지 컴포넌트

### 레이아웃 컴포넌트

- `Layout.tsx`: 전체 애플리케이션 레이아웃
- `Sidebar.tsx`: 네비게이션 사이드바

## 상태 관리

Zustand를 사용하여 전역 상태를 관리합니다:

```typescript
// src/store/index.ts
interface AppState {
  campaigns: Campaign[]
  customers: Customer[]
  deliveries: Delivery[]
  // ... 기타 상태
}
```

## API 통신

Axios를 사용하여 백엔드 API와 통신합니다:

```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
})
```

## 스타일링

Tailwind CSS를 사용하여 스타일링을 합니다:

- 유틸리티 클래스 기반 스타일링
- 반응형 디자인
- 다크 모드 지원 (선택사항)

## 개발 가이드

### 새 페이지 추가

1. `src/app/` 디렉토리에 새 폴더 생성
2. `page.tsx` 파일 생성
3. 라우팅 자동 설정

### 새 컴포넌트 추가

1. `src/components/` 디렉토리에 컴포넌트 생성
2. TypeScript 인터페이스 정의
3. 재사용 가능한 컴포넌트로 설계

### API 엔드포인트 추가

1. `src/lib/api.ts`에 새 함수 추가
2. 타입 정의 업데이트
3. 컴포넌트에서 사용

## 문제 해결

### 포트 충돌
기본 포트 3000이 사용 중인 경우 자동으로 다른 포트를 사용합니다.

### API 연결 문제
백엔드 서버가 실행 중인지 확인하고, 환경 변수 `NEXT_PUBLIC_API_URL`을 확인하세요.

### 빌드 오류
의존성 문제가 있는 경우 `node_modules`를 삭제하고 다시 설치하세요:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.
