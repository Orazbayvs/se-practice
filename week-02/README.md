# Week 02 — The Prompt Is an Engineering Input

**Course:** AI-Driven Software Engineering (Fall 2026, KBTU SITE)
**Practice work #02** · 1 point · AI-use level: **D (AI-integrated, disclosure required)**

---

## The idea of this lab

You will give **one AI assistant the same coding task four times**, changing nothing except the
prompt. Then you test all four outputs against **the same six cases** and decide, from evidence,
which prompt was worth writing.

| Prompt | What changes |
| --- | --- |
| **A** | one vague sentence |
| **B** | role, signature, requirements, constraints |
| **C** | B + a worked example + required tests |
| **D** | your own combined prompt, written after you have seen A, B and C |

**Main message of this lab:** a prompt is an engineering input. Change it deliberately, test the
output, and decide from evidence — not from first impressions — which version is better.

Last week you compared *a human* against *a tool*. This week the human is constant and the
**prompt is the only variable**. Same domain as Week 01 on purpose: you already know what correct
looks like, so your attention is free for the actual subject.

**Time budget:** ~50 min in class (Parts 0–3) + ~60 min at home (Parts 4–7).

---

## Deliverables

By the deadline, your branch `week-02` must contain:

```
week-02/
├── README.md                  # this file — read-only
├── lab-report.md              # the one worksheet you fill in
├── AI_USAGE.md                # AI disclosure (required every week)
├── code/
│   ├── prompt_a.py            # the AI's output for Prompt A, unedited
│   ├── prompt_b.py            # …for Prompt B
│   ├── prompt_c.py            # …for Prompt C
│   └── prompt_d.py            # …for Prompt D
└── tests/
    └── test_analyze_marks.py  # provided harness — DO NOT EDIT
```

Use your own language's extension if you are not using Python (`prompt_a.js`, `PromptA.java`, …).
Fill in `lab-report.md` — **do not delete its headings**; the grading pass reads them by number.

---

## Part 0 — Branch setup — ~3 min

Full instructions are in **[SETUP.md](../SETUP.md)**. Short version:

```bash
git checkout main
git pull
git checkout -b week-02
mkdir -p week-02/code week-02/tests
```

Copy `README.md`, `lab-report.md`, `AI_USAGE.md` and `tests/test_analyze_marks.py` from the course
template into your `week-02/` folder.

---

## Part 1 — Freeze the experiment — ~5 min

An experiment where two things change at once tells you nothing. Before you send a single prompt,
fix these three and **do not change them again for the rest of the lab**:

1. **One AI assistant** — ChatGPT, Claude, DeepSeek, Gemini, Qwen, whatever you can access.
2. **One model** — record the exact name shown in the interface (`GPT-5.1`, `Claude Sonnet 4.5`,
   `DeepSeek-V3`…). "ChatGPT" is not a model name.
3. **One implementation language** — **Python is recommended**, because the provided harness is
   Python and needs no setup. Any language you can run and explain is allowed.

Write all three into **section 1** of `lab-report.md`.

Three more rules that make the comparison fair:

- **A fresh chat for every prompt.** Prompts A, B, C and D each start in a new, empty conversation.
  A model that already saw your requirements in the previous message is not being tested on
  Prompt A.
- **No follow-up questions during the first run.** Send the prompt, take what comes back. You may
  ask follow-ups only in Part 7, after all four are scored.
- **Copy the response exactly before touching it.** Do not fix the code, not even an import, not
  even an obvious typo. A silently repaired output is a destroyed measurement.

```bash
git add week-02
git commit -m "week-02: experiment setup — tool, model and language fixed"
```

---

## Part 2 — Prompt A (minimal) — ~8 min

Start a new chat. Send **exactly this and nothing else**:

```
Write Python code to analyze student marks.
```

Save the AI's complete response to `code/prompt_a.py`, unedited. Then fill in **section 2** of
`lab-report.md`:

- every assumption the AI made that you never gave it (a data format, a pass threshold, a rounding
  rule, an input method, a whole CLI);
- every question it **should** have asked and did not;
- whether the function is even called `analyze_marks`.

That last one is usually where Prompt A dies, and the harness will say so.

---

## Part 3 — Prompt B (structured context) — ~8 min

New chat. Send **exactly this**:

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

Save the code to `code/prompt_b.py`, unedited. Fill in **section 3**: what B fixed compared to A,
and what it still leaves open.

