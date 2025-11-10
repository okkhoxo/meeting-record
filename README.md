# Minimal Presentation Template

미니멀한 디자인의 웹 프레젠테이션 템플릿입니다.

## 특징

- ✨ 깔끔한 미니멀 디자인
- 📱 반응형 디자인 (모바일, 태블릿, 데스크톱 지원)
- 🎨 다양한 슬라이드 레이아웃
- ⚡ Reveal.js 기반으로 부드러운 전환 효과
- 🚀 Vercel 배포 가능

## 포함된 슬라이드

1. 타이틀 슬라이드
2. 타임라인 (세로형)
3. 타임라인 (가로형)
4. 설명 슬라이드 01
5. 프로필/스킬 슬라이드
6. 팀/소개 슬라이드
7. 이미지 갤러리
8. 설명 슬라이드 02
9. 차트 슬라이드
10. 분석 슬라이드
11. 연락처 슬라이드

## 로컬에서 실행하기

1. 파일을 다운로드하거나 클론합니다
2. 브라우저에서 `index.html` 파일을 열거나
3. 로컬 서버로 실행:
```bash
npx serve .
```

## Vercel 배포 방법

### 방법 1: Vercel CLI 사용

1. Vercel CLI 설치:
```bash
npm install -g vercel
```

2. 프로젝트 폴더에서 배포:
```bash
vercel
```

3. 프로덕션 배포:
```bash
vercel --prod
```

### 방법 2: Vercel 웹사이트 사용

1. [Vercel](https://vercel.com) 가입/로그인
2. "Add New Project" 클릭
3. 이 폴더를 GitHub에 올린 후 저장소 연결, 또는
4. "Import Git Repository" 없이 직접 폴더 드래그 앤 드롭

## 커스터마이징

### 색상 변경
`style.css` 파일의 `:root` 섹션에서 색상 변수를 수정하세요:

```css
:root {
    --primary-color: #2b2b2b;
    --secondary-color: #6b6b6b;
    --text-color: #333;
    --light-gray: #f5f5f5;
    --border-color: #e0e0e0;
}
```

### 슬라이드 추가/제거
`index.html` 파일에서 `<section>` 태그를 추가하거나 제거하세요.

### 이미지 추가
이미지 플레이스홀더를 실제 이미지로 교체하려면:

```html
<!-- 기존 -->
<div class="gallery-image">01</div>

<!-- 변경 -->
<img src="your-image.jpg" alt="Description">
```

## 키보드 단축키

- **→/←**: 다음/이전 슬라이드
- **Space**: 다음 슬라이드
- **Esc**: 슬라이드 개요 보기
- **F**: 전체화면 모드

## 기술 스택

- HTML5
- CSS3
- Reveal.js 4.5.0
- Google Fonts (Roboto)

## 라이선스

MIT License
