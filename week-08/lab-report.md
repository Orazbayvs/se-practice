# Week 08 — Lab report

**Name:** Koibagar Orazbay
**Group:** CSCI-2208 Software Engineering
**Date:** 2 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Copilot in VS Code (this chat) |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | Prompt-only simulation in a separate Copilot assistant context; no skill was installed and the environment did not show an invocation indicator |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer, in the local terminal |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-08/app

 ✓ src/booking.test.ts (17 tests) 2ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. Relevant output from the real run:

```text
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-08/app

 ❯ src/booking.test.ts (17 tests | 3 failed) 5ms
   × T01 AC4: a request touching after a booking is available 3ms
     → expected false to be true // Object.is equality
   × T08 AC4: a request touching before a booking is available 0ms
     → expected false to be true // Object.is equality
   × AC5: an available check does not replace the bookings array 0ms
     → expected false to be true // Object.is equality

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01 AC4: a request touching after a booking is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:7:26
      5|   const bookings = [{ start: 600, end: 660 }];
      6|   const input = { start: 660, end: 720, now: 540, blocked: false, book…
      7|   expect(canBook(input)).toBe(true);
       |                          ^
      8| });
      9|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  src/booking.test.ts > T08 AC4: a request touching before a booking is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:49:26
     47|   const bookings = [{ start: 600, end: 660 }];
     48|   const input = { start: 570, end: 600, now: 540, blocked: false, book…
     49|   expect(canBook(input)).toBe(true);
       |                          ^
     50| });
     51|

⎯⯯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  src/booking.test.ts > AC5: an available check does not replace the bookings array
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:92:26
     90|   const before = JSON.parse(JSON.stringify(bookings));
     91|   const input = { start: 660, end: 720, now: 540, blocked: false, book…
     92|   expect(canBook(input)).toBe(true);
       |                          ^
     93|   expect(bookings).toEqual(before);
     94| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯

 Test Files  1 failed (1)
      Tests  3 failed | 14 passed (17)
```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug. The block below is the relevant output excerpt from the real run.

```text
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-08/app

 ❯ src/booking.test.ts (19 tests | 2 failed | 17 skipped) 4ms
   × BUG-A AC4: a request touching two bookings is available 3ms
     → expected false to be true // Object.is equality
   × BUG-B AC5: an available request that touches no booking leaves bookings unchanged 1ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > BUG-A AC4: a request touching two bookings is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:114:26
    112|   ];
    113|   const input = { start: 660, end: 720, now: 540, blocked: false, book…
    114|   expect(canBook(input)).toBe(true);
       |                          ^
    115| });
    116|

⎯⯯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/booking.test.ts > BUG-B AC5: an available request that touches no booking leaves bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  Array [
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:122:20
    120|   const input = { start: 720, end: 780, now: 540, blocked: false, book…
    121|   expect(canBook(input)).toBe(true);
    122|   expect(bookings).toEqual(before);
       |                    ^
    123| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯

 Test Files  1 failed (1)
      Tests  2 failed | 17 skipped (19)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | BUG-A | request 660–720; existing bookings 600–660 and 720–780 | true | false | My initial suspicion was that inclusive endpoint checks treated touching intervals as overlapping; I had not yet identified the exact line. |
| BUG-B | BUG-B | request 720–780; existing booking 600–660 | true; original array unchanged | `canBook` returned true but appended 720–780 to the same array | My initial suspicion was that the function mutated the caller's booking list; I had not yet identified the exact statement. |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes |
| I read the whole file once: no passwords, API keys or private student data | yes |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
Archive:  bug-detector.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
      570  11-02-2026 19:02   bug-detector/SKILL.md
---------                     -------
      570                     1 file
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

No external skill-upload environment was available, so I used the deck's prompt-only simulation
in a fresh Copilot Chat: the skill text was sent first, then the diagnosis prompt and same test
input. This is a simulation, not an installed skill, and the environment showed no invocation
badge. `evidence/install.png` is a genuine screenshot of that chat's diagnostic response and the
visible end of the skill instruction. The student has read `SKILL.md` and confirmed it contains
no secrets.
Copilot drafted the initial file from the handout. The student edited the punctuation at the end
of steps 5 and 6 and reviewed the full file. The checker requires those procedure lines verbatim,
so Copilot restored the periods in the final copy. The initial AI draft and the student's edits
are disclosed in `AI_USAGE.md`.
The student independently read the complete file on 2 November 2026 and confirmed it contains
only the handout procedure, with no passwords, API keys or private student data.
---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failure excerpt from the real 2.2 run:
RUN v2.1.9
× T01 AC4: a request touching after a booking is available
  expected false to be true

Provided canBook:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
**Root cause:** The overlap check treats bookings that touch at an endpoint as overlapping. In `if (start <= b.end && end >= b.start)`, the inclusive comparisons reject a request whose start equals an existing booking’s end, contrary to AC4.

**Minimal patch:** Use strict comparisons for overlap (`start < b.end && end > b.start`). Also remove the `bookings.push(...)`: the shown function mutates booking data, contrary to AC5.

**Regression test:** With `now = 500`, an existing booking `{ start: 600, end: 660 }`, and a request `{ start: 660, end: 720 }`, expect `canBook(...)` to return `true` and `bookings` to remain unchanged.
```

---

## 6. Task 5 — with the skill

