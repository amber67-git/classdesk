# ClassDesk

영어 리딩 수업용 학생·수업·수업료·도서 관리 앱. 파일 하나(`index.html`)로 돌아가며 빌드 과정이 없다.

- **주소:** https://amber67-git.github.io/classdesk/
- **배포:** GitHub Pages가 `main` 브랜치를 그대로 서비스한다(브랜치 배포, 빌드 없음). 푸시하고 1~2분 뒤 반영된다.
- **설치(홈 화면 앱):** Android Chrome → 메뉴 ⋮ → **앱 설치**(또는 홈 화면에 추가). iPhone/iPad Safari → 공유 → **홈 화면에 추가**.
- **배포 전 검사:** `node .github/scripts/validate.mjs` (PR과 `main` 푸시 때 CI에서도 실행된다)

## 주소(origin) 규칙 — 모든 앱 공통

`amber67-git.github.io` 아래의 GitHub Pages 사이트들(`/classdesk/`, `/studydesk/` …)은 폴더만 다를 뿐 **사이트 주소(origin)가 하나**다. 2026-11-04에 실제로 확인한 문제:

- Android Chrome은 **한 origin에 웹앱(PWA)을 하나만** 설치한다. ClassDesk가 깔려 있으면 StudyDesk가 "This app is already installed"로 막히고, 반대도 마찬가지였다. manifest의 `id`·`scope`를 폴더별로 줘도 풀리지 않았다(`chrome://webapks`로 확인).
- 같은 origin의 앱들은 localStorage·IndexedDB·서비스 워커 캐시·저장 용량(localStorage 약 5MB)을 **같이 쓴다.** 어느 한 앱에서 **"사이트 데이터 삭제"를 누르면 모든 앱의 데이터가 같이 지워진다.**

그래서:

1. 폰에 설치해서 쓰는 앱은 **앱마다 자기 origin**을 가진다.
2. **ClassDesk만 `https://amber67-git.github.io/classdesk/`에 남는다.** 수업료 데이터와 Firebase 승인 도메인이 이 주소에 묶여 있기 때문이다.
3. **이 origin에는 다른 설치형 앱을 새로 올리지 않는다.**
4. 그 밖의 앱은 저장소마다 **Cloudflare Pages 프로젝트**를 하나씩 만들어 `https://<프로젝트명>.pages.dev`로 배포한다. 브라우저 데이터는 주소마다 따로라서 새 주소는 빈 상태로 시작한다. 그래서 기기마다:
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
| manifest `id` | `"/classdesk/app"` (= `https://amber67-git.github.io/classdesk/app`). v116(2026-11-04, PR #4)에서 `"./"`를 바꾼 값이다. `id`는 폴더가 아니라 origin 기준으로 풀리므로 `"./"`는 사이트 전체(`https://amber67-git.github.io/`)를 뜻했고, 그 때문에 같은 주소의 다른 앱(StudyDesk)이 "이미 설치됨"으로 막혔다 | 설치된 앱이 또 다른 앱으로 취급되어 모든 기기에서 다시 설치해야 한다 |
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

## 기타

- 프로젝트 인수인계 메모 `CLAUDE.md`는 실제 학생 정보가 들어 있어 저장소에 올리지 않는다(`.gitignore`). `validate.mjs`가 이 파일이 저장소에 들어오면 실패시킨다.
- 화면 디자인 규칙은 [`DESIGN.md`](DESIGN.md).
