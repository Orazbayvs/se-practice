# Week 07 — Lab report

**Name:** Koibagar Orazbay  
**Group:** CSCI-2208 Software Engineering  
**Date:** 2 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | week-06 |
| Bolt project link (or `not shared`, and why) | not shared; I used the Week 06 project export in the repository |
| Assistant that generated the tests (tool) | Copilot in VS Code (this chat) |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer, in the local terminal |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |
| Test command | `npx vitest run` from `week-07/app/` |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `src/lib/availability.ts`, `checkAvailability` |
| Its inputs | Room, candidate start/end, current time, and all bookings |
| What it returned | `{ available: boolean, reasons: string[] }` |
| How the page used it | `src/App.tsx` passed the selected room, times, current time and bookings, then displayed its result and reasons |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

The Week 06 decision used the interval bounds, current time, duration limit, blocked-room flag,
and overlap check. I moved those conditions into `src/booking.ts` as `canBook`, with the shared
input shape required by the practice. `src/App.tsx` now passes the selected room's bookings and
uses the returned boolean for Available/Unavailable. The same conditions also produce the
existing explanatory reasons, so the page keeps understandable feedback. The conversion and
display helpers remain in `src/lib/availability.ts`. I changed the fictional A-101 sample booking
to 10:00–11:00 so the manual checks use the practice fixture; the decision rules are unchanged.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The request starts at the booking's end, so the intervals only touch. |
| T02 | 540–570 (starts now) | false | AC1 | AC1 requires the requested start to be strictly later than now. |
| T03 | 720–720 (zero duration) | false | AC1 | Equal endpoints do not satisfy the required start-before-end rule. |
| T04 | 750–720 (reversed) | false | AC1 | A reversed interval has its start after its end. |
| T05 | 1380–1441 (past day end) | false | AC1 | The end exceeds the allowed 1440-minute day boundary. |
| T06 | 720–840 (120 minutes) | true | AC2 | AC2 rejects only durations longer than 120 minutes. |
| T07 | 720–841 (121 minutes) | false | AC2 | 121 minutes is longer than AC2's 120-minute maximum. |
| T08 | 570–600 (touching before) | true | AC4 | The request ends exactly when the booking begins; no overlap occurs. |
| T09 | 630–690 (partial overlap) | false | AC4 | The request shares the 630–660 portion with the booking. |
| T10 | 570–690 (contains booking) | false | AC4 | The candidate includes the full existing booking interval. |
| T11 | 615–645 (inside booking) | false | AC4 | Both candidate endpoints fall inside the existing booking. |
| T12 | 600–660 (identical interval) | false | AC4 | Identical intervals overlap for their entire duration. |
| T13 | 660–720, blocked = true | false | AC3 | A blocked room rejects a request regardless of its free time. |
| T14 | 630–690, bookings = [] | true | AC4 | With no existing bookings, this otherwise valid interval cannot overlap. |
| AC5 | Available request; compare the bookings before and after | true, data unchanged | AC5 | An availability check reports a decision and does not edit stored booking data. |
| X1 | 1380–1440 (ends exactly at day boundary) | true | AC1 | End 1440 is allowed, and this one-hour request starts after now. |
| X2 | Existing booking 700–650; request 660–720 | true | Assumption | The existing interval is reversed and the ACs do not define its treatment; the implemented overlap predicate finds no overlap. |

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced
by `Vitest`, followed by the case table from section 3:

I did not start a separate fresh chat or send a distinct prompt message. Copilot generated the
file in this task chat after reading the handout. The following is the deck prompt transcribed
for an accurate record, not a claim that I sent it as a separate verbatim message. The assistant
could see `app/src/booking.ts` in the workspace.

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

We will run the tests ourselves.

