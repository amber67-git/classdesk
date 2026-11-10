# ClassDesk

영어 리딩 수업용 학생·수업·수업료·도서 관리 앱. 파일 하나(`index.html`)로 돌아가며 빌드 과정이 없다.

- **주소:** https://amber67-git.github.io/classdesk/
- **배포:** GitHub Pages가 `main` 브랜치를 그대로 서비스한다(브랜치 배포, 빌드 없음). 푸시하고 1~2분 뒤 반영된다.
- **설치(홈 화면 앱):** Android Chrome → 메뉴 ⋮ → **앱 설치**(또는 홈 화면에 추가). iPhone/iPad Safari → 공유 → **홈 화면에 추가**.
- **배포 전 검사:** `node .github/scripts/validate.mjs` (PR과 `main` 푸시 때 CI에서도 실행된다)

## 주소(origin) 규칙 — 모든 앱 공통

`amber67-git.github.io` 아래의 GitHub Pages 사이트들(`/classdesk/`, `/studydesk/` …)은 폴더만 다를 뿐 **사이트 주소(origin)가 하나**다. 2026-11-04에 실제로 확인한 문제:

- **현재 Android Chrome**은 같은 origin에 웹앱(PWA)을 **하나만** 설치한다(경로가 다른 PWA 설치가 막히는 것은 Chromium에 버그로 보고돼 있다: issues.chromium.org/issues/572287931, 중복 568841400. 고쳐질 수 있지만 그때까지는 이 전제로 간다). ClassDesk가 깔려 있으면 StudyDesk가 "This app is already installed"로 막히고, 반대도 마찬가지였다. manifest의 `id`·`scope`를 폴더별로 줘도 풀리지 않았다(`chrome://webapks`로 확인).
- 같은 origin의 앱들은 localStorage·IndexedDB·서비스 워커 캐시·저장 용량(localStorage 약 5MB)을 **같이 쓴다.** 어느 한 앱에서 **"사이트 데이터 삭제"를 누르면 모든 앱의 데이터가 같이 지워진다.**

그래서:

1. 폰에 설치해서 쓰는 앱은 **앱마다 자기 origin**을 가진다.
2. **ClassDesk만 `https://amber67-git.github.io/classdesk/`에 남는다.** 수업료 데이터와 Firebase 승인 도메인이 이 주소에 묶여 있기 때문이다.
3. **이 origin에는 다른 설치형 앱을 새로 올리지 않는다.**
4. 그 밖의 앱은 저장소마다 **Netlify 사이트**를 하나씩 만들어 `https://amber-<앱이름>.netlify.app`로 배포한다. 첫 사례: StudyDesk → https://amber-studydesk.netlify.app/ (studydesk 저장소 PR #10).
   - 소유자의 Netlify 계정(GitHub 로그인) → **Add new site → Import an existing project → GitHub** → 그 저장소만 선택한다.
   - 빌드가 없는 앱은 Base directory·Build command·Publish directory를 **모두 비운다.**
   - 첫 배포가 성공하면 공개 상태를 확인하고, 비공개면 **Make public**을 누른다(새 사이트는 보통 비공개로 시작해서 로그인 없이는 열리지 않는다). 그리고 Project configuration → **Change project name**으로 `amber-<앱이름>`을 준다.
   - 마지막으로 로그인하지 않은 시크릿 창에서 새 주소가 열리는지 확인한다. 안 열리면 아직 비공개다.

   브라우저 데이터는 주소마다 따로라서 새 주소는 빈 상태로 시작한다. 그래서 기기마다:
   - 옛 주소의 앱에서 백업(내보내기)을 받는다. 내보내기 기능이 없는 앱은 옮기기 전에 먼저 만든다.
   - 새 주소에서 그 파일을 불러오고, 주요 기록이 그대로 보이는지 확인한다.
   - 확인이 끝나기 전에는 옛 주소의 앱을 지우지 않는다. 지울 때도 아래처럼 **앱만** 지운다.
5. 앱은 한 번에 하나씩 옮긴다. 안드로이드 설치 문제는 추측으로 고치지 말고 `chrome://webapks` 화면과 설치 창 스크린샷으로 먼저 확인한다.

### 다른 앱을 옮길 때 ClassDesk 데이터 지키기

