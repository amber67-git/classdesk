# ClassDesk UI/UX Design Guide

이 문서는 ClassDesk의 디자인 규격을 다른 앱(예: Vocab app)에서 그대로 재현할 수 있도록 정리한 것입니다.
AI 코딩 도구에 "이 문서의 규격대로 만들어줘"라고 주면 됩니다. 코드 예시는 순수 HTML/CSS라 어떤 프레임워크에도 옮길 수 있습니다.

---

## 1. 한 줄 요약 (the essence)

**"모든 페이지가 같은 뼈대, 같은 치수, 같은 부품."**
페이지를 넘겨도 바뀌는 것은 *내용*뿐이어야 하고, 툴바·헤더·행·버튼의 크기와 위치는 픽셀 단위로 같아야 한다.
꾸밈보다 **일관성**이 우선이다. 한 페이지에만 특별한 폭·색·간격을 주지 않는다.

---

## 2. Design tokens (CSS variables)

앱 전체는 아래 변수만 참조한다. 값을 바꾸면 앱 전체가 따라온다.

```css
:root{
  /* Brand / primary — 메인 컬러. 이 4개만 바꾸면 앱 전체 색이 바뀐다 */
  --pri:#16a34a;      /* 버튼, 활성 메뉴, 로고, 스위치, 포커스 링 */
  --pri-h:#15803d;    /* primary hover (조금 더 진하게) */
  --pri-l:#dcfce7;    /* primary light — 활성 메뉴 배경, 선택 바 배경, 배지 배경 */
  --pri-t:#14532d;    /* primary text — light 배경 위에 얹는 진한 글자색 */

  /* Success (paid / done) — 의미 색. 브랜드 색과 별개로 항상 초록 */
  --ok:#16a34a;--ok-l:#dcfce7;--ok-t:#15803d;

  /* Surfaces & borders */
  --bg:#f8fafc;       /* 페이지 바탕 */
  --surf:#fff;        /* 카드, 사이드바, 상단 바 */
  --surf2:#f1f5f9;    /* 툴바, 표 헤더 띠, hover */
  --surf3:#e2e8f0;    /* 진행 막대 트랙 등 */
  --bdr:#e2e8f0;      /* 기본 선 */
  --bdr2:#cbd5e1;     /* 입력창·버튼 테두리 (조금 진함) */

  /* Text */
  --txt:#0f172a;      /* 본문 */
  --txt2:#475569;     /* 보조 */
  --txt3:#94a3b8;     /* 힌트, 표 헤더, 비활성 */

  /* Semantic */
  --red:#dc2626;--red-l:#fee2e2;     /* 미납, 삭제, 오류 */
  --amb:#d97706;--amb-l:#fef3c7;     /* 부분, 주의 */
  --blu:#2563eb;--blu-l:#dbeafe;     /* 정보, 선불 */
  --pur:#7c3aed;--pur-l:#ede9fe;     /* 기타 라벨 */

  /* Type scale (px) */
  --fs-xs:10px;--fs-sm:11px;--fs-base:12px;--fs-md:13px;--fs-lg:15px;--fs-xl:17px;--fs-2xl:22px;

  /* Spacing scale */
  --sp-1:4px;--sp-2:8px;--sp-3:12px;--sp-4:16px;--sp-5:20px;--sp-6:24px;--sp-8:32px;

  /* Radii */
  --r:8px;            /* 버튼, 입력창, 작은 상자 */
  --rl:12px;          /* 카드, 모달 */

  /* Fonts */
  --font:'Inter',sans-serif;               /* UI 전체 */
  --mono:'JetBrains Mono',monospace;       /* 숫자·금액·시간·버전 */

  /* Shadows */
  --sh:0 1px 3px rgba(0,0,0,.07);          /* 카드 */
  --shm:0 4px 16px rgba(0,0,0,.08);
  --shl:0 10px 40px rgba(0,0,0,.12);       /* 모달 */
}
```

