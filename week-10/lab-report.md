# Week 10 — Lab report

**Name:** Orazbay Koybagar
**Group:** CSCI-2208
**Date:** 2026-11-19

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Copilot SDK in VS Code, including a read-only Explore review |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Copilot, in the local repository workspace |
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | `03ed5b7` |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer, in an isolated worktree at the baseline commit |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |

## 2. Task 1 — the baseline

### 2.1 The project's commands

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 19/19 baseline tests |
| `npm test` | yes | pass | 19/19 baseline tests |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | npm reports `Missing script: "test:unit"` |
| `npm run build` | yes | pass | Vite build succeeds; Browserslist data is outdated |
| `npm run lint` | yes | pass | ESLint exits successfully |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v2.1.9 /private/tmp/se-practice-week10-baseline/week-10/app

 ✓ src/booking.test.ts (19 tests) 2ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  04:05:40
   Duration  319ms (transform 21ms, setup 0ms, collect 21ms, tests 2ms, environment 0ms, prepare 34ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
The project is a React and TypeScript Vite room-availability checker. AGENTS.md says the booking rule is in src/booking.ts, the page is src/App.tsx, and tests are in src/booking.test.ts. It lists AC1–AC5, tells the agent to use real KBTU room data, and names npm run test:unit as its test command. It also permits a Supabase table and login and instructs the agent to deploy a production preview. The listed test script does not exist in package.json.
```

Which rules in its summary are wrong for this project, and how you know:

The exact task contract in `week-10/README.md` §3 requires fictional data and no login or database. It includes AC6, which the playbook omitted. Its AC4 statement is reversed: endpoint-touching bookings are allowed. I checked `package.json` and ran `npm run test:unit`; it fails because there is no such script. The production deployment instruction also conflicts with the task's no-external-deployment constraint.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

I ran the review with GitHub Copilot in read-only Explore mode inside VS Code. Before submitting the prompt, I checked `git status` to verify that the working tree had no uncommitted changes. After the assistant generated its analysis, I immediately checked `git status` again to confirm that zero files in `app/` were modified or created. The review was strictly observational.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer:

```text
Read-only review of the Week 08 baseline:

- Correctness: src/lib/availability.ts timeToMinutes converts numeric hour and minute fields without checking their ranges. An input such as 12:60 can be interpreted as 13:00; verify with a focused unit test. src/booking.ts also has separate boolean and explanation paths, so invalid non-finite times may be rejected without a useful reason; compare canBook with getBookingReasons.
- Security: the initial install reported dependency advisories. This does not establish an exploitable application path; run npm audit and distinguish development dependencies from production dependencies.
- Privacy: src/lib/sampleData.ts contains room and booking examples, and the footer calls them fictional. I found no personal identifiers or outbound request in the UI source, but provenance of sample names should still be confirmed.
- Reliability: the app has local Vitest/build/lint commands, but no CI workflow was present in the app folder. A future regression could therefore remain undetected until someone runs the checks manually.
- Maintainability: src/App.tsx owns form state, selection, result display, and room/bookings UI in one large component. A UI edit can affect multiple concerns; inspect the component before deciding whether extraction is warranted.
- Agent operations: app/AGENTS.md names a missing test script, encourages real KBTU data, permits a database/login, contradicts endpoint-touch behavior, omits AC6, and requests production deployment. Compare every instruction with the Week 10 contract before accepting it.

I did not run tests or make edits during this read-only review.
```

### 3.2 Challenging the AI's claims

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | `12:60` can be normalized to an ordinary time | Correctness | `src/lib/availability.ts`; the R1 test before the fix returned 780 instead of -1 | confirmed | The parser accepted an out-of-range minute value as 13:00. |
| 2 | `canBook` and `getBookingReasons` can disagree on invalid values | Correctness | `src/booking.ts`; R2 test with `now: NaN` failed because the reasons array was empty | confirmed | The two paths duplicated validation and the explanation path missed non-finite values. |
| 3 | Endpoint-touching requests are treated as overlaps | Correctness | `src/booking.ts`, T01/T08/BUG-A tests and AC4 in `week-10/README.md` | unsupported | Strict overlap inequalities allow touching; both endpoint tests pass and the contract permits it. |
| 4 | `npm run test:unit` is a usable test command | Agent operations | `app/package.json`; ran the command in the baseline worktree | unsupported | npm reports `Missing script: "test:unit"`; `npm test` is the actual script. |
| 5 | The app transmits room or student data to an external service | Privacy | Searched `app/src` for fetch, axios, XMLHttpRequest, storage APIs, and URLs; inspected sample data and footer | unsupported | No outbound request or personal identifier was found; the footer labels the sample data fictional. |
| 6 | The app has no automated CI check | Reliability | Checked tracked app files and the app folder for `.github/workflows` | confirmed | No workflow exists in the project folder; local tests do not run automatically on pushes. |
| 7 | The dependency tree has known advisories | Security | Ran `npm audit` and `npm audit --omit=dev` | confirmed | Full audit reported 24 advisories, including 2 critical; production-only audit reported 0. |

---

## 4. Task 4 — the risk register

### 4.1 The register

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Correctness | Unchecked time parsing and duplicated booking validation let malformed or non-finite values be accepted or unexplained, so users can receive an unsafe availability result. | `src/lib/availability.ts`; `src/booking.ts` | R1 red test showed `12:60` became 780; R2 red test showed `canBook` false but no reason for NaN. | confirmed | 3 | 3 | 9 | Strictly validate clock input and use one pure reason-producing validator for the boolean and explanation APIs. | Me | R1/R2 tests and full Vitest suite |
| R2 | Agent operations | Stale or unsafe AGENTS instructions can make an agent use real data, add auth/database, run a nonexistent test command, or deploy externally. | `AGENTS.md` | Original AGENTS.md contains each directive; package.json has no `test:unit`; Week 10 contract forbids these actions. | confirmed | 3 | 3 | 9 | Apply the minimal, contract-checked AGENTS patch and require tests/build before acceptance. | Me | Checker A2/A3 and C1-C6; review the final diff |
| R3 | Security | Vulnerable development dependencies may be invoked by a local toolchain, exposing developers or CI to known issues if hostile inputs reach those tools. | `package-lock.json` | `npm audit`: 24 advisories (2 critical, 13 high); `npm audit --omit=dev`: 0. | confirmed | 2 | 3 | 6 | Upgrade dependencies in a separately reviewed change; do not force a breaking Vitest upgrade in this risk-review patch. | Me | Re-run full and production-only npm audit, tests, build, and lint after upgrades. |
| R4 | Reliability | No push-triggered CI means a regression can be merged without automatic test/build feedback. | `missing: CI workflow` | No workflow exists under the app project; tests currently run only when invoked manually. | confirmed | 2 | 2 | 4 | Add a workflow in a separately scoped change after the release decision. | Me | Verify a workflow runs tests and build on a test branch push. |
| R5 | Maintainability | A thin README and a large App component leave architecture and UI responsibilities unclear, making future edits harder to review and more likely to couple unrelated behavior. | `README.md`; `src/App.tsx` | README contains only project title/Bolt badge; App owns selection/state, booking submission, result display, and room/bookings markup. | confirmed | 2 | 2 | 4 | Document module responsibilities and extract UI only when a focused change justifies it. | Me | Review the architecture notes and inspect component boundaries in a later scoped PR. |

### 4.2 The top two for action

1. **R1** — 3 × 3 = 9: the observed red test proves `12:60` became 780, and the second red test proves invalid time had no explanation.
2. **R2** — 3 × 3 = 9: the playbook explicitly directs real data, a database/login, a missing test command, and production deployment.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No Prettier config or prettier dependency in `app/`. |
| 1b | Linter | yes | `eslint.config.js`; `eslint` dependency and `npm run lint`. |
| 1c | Type checks | yes | `tsconfig.json`, TypeScript dependency, and `npm run typecheck`. |
| 1d | Unit tests | yes | `src/booking.test.ts`, Vitest dependency, `npm test`. |
| 1e | Pinned dependencies (lockfile) | yes | Tracked `package-lock.json`. |
| 2a | `.env.example` | no | No `.env.example` in `app/`. |
| 2b | Architecture notes | no | `app/README.md` is only a title and Bolt badge; it does not describe modules. |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md` exists (the initial version was inconsistent and has now been patched). |
| 3a | CI | no | No workflow under `app/.github/workflows/`. |
| 3b | Pre-commit hooks | no | No Husky, lint-staged, simple-git-hooks, or `.pre-commit-config.yaml`. |
| 3c | Integration checks | no | The suite tests `canBook`; it does not render the page or integrate UI modules. |
| 3d | Reviewable evidence | no | No PR template or CI log requirement is present in `app/`. |

### 5.2 The level and the gaps

**Level:** 1

**Missing evidence for the next level:**

- Level 2 needs 2a `.env.example` and 2b module-level architecture notes; only 2c is present, so the level is 1/3 and does not reach the 80% threshold.
- The app README is not an architecture guide, and the layout separates some library code but leaves the UI in one large App component. Level 3 would additionally need CI, hooks, integration checks, and reviewable evidence.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1-AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer:

```text
The baseline playbook conflicts with the Practice 10 contract. It instructs the agent to use real KBTU rooms and timetables, reverses AC4 by calling endpoint-touching bookings overlaps, omits AC6, names npm run test:unit although package.json has no such script, permits a Supabase table and login, and requires a production deployment. The prompt also requires rules against secrets and external deployments and a test gate before acceptance.

A minimal patch should retain the existing headings; specify fictional-only room data and AC1–AC6 exactly as the README does; change the test command to npm test; forbid login, databases, secrets, and production deployment; and require tests/build before acceptance. I would leave install, dev-server, and build commands that exist unchanged.
```

### 6.2 Findings and my decisions

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Real KBTU names and timetable | Conflicts with the Week 10 fictional-only contract. | modify | README §3 is authoritative for this branch; after checking it, the instruction became one fictional room and fictional bookings only. |
| 2 | AC4 endpoint-touching counts as overlap | Reverses AC4 in the README. | modify | The contract explicitly allows requests that only touch at an endpoint. |
| 3 | AC6 omitted | Missing required UI-feedback criterion. | approve | AC6 is already in the Practice 10 contract; I added its exact desktop/mobile feedback requirement. |
| 4 | `npm run test:unit` | Command does not exist. | approve | `npm test` is the actual package script and passes. |
| 5 | Supabase table and login | Violates no-login/no-database scope. | modify | The playbook now forbids both rather than permitting them. |
| 6 | No rule against secrets | Missing required safety constraint. | approve | Added an explicit rule forbidding secrets, keys, credentials, and `.env` files. |
| 7 | `npx netlify deploy --prod` | Violates no-external-deployment scope. | modify | Replaced the production deploy instruction with an explicit prohibition. |
| 8 | No test gate before acceptance | Missing a verification safeguard. | approve | Requires `npm test` and `npm run build` before proposing acceptance. |

The first AGENTS patch was applied and committed before approval was requested; that sequence was wrong. After checking the actual Practice 10 README and checker, I retained the Practice 10 contract rather than the SIS 04 room-catalog requirements. The patch changes 8 lines and preserves the original headings.

### 6.3 The approved patch

`git diff app/AGENTS.md`, from baseline `03ed5b7` to the approved patch:

```diff
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..4a1bc1c 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,32 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.

-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional bookings only; do not use real names or timetables.

 ## Acceptance contract

 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.

 ## Commands

 - Install: `npm install`
 - Dev server: `npm run dev`
- Tests: `npm run test:unit`
+ Tests: `npm test`
 - Build: `npm run build`

 ## You may

 - Edit any file in the project.
 - Add packages when a task needs them.
- If bookings need to persist, add a small Supabase table and a login page.
+ Do not add login or database features.
+ Do not add secrets, API keys, passwords, tokens, credentials, or `.env` files.

 ## Before you finish

-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+ Run `npm test` and `npm run build` before proposing acceptance.
+ Do not deploy, publish, or use production services.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R1**. The real run, with the new test failing:

```text
 RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-10/app

 ❯ src/booking.test.ts (20 tests | 1 failed | 19 skipped) 3ms
   × R1 AC1: invalid minute input cannot become an available booking 3ms
     → expected 780 to be -1 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > R1 AC1: invalid minute input cannot become an available booking
AssertionError: expected 780 to be -1 // Object.is equality

- Expected
+ Received

- -1
+ 780

 ❯ src/booking.test.ts:134:23
    132|     bookings: [],
    133|   };
    134|   expect(input.start).toBe(-1);
       |                       ^
    135|   expect(canBook(input)).toBe(false);
    136| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 Test Files  1 failed (1)
      Tests  1 failed | 19 skipped (20)
   Start at  03:57:44
   Duration  205ms (transform 25ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 48ms)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1280 × 900 CSS px | Room selector, time inputs, duration, check result, room details and bookings | Main form and Available feedback are visible; lower details continue below the captured viewport. | `evidence/ui-desktop.png` |
