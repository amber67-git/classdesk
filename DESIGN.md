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
  --grn:var(--pri);--grn-l:var(--pri-l);--grn-t:var(--pri-t);   /* 옛 이름(코드 곳곳에서 --grn을 쓴다) — 포커스 링도 --grn */

  /* Success (paid / done) — 의미 색. 브랜드 색과 별개로 항상 초록 */
  --ok:#16a34a;--ok-l:#dcfce7;--ok-t:#15803d;

  /* Surfaces & borders */
  --bg:#f8fafc;       /* 페이지 바탕 */
  --surf:#fff;        /* 카드, 사이드바, 상단 바 */
  --surf2:#f1f5f9;    /* 툴바, 표 헤더 띠, hover */
  --surf3:#e2e8f0;    /* 진행 막대 트랙 등 */
  --bdr:#e2e8f0;      /* 기본 선 */
  --bdr2:#cbd5e1;     /* 입력창·버튼 테두리 (조금 진함) */
  --row-hover:#fafbfc;              /* 목록·표 행 hover 배경 */
  --pin-shade:rgba(15,23,42,.14);   /* 가로 스크롤 목록에서 고정된 첫 열의 그림자 */
  --edge-fade:rgba(15,23,42,.08);   /* 가로 스크롤 목록 오른쪽 끝 "더 있음" 그림자 */

  /* Text */
  --txt:#0f172a;      /* 본문 */
  --txt2:#475569;     /* 보조 */
  --txt3:#5f6f84;     /* 힌트, 표 헤더, 비활성 — v136: 흰 바탕 5.1:1, --surf2(표·달력 머리) 위 4.7:1. 이보다 연하게 하지 말 것(작은 글씨는 4.5:1 이상) */

  /* Semantic */
  --red:#dc2626;--red-l:#fee2e2;     /* 미납, 삭제, 오류 */
  --amb:#d97706;--amb-l:#fef3c7;     /* 부분, 주의 */
  --blu:#2563eb;--blu-l:#dbeafe;     /* 정보, 선불 */
  --pur:#7c3aed;--pur-l:#ede9fe;     /* 기타 라벨 */

  /* Tinted badges, chips and boxes (v137) — 글자는 같은 색 계열의 -l 배경 위에서 4.5:1 이상 */
  --amb-t:#92400e;--amb-bdr:#fcd34d;  /* 주의 배지 글자 / 주의 띠 밑선 */
  --red-t:#991b1b;--red-h:#fca5a5;    /* 미납 배지 글자 / 빨간 버튼 hover 배경 */
  --blu-t:#1e40af;--blu-bdr:#bfdbfe;--blu-ll:#eff6ff;   /* 정보 배지 글자 / 정보 상자 테두리·배경 */
  --pur-t:#5b21b6;--pur-tt:#6d28d9;   /* 보라 배지 글자 / 격주 표시 */
  --cyn-l:#cffafe;--cyn-t:#0e7490;    /* 앱 결제 배지 */
  --ok-h:#bbf7d0;                     /* 초록 버튼 hover 배경 */
  --ind:#6366f1;--ind-l:#e0e7ff;--ind-t:#3730a3;        /* 달력 수업 칩 (테두리 / 배경 / 글자) */
  --day-out:#fafafa;                  /* 달력에서 다른 달의 날 */
  --chip-red-t:#7f1d1d;--chip-amb-t:#78350f;--chip-off:#94a3b8;   /* 달력 칩: 미납 글자 / 부분 글자 / 취소 테두리 */
  --sel-tint:rgba(22,163,74,.09);     /* 커리큘럼 시트에서 고른 셀 (v138) */
  color-scheme:light;                 /* 스크롤바·폼 컨트롤도 밝게 */

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

/* Dark mode (v137) — 같은 이름에 어두운 값. 글꼴·간격·모서리는 그대로 */
:root[data-theme="dark"]{
  color-scheme:dark;
  --bg:#0d1321;--surf:#161e2e;--surf2:#1d2738;--surf3:#283447;
  --bdr:#283447;--bdr2:#3a475c;
  --row-hover:#1b2436;--pin-shade:rgba(0,0,0,.55);--edge-fade:rgba(0,0,0,.35);
  --txt:#e6ebf2;--txt2:#b6c0ce;--txt3:#8d99ab;
  --pri:#16a34a;--pri-h:#1fb257;--pri-l:#12341f;--pri-t:#86efac;
  --ok:#22c55e;--ok-l:#12341f;--ok-t:#86efac;--ok-h:#1a4d2e;
  --red:#f87171;--red-l:#3d1a1a;--red-t:#fca5a5;--red-h:#5c2323;
  --amb:#fbbf24;--amb-l:#3a2a0c;--amb-t:#fcd34d;--amb-bdr:#6b4e12;
  --blu:#60a5fa;--blu-l:#172554;--blu-t:#93c5fd;--blu-bdr:#1e3a8a;--blu-ll:#14203d;
  --pur:#a78bfa;--pur-l:#2e1f5e;--pur-t:#c4b5fd;--pur-tt:#c4b5fd;
  --cyn-l:#0b3340;--cyn-t:#67e8f9;
  --ind:#818cf8;--ind-l:#232a5c;--ind-t:#c7d2fe;--day-out:#111827;
  --chip-red-t:#fca5a5;--chip-amb-t:#fcd34d;--chip-off:#5b6678;
  --sel-tint:rgba(74,222,128,.13);
  --sh:0 1px 3px rgba(0,0,0,.4);--shm:0 4px 16px rgba(0,0,0,.45);--shl:0 10px 40px rgba(0,0,0,.6);
}
```

### 메인 컬러 바꾸는 법
1. `--pri`, `--pri-h`, `--pri-l`, `--pri-t` 네 값만 바꾼다. (예: 파랑 → `#2563eb / #1d4ed8 / #dbeafe / #1e3a8a`)
2. 규칙: `--pri-l`은 흰 배경과 거의 구분 안 될 만큼 연하게, `--pri-t`는 `--pri-l` 위에서 대비 4.5:1 이상.
3. 결제 완료·완료 배지 같은 "성공" 의미 색은 `--ok*`를 쓰므로 브랜드 색을 바꿔도 초록으로 남는다. 성공도 같이 바꾸고 싶으면 `--ok*`를 `--pri*`와 같게 둔다.
4. 코드 안에 `#16a34a` 같은 hex를 직접 쓰지 않는다. 항상 변수를 쓴다. (ClassDesk는 달력 상태색·차트용 데이터 색 몇 곳만 예외로 hex를 쓴다.)
5. 브랜드 색을 쓰는 곳: 사이드바 로고 글자, 활성 메뉴(배경 `--pri-l`, 글자 `--pri-t`, 아이콘 `--pri`), 초록 버튼, 스위치 on, 세그먼트 활성, 입력창 포커스 링, 링크, 선택 바.

