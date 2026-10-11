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
| **Exact** model name | GPT-6 Luna |
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
| 7 | `test_zero_length_is_rejected` | `(600, 600)` | existing `[(700, 760)]` | False | AC1 | pass | pass |
| 8 | `test_reversed_interval_is_rejected` | `(660, 600)` | existing `[(700, 760)]` | False | AC1 | pass | pass |
| 9 | `test_end_at_1440_is_allowed` | `(1380, 1440)` | `existing=[]` | True | AC1 | pass | pass |
| 10 | `test_end_after_1440_is_rejected` | `(1380, 1441)` | `existing=[]` | False | AC1 | pass | pass |
| 11 | `test_empty_existing_bookings_allow_request` | `(600, 660)` | `existing=[]` | True | AC4 | pass | pass |
| 12 | `test_overlap_with_second_of_several_bookings_is_rejected` | `(720, 780)` | `existing=[(900, 960), (600, 660), (700, 760)]` | False | AC4 | pass | pass |
| 13 | `test_request_containing_existing_booking_is_rejected` | `(570, 690)` | base | False | AC4 | pass | pass |
| 14 | `test_touching_existing_start_is_allowed` | `(570, 600)` | base | True | AC4 | pass | pass |
| 15 | `test_existing_is_unchanged_after_success` | `(780, 840)` | unsorted three-booking list | True | Contract | pass | pass |
| 16 | `test_existing_is_unchanged_after_rejection` | `(610, 650)` | unsorted three-booking list | False | Contract | pass | pass |
| 17 | `test_non_integer_start_returns_false_by_declared_assumption` | `(600.5, 660)` | `existing=[]` | False | §9.2 assumption | fail: True | pass |
| 18 | `test_integer_subclass_is_accepted` | `(Minute(600), Minute(660))` | `existing=[]` | True | AC1 | pass | pass |
| 19 | `test_boolean_start_returns_false_by_declared_assumption` | `(True, 61)` | `now=0, existing=[]` | False | §9.2 assumption | fail: True | pass |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(600.5, 660, 540, False, [])` | False by my declared assumption | True on v1 | `if not (0 <= start < end <= 1440 and start > now):` lets the float pass its comparisons | reject non-integer start/end before AC1 checks | My input assumption plus assistant implementation |
| 2 | `can_book(Minute(600), Minute(660), 540, False, [])` | True | False with exact-type guard | `type(start) is not int` rejects an `int` subclass | Use `isinstance` while excluding Boolean values | Assistant's critique, accepted by me |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

~~~~text
Prompt:
The expected result is False, but I get True. Here are my code and failing test. Explain the cause and propose the smallest fix without changing the contract.

Code:
```python
def can_book(start, end, now, blocked, existing):
    """Return whether the requested time is valid and available."""
    if not (0 <= start < end <= 1440 and start > now):
        return False

    if end - start > 120:
        return False

    if blocked:
        return False

    for existing_start, existing_end in existing:
        if start < existing_end and existing_start < end:
            return False

    return True
```

Failing test:
```python
def test_non_integer_start_returns_false_by_declared_assumption(self):
    self.assertIs(can_book(600.5, 660, 540, False, []), False)
```

Actual output: `AssertionError: True is not False`.

Assistant answer:
`600.5` passes the current range check: it is greater than `now`, less than `end`, and produces a duration under 120 minutes. The function never checks that `start` and `end` are integers, so it returns `True`. The test supplies a float despite the contract specifying integer times; to make the function reject such inputs, add an integer check to the initial condition:

```python
if not (
    isinstance(start, int)
    and isinstance(end, int)
    and 0 <= start < end <= 1440
    and start > now
):
    return False