### 메인 컬러 바꾸는 법
1. `--pri`, `--pri-h`, `--pri-l`, `--pri-t` 네 값만 바꾼다. (예: 파랑 → `#2563eb / #1d4ed8 / #dbeafe / #1e3a8a`)
2. 규칙: `--pri-l`은 흰 배경과 거의 구분 안 될 만큼 연하게, `--pri-t`는 `--pri-l` 위에서 대비 4.5:1 이상.
3. 결제 완료·완료 배지 같은 "성공" 의미 색은 `--ok*`를 쓰므로 브랜드 색을 바꿔도 초록으로 남는다. 성공도 같이 바꾸고 싶으면 `--ok*`를 `--pri*`와 같게 둔다.
4. 코드 안에 `#16a34a` 같은 hex를 직접 쓰지 않는다. 항상 변수를 쓴다. (ClassDesk는 달력 상태색·차트용 데이터 색 몇 곳만 예외로 hex를 쓴다.)
5. 브랜드 색을 쓰는 곳: 사이드바 로고 글자, 활성 메뉴(배경 `--pri-l`, 글자 `--pri-t`, 아이콘 `--pri`), 초록 버튼, 스위치 on, 세그먼트 활성, 입력창 포커스 링, 링크, 선택 바.

---

## 3. Layout skeleton (모든 페이지 동일)

```
┌──────────┬──────────────────────────────────────────┐
│ BRAND    │ TOPBAR  (page title)               52px  │  ← 두 칸의 높이가 같아 밑선이 한 줄
├──────────┼──────────────────────────────────────────┤
│          │ TOOLBAR (.fbar) — filters | count + Add  │  ← 59px, 배경 --surf2
│ SIDEBAR  ├──────────────────────────────────────────┤
│ 220px    │ CONTENT (.pc) — cards                    │  ← padding 24px 28px
│          │                                          │
│ version  │                                          │
└──────────┴──────────────────────────────────────────┘
```

- **사이드바** 220px 고정, `position:fixed`. 브랜드 칸 높이 **52px** (= 상단 바). 메뉴 항목: 아이콘 16px + 글자 13px/500, padding 8px 12px, radius 8px. 활성: 배경 `--pri-l`, 글자 `--pri-t` 600, 아이콘 `--pri`. 맨 아래에 버전·날짜(10px, mono).
- **상단 바** 높이 52px, padding 0 **28px**, 제목 15px/600, `position:sticky`, 아래 선 `--bdr`.
- **왼쪽 정렬선은 28px 하나**: 상단 바, 툴바, 콘텐츠의 왼쪽 padding이 모두 28px. (폰 ≤640px: 모두 12px)
- **콘텐츠** `.pc{padding:24px 28px}`; 카드 사이 간격 14px.

---

## 4. Toolbar (.fbar) — 페이지마다 절대 달라지지 않는 부분

```html
<div class="fbar">
  <select>…</select>                       <!-- 왼쪽: 필터 -->
  <input type="text" placeholder="Search…"/>
  <div class="fbar-right">                 <!-- 오른쪽: 개수 + 주 버튼 -->
    <span class="cell-muted2">14 items</span>
    <button class="btn btn-p"><i class="ti ti-plus"></i> Add item</button>
  </div>
</div>
```

```css
.fbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:12px 28px;background:var(--surf2);border-bottom:1px solid var(--bdr)}
.fbar-right{margin-left:auto;display:flex;gap:8px;align-items:center}
/* 크기는 고정 — 글자 길이에 따라 늘었다 줄었다 하지 않는다 */
.fbar select{width:160px!important;height:34px;font-size:12px;padding:0 10px}
.fbar input[type=text]{width:280px!important;height:34px;font-size:12px;padding:0 10px}
.fbar .btn{height:34px;padding:0 12px;font-size:12px}
.fbar .btn-p{width:150px!important;padding:0 8px}   /* 짧은 라벨이면 양옆 여백만 넓어짐 */
```