### 다크 모드 (v137)
- `<html data-theme="light|dark">`. 설정 → 템플릿 → 화면 모드(기기 설정에 맞춤 — 기본 / 밝게 / 어둡게)가 정하고, 기기마다 `localStorage.classdesk_theme`에 둔다(동기화·백업 안 함 — `mc_`로 시작하지 않는 이유).
- `<head>`의 작은 스크립트가 첫 화면 전에 적용하므로 흰 화면이 번쩍이지 않는다. 인쇄할 때는 `beforeprint`에서 밝게 바꿨다가 `afterprint`에서 되돌린다.
- **색은 토큰만 바꾼다.** `:root[data-theme="dark"]` 블록에 같은 이름의 어두운 값이 있다. 새 색이 필요하면 `:root`에 밝은 값을, 다크 블록에 어두운 값을 같이 넣는다. hex를 직접 쓰면 다크 모드에서 그 칸만 밝게 남는다.
- v137에 더한 토큰(값은 위 2장의 두 블록): 배지·칩 글자 `--amb-t --red-t --blu-t --pur-t --pur-tt --cyn-l --cyn-t`, 상자·띠 `--amb-bdr --blu-bdr --blu-ll`, hover `--ok-h --red-h`, 달력 `--ind --ind-l --ind-t --day-out --chip-red-t --chip-amb-t --chip-off`, 커리큘럼 시트 선택 `--sel-tint`(v138), 그리고 `color-scheme`.
- 다크 값 규칙: 글자(`--txt*`, 강조색)는 `--bg/--surf/--surf2` 위에서 4.5:1 이상, `--x-t`는 `--x-l` 위에서 4.5:1 이상. `design4-test.js`가 확인한다.
- 밝은 화면은 v136과 계산된 색이 한 칸도 다르지 않아야 한다(토큰으로 옮길 때 값을 그대로 둔다).

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
.fbar input[type=text],.fbar input[type=search]{width:280px!important;height:34px;font-size:12px;padding:0 10px}
/* type=search = 같은 모양 + 브라우저의 지우기(×) 버튼. 폰에서 쓰는 검색 칸(Students)에 쓴다 */
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
  줄어든다 (`@media(min-width:641px){.fbar{flex-wrap:nowrap}.fbar input[type=text],.fbar input[type=search]{flex:0 1 280px;min-width:140px}}`).
  폰(≤640px)에서는 같은 두 선택자가 `flex:1 1 100%`로 한 줄을 다 쓴다.
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
.grid-row:hover, tbody tr:hover td{background:var(--row-hover)}
.cell-main{font-weight:600;font-size:13px;color:var(--txt)}   /* 첫 열(이름/제목) */
```

- 헤더에 세로 구분선을 그리지 않는다. 열 너비 조절 손잡이는 평소 투명, hover 때만 `--pri` 선.
- 행마다 오른쪽 끝에 연필(편집) 아이콘 버튼(`.bic`). 더블클릭도 편집. 안내 문구("더블클릭하세요")는 넣지 않는다.
- 숫자·금액·시간은 `--mono`.
- 설정 → 사용자 항목에서 체크를 끈 열은 목록에서 빠진다(학생·교재·교구 v134, 수업료 v139). 헤더와 행의 그 열 트랙을 `0px`로 만들고 셀은 제자리에서 숨겨 다른 열이 어긋나지 않게 한다. 폰 카드에서는 그 칸만 `display:none`. 폭에 따라 열 구성이 바뀌는 목록(수업료: ≤1320px, ≤1000px)은 각 폭의 구성에도 같은 `0px`를 넣는다(`GRID_HIDE_PAGES.payments.bp`).
- 목록이 카드보다 넓으면 **카드 안에서 가로 스크롤**된다 — 넓이 ≤1280px(화면 반 분할, 태블릿)에서는 항상, 그보다 넓은 화면에서도 넘칠 때(`.list-scroll`, v115). 카드 밖으로 삐져나가면 안 된다. 첫 열은 고정되고(`--pin-shade` 그림자), 오른쪽 끝에 옅은 그림자(`--edge-fade`)로 "더 있음"을 표시. **예외: Books(`#page-booklib`)** — 첫 열이 선택 체크박스라 고정하지 않는다(`position:static`, 그림자 없음).

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

레벨 배지(v144): 학생 이름 옆의 `.lv-badge`는 상태가 아니라 분류라서 메인 컬러의 연한 쌍(`--pri-l` / `--pri-t`)을 쓴다. 수업 창 맨 위의 수업 설정 한 줄(`.lm-plan`)은 레벨 배지 하나와 `.tag` 칩으로 이루어지고, 값이 없으면 줄 자체를 숨긴다.

레벨테스트(v145): 페이지와 결과 창은 앱의 색 변수를 그대로 쓰고 다크 모드를 따른다(레벨 네모 `.lt-lv`는 `.lv-badge`와 같은 `--pri-l` / `--pri-t`). 학생이 푸는 화면 `#lt-screen`만 예외로, 지문 색과 글자 크기가 시험의 일부라서 **항상 밝은 화면**이고 자체 색(`--lt-*`)과 읽기용 글꼴 Andika를 쓴다. 안의 클래스는 모두 `lt-`로 시작하고 앱의 `.btn`, `.card`를 쓰지 않는다. 선생님용 조작은 길게 눌러야 동작하므로, 안내는 화면 아래 토스트가 아니라 위쪽 `#lt-hint`(누름을 가로채지 않음)로 보여 준다.