**Prompt-only simulation:** A separate assistant context received the skill text as its first
instruction; no skill was installed or shown as invoked. It then received exactly the same
diagnostic input as section 5. Only the question changes, to the deck's skill question:

```text
Use the bug-detector skill to diagnose the failed room-booking test.

AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failure excerpt from the real 2.2 run:
RUN v2.1.9
× T01 AC4: a request touching after a booking is available
  expected false to be true

Provided canBook:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
**Defect:** Confirmed — endpoint-touching bookings are rejected, violating AC4.
**Evidence:** In the overlap loop, `if (start <= b.end && end >= b.start) return false;` treats a request starting exactly when an existing booking ends as overlapping. This matches T01’s failure.
**Root cause:** The overlap check uses inclusive comparisons; endpoint-only contact should not count as overlap.
**Minimal patch:** Use `start < b.end && end > b.start` for the overlap check.

**Defect:** Confirmed — availability checks mutate booking data, violating AC5.
**Evidence:** `bookings.push({ start, end });` adds a booking before returning `true`.
**Minimal patch:** Remove the `push`; keep `canBook` read-only.

**Regression test:** With `bookings = [{ start: 60, end: 90 }]`, `now = 0`, and a request `{ start: 90, end: 120 }`, expect `canBook(...)` to return `true` and `bookings` to remain unchanged.

**Hypotheses:** None established from the supplied evidence.
```

Did the environment show that the skill was invoked? not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Both identified the inclusive overlap comparison as BUG-A and the append as a violation of AC5. | Same root causes as the no-skill answer. |
| Reproducible test | The proposed test checks both endpoint availability and unchanged data at once. Because the request touches an endpoint, BUG-A can reject it before the mutation is reached; it does not isolate BUG-B. | Same limitation: its proposed BUG-B case also touches an endpoint, so BUG-A can mask whether BUG-B is detected. |
| Minimal proposed patch | Correct minimal changes: use strict overlap comparisons and remove the append. | Same two minimal changes. |
| Unsupported claims | The source shows the append, but the T01 failure itself only proves the endpoint bug; it does not demonstrate mutation. | Same distinction: mutation is visible in the source, not established by the T01 failure alone. |
| Clarity of explanation | Concise, but it does not separate evidence from hypothesis or warn that the combined regression test can be masked. | The structured labels made it easier to follow, but it still missed that its proposed BUG-B regression test was coupled to BUG-A. |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

- No skill: both. With skill text: both.

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
BUG-A minimal diff:

-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;

Targeted command: `npx vitest run -t 'BUG-A'`

Targeted run:
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-08/app

 ✓ src/booking.test.ts (19 tests | 18 skipped) 1ms

 Test Files  1 passed (1)
      Tests  1 passed | 18 skipped (19)

Full suite after BUG-A only:
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-08/app

 ❯ src/booking.test.ts (19 tests | 2 failed) 5ms
   × AC5: an available check does not replace the bookings array 3ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   × BUG-B AC5: an available request that touches no booking leaves bookings unchanged 0ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > AC5: an available check does not replace the bookings array
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  Array [
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 720,
+     "start": 660,
+   },
  ]

 ❯ src/booking.test.ts:93:20
     91|   const input = { start: 660, end: 720, now: 540, blocked: false, book…
     92|   expect(canBook(input)).toBe(true);
     93|   expect(bookings).toEqual(before);
       |                    ^
     94| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/booking.test.ts > BUG-B AC5: an available request that touches no booking leaves bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  Array [
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 780,
+     "start": 720,
    },
  ]

 ❯ src/booking.test.ts:122:20
    120|   const input = { start: 720, end: 780, now: 540, blocked: false, book…
    121|   expect(canBook(input)).toBe(true);
    122|   expect(bookings).toEqual(before);
       |                    ^
    123| });

 Test Files  1 failed (1)
      Tests  2 failed | 17 passed (19)
   Start at  18:30:47
   Duration  235ms (transform 20ms, setup 0ms, collect 18ms, tests 5ms, environment 0ms, prepare 31ms)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
BUG-B minimal diff:

-  bookings.push({ start, end });

Targeted BUG-B run:
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-08/app

 ✓ src/booking.test.ts (19 tests | 18 skipped) 1ms

 Test Files  1 passed (1)
      Tests  1 passed | 18 skipped (19)

Final full suite:
RUN  v2.1.9 /Users/orazbajkojbagar/Desktop/5 semester/Software/2 assignment/week-08/app

 ✓ src/booking.test.ts (19 tests) 2ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  18:31:01
   Duration  199ms (transform 20ms, setup 0ms, collect 20ms, tests 2ms, environment 0ms, prepare 28ms)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All assignment-checker checks pass. |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
Both assistant contexts proposed a BUG-B test that also touched an endpoint, so BUG-A could reject it before the mutation assertion ran. The committed 720–780 regression test isolates the mutation instead.

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
The skill text did not change the diagnosis in a meaningful way: both assistant responses found the inclusive overlap check and the array append. The skill response was easier to scan because it separated evidence, cause and fix, but both proposed a BUG-B test that also touched an endpoint, so BUG-A could mask the mutation. The independent 720–780 regression isolated that behavior, and each failing test passed after its corresponding one-line fix; all 19 tests then passed. This proves these test cases match the stated criteria for these two defects, not that every possible input is correct or that other defects do not exist. I reviewed and edited the generated skill wording, but did not type it from scratch; the prompt-only chat is documented with a genuine screenshot.
