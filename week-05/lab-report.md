# Week 05 — Lab report

**Name:** Koibagar Orazbay
**Group:** [CSCI-2208] Software Engineering - Fall 2026
**Date:** 2026-10-11

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Copilot SDK in VS Code |
| **Exact** model name | not displayed |
| Language and version | Python 3.14.6 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
### Implementation plan
1. Check AC1: `0 <= start < end <= 1440` and `start > now`; otherwise return `False`.
2. Check AC2: duration `end - start` is at most 120 minutes; otherwise return `False`.
3. Check AC3: return `False` if the room is blocked.
4. Check AC4: return `False` if any existing interval overlaps the requested interval. Treat intervals as `[start, end)`, so touching endpoints are allowed.
5. Return `True` only if all checks pass. Do not modify any inputs.

**Assumptions:** `now` is valid, `blocked` is Boolean, and `existing` contains valid bookings for this room, as stated. Invalid requested times return `False`.

**Boundary cases to test:** start equal to `now` versus `now + 1`; start at `0`; end at `1440`; equal start and end; duration exactly 120 versus 121; existing booking ending exactly at the requested start or starting exactly at the requested end; and overlaps by one minute at either endpoint. Also verify that `existing` remains unchanged.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | The plan says invalid requested times return `False` and tests `start=0`; | AC5 says return False otherwise, but because `now >= 0`, `start=0` cannot satisfy `start > now`. Contract input types make non-integer handling open. | Kept False for invalid integer requests per AC5; selected and disclosed `return-false` for non-integer input as an explicit assumption, not as a claimed AC. |

**Boundary cases the assistant suggested that I kept as tests:**

- Kept: `start == now` / `now + 1`, `end == 1440`, equal endpoints, durations 120 / 121, both touching directions, overlap by one minute, unchanged `existing`.

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440 and start > now):` | AC1 | Correct for integer inputs. |
| 2 | `if end - start > 120:` | AC2 | Correct: exactly 120 remains allowed. |
| 3 | `if blocked:` | AC3 | Correct: blocked room returns False. |
| 4 | `if start < existing_end and existing_start < end:` | AC4 | Correct for half-open intervals; strict inequalities allow touching. |
| 5 | `return True` after the loop | AC5 | Correct: reached only after all criteria pass; no input is mutated. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- No extra behavior: the function only validates, checks overlap, and returns a Boolean.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `test_touching_end_is_allowed` | `(660, 720)` | base | True | AC4 | pass | pass |
| 2 | `test_partial_overlap_is_rejected` | `(630, 690)` | base | False | AC4 | pass | pass |
| 3 | `test_blocked_room_is_rejected` | `(660, 720)` | `blocked=True` | False | AC3 | pass | pass |
| 4 | `test_exactly_two_hours_is_allowed` | `(720, 840)` | base | True | AC2 | pass | pass |
| 5 | `test_over_two_hours_is_rejected` | `(720, 841)` | base | False | AC2 | pass | pass |
| 6 | `test_starting_now_is_rejected` | `(540, 570)` | base | False | AC1 | pass | pass |
| 7 | `test_zero_length_is_rejected` | `(600, 600)` | existing `[(700, 760)]` | False | AC1 | pass | pending |
| 8 | `test_reversed_interval_is_rejected` | `(660, 600)` | existing `[(700, 760)]` | False | AC1 | pass | pending |
| 9 | `test_end_at_1440_is_allowed` | `(1380, 1440)` | `existing=[]` | True | AC1 | pass | pending |
| 10 | `test_end_after_1440_is_rejected` | `(1380, 1441)` | `existing=[]` | False | AC1 | pass | pending |
| 11 | `test_empty_existing_bookings_allow_request` | `(600, 660)` | `existing=[]` | True | AC4 | pass | pending |
| 12 | `test_overlap_with_second_of_several_bookings_is_rejected` | `(720, 780)` | `existing=[(900, 960), (600, 660), (700, 760)]` | False | AC4 | pass | pending |
| 13 | `test_request_containing_existing_booking_is_rejected` | `(570, 690)` | base | False | AC4 | pass | pending |
| 14 | `test_touching_existing_start_is_allowed` | `(570, 600)` | base | True | AC4 | pass | pending |
| 15 | `test_existing_is_unchanged_after_success` | `(780, 840)` | unsorted three-booking list | True | Contract | pass | pending |
| 16 | `test_existing_is_unchanged_after_rejection` | `(610, 650)` | unsorted three-booking list | False | Contract | pass | pending |
| 17 | `test_non_integer_start_returns_false_by_declared_assumption` | `(600.5, 660)` | `existing=[]` | False | §9.2 assumption | fail: True | pending |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(600.5, 660, 540, False, [])` | False by my declared assumption | True on v1 | `if not (0 <= start < end <= 1440 and start > now):` lets the float pass its comparisons | reject non-integer start/end before AC1 checks | My input assumption plus assistant implementation |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