| Mobile | 390 × 844 CSS px | Header, form and time input layout at phone width | Horizontal clipping is visible in the header and form; AC6 mobile layout remains a known limitation. | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

I did not run `npm audit fix` because it proposes broad dependency changes, including a breaking Vitest upgrade; I did not run browser automation, a screen-reader/keyboard audit, CI (none exists), or any production deployment. The missing `npm run test:unit` was attempted and returned “Missing script”; `npm test` is the working suite.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit line. The four lines below are the exact Part 8 prompt used to constrain the refactor:

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior.
Use a pattern only if the identified design problem justifies it.
Do not add new features or dependencies.
Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** two time-validation paths could diverge, and the clock parser accepted impossible minute values. I used strict parsing plus one pure reason-producing validator as the single source of truth; `canBook` now derives its boolean from those same reasons, so invalid inputs cannot be silently accepted or unexplained.

**What I rejected from the agent's patch, and why:** I rejected the assistant's suggestion to introduce third-party schema validation libraries (such as Zod) and rejected changing the public boolean signature of `canBook`. I kept the change strictly focused on extracting pure clock-parsing validation in `src/lib/availability.ts` and consolidating the reason check in `src/booking.ts`.

The diff I approved (`git diff`):

```diff
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index 2a3681a..b5f099a 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -23,6 +23,9 @@ function getUnavailabilityReasons({
 }: BookingRequest): string[] {
   const reasons: string[] = [];

+  if (![start, end, now].every(Number.isFinite)) {
+    reasons.push('Time values must be finite.');
+  }
   if (start < 0 || end > 1440) {
     reasons.push('Times must be within 00:00–24:00.');
   }
@@ -33,7 +36,8 @@ function getUnavailabilityReasons({
     reasons.push('Start time must be after the current time.');
   }

-  const validInterval = start >= 0 && end <= 1440 && start < end;
+  const validInterval =
+    Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end <= 1440 && start < end;
@@ -56,21 +60,8 @@ function getUnavailabilityReasons(request: BookingRequest): string[] {
-  if (!(0 <= start && start < end && end <= 1440)) return false;
-  if (!(start > now)) return false;
-  if (end - start > 120) return false;
-  if (blocked) return false;
-  for (const b of bookings) {
-    if (start < b.end && end > b.start) return false;
-  }
-  return true;
+  return getUnavailabilityReasons(request).length === 0;
 }
diff --git a/week-10/app/src/lib/availability.ts b/week-10/app/src/lib/availability.ts
index 5bf2238..64b292f 100644
--- a/week-10/app/src/lib/availability.ts
+++ b/week-10/app/src/lib/availability.ts
@@ -1,8 +1,11 @@
 export function timeToMinutes(time: string): number {
-  if (!time) return -1;
-  const [h, m] = time.split(':').map(Number);
-  if (isNaN(h) || isNaN(m)) return -1;
-  return h * 60 + m;
+  const match = /^(\d{2}):(\d{2})$/.exec(time);
+  if (!match) return -1;
+
+  const hours = Number(match[1]);
+  const minutes = Number(match[2]);
+  if (minutes > 59 || hours > 24 || (hours === 24 && minutes !== 0)) return -1;
+  return hours * 60 + minutes;
 }
```

