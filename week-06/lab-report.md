# Week 06 — Lab report

**Name:** Orazbay
**Group:** CSCI-2208 Software Engineering — Fall 2026
**Date:** 2026-10-18

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed |
| Bolt project link (or `not shared`, and why) | https://bolt.new/~/sb1-byt5w3qv (login required); published preview: https://smart-campus-room-av-iqh7.bolt.host/ |
| Browser and version | Safari (version not recorded) |
| If you could not use Bolt.new: the tool you used instead, and why | Not applicable; Bolt.new was used. |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | The checker may treat a request that starts when an existing booking ends as overlapping. | AC4 | No — T1 was Available. |
| 2 | Checking an available interval may add it to the bookings, making the same check unavailable the second time. | AC5 | No — both T8 checks were Available. |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes

**Bolt's list of the files/components it created, pasted unedited:**

```text
src/lib/types.ts — type definitions for rooms and bookings
src/lib/sampleData.ts — five fictional rooms and six sample bookings
src/lib/availability.ts — the availability-checking logic (AC1–AC4)
src/App.tsx — the full UI with room selector, time inputs, result panel, and room info sidebar
```

**What v1 does — one line per thing that works, or visibly does not:**

- The user can select one of five fictional rooms, set current/start/end times, and request an availability decision.
- The page reports Available or Unavailable with explanatory feedback and shows the selected room's details and existing bookings.
- The app does not modify the displayed bookings when checking the same request twice.
- The sample-data room with the 10:00–11:00 booking also has a second booking from 14:00–15:30, so it does not exactly match the required single-booking test fixture.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Available | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Unavailable | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Unavailable | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Available | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Available | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | The B-204 sample fixture has an extra booking, so the assigned duration test is not isolated. | Select B-204 and check 12:00–14:01 with current time 09:00 → expect the >120-minute rejection against the sole 10:00–11:00 booking → observed both the duration rejection and an overlap with Study Group (14:00–15:30); see `evidence/issue-1.png`. | Medium | Fix |
| 2 | The unused Supabase dependency is out of scope and triggers the checker's backend/database scope finding. | Inspect `original/project/package.json` dependencies → expect no backend/database dependency for this frontend-only prototype → observed `@supabase/supabase-js` despite no use in application code; see `evidence/issue-2.png`. | Medium | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
In the current prototype, selecting Room B-204, setting current time to 09:00, and checking 12:00–14:01 also reports an overlap with "Study Group" (14:00–15:30), but AC2 requires this 121-minute request to be rejected for exceeding 120 minutes, and the specified T5 setup gives the room only one booking (10:00–11:00). Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
```

Bolt's answer, as pasted:

```text
Let me read the current sample data and availability logic to identify the exact issue.

0123456789

 files read

There are two problems to fix:

1. **Sample data (T5 setup):** Room B-204 currently has two bookings — "Organic Chem Lab" (10:00–11:00) and "Study Group" (14:00–15:30). The T5 test case requires B-204 to have only one booking (10:00–11:00). The "Study Group" booking is what's causing the false overlap message. I'll remove it.
2. **AC2 reporting logic:** When a request exceeds 120 minutes (AC2 violation), the overlap check (AC4) still runs and can report spurious overlaps alongside the duration violation. The fix is to skip the overlap check when AC2 already rejects the request — a request that's too long should be rejected purely for that reason, not cluttered with overlap messages.

0123456789

 file edits

Now let me verify the build passes.

**
Built to verify changes compile

Open
Build passes. Here's what I changed and why:

**Two files changed:**