규칙
- 드롭다운 160 · 검색 280 · 주 버튼 150 · 높이 34 · 간격 10. 어떤 페이지도 예외 없음.
- 필터가 많으면(예: 7개) 툴바에 늘어놓지 말고 **"Filters" 버튼 → 접히는 패널**로 넣고, 버튼에 활성 개수 배지를 단다.
- **선택 시 작업(일괄 편집·인쇄 등)은 툴바에 넣지 않는다.** 체크했을 때만 목록 위에 나타나는 **선택 바**(`.selbar`)를 쓴다. 툴바 모양이 상황에 따라 변하면 안 된다.
- 개수 표기는 항상 `N items` 형식 (괄호 없음).
- 월 이동이 있는 페이지(달력)는 툴바 정중앙에 `‹ September 2026 ›`.
- **폰보다 넓으면(≥641px) 툴바는 절대 두 줄로 접히지 않는다.** 자리가 모자라면 검색창이 280→최소 140px로
  줄어든다 (`@media(min-width:641px){.fbar{flex-wrap:nowrap}.fbar input[type=text]{flex:0 1 280px;min-width:140px}}`).
  개수 + 주 버튼(`.fbar-right`)은 `flex-shrink:0;white-space:nowrap`. 반화면 PC(960px)에서 "14 workbooks"가 길어
  Workbooks만 두 줄이 되던 문제를 이 규칙으로 막았다.

---

## 5. Components

### Card
```css
.card{background:var(--surf);border:1px solid var(--bdr);border-radius:12px;box-shadow:var(--sh);margin-bottom:14px}
.ch{padding:14px 18px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between} /* header */
.ct{font-size:13px;font-weight:600;display:flex;align-items:center;gap:7px}  .ct i{font-size:15px;color:var(--txt3)}
.cb.p{padding:18px}                                                            /* body with padding */
```
카드 제목은 항상 "회색 아이콘 + 13px/600 글자". 헤더 오른쪽에는 `btn btn-sm` 하나만.

### List (grid rows 또는 table — 둘 다 같은 규격)
```css
/* 헤더 띠 */
.grid-head, th{padding:9px 14px;background:var(--surf2);border-bottom:1px solid var(--bdr);
  font-size:10px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.05em;position:sticky;top:52px}
/* 행 */
.grid-row, td{padding:10px 14px;border-bottom:1px solid var(--bdr);font-size:12px;color:var(--txt2)}
.grid-row:hover, tbody tr:hover td{background:#fafbfc}
.cell-main{font-weight:600;font-size:13px;color:var(--txt)}   /* 첫 열(이름/제목) */
```
- 헤더에 세로 구분선을 그리지 않는다. 열 너비 조절 손잡이는 평소 투명, hover 때만 `--pri` 선.
- 행마다 오른쪽 끝에 연필(편집) 아이콘 버튼(`.bic`). 더블클릭도 편집. 안내 문구("더블클릭하세요")는 넣지 않는다.
- 숫자·금액·시간은 `--mono`.
- 넓이 ≤1280px(화면 반 분할, 태블릿)에서는 목록이 **카드 안에서 가로 스크롤**된다. 카드 밖으로 삐져나가면 안 된다. 오른쪽 끝에 옅은 그림자로 "더 있음"을 표시.

### Buttons
```css
.btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:7px 14px;border-radius:8px;
  font-size:12px;font-weight:500;border:1px solid var(--bdr2);background:var(--surf);color:var(--txt);cursor:pointer}
.btn:hover{background:var(--surf2)}
.btn-p{background:var(--pri);color:#fff;border-color:var(--pri)}  .btn-p:hover{background:var(--pri-h)}
.btn-d{color:var(--red);border-color:var(--red)}                  /* 삭제 */
.btn-sm{padding:4px 10px;font-size:11px}  .btn-xs{padding:2px 7px;font-size:10px}
.bic{padding:5px;border:none;background:none;color:var(--txt3);font-size:16px;border-radius:8px}  /* 아이콘 전용 */
.bic:hover{background:var(--surf2);color:var(--txt)}
```
- 한 화면에 초록(primary) 버튼은 **하나**만: 그 페이지의 주 행동(Add ○○, Save).
- 위험 행동(삭제)은 빨간 외곽선 버튼, 확인창 + 6초 실행취소 토스트.
- 아이콘은 Tabler Icons (`ti ti-*`), 버튼 안 아이콘 크기는 글자와 같게.

