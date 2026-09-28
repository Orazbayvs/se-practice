# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Orazbaj
**Group:** AI-Driven Software Engineering
**Date:** 2026-09-28

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | GitHub Copilot |
| Exact model name | MAI-Code-1.1-Flash |
| Implementation language | Python |
| Date of the runs | 2026-09-28 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
n/a — used Python
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. It assumed a list of numeric marks was the input format.
2. It invented a pass threshold of 50 without being told.
3. It assumed a CLI-style script and printed output instead of only defining a function.
4. It chose dictionary keys like avg/high/low/pass_pct on its own.

**Questions it should have asked and did not:**

1. What is the required function name and exact signature?
2. What are the required keys in the returned dictionary and the exact pass_rate format?

**Is the function named `analyze_marks` with the required signature?** no — if no, what is it
called: `report`

**First impression before testing** (one sentence — you will compare this with section 6 later):
It is plausible-looking code, but it is missing the required contract and therefore likely to fail the harness.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. It specified the exact function name and default argument.
2. It named the required return fields and the validation rules.

**What B still leaves open:**

1. It does not say whether pass_rate is a percent (0–100) or a fraction (0–1).
2. It does not require a specific rounding rule for the numeric output.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes |
| below 0 / above 100 | yes |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** no — if no, where do they disagree:
The AI used pass_rate as a fraction like 0.67 instead of a percentage like 66.67, so its self-tests agree with its own assumption but disagree with the required harness.

**Assumptions C stated explicitly before the code:**
The remaining assumption was that pass_rate is a ratio in the range 0–1 unless otherwise specified; the example in the prompt was not explicit enough to resolve the ambiguity.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50) exactly as specified.
Return a dictionary with the keys average, highest, lowest, and pass_rate.
Use a list of numeric marks from 0 to 100; reject empty input, non-numeric values, bools, and values below 0 or above 100 by raising ValueError.
Use no external libraries and no CLI or print statements.
The pass rate must be a percentage in the range 0–100, not a fraction, and should be rounded to two decimal places.
Example: analyze_marks([40, 60, 80], 50) returns {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}.
Include tests for these cases: single mark, decimals, custom pass_mark, empty list, text value, and marks below 0 or above 100.
State any remaining assumptions before the code.
```

**What I deliberately added that A, B and C did not have:**

1. I resolved the pass_rate ambiguity by requiring a percentage with two-decimal rounding.
2. I explicitly forbade CLI/print output and required a pure function.
3. I narrowed the return contract to the exact keys and example values.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
The specification left a key ambiguity: whether pass_rate should be presented as 0.67 or 66.67. I resolved it by requiring a percentage in the range 0–100 rounded to two decimal places, which matches the test harness.

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | FAIL | FAIL | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | FAIL | FAIL | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | FAIL | FAIL | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | FAIL | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | FAIL | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | FAIL | PASS | PASS |
| | **Totals** | | 0/6 | 0/6 | 3/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1 | function `report` does not exist because the required `analyze_marks` name was missing |
| A | 2 | same missing function error |
| A | 3 | same missing function error |
| A | 4 | same missing function error |
| A | 5 | same missing function error |
| A | 6 | same missing function error |
| B | 1 | returned dictionary with keys `avg`, `high`, `low`, and `pass_rate` as 0.67 instead of `average`, `highest`, `lowest`, and 66.67 |
| B | 2 | same key mismatch and wrong pass-rate representation |
| B | 3 | same key mismatch and wrong pass-rate representation |
| B | 4 | returned `ValueError` but the dict keys were still wrong for earlier cases |
| B | 5 | returned `ValueError` as required, but the function failed earlier cases |
| B | 6 | returned `ValueError` as required, but the function failed earlier cases |
| C | 1 | returned `pass_rate` as 0.67 instead of 66.67 |
| C | 2 | returned `pass_rate` as 1.0 instead of 100 |
| C | 3 | returned `pass_rate` as 0.5 instead of 50 |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
======================================================================
analyze_marks harness — code/prompt_a.py
tolerance for numeric comparison: 0.01
======================================================================
ERROR: code/prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
====================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
====================================================================
SIGNATURE: ok
--------------------------------------------------------------------
case 1  FAIL  analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : missing key(s) average, highest, lowest — got keys ['avg', 'high', 'low', 'pass_rate']
--------------------------------------------------------------------
case 2  FAIL  analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : missing key(s) average, highest, lowest — got keys ['avg', 'high', 'low', 'pass_rate']
--------------------------------------------------------------------
case 3  FAIL  analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : missing key(s) average, highest, lowest — got keys ['avg', 'high', 'low', 'pass_rate']
--------------------------------------------------------------------
case 4  FAIL  analyze_marks([], 50)
          expect: ValueError
          got   : returned {'avg': 0.0, 'high': 0, 'low': 0, 'pass_rate': 0.0} where ValueError was required
--------------------------------------------------------------------
case 5  FAIL  analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : returned {'avg': 0.0, 'high': 0, 'low': 0, 'pass_rate': 0.0} where ValueError was required
--------------------------------------------------------------------
case 6  FAIL  analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : returned {'avg': 0.0, 'high': 0, 'low': 0, 'pass_rate': 0.0} where ValueError was required
--------------------------------------------------------------------
RESULT  0 PASS · 6 FAIL · 0 ERROR   (code/prompt_b.py)
====================================================================
```

