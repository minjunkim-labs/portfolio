# portfolio

김민준의 포트폴리오 사이트다. Astro로 정적 페이지를 만들고 Cloudflare Workers 정적 자산으로 배포한다. 사이트에 쓰는 경력 사실은 비공개 career 저장소의 경력 정본에서만 가져온다.

## 명령

`python3 -I .baseline/baseline.py run test`처럼 부른다. 이 칸은 `.baseline/commands.json`과 같아야 한다.

- setup: `sh -c 'npm ci --ignore-scripts && npx playwright install --with-deps chromium'`
- check: `npm run check`
- test: `sh -c 'node --test scripts/audit.test.mjs && npm run test'`
- build: `sh -c 'npm run build && npx wrangler deploy --dry-run'`

check는 `astro check`(타입·템플릿 검사)다. test는 Playwright로 빌드한 사이트를 Chromium에서 연다. build의 dry-run은 로그인 없이 배포 설정만 검사한다. 의존성 취약점 검사(`node scripts/audit.mjs`)는 네트워크가 필요해 CI에서만 돈다.

## 길잡이

| 경로 | 무엇 |
| --- | --- |
| `src/pages/` | 페이지. 파일 하나가 URL 하나다 |
| `public/` | 그대로 복사되는 정적 파일 |
| `tests/` | Playwright 테스트. 설정은 `playwright.config.ts` |
| `scripts/audit.mjs` | `npm audit` 검사와 기한이 있는 예외 목록 |
| `astro.config.mjs` | Astro 설정. 지금은 정적 출력만 쓴다 |
| `wrangler.jsonc` | Cloudflare 배포 설정. `dist/`를 정적 자산으로 올린다 |
| `.mise.toml` | 툴체인 판(Node). `run`이 이 판으로 돈다 |
| `docs/agents/` | Matt 스킬이 읽는 트래커·라벨·도메인 문서 설정 |
| `docs/agents/ops.md` | ops 규칙. 배포·SDK·비밀값을 다룰 때 읽는다 |
| `REVIEW.md` | 리뷰 기준. 리뷰할 때만 읽는다 |

## 배포

- Cloudflare Workers Builds가 이 저장소에 연결되어 `main`에 병합되면 빌드·배포한다. 배포 토큰을 GitHub에 두지 않는다.
- 서버 기능(연락 폼, API)이 필요해지면 그때 `@astrojs/cloudflare`를 더한다.

## 병합

- 상시 지시: 문서·쉬움 PR은 리뷰가 끝나면 `python3 -I .baseline/baseline.py enqueue <PR> <리뷰한 head>`로 머지 큐에 넣는다. 소유자가 끄려면 이 줄을 지운다.

## 이 저장소의 규칙

- `.env.example`은 비밀값 파일이 아니다. `docs/agents/ops.md`대로 빈 칸만 두고 커밋한다.

<!-- baseline:start -->
## 작업 방식

- 규칙은 repo-baseline의 [POLICY.md](https://github.com/minjunkim-labs/repo-baseline/blob/main/POLICY.md)다. 이 블록은 그 요약이다.
- 시작 전에 열린 PR과 Issue에서 같은 일을 찾는다. 있으면 그 PR을 잇거나 소유자에게 묻는다.
- 시작 전에 완료 기준을 정해 PR 본문 Summary에 쓴다. 완료 주장은 명령의 실제 출력이다.
- 리뷰 등급은 셋이다. 문서는 필수 CI만, 쉬움은 구현 대화를 물려받지 않는 하위 에이전트 리뷰 한 번, 어려움은 구현 대화를 물려받지 않는 새 세션 하나가 Spec·Standards와 보안 관점을 본 뒤 소유자 병합이다(POLICY §3).
- 등급은 `review-preflight`가 정하고 리뷰어는 올릴 수만 있다. `enqueue`는 어려움 PR을 넣지 않는다.
- 무엇을 만들고 무엇이라 부를지 정할 일이 크면 사람만 부르는 스킬(`grill-with-docs`, `wayfinder`, `to-spec`, `to-tickets`)의 이름을 대고 실행을 권한다.
- 이 블록은 repo-baseline이 관리한다. 고치지 않는다. 블록 밖은 프로젝트가 쓴다.

## 하지 않는 것

- 비밀값(`.env*`, 키, 토큰)을 읽거나 커밋하지 않는다. 커밋됐으면 먼저 키를 폐기한다.
- `main`에 직접 push하지 않는다. `enqueue`를 거치지 않고 병합하지 않는다.
- 어려움 PR(예: 돈, 인증·권한, 복구가 어려운 migration, workflow 권한, 에이전트 설정 폴더, `.baseline/`)을 병합하지 않는다.
- 우선순위·일정·내부 판단과 취약점 설명을 공개 Issue·PR·커밋에 쓰지 않는다.
- 브랜치 보호·저장소 설정·CI workflow를 사람 승인 없이 바꾸지 않는다.
<!-- baseline:end -->