레벨테스트 리포트 창(v172): 새 창 하나에 두 벌이 들어 있다 — 학부모용(`#rp-parent`, 먼저 보임)과 선생님용(`#rp-teacher`). 위쪽 어두운 `.toolbar`에 `.seg`(흰 바탕, 고른 쪽은 `--ink` 바탕에 흰 글자, `aria-pressed`) · 인쇄 버튼 · 안내 한 줄 순서이고, 좁으면 줄바꿈한다. 인쇄할 때 `.toolbar`는 숨기고 화면에 보이는 한 벌만 나온다. 학부모용에는 레벨 글자·점수·표·그래프를 넣지 않는다: 영역 한 줄은 `.rp-area`(왼쪽 64px 이름, 오른쪽에 지금 모습 + 작은 회색 글씨로 확인 방법). 선생님용은 맨 위에 `.rp-teacher` 띠(`--amber-soft` / `--amber-ink`)로 기록용임을 밝힌다. 인쇄할 때 학부모용은 한 쪽에 들어가도록 조금 줄인다(`body.rv-parent`: `zoom:.9`, 줄 간격 1.45, 칸 위아래 여백 6px) — 선생님용은 줄이지 않는다(v176).

종이 테스트 진행 카드·기록지 창(v176): 리포트 창과 같은 틀 — 어두운 `.toolbar`에 `.seg`(진행 카드 | 학생 기록지) · 인쇄 버튼 · 안내 한 줄, 화면에 보이는 쪽만 인쇄. 종이는 한 쪽이 `.pk-page`(화면에서는 흰 종이 한 장씩, 인쇄에서는 쪽 나눔)이고 글자는 10pt, 표는 `--ink` 0.7pt 선에 머리칸 `--bg`. 색은 인쇄용 변수(`LT_PRINT_TOKENS`)만 쓴다. 시험지 인쇄 창에서는 맨 위 `.ltsh-packs`(아래쪽에 구분선)에 `.ltsh-pack` 줄로 들어간다: 작은 버튼 + 회색 설명 — 목록이 길어 아래에 두면 보이지 않기 때문에 목록보다 위에 둔다.

시작 레벨 창(v176): 학생 한 줄(`.ltl-row`)에 왼쪽 이름(굵게, 한글 이름은 회색), 오른쪽 `.seg`(– A B C D E, 고른 것은 `.active`). 목록은 창 높이의 46%까지만 차지하고 그 안에서 스크롤한다. 붙여 넣기는 접어 둔 `<details>` 안에 둔다.

남은 영역(v177): 레벨테스트 학생 줄에서 이름·마지막 테스트 줄 아래에 `.lt-left` 한 줄 — 글자 "남은 영역"(`--amb-t`, `--fs-sm`)과 영역마다 알약 버튼(`.lt-leftb`: `--amb-l` 바탕, `--amb-bdr` 테두리, `--amb-t` 글자, 높이 28px 이상, 600px 이하 44px). "결과 확인" 버튼(`.lt-todo`)과 같은 호박색 계열로, 선생님이 할 일이 남았다는 뜻이다. 리포트 창의 `.rv-warn`은 어두운 `.toolbar` 안에서 한 줄을 다 차지하는 띠(`--amber-soft` 바탕, `--amber-ink` 글자, 굵게)이며 도구 막대와 함께 인쇄에서 빠진다.

기록지 사진 창·평가 붙여 넣기 창(v178): 기록지 창은 평가 창의 사진 구역(`.ltq-media`, `.ltm-pics` 96px 격자)을 그대로 쓴다. 학생 자세히의 머리글 줄 오른쪽에 작은 버튼 두 개(`.lt-ph-btns`: 기록지 · 모든 영역)가 나란히 놓이며 좁으면 줄바꿈한다. 평가 붙여 넣기 창은 시작 레벨 창의 붙여 넣기와 같은 모양(고정폭 글꼴 12px 입력 칸, 작은 버튼, 옆에 상태 한 줄)이고, 그 아래 미리 보기 목록(`#ltrp-list`, 높이 40vh까지)에 줄마다 `.ltrp-row` — 윗줄에 레벨 네모(22px)·이름(굵게)·영역·점수, 아랫줄에 날짜·항목별 점수·개수·메모(`--txt2`). 읽지 못한 줄(`.bad`)은 원문을 고정폭 글꼴로, 이유를 `--red-t`로 보여 준다. 적용 버튼은 확인을 거친 뒤에만 켜진다.

AI 제안(v179): 쓰기 창의 사진 구역에서 "사진 올리기" 옆에 보조 버튼 "AI로 확인"(`ti-sparkles`)이 놓인다. 제안은 사진 아래 테두리 상자(`.ltai`: `--bdr2` 테두리, 10px 둥근 모서리, `--surf` 바탕)에 나온다 — 작은 머리글, 읽은 글(고정폭 12px, 줄바꿈 유지), 회색 보조 줄(`.ltai-l`: 굵은 이름 + 내용), 레벨 네모(22px)·항목 점수·총점이 한 줄(`.ltai-s`), 그리고 주 버튼 "채점표에 넣기"와 "닫기". 읽는 중과 오류는 사진 구역의 상태 줄(`.ltm-state`, 오류는 `--red-t`)을 그대로 쓴다. 제안임이 드러나도록 머리글에 "확인이 필요한 제안"이라고 적고, 저장 버튼 색(주 버튼)은 창 아래의 저장에만 남긴다는 원칙의 예외로 "채점표에 넣기"만 주 버튼이다(저장이 아니라 옮기기이며 누른 뒤 초점이 저장으로 간다).

100점 점수(v180): 점수는 어디서나 `.lt-score`(굵게, 숫자 폭 고정)로 `52/100`처럼 쓴다 — 자세히의 영역 버튼(읽기 포함), 결과 창의 결과 줄, 붙여 넣기 미리 보기, AI 제안. 채점표의 항목 버튼(`.ltq-pt`, 44px 이상)은 0·20·40·60·80·100을 보여 주고 합계 줄의 이름은 "평균"이다. 선생님용 리포트의 영역별 수준 표는 읽기를 포함해 모든 줄에 점수 칸이 있고, 표 아래 작은 글씨로 기준(A 1–20 … E 81–100)을 한 번 적는다. 학부모용 리포트에는 점수를 넣지 않는다.

테스트용 책 고르기(v181): 책 읽기 확인 창 맨 위 구역(`.ltb-pick`)에 `.seg`(A–E, 학생의 시작 레벨이 먼저 `.active`)와 그 레벨의 책 버튼(`.ltb-chip`: 알약 모양, `--bdr2` 테두리, 높이 34px 이상·600px 이하 44px, 긴 제목은 줄바꿈)이 놓인다. 고른 책은 `.on`(`--grn` 테두리, `--grn-l` 바탕)으로 표시하고, 목록 편집을 켜면 버튼 오른쪽에 × 칸이 생긴다. 아래에 작은 버튼 두 개(레벨 …에 추가 · 목록 편집). 제목 입력 칸은 그대로 남아 다른 책도 적을 수 있다.

