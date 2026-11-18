# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | (write here) |
| Assistant (tool) | Copilot SDK in VS Code |
| Assistant model | not displayed |
| Starting point | starter |
| Baseline commit | fda142d |
| Language (ts or js) | ts |
| Vitest version | 3.2.7 |
| Where I ran the tests | SIS 04 assignment, macOS terminal |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
 RUN  v3.2.7 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/sis-04/app

 No test files found, exiting with code 1

 include: **/*.{test,spec}.?(c|m)[jt]s?(x)
 exclude:  **/node_modules/**, **/dist/**, **/cypress/**, **/.git/**, **/.cache/**, **/coverage/**
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/
  starter/ — unchanged source supplied for the SIS 04 starting point
  app/ — target project; package.json, Vite entry files and src/ are the runnable app
  app/src/App.tsx — React page and, in the starter, the only availability rules
  app/src/main.tsx — mounts the React application
  app/src/index.css — page and responsive presentation
  app/package.json — scripts and dependencies
  sis-04/tests/check_sis.py — local acceptance checker
  sis-04/report.md — this evidence report
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am starting a new analysis for SIS 04. Use this repository map: sis-04/app/src/App.tsx contains the React UI and all availability logic in check(); sis-04/app/src/main.tsx mounts the page; sis-04/app/src/index.css provides presentation; sis-04/app/package.json defines the Vite and Vitest setup; sis-04/tests/check_sis.py defines the acceptance checks.

The application must preserve AC1-AC6: reject start >= end and past requests, enforce 120 minutes, reject blocked rooms, reject overlaps while allowing endpoint touching, return Available/Unavailable without changing booking data, and provide clear responsive feedback. It must add F1-F5: filter capacity at or above attendees, require ALL selected equipment, never report blocked rooms available, show a clear empty state, and refresh availability when the room changes.

Constraints: use only fictional in-memory room data, and do not add login/account features, payments, live APIs, backend/database services or browser storage. Review the starting code, name maintainability risks with file/function and evidence, and propose a numbered plan of small safe steps. Do not rewrite the app or generate code yet. Keep AC1-AC5 testable and identify one implementation suggestion that should be rejected or modified.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Availability rules are coupled to presentation | `src/App.tsx`, `check()` | The start/end validation, 120-minute limit, blocked check and overlap loop all execute inside the React event handler. | High |
| 2 | Catalog is too small and lacks required fields | `src/App.tsx`, `ROOMS` | The two rooms have only id, name, blocked and bookings; capacity and equipment are absent, so F1 and F2 cannot be implemented reliably. | High |
| 3 | Blocked status is selected separately from the room catalog | `src/App.tsx`, `blocked` state and `check()` | The `Room blocked` checkbox is a global override rather than `room.blocked`, so F3 and room switching can disagree with catalog data. | High |
| 4 | Room lookup and display formatting are mixed in the component | `src/App.tsx`, `room` and `fmt()` | `ROOMS.find(r => r.id === roomId)!` and minute formatting are embedded in UI code instead of isolated room/booking responsibilities. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Add pure `src/rooms.ts`, `src/filter.ts` and `src/booking.ts` modules, preserving the starter's AC rules.
2. Add Vitest regression tests for AC1-AC5 and boundary cases before changing the UI behavior.
3. Add a fictional catalog of at least four rooms and tests for F1, F2, F3, F4 and F5.
4. Refactor `App.tsx` to import the catalog and rules, with no duplicated booking or filter logic.
5. Add the four UI/refactoring diagrams and evidence, run the full suite and record measured results.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Keep the existing global `blocked` checkbox and also copy it into each room | Rejected | It would override catalog truth and could make F3 depend on UI state. The catalog's `blocked` field and `checkRoom()` must decide availability directly. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