```

This keeps the contract unchanged and rejects the test’s float input. Note that in Python, `bool` is a subclass of `int`; use `type(start) is int` and `type(end) is int` instead if Boolean values should also be rejected as times.
~~~~

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
- **Issue — rejects integer subclasses:** `if type(start) is not int or type(end) is not int:` rejects values of subclasses of `int`, even when they represent valid integer minutes and satisfy all other checks. The contract requires integer times but does not restrict them to exact built-in `int` objects. This concerns the **function contract**.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | `type(...) is int` rejects integer subclasses | accept | The contract says integer minutes without restricting values to exact built-in `int`; `test_integer_subclass_is_accepted` failed with exact-type checks. Replaced with `isinstance`, excluding bool separately. | 19 tests pass |
| 2 | No second issue was raised in the assistant's critique. | N/A | I did not invent another suggestion; the checker requires two judged points, so L6 is disclosed below. | No change needed |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | Added integer guard before AC1, then refined it to accept `int` subclasses but reject `bool` | Implement `return-false` for non-integer request times without excluding integer subclasses | Float and Boolean assumption tests pass; the custom `Minute(int)` test also passes. |
| 2 | Changed exact `type(x) is int` checks to `isinstance(x, int)` with explicit Boolean exclusion | Accept all integer subtypes required by the contract while retaining the selected behavior for Boolean values | `test_integer_subclass_is_accepted` failed on the exact-type guard and passes after this change. |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_boolean_start_returns_false_by_declared_assumption (test_booking.BookingTests.test_boolean_start_returns_false_by_declared_assumption) ... ok
test_empty_existing_bookings_allow_request (test_booking.BookingTests.test_empty_existing_bookings_allow_request) ... ok
test_end_after_1440_is_rejected (test_booking.BookingTests.test_end_after_1440_is_rejected) ... ok
test_end_at_1440_is_allowed (test_booking.BookingTests.test_end_at_1440_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_is_unchanged_after_rejection (test_booking.BookingTests.test_existing_is_unchanged_after_rejection) ... ok
test_existing_is_unchanged_after_success (test_booking.BookingTests.test_existing_is_unchanged_after_success) ... ok
test_integer_subclass_is_accepted (test_booking.BookingTests.test_integer_subclass_is_accepted) ... ok
test_non_integer_start_returns_false_by_declared_assumption (test_booking.BookingTests.test_non_integer_start_returns_false_by_declared_assumption) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_with_second_of_several_bookings_is_rejected (test_booking.BookingTests.test_overlap_with_second_of_several_bookings_is_rejected) ... ok
test_partial_overlap_is_rejected (test_booking.BookingTests.test_partial_overlap_is_rejected) ... ok
test_request_containing_existing_booking_is_rejected (test_booking.BookingTests.test_request_containing_existing_booking_is_rejected) ... ok
test_reversed_interval_is_rejected (test_booking.BookingTests.test_reversed_interval_is_rejected) ... ok
test_starting_now_is_rejected (test_booking.BookingTests.test_starting_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_existing_start_is_allowed (test_booking.BookingTests.test_touching_existing_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 19 tests in 0.000s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (16 lines)
PASS   S1   your suite has at least 11 tests            19 tests
PASS   S2   your suite is green on your own code        19 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starting_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_1440_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_touching_end_is_allowed, test_touching_existing_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_existing_is_unchanged_after_rejection, test_overlap_with_second_of_several_bookings_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_request_containing_existing_booking_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_is_unchanged_after_success
PASS   M10  your tests catch a fault in AC5             caught by test_existing_is_unchanged_after_rejection, test_existing_is_unchanged_after_success
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              5 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  19 tests listed
PASS   L5   report 5: debugging evidence                2 row(s) of input / expected / actual
FAIL   L6   report 6: the critique, each point judged   section 6 needs the critique pasted and at least 2 points marked accept or reject with a reason (found 1)
PASS   L7   report 7: change log                        2 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      149 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: no
Not counted for M - these fail on a can_book that follows the contract exactly, so they
test what the contract leaves open or contradict an AC: test_boolean_start_returns_false_by_declared_assumption, test_non_integer_start_returns_false_by_declared_assumption
SUMMARY pass=31 fail=1 error=0   (32 checks)
Every FAIL or ERROR you keep goes in lab-report.md section 9 and in submission.yml known_fails.
One you report and explain costs you nothing. One you hide costs the whole criterion.
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
| L6 | The assistant returned one concrete critique point; I judged it and did not invent a second suggestion just to satisfy the shape check. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- I choose `return-false`: Python floats such as `600.5` pass ordinary range comparisons, so the function explicitly rejects non-integer `start` or `end`. The contract leaves this case open; this is my declared assumption, not an AC.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- AC1's lower bound `0 <= start` cannot be the only rejection reason. Because `now` is valid and at least 0, and AC1 also requires `start > now`, any acceptable start is already greater than 0. A request with `start=0` fails the future-time condition first.

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
In this practice, I analyzed and verified the can_book function against the provided contract and criteria AC1–AC5. The core overlap condition, start < existing_end and existing_start < end, effectively detects conflicting intervals for half-open ranges. Because boundaries are exclusive at the end, touching endpoints evaluate to False under strict inequality, correctly allowing adjacent bookings. During testing, initial code v1 successfully passed all standard specification checks (F1–F10). However, custom boundary tests for unspecified contract behavior revealed that floating-point inputs required explicit handling. Subsequently, code critique identified that using exact type(x) is int checks prematurely rejected valid custom int subclasses. Adding a test for int subclasses prompted us to refine the implementation using isinstance(x, int) while explicitly excluding bool instances. Finally, regarding unspecified contract behavior, I decided to return False for non-integer inputs. This experience highlighted the necessity of rigorous boundary testing beyond initial AI-generated code.