### 8.2 The second mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit line. Not applicable: this mitigation patches the agent playbook.

**Problem → pattern → benefit:** contradictory instructions could cause unsafe or unverifiable agent changes. The minimal playbook patch corrects the contract and commands and adds explicit safety and test gates, reducing the chance of an out-of-scope change or false acceptance.

**What I rejected from the agent's patch, and why:** I rejected the initial SIS 04-based objection that “one fictional room” and AC6 should be removed. Practice 10 README §3 and checker C1/C3 require them; applying the SIS 04 catalog contract here would fail this lab.

The diff I approved (`git diff`):

```diff
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..4a1bc1c 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,32 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.

-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional bookings only; do not use real names or timetables.

 ## Acceptance contract

 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
@@
- Tests: `npm run test:unit`
+Tests: `npm test`
@@
- If bookings need to persist, add a small Supabase table and a login page.
+ Do not add login or database features.
+ Do not add secrets, API keys, passwords, tokens, credentials, or `.env` files.
@@
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+ Run `npm test` and `npm run build` before proposing acceptance.
+ Do not deploy, publish, or use production services.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 3 | 9 | 1 | 2 | 2 | The strict parser test and non-finite reason test pass; shared validation prevents result/reason drift. |
| R2 | 3 | 3 | 9 | 1 | 3 | 3 | AGENTS now forbids real data, database/login, secrets, and deployment; A2/A3/C1-C6 pass. |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
> vite-react-typescript-starter@0.0.0 test
> vitest run

 RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-10/app

 ✓ src/booking.test.ts (21 tests) 3ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  04:03:35
   Duration  293ms (transform 23ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 28ms)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Work only on a separate `week-10-agent/<topic>` branch/worktree; do not modify this branch or `main`. |
| Permitted files | Limit edits to agreed `app/src/booking.ts`, `app/src/lib/availability.ts`, and matching tests; request approval before changing AGENTS, package files, reports, or checkers. |
| Commands | From `week-10/app`, run `npm test`, `npm run build`, `npm run lint`, and `npm run typecheck`; report each exit status. |
| Prohibited actions | Do not add login, databases, secrets, real student data, dependencies, or deploys; do not edit `provided/AGENTS.md` or either checker. |
| Required evidence | Attach the commit SHA, focused diff, full test/build output, and any manual UI screenshots needed for an App change. |
| Before merging or deploying | The owner must review the diff and rerun checks; never merge or deploy this project without explicit approval, and production deployment remains prohibited. |

### 9.2 Optional — the deck's checklist prompt (not graded)

Not sent.

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

None after the report is completed and checked. `npm audit` findings are a residual risk, not a checker FAIL/ERROR.

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Write your conclusion below this line -->

CONDITIONAL. I decided on a CONDITIONAL release because of the current state of our risk register and verification evidence. Two of our highest confirmed risks, R1 (clock parsing and reason divergence, originally 3 x 3 = 9) and R2 (unsafe playbook directives, 3 x 3 = 9), are successfully mitigated and down to 1 x 2 = 2 and 1 x 3 = 3 respectively, backed by 21 passing Vitest unit tests. However, R3 (24 vulnerabilities in dev dependencies, scoring 2 x 3 = 6) remains open because updating those packages was intentionally postponed to avoid breaking the Vite/Vitest toolchain during this review. In addition, R4 (missing CI) and the lack of automated component tests for App.tsx mean UI regressions can only be caught manually. Release is therefore conditional on manual browser verification and addressing dev dependencies in a subsequent maintenance pull request.