종이 시험과 인쇄(v147): 답 입력 버튼 `.ltp-b`는 한 줄에 번호 네 개와 `.blank`(무응답) 하나이고, 손가락으로 누르기 좋게 높이 44px 이상이다. 고른 번호(`.on`)는 앱의 다른 "선택됨" 상태와 같은 쌍(`--grn-l` 바탕, `--grn-t` 글자, `--grn` 테두리)을 쓴다. 결과 창의 구두 확인은 질문 상자 `.ltr-probe`(`--surf2` 바탕)와 버튼 줄 `.ltr-pbtns`로 이루어지고, 고른 버튼(`.on`)도 같은 쌍이다. **인쇄 창**(시험지·정답지, 이후의 리포트)은 앱과 별개의 문서라 앱의 색 변수를 볼 수 없고 종이라서 항상 밝다. 그래서 자체 토큰 묶음(`LT_PRINT_TOKENS`: `--ink`, `--muted`, `--rule`, `--bg`, `--white` 등)을 문서 맨 위에 두고 규칙에서는 그 변수만 쓴다. 인쇄 규격은 `@page{size:A4;margin:12mm 15mm}`, 시험지 한 장에 한 쪽이고(`.sh-page.brk`에서 쪽 나눔), 화면 위쪽의 인쇄 버튼 줄(`.toolbar`)은 인쇄할 때 숨긴다.

영역별 평가와 리포트(v148): 학생 줄의 "자세히" 패널(`.lt-hist`)은 작은 머리글(`.lt-ph`, 11px 대문자, `--txt2`) 아래에 영역 버튼 한 줄(`.lt-skills`)과 테스트 줄을 차례로 둔다. 영역 버튼(`.lt-skill`)은 알약 모양(높이 34px 이상, 600px 이하 44px)이고 이름 뒤에 작은 레벨 네모(22px)와 점수, 아직 평가가 없으면 + 아이콘이 온다. Reading은 버튼이 아니라 같은 모양의 표시다. 평가 창의 다섯 단계 선택지(`.ltq-opt`)는 레벨 네모와 설명 한 문단으로 된 큰 버튼이고, 고른 것(`.on`)은 `--grn` 테두리와 `--grn-l` 바탕이다. 학부모 리포트는 시험지와 같은 인쇄 창이라 `LT_PRINT_TOKENS`만 쓰고, 성장 그래프(`svg.growth`)의 색도 클래스(`.g-line`, `.g-dot`, `.g-now` 등)로 그 토큰을 가리킨다. 영역별 수준 표(`.rg-row`)는 줄 높이 40px 이상이고 선생님 평가 줄에는 평가한 날짜를 작게 적는다. 학습 목표와 추천 활동은 2단(`.rp-two`), 성장 변화는 글 왼쪽·그래프 오른쪽(`.rp-grow`, 그래프 너비 264px)이며 560px 이하에서는 모두 한 단으로 쌓는다. 선생님 의견(`.rp-note`)은 인쇄할 때 여섯 줄까지만 줄을 나누고(빈 줄은 한 줄만, 나머지는 마지막 줄에 이어 붙임) 300자를 넘으면 12.5px(`.long`)로 줄인다. 그래서 평가 네 영역, 그래프, 600자 의견이 모두 들어간 리포트도 A4 두 쪽에 들어가고, 구역(`.rp-sec`)은 쪽 사이에서 잘리지 않게 한다.

샘플 테스트와 채점표(v149): 샘플 테스트 묶음(`.lt-trial`)은 학생 줄 위에 `--surf2` 바탕으로 놓이고, 있을 때만 보인다. 줄은 자세히 패널의 테스트 줄(`.lt-hrow`)과 같다. 평가 창의 채점표(`.ltq-rub`)는 항목마다 이름과 작은 설명(`.ltq-rn`), 그 아래 0~5 버튼 여섯 개(`.ltq-pt`, 44px 이상, 고른 것은 `.ltq-opt.on`과 같은 `--grn` 테두리·`--grn-l` 바탕)를 두고, 합계 줄(`.ltq-total`)에 점수를 20px로 적는다. 자세히 패널의 점수(`.lt-score`)는 레벨 네모 옆에 `50/100`처럼 적는다. 리포트의 영역별 수준 표는 점수가 하나라도 있으면 오른쪽에 64px 점수 칸(`.rg.sc`, `.rg-score`: 점수 16px 굵게, 아래에 지난번 점수 10.5px)을 더하고, 항목별 점수와 세는 숫자는 이름 아래 작은 글씨에 적는다. 리포트 구역의 위아래 여백은 10px이다.

커리큘럼 대상 고르기(v150): 커리큘럼 표 위에 버튼 줄(`.curr-who`)을 둔다. 버튼(`.cw-chip`)은 알약 모양(높이 30px 이상, 테두리 `--bdr`)이고 고른 것(`.on`)은 `--grn` 테두리·`--grn-l` 바탕·`--grn-t` 글자다. 학생 버튼에는 이름 뒤에 레벨 글자(`.cw-lv`, 11px 굵게)를 붙이고, 학생들 앞에 작은 머리글(`.cw-label`, 11px 대문자)을 둔다. 600px 이하에서는 한 줄로 두고 가로로 밀어 보며 버튼 높이는 44px이다. 학생을 고르면 그 아래에 안내 줄(`.curr-who-info`, `--surf2` 바탕, 모서리 10px)이 나와 이름·레벨·수업 파트와 작은 버튼 두 개를 보여 준다.

커리큘럼 표 다듬기와 메뉴 순서(v152): 표 머리글의 세로선은 칸의 오른쪽 테두리 하나(`--bdr2`)이고 본문 세로선(`--bdr`)과 같은 자리에 온다. 너비 조절 손잡이는 평소에 보이지 않고 올렸을 때만 `--grn` 3px 선으로 나온다. 오른쪽에 붙어 있는 줄 도구 칸은 흐린 그림자 대신 왼쪽 테두리 1px(`--bdr2`)로 경계를 긋는다. 커리큘럼 필터 줄은 좁으면 줄을 바꾸고 연도·월 칸은 내용 너비를 지킨다(최소 112px). 표 상자의 높이는 위에 놓인 것들 아래 남은 높이에 맞춘다(`csFitBox`). 학생 버튼(`.cw-chip`)의 높이는 30px 이상(600px 이하에서는 44px)이다. 설정의 메뉴 순서 목록(`.nav-ord`, 너비 360px 이하)은 줄마다 아이콘·이름·위아래 화살표 버튼(`.bic`)이고, 못 누르는 화살표는 흐리게(불투명도 .3) 둔다.