### Badge (상태)
```css
.badge{display:inline-flex;font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;letter-spacing:.02em}
.bp{background:var(--ok-l);color:var(--ok-t)}     /* Paid / Done */
.bu{background:var(--red-l);color:#991b1b}        /* Unpaid */
.bpa{background:var(--amb-l);color:#92400e}       /* Partial */
.bc{background:#f1f5f9;color:#64748b}             /* Cancelled / neutral */
```
연한 배경 + 진한 같은 계열 글자. 배경만 진하게 칠하지 않는다.

### Switch (on/off) — 체크박스 대신 항상 이것
```css
.sw{position:relative;display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:500;color:var(--txt2);cursor:pointer}
.sw input{position:absolute;opacity:0;width:0;height:0}
.sw-track{width:30px;height:18px;border-radius:99px;background:var(--bdr2);position:relative;transition:background .15s}
.sw-track::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
.sw input:checked+.sw-track{background:var(--pri)}  .sw input:checked+.sw-track::after{transform:translateX(12px)}
```

### Segmented control (보기 전환: Calendar / Summary)
```css
.seg{display:inline-flex;align-items:center;height:34px;padding:2px;gap:2px;border:1px solid var(--bdr2);border-radius:8px;background:var(--surf)}
.seg-btn{height:28px;padding:0 12px;border:none;background:none;border-radius:6px;font-size:12px;font-weight:500;color:var(--txt2)}
.seg-btn.active{background:var(--pri-l);color:var(--pri-t);font-weight:600}
```

### Selection bar (체크한 항목에 대한 작업)
```css
.selbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:8px 14px;margin-bottom:14px;
  background:var(--pri-l);border:1px solid var(--pri);border-radius:8px}
.selbar-count{font-size:12px;font-weight:600;color:var(--pri-t)}   /* "3 selected" */
```
목록 바로 위, 선택이 0이면 사라진다. 오른쪽 끝에 "Clear selection".

### Stat card (대시보드 숫자)
```css
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}   /* 폰: 2열 */
.sc{background:var(--surf);border:1px solid var(--bdr);border-radius:12px;padding:14px 16px;position:relative;overflow:hidden}
.sc::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--pri)}  /* 색 띠 — 카드마다 다른 의미 색 */
.sc-lbl{font-size:10px;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:7px}
.sc-val{font-size:22px;font-weight:700;font-family:var(--mono);line-height:1;white-space:nowrap}
.sc-sub{font-size:11px;color:var(--txt3);margin-top:3px}
```
카드 안 보조 동작(예: 금액 보이기/숨기기)은 오른쪽 위 **연한 아이콘 버튼**(`opacity:.5`, hover 1)으로.

### Inputs
```css
input,select,textarea{height:36px;padding:0 10px;border:1px solid var(--bdr2);border-radius:8px;font-size:13px;background:var(--surf)}
input:focus{border-color:var(--pri);box-shadow:0 0 0 3px var(--pri-l);outline:none}
.fg label{display:block;font-size:11px;font-weight:600;color:var(--txt2);margin-bottom:5px;text-transform:uppercase;letter-spacing:.05em}
```
폰에서는 입력창 글자 16px (iOS 자동 확대 방지), 높이 42px.

### Modal
```css
.mo{position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(2px);display:none;align-items:center;justify-content:center;z-index:999}
.mo.show{display:flex}
.mb{background:var(--surf);border-radius:12px;padding:24px;width:600px;max-width:calc(100vw - 32px);max-height:92vh;overflow-y:auto;box-shadow:var(--shl)}
.mt{font-size:15px;font-weight:700;margin-bottom:18px;display:flex;justify-content:space-between}  /* 제목 + X 버튼 */
```
버튼 줄: 오른쪽 정렬, [Cancel] [Save(primary)]. 삭제 버튼은 왼쪽 끝. 비밀번호/PIN 창처럼 뒤 내용이 보이면 안 되는 경우 배경을 불투명(`--bg`)으로.

### Empty state
```css
.empty{display:flex;flex-direction:column;align-items:center;padding:48px 20px;color:var(--txt3)}  /* 아이콘 + 한 줄 문구 */
```