1. **`src/lib/sampleData.ts`** — Removed the "Study Group" (14:00–15:30) booking from Room B-204. The T5 test case requires B-204 to have only one existing booking (10:00–11:00, "Organic Chem Lab"). The extra booking was causing a false overlap message when testing the 12:00–14:01 request.
2. **`src/lib/availability.ts`** — Changed the overlap check (AC4) to skip when the request is already rejected for exceeding the 120-minute limit (AC2). Previously, a 121-minute request would trigger both the duration-violation message and any overlap messages. Now, when a request is too long, it's rejected solely for that reason — the overlap check only runs for requests that pass the duration check. All other criteria (AC1, AC3, AC4 for valid-length requests) are preserved.
Now selecting Room B-204, current time 09:00, and checking 12:00–14:01 will report only the duration violation (121 min exceeds 120 min) — no spurious overlap.
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
The current app is a standalone, one-page room availability checker with no backend or database. Remove the unused Supabase dependency from the project, including updating the lockfile. First confirm that no application code imports or uses Supabase. Do not change the UI, sample data, availability logic, or any other dependencies. Then run the available build/check and tell me exactly what you changed and whether it passed.
```

Bolt's answer, as pasted:

```text
Let me first confirm no application code imports or uses Bolt Database.

**
Searched
`supabase`

Open
No matches in any source file. Let me also check config files and HTML for any references.

0123456789

 actions taken

Confirmed: no source code, config, or HTML references Bolt Database — only `node_modules/`, `package.json`, `package-lock.json`, and `.env`. Safe to remove. I'll remove it from `package.json` and reinstall to update the lockfile.

0123456789

 actions taken

Both build and typecheck passed.

**What I changed:**

1. **`package.json`** — Removed the `@supabase/Bolt Database-js` entry from the `dependencies` list. No other dependencies were touched.
2. **`package-lock.json`** — Updated automatically by running `npm install`, which removed all 13 Bolt Database-related packages from the lockfile and `node_modules`.
**Verification performed:**

- Searched all source files (`src/`), config files, and HTML — confirmed zero imports or references to Bolt Database anywhere in the application code.
- Ran `npm run build` — passed (exit 0).
- Ran `npm run typecheck` — passed (exit 0).
No UI, sample data, availability logic, or other dependencies were changed. The `.env` file still contains Bolt Database variables but those are unused by the app and I left them untouched since you only asked to remove the dependency.
```

**Cleanup prompt 2, as sent, and Bolt's answer:**

```text
Review only package.json and package-lock.json for unnecessary dependencies. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.
```

Bolt's answer, as pasted:

```text
Let me check which devDependencies are actually referenced in the project's config files.

0123456789

 files read

Every dependency in `package.json` is genuinely used:

**Runtime deps:** `react`, `react-dom`, `lucide-react` — all imported in app code.
**Dev deps:** `@vitejs/plugin-react` (vite.config.ts), `autoprefixer`/`postcss`/`tailwindcss` (postcss.config.js), `eslint` + `@eslint/js` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` + `globals` + `typescript-eslint` (eslint.config.js), `typescript` + `@types/react` + `@types/react-dom` (typechecking), `vite` (build tool).

There are no unnecessary packages to remove. However, while reviewing the dependency configuration, I noticed one small cleanup in `vite.config.ts`: the `optimizeDeps.exclude` for `lucide-react` is unnecessary. That exclusion pattern is meant for packages with WASM bundles (like PGlite), not a simple icon library. Removing it won't affect AC1–AC6 — it only impacts dev-server pre-bundling, not production builds or the availability logic.

0123456789

 actions taken

Both build and typecheck passed.

**What I reviewed and changed:**

I checked every dependency in `package.json` against the project's config files and source code. All remaining packages are genuinely used — `package.json` and `package-lock.json` have no unnecessary dependencies left to remove.

The one small cleanup I made was in `vite.config.ts`: I removed the `optimizeDeps.exclude` entry for `lucide-react`. That exclusion pattern is meant for packages with WASM bundles, not a simple icon library. Vite's pre-bundling can handle `lucide-react` normally, and this setting only affects the dev server — not production builds or the availability logic. All acceptance criteria (AC1–AC6) are preserved since no application code or availability logic was touched.
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Removed B-204's extra Study Group booking and skipped overlap reporting when duration exceeds 120 minutes. | accept | AC2: reject durations over 120 minutes; AC4 still checks valid-length intervals. The fixture now matches the specified single-booking setup. | Retested T5: Unavailable, with only the 121-minute reason. Retested T1–T9 after the final local copy was assembled; all nine match. |
| 2 | Bolt removed the unused `@supabase/supabase-js` dependency and updated its lockfile; no source-code use was found. | accept | Scope: this is a frontend-only prototype with no backend, database or external API. | Bolt reported build and typecheck passed. Its updated export was not downloaded; the already-tested local final copy independently has the same dependency removed and passed build, TypeScript, lint, and T1–T9. |
| 3 | Bolt found all dependencies necessary, then removed `optimizeDeps.exclude: ['lucide-react']` from `vite.config.ts`. | reject | Scope of the prompt: review only `package.json` and `package-lock.json`; the config change was outside that requested area, so it was not accepted into the local final copy. | Bolt reported build and typecheck passed. The config edit was not downloaded or applied locally; the local final remains the previously tested version, with T1–T9 matching. |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Extra B-204 booking and noisy reason on T5 | Fix | `src/lib/sampleData.ts`: removed Study Group; `src/lib/availability.ts`: only check overlaps for valid intervals of at most 120 minutes. | T5 Unavailable for the 121-minute limit only; all T1–T9 pass on the final copy. |
| 2 | Unused backend dependency outside the prototype scope | Fix (Bolt cleanup prompt; local equivalent was already applied by hand) | Bolt reported removing Supabase from `package.json` and updating `package-lock.json`. The updated Bolt export was not downloaded; the local final copy already has the same removal. | Bolt reported build and typecheck passed. The local final copy passed production build, TypeScript, lint, and T1–T9; no Supabase dependency remains there. |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `src/lib/availability.ts`

The src/lib/availability.ts file evaluates whether a requested candidate booking interval is valid by running a sequence of strict logical checks. First, it verifies the time range boundaries, ensuring that the start time is greater than or equal to midnight (0 ≤ start), strictly less than the end time, and within the daily limit (end ≤ 1440), while also confirming that the start time is after the supplied current time according to AC1. Next, it enforces the maximum duration rule by checking that the total interval length does not exceed 120 minutes, satisfying AC2. Then, it checks if the selected room is currently flagged as blocked, immediately rejecting the request if a block is active in accordance with AC3. Finally, it iterates through existing bookings to ensure there are no time overlaps, while correctly permitting touching endpoints where one booking ends exactly when another begins, fulfilling AC4. Only when all these conditions pass does the module return a clear available status.

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The checker passes all checks. The third Bolt prompt and answer are recorded as sent in section 6; its Vite config edit was rejected as outside the prompt's requested scope and was not included in the local final copy. |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

- No. The browser's `type="time"` control allows the last end time of 23:59, but does not let the user enter 24:00. This final page therefore cannot express an end minute of 1440. I declare `not-expressible`; the interface still checks all times it can represent.

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

- v1 provided a user-editable current-time input, initially set to 09:00. T6 was testable by setting current time and requested start to 09:00; it correctly returned Unavailable because the start must be strictly after now.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

Reflecting on this prototype cleanup lab, both of my initial predictions proved incorrect: version one successfully handled touching endpoints in case T1 and correctly maintained the Available state during repeated checks in case T8 without altering booking data. However, real testing uncovered unexpected flaws, such as case T5 which correctly returned Unavailable for exceeding the 120-minute limit, but incorrectly displayed an extra overlap error due to a redundant "Study Group" entry in the sample data rather than a faulty core validation algorithm. Regarding a hypothetical AI suggestion, I would reject any proposal to introduce persistent browser storage for bookings, because it violates project scope and breaks AC5 by mutating state across checks. This highlights the vital difference between a UI that merely looks finished and one meeting AC1–AC6. Rigorous testing is essential to separate visual polish from true logical correctness.