다른 앱의 옛 주소(`amber67-git.github.io/<앱>/`)로 설치해 둔 앱을 폰에서 지울 때는 **설정 → 애플리케이션에서 앱만 삭제**하고, **"사이트 데이터 삭제"·"저장공간 지우기"는 절대 누르지 않는다.** 같은 origin에 있는 ClassDesk 데이터까지 지워진다. 지운 뒤에는 Chrome 주소창에 `chrome://webapks`를 입력해 ClassDesk가 남아 있는지 확인한다. v116(2026-11-04) 이후에 설치한 ClassDesk는 Manifest Id가 `https://amber67-git.github.io/classdesk/app`, Start URL이 `https://amber67-git.github.io/classdesk/`로 나온다. Manifest Id가 `https://amber67-git.github.io/`로 나오면 v116 이전에 설치한 것이니, 먼저 Export로 백업한 뒤 앱만 삭제하고 다시 설치한다(앱 안 설명서 FAQ 참고).

## 절대 바꾸지 말 것

| 항목 | 값 | 바꾸면 |
|---|---|---|
| 주소 | `https://amber67-git.github.io/classdesk/` | 기기에 저장된 데이터와 Firebase 로그인이 새 주소에서 보이지 않는다 |
| manifest `id` | `"/classdesk/app"` (= `https://amber67-git.github.io/classdesk/app`). v116(2026-11-04, PR #4)에서 `"./"`를 바꾼 값이다. `id`는 폴더가 아니라 origin 기준으로 풀리므로 `"./"`는 사이트 전체(`https://amber67-git.github.io/`)를 뜻했다. 당시엔 이것이 StudyDesk 설치 충돌의 원인이라고 봤지만 **아니었다**: 고친 뒤에도 StudyDesk를 깔자 이번엔 ClassDesk가 "이미 설치됨"으로 막혔다. 진짜 원인은 위의 "현재 Android Chrome의 같은 origin 설치 제한(Chromium 버그 572287931)"이다. 경로 기준 id 자체는 올바른 값이라 그대로 둔다 | 설치된 앱이 또 다른 앱으로 취급되어 모든 기기에서 다시 설치해야 한다 |
| manifest `start_url`, `scope` | `"./"` | 앱이 이 폴더 밖을 열거나 설치 범위가 바뀐다 |
| localStorage 키 이름 | `mc_*`(데이터), `cd_*`(기기 전용), `gcse_*` | 저장된 데이터를 못 읽는다 |
| 서비스 워커 캐시 이름 | `classdesk-shell` | — (자기 캐시만 쓰고 다른 캐시는 지우지 않는다) |

코드의 경로는 모두 상대 경로다(`sw.js`, `icons/…`, `manifest.webmanifest`). `/classdesk/` 같은 절대 경로를 넣지 않는다.

## 데이터가 있는 곳

- **localStorage** — `mc_*`: 학생·수업·수업료·도서·설정 등 앱 데이터(로그인하면 클라우드와 동기화). `cd_*`: 이 기기에서만 쓰는 값(가리기 상태, PIN 신뢰, 미수금 알림 시각 등). `gcse_api_key`·`gcse_cx`: 표지 검색 키.
- **IndexedDB** — Firebase 로그인 상태와 Firestore 오프라인 캐시(Firebase가 관리).
- **Firestore** — 프로젝트 `mychalkboard`. 로그인한 기기끼리 데이터를 맞춘다.

## 백업

설정 → **Backup** → **Export**가 JSON 파일 하나를 내려받는다: `{ "app": "classdesk", "version": 1, "exportedAt": …, "data": { mc_* …, gcse_api_key, gcse_cx } }`. **Import**는 기존 `mc_*` 키를 지운 뒤 파일의 `mc_*`·`gcse_api_key`·`gcse_cx`만 써 넣는다. 그 밖의 키(다른 앱의 데이터)는 건드리지 않는다. **백업 파일은 남에게 보내지 않는다.** 학생 이름·연락처, 수업, 수업료 기록이 모두 들어 있고, 표지 검색 키(`gcse_api_key`·`gcse_cx`)도 들어 있다. 문제를 보여 주려고 꼭 보내야 하면 학생 정보와 금액을 지우거나 가짜 값으로 바꾸고, 두 키도 지운 사본을 보낸다.

## 로그인(Firebase)

- Auth 도메인: `mychalkboard.firebaseapp.com`
- 승인 도메인(Authentication → Settings → Authorized domains)에 `amber67-git.github.io`가 있어야 한다.

## 같은 origin 점검 기록 (2026-11-04)

같은 주소에 있는 다른 공개 저장소의 저장 키와 서비스 워커를 읽어 ClassDesk와 겹치는지 확인했다.

| 앱 | localStorage 키 | 서비스 워커 캐시 정리 |
|---|---|---|
| ClassDesk | `mc_*`, `cd_*`, `gcse_*` | 지우지 않음 |
| StudyDesk | `study-notes-app-chalkboard-v2`(+`:sync-*`) | `studydesk-`로 시작하는 자기 캐시만 |
| my-fit | `wwt.*` | `myfit-shell-`로 시작하는 자기 캐시만 |
| diet-tracker | `dmt_*` | 서비스 워커 없음 |
| vela | `ml_*` | 서비스 워커 없음 |
| Chalk, subtitle | 없음 | 서비스 워커 없음 |

겹치는 키가 없고, 남의 캐시를 지우는 서비스 워커도 없다. 다만 저장 용량(약 5MB)은 다른 앱들이 이 주소를 떠날 때까지 함께 쓴다. 설정 → Backup의 사용량 막대는 이 주소 전체의 사용량이다.

## 설명서(Settings → Guide) 갱신 규칙 — 2026-11-08 소유자 요청

앱 안 Guide(`index.html`) 끝에 **"What's new — recent changes"**(버전 · 날짜 · 한 줄, 최신이 위)와 기준 줄 `Guide written against version: <b>vNNN</b>`이 있다.

- 사용자가 체감하는 변경(동작·화면·주소·설치·데이터)은 **같은 PR에서** What's new 맨 위에 한 줄 더하고, 바뀐 기능의 Guide 섹션·FAQ도 같이 고친다.
- 기준 줄의 버전은 **모든 배포에서** `APP_VERSION`과 같게 올린다. 문서만 바뀐 버전은 What's new 줄을 생략해도 되지만 기준 줄은 올린다. `validate.mjs`가 두 값이 다르면 실패시킨다.
- 내부 수정(코드 정리, 리뷰 반영)은 What's new에 넣지 않는다.

## 언어(한국어 / English) 규칙 — v124부터

앱의 메뉴·버튼·안내문은 영어와 한국어 두 가지다. Settings → Templates → **Language**에서 고르며(기본값은 기기 언어), 값은 설정(`mc_settings.lang`)이라 기기 간에 동기화된다. 사용자가 직접 입력한 내용(이름·메모·템플릿)은 번역하지 않는다.

- **영어 원문이 곧 사전의 키다.** 스크립트에서는 `tx("Add student")`, 마크업에서는 그 요소에 `data-i18n`을 붙인다(`data-i18n-ph` = placeholder, `data-i18n-title` = title, `<select data-i18n-opts>` = 옵션 전체). 한국어는 `index.html`의 `/* i18n-dict-start */ … /* i18n-dict-end */` 사이 `I18N.ko`에 한 줄씩 적는다.
- `data-i18n`은 **그 요소의 직접 텍스트만** 바꾼다. 자식 요소 안의 글은 자식에 따로 표시한다. 숫자·이름이 들어가는 문장은 `{n}` 자리표시자를 쓴다: `tx("{n} students",{n})`.
- 같은 영어 단어가 문맥에 따라 다른 한국어가 되면 `"new|tenure"`처럼 `|` 뒤에 문맥을 적는다. `|` 뒤는 화면에 나오지 않는다.
- 저장되는 값은 바꾸지 않는다. 시간표는 여전히 `"Mon 15:45"`로 저장되고, 화면에 보일 때만 `schedLabel()`이 요일을 번역한다.
- 번역 함수 이름은 `t`가 아니라 **`tx`**다(파일 안에 `t`라는 지역 변수가 수십 개 있다). `validate.mjs`가 `tx`라는 지역 변수가 생기면 실패시킨다.
- **교차 검증 두 가지.** ① `node .github/scripts/validate.mjs`(CI에서도 실행): 마크업과 스크립트가 쓰는 모든 키를 모아 한국어가 없는 키, 아무 데서도 쓰지 않는 한국어 줄, 번역할 수 없게 표시된 마크업을 실패로 보고한다. ② `NODE_PATH=$(npm root -g) node .github/scripts/i18n-sweep.mjs [--pages dashboard,students]`(배포 전에 손으로, Playwright 필요): 앱을 한국어로 열어 화면 구조 요소(메뉴·제목·버튼·라벨·열 머리글·placeholder·툴팁·빈 상태)에 남은 영어를, 영어로 열어 새어 나온 한국어를 페이지별로 나열한다. 데이터 행은 보지 않는다.
- 진행 상황: v124 = 사이드바·대시보드·학생·학생 카드·설정 탭. 나머지 페이지와 Guide는 다음 버전들에서 순서대로.

## 기타

- 프로젝트 인수인계 메모 `CLAUDE.md`는 실제 학생 정보가 들어 있어 저장소에 올리지 않는다(`.gitignore`). `validate.mjs`가 이 파일이 저장소에 들어오면 실패시킨다.
- 화면 디자인 규칙은 [`DESIGN.md`](DESIGN.md).
