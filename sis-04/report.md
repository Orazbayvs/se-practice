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

The catalog in `src/rooms.ts` contains five fictional rooms: A-101, B-204, C-305, D-401 and E-102. It stores capacity, equipment, blocked status and each room's own bookings. The page lets the user enter attendees and select multiple required items; `filterRooms()` keeps only rooms that meet capacity and contain every selected item. No matches produce "No rooms match these requirements." The room cards/select also mark D-401 as blocked. Changing the room selection clears the previous availability result before the next check.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees 10, projector and whiteboard selected; the list is narrowed to matching rooms with sufficient capacity and both items. |
| `evidence/filter-empty.png` | Attendees 100 with projector and whiteboard selected; no room matches, and the page shows the empty-state message. |
| `evidence/switch-a.png` | Room A-101 selected for 09:00 current time and 10:30–11:30; the overlap with 10:00–11:00 makes the result unavailable. |
| `evidence/switch-b.png` | The same 09:00/10:30–11:30 times, but Room B-204 selected with no bookings; the result changes to available. |
| `evidence/narrow.png` | The responsive page at 390×844 portrait width, with filters and room cards arranged for a phone. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines the Room/Interval types and fictional catalog data only. |
| `src/booking.ts` | Implements pure canBook AC1-AC5 rules and chosen-room checkRoom lookup. |
| `src/filter.ts` | Implements F1 capacity and F2 all-equipment filtering. |
| `src/App.tsx` | Imports and coordinates the catalog and rule modules; renders responsive UI and feedback. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep blocked status as a room field and reject it in `checkRoom()` | Do not use a global blocked checkbox and copy it to the selected room | F3 requires the chosen room's own status; a catalog field plus a direct canBook call keeps room switching unambiguous. |
| Use strict overlap checks (`start < booking.end && end > booking.start`) | Use inclusive comparisons that reject touching intervals | AC4 and B3 require endpoint touching to remain available; strict comparisons implement that boundary. |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/App.tsx`, `check()` mixed the whole availability decision and overlap loop with React presentation | `src/booking.ts`, `canBook()` plus `checkRoom()`; UI calls only `checkRoom()` |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `T01 AC1: start equal to end is rejected`; `T02 AC1: a request in the past is rejected` | Equal/past request → false |
| AC2 | `T09 B1 AC2: exactly 120 minutes is available`; `T10 B2 AC2: 121 minutes is rejected` | 120 → true; 121 → false |
| AC3 | `T04 AC3: blocked room is rejected` | Blocked chosen room → false |
| AC4 | `T11 B3 AC4: touching the end of a booking is available` | Endpoint touch → true |
| AC5 | `T06 AC5: canBook does not change bookings` | Original bookings unchanged |
| F1 | `T16 F1: capacity filter excludes rooms below attendees` | Rooms below attendees excluded |
| F2 | `T17 F2: selected equipment uses all-items matching` | Only rooms with all selected items |
| F3 | `T07 F3: checkRoom rejects a blocked chosen room` | Blocked room → false |
| F4 | `T18 F4: filter can return an empty result` | No matches → [] |
| F5 | `T08 F5: switching rooms changes availability at the same times` | A overlaps → false; B free → true |
| B1 | `T09 B1 AC2: exactly 120 minutes is available` | 720–840 → true |
| B2 | `T10 B2 AC2: 121 minutes is rejected` | 720–841 → false |
| B3 | `T11 B3 AC4: touching the end of a booking is available` | 660–720 after 600–660 → true |
| B4 | `T12 B4 AC4: overlapping a booking is rejected` | 659–661 over 600–660 → false |
| B5 | `T19 B5: capacity exactly equal to attendees is included` | 8 capacity, 8 attendees → included |
| B6 | `T20 B6: capacity one below attendees is excluded` | 8 capacity, 9 attendees → excluded |
| INT | `T15 INT: filtered result is checked with the chosen room` | Filter then checkRoom must agree |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
npx vitest run
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
RUN  v3.2.7 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/sis-04/app

 ✓ src/filter.test.ts (6 tests) 3ms
 ✓ src/booking.test.ts (15 tests) 2ms

 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  01:10:25
   Duration  222ms (transform 35ms, setup 0ms, collect 44ms, tests 5ms, environment 0ms, prepare 88ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 0/0 | 21/21 | Compared report 1.1 baseline and report 6.3 final Vitest output. |
| Duplicated logic locations removed | 1 location | 0 repeated booking-rule locations | Counted the one row in 5.3: `App.tsx, check()` availability logic moved to `booking.ts`. |
| Code structure: modules and their responsibilities | 1 UI file contained catalog and rules | 4 focused modules: rooms, booking, filter and App UI | Read `git ls-files sis-04/app/src` and the responsibilities table. |
| Remaining limitation | No room catalog or filter; no executable starter tests | Catalog and bookings are fixed fictional in-memory data; no persistence or live service | Reviewed the final source and scope: no storage/API code is present. |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Copilot SDK in VS Code / not displayed
**Date:** 2026-11-19
**Purpose:** Analyze the starter and obtain a maintainability plan before changing app/src

**Prompt:**

```text
I am starting SIS 04. Review the starter repository and identify maintainability risks with file/function references and a small implementation plan. Preserve AC1-AC6, add F1-F5, use fictional data, and do not add login, payments, live APIs or database services.
```

**Output used:**

```text
The suggested priorities were to separate availability rules, catalog data and filtering, add tests, move UI logic, and avoid keeping blocked status outside the catalog.
```

**Problems found:** Confirmed coupled `check()` logic, missing room capacity/equipment, and the global blocked checkbox in `src/App.tsx`.
**Changes made:** Recorded the repository map, risks, numbered plan and rejected global-blocked suggestion in report §2–§3.
**Verified by:** Read the starter file directly and committed the analysis before the first app/src change.

### 8.2 Exchange 2

**Tool and model:** Copilot SDK in VS Code / not displayed
**Date:** 2026-11-19
**Purpose:** Implement the room catalog, filter and booking modules

**Prompt:**

```text
Create src/rooms.ts with five complete rooms, src/filter.ts with F1 and F2, and src/booking.ts with canBook plus checkRoom. Keep canBook pure and make checkRoom use the chosen room's blocked and bookings fields.
```

**Output used:**

```text
Implemented explicit Room/Interval types, filterRooms capacity and every-equipment checks, and checkRoom lookup followed by canBook. The catalog uses only local fictional bookings.
```

**Problems found:** The final UI initially kept a 24:00 shortcut; I removed it later because it was not required and could complicate stable time screenshots.
**Changes made:** Added the three modules and five-room data, then connected them to the React page.
**Verified by:** `npx vitest run` reported 21 passing tests and the acceptance checker could locate all required exports.

### 8.3 Exchange 3

**Tool and model:** Copilot SDK in VS Code / not displayed
**Date:** 2026-11-19
**Purpose:** Add traceable tests, screenshots and refactoring evidence

**Prompt:**

```text
Add 10+ Vitest tests whose titles contain AC1-AC5, F1-F5, B1-B6 and INT. Use fixed test catalogs, no mocks, and add five real UI screenshots plus before/after PlantUML diagrams.
```

**Output used:**

```text
The suite added 21 tests across booking.test.ts and filter.test.ts. The UI was captured at desktop and 390-pixel portrait widths after setting filter and room-switch states.
```

**Problems found:** The first room-switch evidence could accidentally depend on the extra 24:00 state, so I removed that state and recaptured the switch screenshots.
**Changes made:** Added 21 tests, both PlantUML diagrams and five PNG screenshots under evidence/.
**Verified by:** Final Vitest run: 2 files passed and 21 tests passed; the shipped screenshot and test files were inspected directly.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| none | No known FAIL or ERROR results are declared before the final checker run. |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

Для этого задания я дал ассистенту карту репозитория и формальную контекстную запись с критериями AC1-AC6, правилами F1-F5 и ограничениями без логина, платежей, сети и базы данных. Полезной была идея разобрать стартовый компонент на отдельные модули и сначала зафиксировать риски до изменения кода. Я лично сверил эти риски с исходным App.tsx: доступность была в обработчике check(), каталог был маленьким и неполным, а blocked находился вне room-каталога.

Некоторые предложения требовали проверки. Я принял разбиение по rooms, booking и filter, но отклонил сохранение глобального blocked-флага поверх каталога, потому что это противоречило выбранной комнате и F3. Я также убрал лишний режим «Ends at 24:00», который не входил в требование F4/F5 и усложнял воспроизводимость снимков переключения комнаты.

Лично я проверил реализацию через тесты с фиксированными каталогами, а не через демонстрационные ROOMS. Результаты Vitest меняли решения: сначала suite обеспечила сохранение AC1-AC5, затем F1-F2 проверяли одинаковое участие capacity и equipment, а граничные случаи подтвердили strict overlap и ровно 120 минут. Это позволило не принимать удобные для кода, но неправильные ожидаемые значения.

Наибольший риск после рефакторинга — случайное изменение каталога или логики фильтра, поэтому каждое правило остается отдельным и покрытым собственным expect. Следующим шагом я бы добавил браузерные проверки на выбранном телефоне и реальные сценарии переключения комнат, а также вынес рендеринг карточки комнаты в компонент. Важнее всего понять, что AI ускоряет анализ и реализацию, но ответственность за границы задачи, фактический запуск и корректность доказательств остается у меня.