새 화면 덜어 내기(v153): 화면 위의 설명 문단은 두지 않는다 — 버튼 이름과 한 줄짜리 안내로 충분하지 않은 것만 설명서에 적는다. 레벨테스트 학생 줄에는 할 일이 있을 때만 강조 버튼(`.lt-todo`: `--amb-bdr` 테두리, `--amb-l` 바탕, `--amb-t` 글자)이 나온다. 평가 창의 채점표 줄(`.ltq-r`)은 왼쪽에 항목 이름과 작은 설명, 오른쪽에 0~5 버튼을 한 줄로 두고 600px 이하에서 위아래로 쌓는다. 커리큘럼 도구 모음에는 안내 글을 두지 않는다. 창(`.mb`) 안쪽 여백은 `.mb`가 준다 — 내용 묶음에 여백을 또 주지 않는다(기타 수입·미납 알림·새 일정 시작일 창에서 두 번 들어가 있던 것을 뺐다). 창 바깥 바탕(`.mo`)에 좌우 16px 여백을 둔다 — 폭을 따로 정한 창도 휴대폰에서 화면 가장자리에 붙지 않는다.

레벨테스트 학생 화면의 한글 스위치(v155): 위 막대 오른쪽, 자물쇠 바로 왼쪽에 `.lt-ko` — 글자 "한글"(13px, 굵게)과 34×20px 트랙. 꺼짐은 트랙 `--lt-lock`, 글자 `--lt-muted`; 켜짐(`.on`)은 트랙과 글자 `--lt-brand`, 손잡이(16px, `--lt-surface`)가 오른쪽으로 14px. 누르는 영역 높이는 자물쇠와 같은 44px. 학생 화면이므로 앱의 색 토큰이 아니라 `--lt-*` 토큰만 쓴다. 움직임 줄이기 설정에서는 전환 효과가 없다. v156부터 이 스위치는 화면의 모든 고정 문구도 바꾼다: 켜짐은 버튼이 한국어+영어("다음 · Next", "글 크게 보기 · Show the text larger")이고 안내 문장은 한국어, 꺼짐은 모두 영어만("Next"). 학생 화면에 새 문구를 넣을 때는 반드시 두 형태를 함께 준다(`ltL`). 연습 문제 화면(v156)은 문제 화면과 같은 틀에 표시 세 가지만 더한다: 꼬리표 `.lt-extag`(알약 모양, `--lt-amber-soft` 바탕 · `--lt-amber-ink` 글자), 안내 한 줄 `.lt-exlead`(`--lt-muted`), 고른 뒤의 말 `.lt-exmsg`(맞으면 `--lt-brand`, 다시 고르라는 말은 `.lt-retry` = `--lt-amber-ink`; 높이 44px을 미리 잡아 화면이 밀리지 않게 한다). 틀렸다는 표시에 빨강은 쓰지 않는다.

커리큘럼의 계획 불러오기 줄(v157): 할 일이 있을 때만 나오는 한 줄 `.curr-plan` — `--amb-l` 바탕, `--amb-bdr` 테두리, `--amb-t` 글자, 오른쪽 끝에 작은 주 버튼 하나. 설명 문단이 아니라 "없다 + 버튼"만 적는다. 가져온 줄 표시 `.cs-flash`는 같은 `--amb-l` 바탕을 2.6초 동안 준다(셀에 칠해 둔 색보다 우선).

계획 줄의 두 번째 상태(v158): 실린 계획이 바뀌었을 때 같은 `.curr-plan` 줄에 버튼 두 개가 `.curr-plan-btns`(오른쪽 정렬, 간격 8px)로 묶여 나온다 — 보조 버튼 "그대로 두기", 주 버튼 "내 계획에 반영". 색과 높이는 첫 상태와 같다.

듣기·문법 문항(v158): 평가 창 안의 `.ltq-sec`은 `--surf2` 바탕, `--bdr` 테두리, 반경 10px의 한 덩어리로 — 제목(`.lt-ph`), 한 문단 설명(`.u-hint`), 시작 레벨 `.seg`(선택은 `.seg-btn.active`), 버튼 줄(`.ltq-sec-row`: 주 버튼 "문항 시작" 하나 + 보조 버튼 둘). 그 아래 직접 고르기 목록 앞에는 `.lt-ph.ltq-or` 제목만 둔다. 마지막 평가 한 줄 `.ltq-last`는 `--txt2`, `--fs-sm`. 학생 화면은 읽기 테스트의 틀을 그대로 쓴다(`.lt-tbar`의 "Listening B"/"Grammar B", 점 진행 표시, `.lt-opt`, `.lt-idk`, `.lt-tfoot`); 새로 생긴 것은 선생님 메뉴 안의 대본 상자 `.lt-xscript`(읽기용 글꼴 16px/1.6, `--lt-line` 테두리)뿐이다. 인쇄물은 `LT_SHEET_CSS`에 `LT_SEC_CSS`(대본 `.sh-say`, 문항 목록 `.sh-says`)만 더한다.

책 읽기 확인(v160): 학생 자세히 패널 안에서 영역 칩 다음에 오는 블록. 제목은 `.lt-ph`, 그 아래 구분별 책 목록 `.lt-bk-sum`(작은 알약 `.lt-bk-band` + 책 제목들), 기록 행은 테스트 기록과 같은 `.lt-hrow`(날짜 `.lt-hdate`, 내용 `.lt-htext`, 오른쪽에 알약과 휴지통 `.bic`), 맨 아래 `.lt-bk-add`에 작은 버튼. 알약 색은 뜻과 묶여 있다 — 혼자 읽기 편함 `--grn-l`/`--grn-t`, 수업용 `--amb-l`/`--amb-t`, 아직 어려움 `--red-l`/`--red-t` — 다크 모드에서도 같은 토큰을 쓴다. 입력 창은 평가 창과 같은 틀(`.fg`, 두 칸 `.ltq-counts`)이고 결과 줄 `.ltb-res`가 정확도(굵게)와 알약을 바로 보여 준다.