```bash
git add week-02
git commit -m "week-02: prompts A and B, outputs captured"
```

> **This is the end of the in-class part.** Parts 4–7 are finished at home.

---

## Part 4 — Prompt C (examples and tests) — ~10 min

New chat. Send **Prompt B again**, with this appended to it:

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

Save the code to `code/prompt_c.py`. **Also save the tests the AI wrote** — into the same file is
fine. Fill in **section 4**, and pay attention to one thing in particular:

> **Do the AI's own tests pass against the AI's own code?** They almost always do. That is not
evidence of correctness — an author testing their own assumptions agrees with themselves. The
six cases below are written by someone else, and that is the entire difference.

---

## Part 5 — Prompt D (your combined prompt) — ~10 min

New chat. Now write **one prompt of your own** that merges everything you learned from A, B and C
into a single send. Not a conversation — **one message**, and you take what comes back.

It should carry, at minimum: the role, the exact signature, the return shape, the validation rules,
the constraints, at least one worked example, the required tests, and a resolution for **every
ambiguity you found in Parts 2–4**.

Paste your full Prompt D text into **section 5** of `lab-report.md`, and the output into
`code/prompt_d.py`.

> One ambiguity is sitting in this specification already. You will meet it in Part 6 and you are
> expected to find it yourself; naming it in section 5 and resolving it inside Prompt D is worth
> more than any other sentence you write this week.

```bash
git add week-02
git commit -m "week-02: prompts C and D, outputs captured"
```

---

## Part 6 — Test all four the same way — ~20 min

### The six cases

Every output is tested with the same six calls. Nothing is repaired first.

| # | Call | Required result |
| --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | average 60 · highest 80 · lowest 40 · pass_rate 66.67 |
| 2 | `analyze_marks([100], 50)` | average 100 · highest 100 · lowest 100 · pass_rate 100 |
| 3 | `analyze_marks([49.5, 50], 50)` | average 49.75 · highest 50 · lowest 49.5 · pass_rate 50 |
| 4 | `analyze_marks([], 50)` | raises **ValueError** |
| 5 | `analyze_marks([40, "60"], 50)` | raises **ValueError** |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises **ValueError** |

### The verdict vocabulary — use these three words and no others

```
PASS    the values match the required ones (tolerance 0.01),
        or the required ValueError is raised deliberately

FAIL    it runs, but a value is wrong, a required key is missing,
        or it returns a result where an error was required

ERROR   it does not run, the function is missing, the signature is wrong,
        or it raises some other exception instead of ValueError
```

"Almost" is not a verdict. An output that returns the right numbers under the key `avg` instead of
`average` is a **FAIL**: the specification named the keys.

### If you are using Python

```bash
python tests/test_analyze_marks.py code/prompt_a.py
python tests/test_analyze_marks.py code/prompt_b.py
python tests/test_analyze_marks.py code/prompt_c.py
python tests/test_analyze_marks.py code/prompt_d.py
```

Paste the **complete terminal output of all four runs** into **section 6** of `lab-report.md`.
The results table without the pasted output does not count.

### If you are not using Python

The harness cannot run your code, so you write the runner yourself — about twenty lines that call
the function with each of the six inputs, print the case number, the returned value or the
exception type, and your verdict. Commit it as `tests/runner.<ext>` and paste its **real terminal
output** into section 6. Screenshots of an IDE are not accepted; text output is.

**Substitution rule for the prompts.** Prompts A, B and C are given in Python wording. If you work
in another language, change **only these tokens** and nothing else, so that every student in the
class is still sending the same prompt:

| Token in the prompt | Replace with |
| --- | --- |
| `Python` | your language |
| `dictionary` | your language's map / object / record type |
| `ValueError` | your language's standard invalid-argument exception |
| `no external libraries` | keep as is — standard library only |

Record the substituted text in section 1. Changing anything else invalidates the comparison.

---

## Part 7 — Score the four prompts — ~15 min

Use the rubric in your worksheet and the harness output to score the four solutions.

### Rubric

- Correctness: did the tests pass or fail?
- Requirement coverage: did it meet the specification beyond the minimum?
- Verifiability: were the tests clear and runnable?
- Assumptions stated: were ambiguities called out?
- Noise: how much unnecessary explanation, CLI code, or invented features were included?

Use the section 7 scoring table in `lab-report.md`.

---

## Final note

The whole point is not to win an argument about who writes the “best” code. The point is to measure,
with evidence, how the wording of the prompt changes the result.