Case table:
T01: 660–720; true; AC4. T02: 540–570; false; AC1. T03: 720–720; false; AC1.
T04: 750–720; false; AC1. T05: 1380–1441; false; AC1. T06: 720–840; true; AC2.
T07: 720–841; false; AC2. T08: 570–600; true; AC4. T09: 630–690; false; AC4.
T10: 570–690; false; AC4. T11: 615–645; false; AC4. T12: 600–660; false; AC4.
T13: 660–720 with blocked=true; false; AC3. T14: 630–690 with bookings=[]; true; AC4.
AC5: available 660–720; true and bookings unchanged. X1: 1380–1440; true; AC1.
X2: existing booking 700–650 with request 660–720; true; assumption outside the ACs.
Default fixture: now=540, blocked=false, bookings=[{start:600,end:660}].
The source module is app/src/booking.ts.
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
The assistant produced the 17-test file saved in suites/first/booking.test.ts. This same-chat response summary records how to run it and what it covers; it is not a separate fresh-chat transcript.
Run command: npx vitest run
AC mapping: T01, T08, T09, T10, T11, T12 and T14 cover AC4; T02–T05 cover AC1; T06–T07 cover AC2; T13 covers AC3; the available call and booking comparison cover AC5; X1 checks the inclusive end-of-day boundary; X2 records the unspecified reversed-existing-booking behavior.
Unclear requirement: no AC defines how an invalid existing booking should affect a valid request. Check the actual return and state the assumption.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind
of weakness (the deck's table: *no exception occurred* · *expected = current output* · *only
valid requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | AC5 booking-data assertion | Weak reference assertion: `before` aliases `bookings`, so an in-place mutation could still pass. | revise | AC5 requires unchanged data; use a deep copy and compare the contents after an Available call. |
| 2 | X2 invalid existing booking | The case is outside the stated ACs, so its expected value must be treated as an explicit assumption, not a requirement. | accept | No AC specifies invalid existing data; the current predicate returns true for this input and §9.3 records it. |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-07/app

 ✓ src/booking.test.ts (17 tests) 2ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | All 17 tests passed; no assertion or runner failure. | Confirmed the suite was discovered and imported the real function. | Test repair after review, not an implementation fix. | Replaced the AC5 alias comparison with a deep-copy content comparison; left the decision rules unchanged. |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

Actual first-run output:
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-07/app

 ✓ src/booking.test.ts (17 tests) 2ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
```

Assistant answer:

```text
Revise the AC5 test: `before` was an alias of the same array, so it did not prove that the booking contents stayed unchanged. Take a deep copy before the call and compare the contents afterward. Keep all expected decisions derived from AC1–AC4. No implementation fix is indicated by the first run. Keep X1 at the inclusive 1440 boundary and keep X2 as a documented assumption because invalid existing bookings are not specified.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real
defect is still open, leave its test failing and explain it in 9.1.

```text
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-07/app

 ✓ src/booking.test.ts (17 tests) 2ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | — |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | — |
| M3 | Remove the blocked-room rejection | Detected | T13 | — |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
M1
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-07/app
 ❯ src/booking.test.ts (17 tests | 1 failed) 4ms
   × T06 AC2: a request of exactly 120 minutes is available 2ms
      Tests  1 failed | 16 passed (17)

M2
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-07/app
 ❯ src/booking.test.ts (17 tests | 3 failed) 4ms
   × T01 AC4: a request touching after a booking is available 3ms
   × T08 AC4: a request touching before a booking is available 0ms
   × AC5: an available check does not replace the bookings array 0ms
      Tests  3 failed | 14 passed (17)

M3
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-07/app
 ❯ src/booking.test.ts (17 tests | 1 failed) 4ms
   × T13 AC3: a blocked room makes a touching request unavailable 2ms
      Tests  1 failed | 16 passed (17)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Available; the displayed A-101 booking remained 10:00–11:00. | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | Selecting blocked Lab C-310 displayed Unavailable and the blocked-room explanation. | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Clearing Start time displayed “Please enter valid times in HH:MM format.” | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At 375 px, the controls and Available result were visible; document width was 375 px with no horizontal overflow. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Repeating the check left the booking list as Intro to Algorithms 10:00–11:00 and Faculty Meeting 13:00–14:00. | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The final suite, restored implementation, manual checks and report checker all pass. |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 17 / 17 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5 represented; no UI behavior is proven by unit tests. | AC1–AC5 represented; AC6 was checked manually, and invalid existing data remains unspecified. |
| Selected mutants detected | Not yet run when the first version was reviewed. | M1, M2 and M3 detected. |
| Accepted / revised / rejected tests | X2 accepted as a declared assumption; AC5 revised. | AC5 uses a deep-copy content comparison; all expected decisions retained. |
| Remaining limitations | The initial AC5 assertion could pass after mutation. | Tests cover fixed examples, not all input combinations; they cannot establish real room data or persistence. |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

It returns `true`: the existing booking does not satisfy both overlap comparisons (`700 < 720`
is true, but `660 < 650` is false). No AC defines invalid existing-booking behavior. I record
this as `returns-true`, not as a requirement-based guarantee.

---

## 10. Conclusion (120–180 words)

The first suite passed, but its AC5 check compared the bookings array with the same array
reference. That would not notice an in-place change to an item, so I revised it to deep-copy the
bookings before the call and compare their contents afterward. The final green run proves that
the 17 written examples produce the expected decisions with the current implementation; it does
not prove every possible interval or the behavior of real persisted bookings. The mutant runs
give more specific evidence: changing the 120-minute boundary failed T06, treating touching
endpoints as overlap failed T01 and T08, and removing the blocked-room check failed T13. The
manual checks also showed an Available result, blocked-room feedback, invalid-time feedback, and
a usable 375-pixel layout. They are snapshots of a small fictional project, not proof of
accessibility or every browser/device combination. One unresolved limitation is the reversed
existing booking: no acceptance criterion defines it. The implementation returns true for that
case, and I have recorded it as an assumption rather than claiming the ACs require that result.