레벨별 과제와 인쇄 목록(v161): 말하기·쓰기 평가 창의 과제 블록은 듣기·문법의 `.ltq-sec`을 그대로 쓴다 — 레벨 `.seg`, 과제 한 문단 `.ltq-task`(아래 작은 글씨로 한국어나 물어볼 질문), 주 버튼 "과제 보여 주기"와 보조 버튼 하나. 학생 화면의 과제는 읽기용 글꼴 26px 굵게 가운데(`.lt-xtask`), 그림은 84px(`.lt-xpics`), 따라 쓸 문장은 점선 상자(`.lt-xmodel`). 시험지 인쇄 목록은 레벨 줄마다 읽기 세트 뒤에 네 영역 체크박스가 이어지고, 레벨 표시는 `.bic` 버튼(한 묶음 선택)이다. 인쇄물은 `LT_SEC_CSS`에 과제 상자 `.sh-task`, 따라 쓸 문장 `.sh-model`, 그림 `.sh-pics`, 줄 `.sh-lines`(36px 간격)을 더했다.

선생님 대본 창(v162, `#mo-lt-script`): 위에 `.seg` 두 개(레벨, 영역 — 터치 기기에서는 높이 44px, 버튼 38px·너비 44px 이상), 아래에 읽을 글. 읽어 줄 글은 읽기용 글꼴 17px/1.7(`.ltsc-say`), 긴 글은 `--surf2` 상자(`.ltsc-pass`), 문항은 번호가 왼쪽 칸에 있는 목록(`.ltsc-list`, 줄 사이 `--bdr` 선), 정답은 문항 아래 작은 초록 글씨(`.ltsc-ans`, `--grn-t`). 색은 모두 앱 토큰이라 다크 모드를 그대로 따른다(학생 화면 `#lt-screen`의 고정 색과 다르다). 바닥 왼쪽의 정답 가리기는 정답이 없는 영역에서 자리를 지킨 채 숨는다(`visibility`). 페이지 위쪽 버튼 줄은 `#page-leveltest`에서만 900px 이하에서 줄바꿈한다.

커리큘럼의 레벨 칸(v163): 한 주가 한 줄이고 쓰기·말하기·문법은 각각 세 칸(A·B, C, D·E)이다. 머리글은 한 줄 그대로 두고 영역 이름 옆에 레벨 배지(`.lv-badge.cs-sub`)를 붙인다 — 두 줄 머리글은 열 너비 조절·고정 열·필터와 맞물려 있어 쓰지 않는다. 영역이 바뀌는 첫 칸(`th.cs-g1`)은 왼쪽에 `--bdr2` 2px 선으로 묶음을 나눈다. 모든 레벨 공통 글은 세 칸을 가로로 병합한 넓은 한 칸이다(시트의 기존 병합 그대로). 기본 너비: 쓰기·말하기 190px, 문법 150px. 주제 창의 레벨 칸(`.cm-lv`)은 왼쪽 44px에 레벨 이름, 오른쪽에 입력 칸이 오는 세 줄이다. 폰 카드에서는 레벨 칸마다 한 줄("쓰기 A·B")이고, 공통 글은 레벨 이름 없이 한 번만 쓴다.

파닉스·어휘 문항(v164): 학생 화면은 듣기·문법과 같은 틀이다. 낱말 하나만 묻는 문항(어휘 A의 "apple")은 읽기용 글꼴 32px 굵게 가운데(`.lt-qword`)로 크게 보여 준다. 선생님 대본 창의 영역 버튼은 여섯 개라 좁은 화면에서 두 줄로 줄바꿈한다(`#ltsc-top .seg`의 `flex-wrap`).

녹음·사진 칸(v165, `#ltq-media`): 평가 창의 과제 칸과 같은 상자(`.ltq-sec`)를 쓴다. 녹음은 한 줄에 날짜·길이, 브라우저 기본 재생기(높이 40px), 휴지통. 사진은 정사각 썸네일 격자(`.ltm-pics`, 최소 96px, 모서리 8px, `object-fit:cover`) 아래에 날짜와 휴지통. 녹음 중에는 빨간 점(`.ltm-dot`, 깜박임 — `prefers-reduced-motion`에서는 멈춤)과 시계(`--red-t`, tabular-nums), 주 버튼은 "멈추고 저장". 상태 줄(`.ltm-state`)은 작은 글씨, 오류는 `--red-t`. 파일 선택 input은 화면에 두지 않고 버튼이 연다. 크게 보기 창은 사진을 70vh 안에서 스크롤한다.

영역 사이 창(v166, `#mo-lt-all`): 일곱 영역을 한 상자 안의 줄(`.lta-list`, 줄 높이 44px 이상, 줄 사이 `--bdr`)로 보여 준다. 끝난 줄은 초록 체크와 레벨 배지, 다음 차례는 `--grn-l` 바탕에 굵은 글씨와 ▶, 건너뛴 줄은 `--txt3`와 –, 남은 줄은 빈 동그라미. 아래에 "다음: 듣기"(17px 굵게)와 한두 줄 안내, 바닥 왼쪽에 여기서 마치기, 오른쪽에 건너뛰기와 주 버튼 시작. 상태는 색만이 아니라 아이콘과 글자로도 구분한다.

리포트의 영역별 다음 목표(v167, `.rp-goal`): 책 읽기 줄(`.rp-bk`)과 같은 두 칸 격자 — 왼쪽 104px에 영역 이름(굵게), 오른쪽에 목표 문장, 13.5px. 아래에 작은 회색 안내 한 줄(`.rp-small`). 긴 메모와 목표 문장은 `overflow-wrap:anywhere`로 좁은 화면에서도 넘치지 않는다.

학생 화면의 자물쇠(v168, `.lt-lock`): 아이콘만 있던 44px 버튼에 "선생님" 글자(`.lt-lockt`, 12px 굵게, `--lt-muted`)를 붙였다 — 누가 누르는 것인지 보이게. 누르는 영역은 그대로 44px 이상이고, 360px 미만에서는 글자를 숨겨 윗줄이 넘치지 않는다. 아이콘 색은 전과 같은 `--lt-lock`(학생 눈에 띄지 않는 회색). 레벨테스트 페이지의 "이 기기는 로그인되어 있지 않습니다" 줄(`#lt-nosync`)은 커리큘럼의 계획 알림과 같은 `.curr-plan`(연한 호박색 띠 + 작은 버튼)을 그대로 쓴다 — 새 스타일 없음.