### Toast / Undo
하단 중앙, 진한 남색(`#1e293b`) 배경, 흰 글자, "Undo" 링크는 밝은 초록, 6초 후 사라짐.

---

## 6. Typography

- 본문 13px, 표 12px, 힌트 11px, 표 헤더 10px 대문자. 제목은 15px/600 (페이지), 13px/600 (카드).
- 굵기 3단계만: 500(보통 UI), 600(이름·제목), 700(숫자·강조).
- 숫자/금액/시간/버전은 항상 mono 폰트. 금액 표기 `₩1,234,000`.
- 태블릿(터치 + 넓이 ≥700px)에서는 본문 14px, 표 13px, 버튼 36px로 한 단계 키운다. PC·폰은 그대로.

---

## 7. Behaviour patterns

- **편집**: 행 더블클릭 또는 연필 아이콘 → 모달. 저장은 즉시 localStorage + 클라우드 동기화. "저장됨" 문구 대신 화면이 바로 바뀐다.
- **삭제**: 확인창 → 즉시 삭제 → 6초 Undo 토스트.
- **모달 닫기**: X 버튼, 배경 클릭, **Esc** 세 가지가 항상 같이 동작한다. Esc는 맨 위 모달의 자체 Close/Cancel 버튼을
  누르는 방식으로 구현한다 (Promise 기반 다이얼로그도 정상 종료되도록). 자동완성 드롭다운이 Esc를 먹으면
  `preventDefault()`로 모달까지 닫히지 않게 한다.
- **아이콘 전용 버튼**(`.bic`)에는 반드시 `title`을 단다 (Close / Previous month / Edit / Delete / Remove). 툴팁이자 스크린리더 이름.
- **프라이버시**: 민감한 숫자(금액)는 기본 가림 `₩ •••••`, 카드 안 눈 아이콘으로 표시. 태블릿·폰은 앱을 벗어나면 다시 가려짐.
- **PIN 잠금**: 민감한 페이지는 터치 기기에서 PIN, PC는 묻지 않음. 페이지를 벗어나면 즉시 재잠금. PIN 창 배경은 불투명.
- **월 이동**: `‹ 2026년 9월 ›` + Today.
- **동기화 상태**: 설정 화면에서만 작은 회색 글씨 "✓ Synced 14:32". 본문에 배너를 띄우지 않는다.
- **오프라인**: 항상 동작. 연결되면 자동 업로드.

---

## 8. Responsive rules

| 넓이 | 규칙 |
|---|---|
| >1280px | 기본 레이아웃, 표 헤더 sticky |
| ≤1280px (반 분할, 태블릿) | 넓은 목록은 카드 안에서 가로 스크롤, 헤더 sticky 해제, 통계 카드 그대로. `1fr` 컬럼은 160px 하한 (고정 컬럼이 카드보다 넓어지면 fr 컬럼이 0px로 사라지기 때문) |
| ≤1100px | 달력 칩은 두 줄 (시간 / 이름, 이름 / 금액). 한 칸이 ~100px라 한 줄이면 이름이 잘린다 |
| ≤900px | 사이드바 숨김 → 햄버거, 통계 카드 2열 |
| ≤640px (폰) | 좌우 여백 12px, 툴바 컨트롤은 화면 폭에 맞춰 늘어남, 입력 16px/42px |

---

## 9. Don'ts (다른 AI가 자주 하는 실수)

- 페이지마다 툴바를 다른 방식(grid, 아이콘 추가 등)으로 만들지 않는다. **같은 마크업**을 복사한다.
- 컨트롤 폭을 내용 길이에 맡기지 않는다. 고정값.
- 표 헤더에 세로선, 두꺼운 테두리, 진한 배경을 쓰지 않는다.
- hex 색을 코드에 직접 쓰지 않는다. 토큰만.
- 안내 문구("더블클릭하세요", "PC는 묻지 않음")를 화면에 상시 노출하지 않는다. 필요하면 툴팁(`title`)이나 Guide 탭으로.
- 초록(primary) 버튼을 한 화면에 여러 개 두지 않는다.
- 카드 밖으로 내용이 삐져나가게 두지 않는다.