**Prompt C**

```
====================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
====================================================================
SIGNATURE: ok
--------------------------------------------------------------------
case 1  FAIL  analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : pass_rate=0.67 expected 66.67
--------------------------------------------------------------------
case 2  FAIL  analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : pass_rate=1.0 expected 100.0
--------------------------------------------------------------------
case 3  FAIL  analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : pass_rate=0.5 expected 50.0
--------------------------------------------------------------------
case 4  PASS  analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
--------------------------------------------------------------------
case 5  PASS  analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: marks must all be numeric and within 0 to 100
--------------------------------------------------------------------
case 6  PASS  analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must all be numeric and within 0 to 100
--------------------------------------------------------------------
RESULT  3 PASS · 3 FAIL · 0 ERROR   (code/prompt_c.py)
====================================================================
```

**Prompt D**

```
====================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
====================================================================
SIGNATURE: ok
--------------------------------------------------------------------
case 1  PASS  analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
--------------------------------------------------------------------
case 2  PASS  analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
--------------------------------------------------------------------
case 3  PASS  analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
--------------------------------------------------------------------
case 4  PASS  analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
--------------------------------------------------------------------
case 5  PASS  analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: marks must all be numeric and within 0 to 100
--------------------------------------------------------------------
case 6  PASS  analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must all be numeric and within 0 to 100
--------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
====================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 0 | 1 | 2 |
| Requirement coverage | 0 | 1 | 1 | 2 |
| Verifiability (tests) | 0 | 1 | 1 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 0 | 1 | 1 | 2 |
| **Total / 10** | 0 | 4 | 6 | 10 |

**Prompt length, in words:** A 9 · B 38 · C 52 · D 78

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

B added 29 words for 4 points gained over A, C added 14 words for 2 points gained over B, and D added 26 words for 4 points gained over C; the added precision was worth it, but the biggest jump came from resolving the pass_rate ambiguity, not simple verbosity.

---

## 8. Conclusion — 150–200 words

Prompt D scored best and is the one I would actually use at work because it specified the exact contract, removed the pass_rate ambiguity, and matched the harness in all six cases. The single addition that bought the most correctness was the explicit requirement that pass_rate is a percentage from 0 to 100 rounded to two decimals; this changed case 1 from FAIL in Prompt C to PASS in Prompt D, because the AI had produced 0.67 instead of 66.67. Pure noise was the extra explanatory text and the invented CLI-style output in Prompt A; it did not improve correctness and made the output less precise. The key ambiguity was whether pass_rate should be a fraction or a percentage. I resolved it inside Prompt D by requiring a percentage, which matches the harness and the example. This is the kind of ambiguity that only shows up once the tests are written by someone else, and it is exactly why a prompt is an engineering input rather than a casual instruction. 

**Word count:** 176

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. Does the model benefit more from examples or from exact requirements first?
2. When do we know a prompt is complete enough to stop refining it?