길게 누르는 컨트롤의 진행 막대(v182, `#lt-screen [data-hold].lt-holding::after`): 누르고 있는 동안 컨트롤 아래쪽 가장자리에 높이 5px 막대가 왼쪽에서 오른쪽으로 1.2초(누르는 시간과 같음)에 걸쳐 찬다 — 색 `--lt-amber`, 등속. 버튼(`.lt-btn[data-hold]`)은 둥근 모서리 밖으로 막대가 나가지 않게 `overflow:hidden`. 손을 떼면 바로 사라진다. 움직임 줄이기 설정에서는 차오르지 않고 처음부터 꽉 찬 막대로 "누르는 중"만 알린다.

신문 찾기 창(v183, `#mo-news`): 폭 980px 창(휴대폰은 화면 폭). 위에서부터 — 이 창이 어느 주를 위한 것인지 한 줄(`.nw-week`, `--surf2` 바탕, 그 주의 메인 토픽은 노란 배지 `.badge.bpa`), 탭(`.seg`: 이 주 추천 · 검색 · 주제별 · 즐겨찾기 · 사용 기록)과 검색 칸, 필터 줄(신문 · 출판사 난이도 · 추천 레벨 · 주제 · 순서 `select`, 스위치 둘), 결과. 기사 한 건(`.nw-row`)은 줄 구분선만 있는 목록이고 순서가 정해져 있다: 제목(14px 굵게)과 별 → **신문 · 호수 · 날짜**(굵게, `.nw-k`) · 쪽 · 분야 — 종이 신문을 꺼낼 때 보는 정보가 제목 바로 아래 → 출판사 난이도 / 추천 레벨(`.lv-badge`) / 토픽(12px `--txt2`) → 세부 주제·키워드 알약(`--surf2`, 11px; 제목만으로 분류한 경우 "추정" 문구) → 맞는 이유(12px) → 사용 기록(`--ok-t`) → 메모(`--amb-l` 바탕) → 버튼 줄(`.btn-sm`). 그 주에 고른 기사는 왼쪽에 3px 초록 선(`.nw-row.on`)과 채워진 버튼. 주제별 탭은 180px 이상 칸의 격자 버튼(`.nw-topic`: 이름, 다른 언어 이름, 오른쪽에 기사 수; 0건은 흐리게). 커리큘럼 줄의 신문 버튼(`.cs-news`)은 `ti-news` 아이콘이고, 고른 기사가 있으면 초록색과 개수. 터치 기기에서는 최근 검색 알약 36px, 빼기 버튼 32px 이상.

학생 화면의 영역 줄(v169, `.lt-tabs`): 막대 바로 아래 한 줄, 가로로 넘치면 줄 안에서만 밀린다(스크롤바 숨김). 영역 하나(`.lt-tab`)는 높이 44px 이상, 13px 굵은 글씨, 평소 `--lt-muted`; 지금 영역(`.on`)은 `--lt-brand-soft` 바탕에 `--lt-brand` 글씨. 끝난 영역은 뒤에 작은 체크(`.done::after`), 진행 중인 영역은 호박색 점(`.run::after`, 6px). 자물쇠처럼 선생님이 쓰는 부분이라 눈에 띄지 않게 회색 계열로 두었다. 쉬는 화면은 기존 가운데 정렬 화면(`.lt-mid`, `.lt-tbig`)을 그대로 쓴다.

터치 화면에서 누르는 자리(v170): 아이콘 버튼(`.bic`)은 휴대폰 26px, 태블릿 30px로 손가락에는 작다. 보이는 크기와 위치는 그대로 두고, 터치 기기(`pointer:coarse`)에서만 보이지 않는 `::after`로 누르는 자리를 사방 6px씩(창 제목줄의 X는 9px씩, 약 44px) 넓힌다. 대시보드의 눈 버튼(`.sc-eye`)도 같다. 한 줄 선택(`.seg`)은 터치 기기에서 높이 42px, 안의 버튼 36px. 새 아이콘 버튼을 만들 때는 `.bic`를 쓰면 이 규칙을 그대로 받는다. 앱의 토스트는 평소 화면 아래 가운데, 레벨테스트 학생 화면이 열려 있는 동안에는 위쪽(학생이 누르는 "다음" 버튼을 가리지 않게).

"커리큘럼 외" 표시(v175): 커리큘럼으로 수업하지 않는 학생은 어디서나 같은 배지 하나 — `.badge.bpa.off-plan`(노란 배지, 이름과 6px 간격; 수업 창 맨 위 줄 `.lm-plan` 안에서는 간격 0). 학생 목록·레벨테스트 줄의 이름 옆과 수업 창 맨 위 줄의 첫머리에 둔다. 커리큘럼 페이지의 버튼 줄(`.curr-who`)에서는 버튼을 주지 않고, 버튼들 뒤에 `.cw-label` "커리큘럼 외" + `.cw-off`(누를 수 없는 이름 목록, `--txt2`)로 적는다; 폰에서는 줄이 가로로 스크롤되므로 줄바꿈하지 않는다.

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

### Keyboard focus (v136)
```css
:where(button,a[href],summary,[role="button"],[tabindex]:not([tabindex="-1"]),label.btn):focus-visible{outline:2px solid var(--grn);outline-offset:2px}
input[type="checkbox"]:focus-visible,input[type="radio"]:focus-visible{outline:2px solid var(--grn);outline-offset:2px}
.sw input:focus-visible+.sw-track{outline:2px solid var(--grn);outline-offset:2px}   /* 스위치: input은 투명이라 트랙에 */
```
누를 수 있는 것은 키보드(Tab)로 왔을 때 초록 테두리가 보여야 한다. `:focus-visible`이라 마우스·터치에는 안 보인다. 새 버튼에 `outline:none`을 주지 말 것. 마우스용으로 `outline:none`을 준 포커스 상자(예: 책 표지·PDF 칸)는 같은 요소에 `:focus-visible` 규칙을 따로 둔다. 클릭되는 `div`를 새로 만들 땐 `button`을 쓰거나 `tabindex="0"`과 Enter 처리를 같이 붙인다.

v139부터: 누르는 것은 `<button type="button">`이 기본이다. 안에 체크박스 같은 다른 컨트롤이 있어 `button`이 될 수 없는 것(달력 칩)만 `tabindex="0" role="button"`을 단다. 문서 전체 keydown 처리기가 이런 요소에서 Enter/Space를 클릭으로 바꾼다(한글 조합 중이면 무시). 자식 컨트롤은 따로 Tab으로 닿는다. 버튼으로 바꾼 것은 기본 버튼 모양을 지우고 원래 모양을 그대로 쓴다:
```css
.x-btn{background:none;border:0;padding:0 4px;color:var(--txt3);line-height:1}        /* 창 닫기 × — title·aria-label 필수 */
.sf-day{padding:6px 0;border-radius:6px;border:0;background:var(--surf2)}             /* 날짜 고르기 칸; 오늘 .today = --grn 배경, 흰 글자 */
.gb-res{display:flex;gap:8px;width:100%;padding:7px 10px;border:0;border-bottom:1px solid var(--bdr);background:none;text-align:left}  /* 검색 결과 한 줄 */
.cover-pick{padding:0;border:2px solid transparent;border-radius:6px;background:none}  /* 표지 고르기; hover 때 테두리 --grn */
button.ph-chip{line-height:1.5}                                                       /* 자리표시 칩: 모양은 .ph-chip 그대로 */
```
떠 있는 고르기 창(표지 고르기 등)은 Escape로 닫고, 그 Escape가 뒤의 창까지 닫지 않도록 `preventDefault()`·`stopPropagation()`을 함께 부른다.

### 커리큘럼 시트 (v138–v140, 태블릿·PC)
```css
#curr-body td.cs-in{box-shadow:inset 0 0 0 9999px var(--sel-tint)}          /* 고른 칸 */
#curr-body td.cs-act{outline:2px solid var(--grn);outline-offset:-2px}      /* 지금 칸 (시트에 포커스가 있을 때) */
#curr-body td.cs-hit{box-shadow:inset 0 0 0 2px var(--amb)}                /* 찾기 결과 */
#curr-body td.cs-b{font-weight:700} .cs-i{font-style:italic} .cs-s .cs-v{text-decoration:line-through;color:var(--txt3)}
#curr-body td.cs-note{background-image:linear-gradient(225deg,var(--amb) 6px,transparent 6px)}  /* 메모 있는 칸: 오른쪽 위 삼각형 */
.cs-fh{width:8px;height:8px;background:var(--grn);border:1px solid var(--surf)}  /* 채우기 핸들: 고른 범위 오른쪽 아래 */
.cs-notetip{background:var(--amb-l);border:1px solid var(--amb-bdr);border-radius:6px}  /* 고른 칸 아래 메모 */
.cs-menu{position:fixed;background:var(--surf);border:1px solid var(--bdr);border-radius:10px;box-shadow:var(--shl);padding:6px;min-width:230px;
  max-height:calc(100vh - 16px);overflow-y:auto}                             /* 오른쪽 클릭 메뉴: 창보다 길면 세로로 스크롤 */
```
- 도구 막대(`.cs-sheetbar`)는 카드 머리에 한 줄: 실행 취소·다시 실행 | B I S | 병합·색 | 정렬·필터 | 찾기 | 줄 높이. 1100px 이하에서는 버튼 글자를 숨기고 아이콘만(`.cs-lbl`). 필터가 걸리면 "필터 해제" 버튼과 그 열 머리글 아래 초록 선(`th.cs-filt`).
- 찾기 막대(`.cs-find`)는 도구 막대 바로 아래 `--surf2` 띠. 필터 창(`.cs-fpop`)과 메모 창(`.cs-notebox`)은 `.cs-menu`와 같은 떠 있는 상자이며 Esc로 닫는다.
- 메뉴 명령이 새 입력창(메모 등)을 열면 포커스는 그 입력창에 남고, 그렇지 않으면 시트로 돌아간다.
- 폰(≤640px)에서는 이 도구들을 모두 숨기고 카드 목록을 쓴다. 카드 첫 줄은 달 · `Wk n` · 분류이고, 주가 없는 주제(계획에서 2028로 넘어가 달·주가 비어 있는 줄)는 `Wk`를 쓰지 않는다 — `#page-curriculum td[data-c="1"]:empty::before{content:none}` (v171). 이 규칙은 폰 카드에만 해당한다: 태블릿·PC의 시트에는 `Wk` 글자가 없다.

### 비교/동기화 창 (Google Calendar)
외부 데이터와의 차이는 **차이만** 목록으로, 행마다 하나의 동작 버튼(추가 / 취소 / 시간 맞추기). 자동 반영 없음.
같은 목록 규격(`.grid-head/.grid-row`)을 쓰고, 알 수 없는 항목은 `--amb-l` 배경 + 선택 상자. 통계 카드 4개로 요약.

### Modal
- 폰(≤640px)에서는 버튼 줄(`.mf`)이 모달 바닥에 **sticky** — 긴 폼을 끝까지 내리지 않아도 Save/Cancel이 보인다.
- PC에서는 열리자마자 첫 입력칸에 포커스(`openModal`). 터치 기기는 키보드가 튀어나오므로 포커스하지 않는다.
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

- **편집**: 행 더블클릭 또는 연필 아이콘 → 모달. 저장은 즉시 localStorage + 클라우드 동기화. 목록이 바로 바뀌므로 별도 문구 없음.
- **설정 저장**: 화면이 바뀌지 않는 저장(템플릿·API 키·로고·라이브러리 이름)은 아래 가운데 2초 토스트 `✓ Saved`
  (`showToast()`, Undo 토스트와 같은 모양, 버튼 없음). `alert()`는 쓰지 않는다.
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
| ≤1280px (반 분할, 태블릿) | 넓은 목록은 카드 안에서 가로 스크롤, 헤더 sticky 해제, 통계 카드 그대로. `1fr` 컬럼은 160px 하한 (고정 컬럼이 카드보다 넓어지면 fr 컬럼이 0px로 사라지기 때문). 들어가는 목록에는 오른쪽 "더 있음" 그림자를 그리지 않는다(`.list-fits`) |
| 641–1300px (v141) | 학생·교재·교구 목록이 넘치면 덜 중요한 열부터 접는다(이름은 접지 않음). 목록 위 `.fold-note` 한 줄에 접힌 열 이름과 "모두 보기"(→ 가로 스크롤, 기기별로 기억) / "화면에 맞추기" 버튼 |
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
