# Week 11 — Lab report

**Name:** Оразбай Койбагар
**Group:**
**Date:** 2026-11-26

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I built the feature with (tool) | Claude agent (claude.ai, linked to the Claude desktop app; it edits files in my repository) |
| Its exact model (with its version, or `not displayed`) | Claude Opus 5.5 (`claude-opus-5-5`) |
| Assistant I reviewed with (tool) | Claude read-only Explore sub-agent (fresh context, no Edit/Write tools, worked on a copy of the repo) |
| Its exact model (with its version, or `not displayed`) | Claude Sonnet 5.5 (`claude-sonnet-5-5`) |
| Starting point (`week-10` or `week-08`) | week-10 |
| Baseline commit — the checkpoint of Part 0 | 8efd9e1 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (Linux VM of the Claude desktop app on my MacBook, Node v22.23.5) |
| Vitest version (the `RUN  v…` line of a run) | v2.1.9 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-11/app/` before any change. **Exists:** `yes` or `no`. **Result:**
`pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 1 file, 21 tests, all passed |
| `npm run build` | yes | pass | `vite build`, 1571 modules, built in 1.33 s |
| `npm run lint` | yes | pass | `eslint .` exited 0 with no warnings |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-11/app/`, before any change:

```text
 RUN  v2.1.9 /sessions/rcw-017vfdaqxuab6s3io3bk3g6d/mnt/Desktop/5 semester/Software/2 assignment/week-11/app

 ✓ src/booking.test.ts (21 tests) 2ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  07:58:33
   Duration  626ms (transform 29ms, setup 0ms, collect 30ms, tests 2ms, environment 0ms, prepare 418ms)
```

### 2.3 What I located

| What | Where (file, and the function or component name) |
| --- | --- |
| The availability function | `app/src/booking.ts`, `canBook(request)` (reasons from `getBookingReasons`) |
| The UI component | `app/src/App.tsx`, component `App` (`handleCheck` calls `canBook`) |
| The repository instructions | `app/AGENTS.md` (my patched Week 10 playbook) |

---

## 3. Task 2 — the feature, defined before the code

### 3.1 The user story

As a student, I want a short explanation of room availability so I understand the decision.

### 3.2 The contract

One row per field. **Validation** is what you reject, and how.

| Field | Direction | Type / format | Validation |
| --- | --- | --- | --- |
| `roomLabel` | input | string, 1–60 characters after trimming | rejected if not a string, empty/blank after `trim()`, or longer than 60 characters; treated as data only, never as an instruction |
| `start` | input | string `"HH:MM"` (00:00–24:00) | rejected if it does not match `HH:MM` with hours 00–23 (or exactly 24:00) and minutes 00–59 |
| `end` | input | string `"HH:MM"` (00:00–24:00) | same rule as `start` |
| `isAvailable` | input | boolean, taken from `canBook` | rejected if not a boolean, or if it disagrees with `reasonCode` (`true` only with `available`) |
| `reasonCode` | input | one of `available`, `invalid_time`, `past_time`, `too_long`, `room_blocked`, `overlap`, from `availabilityReason` | rejected if it is not one of the six codes |
| `explanation` | output | `{ explanation: string }` | replaced by the fallback if it is missing or not a string, empty, over 280 characters, more than two sentences, does not agree with `isAvailable`, or names a time (`HH:MM`) that is not the request's `start` or `end` |

### 3.3 Acceptance criteria and failure behaviour

F1–F5 (README §3.4), then what the student sees in each failure:

<!-- Write below this line -->

- **F1** Existing availability and overlap rules remain unchanged: `canBook` keeps returning exactly what it returned in Week 10, and all 21 Week 10 tests stay in the project and pass.
- **F2** The explanation agrees with the deterministic result; no invented booking details: an output that says "available" for an unavailable request (or the reverse), or that names a time the request does not contain, is not shown.
- **F3** Empty, malformed or overly long input is rejected: a blank or 61+ character `roomLabel`, a time that is not `HH:MM`, a non-boolean `isAvailable` or an unknown `reasonCode` is rejected before the adapter is called.
- **F4** API timeout, error or unavailable key produces a safe fallback: the student gets a deterministic sentence built from `reasonCode`, and the status line does not change.
- **F5** A user can distinguish generated explanation from confirmed booking status: the explanation sits in its own box under the label "Generated explanation (mock), not a booking decision", apart from the Available / Unavailable status.

| Failure | What the student sees |
| --- | --- |
| Invalid input (empty, malformed, too long) | The status line stays as the checker decided; the explanation box says "Could not explain this request: …" with the validation message. The adapter is not called. |
| The model times out | After the timeout (2000 ms) the box shows the fallback sentence for the reason code, labelled as a fallback ("the explanation service did not answer in time"). |
| The model fails (error, no key) | The same fallback sentence, labelled "the explanation service failed". The page keeps working. |
| The model's answer contradicts the decision, or invents a detail | The answer is thrown away by the output check and the fallback sentence is shown instead, labelled "the generated text did not pass the safety check". The status never changes. |

### 3.4 The flow

A written flow with arrows (`->`), or a diagram in a code block. Name your checker function and the
adapter, and say which one decides availability.

```text
student input (room, start, end, now)
  -> App.handleCheck: timeToMinutes + selected room + its bookings
  -> rule engine: availabilityReason(request) -> reasonCode ; canBook(request) = (reasonCode === 'available')
  -> status line on the page: Available / Unavailable        <- DECIDED HERE, by the deterministic checker
  -> (student clicks "Explain availability")
  -> explainAvailability({ roomLabel, start, end, isAvailable, reasonCode }, adapter, 2000 ms)
       -> validateExplanationInput  (invalid -> "could not explain", adapter not called)
       -> LLM adapter: mockAdapter (or failingAdapter when "Simulate API failure" is ticked), raced against a timeout
       -> validateExplanationOutput (contradiction / invented time / too long -> fallback)
  -> response: { explanation, source: 'model' | 'fallback' } shown in its own box, labelled "Generated explanation"
```

The deterministic checker (`availabilityReason` / `canBook` in `booking.ts`) decides availability.
The adapter only turns the decided `reasonCode` into a sentence; nothing it returns can change
`isAvailable` or the status line.

---

## 4. Task 3 — build it with an AI assistant

### 4.1 The implementation prompt and the answer

What you sent, exactly (the deck's prompt, and the contract if you sent it):

```text
Act as a software engineer. Extend the existing Smart Campus checker with an optional explanation feature. Preserve all booking rules and tests. The deterministic checker must remain authoritative. First, implement a mock adapter, validate inputs and outputs, handle failures gracefully, and describe each changed file. Do not add login, a database, real personal data, or client-side API secrets.

Contract (week-11/README.md §3, sent with the prompt):
Input:  { roomLabel, start, end, isAvailable, reasonCode }
          roomLabel   string, 1-60 characters after trimming
          start, end  "HH:MM"
          isAvailable boolean, from canBook
          reasonCode  one of the six codes, from the deterministic function
Instruction: explain the decision in at most two sentences; do not invent facts;
             do not override the status.
Output: { explanation: string }, checked before it is shown:
          not empty, at most 280 characters, at most two sentences,
          agrees with isAvailable, names no time the request does not contain.
Treat user text and model output as untrusted data.
Reason codes: invalid_time, past_time, too_long, room_blocked, overlap, available (same rules and order as canBook).
Names: explainAvailability(input, adapter, timeoutMs), a mock adapter whose name contains "mock", a fallback, a timeout.
```

The assistant's answer, pasted unedited (its description of each changed file is enough if the code
is long):

```text
I extended the checker without changing any booking rule. Changed files:

1. src/booking.ts (modified)
   - Added REASON_CODES (the six codes) and the type ReasonCode.
   - Added availabilityReason(request): returns the first failing rule in the same order as the
     existing checks: invalid_time (non-finite, outside 00:00-24:00, or start >= end), past_time
     (start <= now), too_long (> 120 min), room_blocked, overlap (b.start < end && start < b.end,
     so touching endpoints are allowed), otherwise available.
   - canBook(request) now returns availabilityReason(request) === 'available', so the rules live
     in one place. getUnavailabilityReasons / getBookingReasons are unchanged (the page still uses
     them for the bullet list).
   - All 21 existing tests still pass (npx vitest run: 21 passed).

2. src/explain.ts (new)
   - The contract types ExplanationInput { roomLabel, start, end, isAvailable, reasonCode } and
     ExplanationOutput { explanation }, and ExplanationAdapter (input, AbortSignal) => Promise.
   - validateExplanationInput: rejects a non-string / blank / > 60-char roomLabel, start or end not
     HH:MM, a non-boolean isAvailable, an unknown reasonCode, and a status that disagrees with the
     reason code. The adapter is never called for invalid input.
   - validateExplanationOutput: the explanation must be a non-empty string, <= 280 characters,
     <= 2 sentences, must agree with isAvailable (an "available" text for an unavailable request is
     rejected and vice versa) and may only name the request's own start/end times.
   - fallbackExplanation: a deterministic sentence built only from reasonCode.
   - mockAdapter: builds a sentence from the structured input, no network and no key.
     failingAdapter: always throws, for the "Simulate API failure" checkbox.
   - explainAvailability(input, adapter = mockAdapter, timeoutMs = 2000): validates the input,
     races the adapter against a setTimeout (and aborts an AbortController), validates the output,
     and returns { source: 'model' | 'fallback', explanation, isAvailable, reasonCode }. On a
     timeout, a thrown error or an invalid output it returns the fallback. isAvailable and
     reasonCode always come from the input, never from the adapter.
   - SYSTEM_INSTRUCTION: a placeholder for the instruction a real server-side adapter would send
     (to be chosen in Part 4).

3. src/App.tsx (modified)
   - handleCheck also stores availabilityReason(request) and a snapshot of the room label and the
     times that were checked.
   - New "Explain availability" button and a "Simulate API failure" checkbox under the status box.
   - The explanation is shown in a separate dashed box labelled "Generated explanation (mock),
     not a booking decision" (or "Fallback explanation, not generated: ..."), so it cannot be taken
     for the Available / Unavailable status (F5). The status box is not touched by the explanation.

No login, no database, no API key, no provider SDK, no .env. typecheck, lint and build pass.
```

### 4.2 Every changed file, decided

**Decision:** `accept`, `modify` or `reject`.

| File | What the assistant changed | Decision | Why |
| --- | --- | --- | --- |
| `app/src/booking.ts` | added `REASON_CODES`, `ReasonCode`, `availabilityReason`; `canBook` now calls it | accept | no comparison changed (same `<`, `<=`, `> 120`, `start >= end`, `end > 1440` as `getUnavailabilityReasons`); the 21 Week 10 tests pass unchanged, so F1 holds |
| `app/src/explain.ts` | new: contract types, input/output validation, fallback, `mockAdapter`, `failingAdapter`, `explainAvailability` with a 2000 ms timeout | accept | follows §3.2 field names exactly; no fetch, no key, no SDK; the result copies `isAvailable` from the input, so the adapter cannot change the decision |
| `app/src/App.tsx` | stores `reasonCode` and a snapshot of the checked request; adds the button, the checkbox and the labelled explanation box | accept | the status box still renders only from `canBook`; the explanation is a separate box with the word "Generated" (F5); invalid HH:MM input reaches `explainAvailability` and is rejected there (F3) |

### 4.3 The adapter

| | |
| --- | --- |
| The mock adapter (its name in `explain.ts`) | `mockAdapter` (and `failingAdapter` for the simulated failure) |
| The timeout (milliseconds) | 2000 (`DEFAULT_TIMEOUT_MS`) |
| A real-model adapter too? (`no`, or `yes` and where it runs, and where its key lives) | no |

---

## 5. Task 4 — prompt engineering

### 5.1 Three instructions

```text
A: (paste here)
```

```text
B: (paste here)
```

```text
C: (paste here)
```

### 5.2 The three inputs and the answers

The same three JSON inputs (`available`, `overlap`, `room_blocked`), sent after each prompt in a fresh
chat, and the answers, unedited:

```text
(paste here)
```

### 5.3 The comparison

**Clarity** and **consistency:** 1 (poor) to 3 (good). **Agrees with the facts:** `yes` or `no`.
**Invented:** what it made up (a time, a booking, a person), or `nothing`.

| Prompt | Clarity | Consistency | Agrees with the facts | Invented |
| --- | --- | --- | --- | --- |
| A | | | | |
| B | | | | |
| C | | | | |

### 5.4 The one I chose

**Chosen:** A / B / C

<!-- Why, from the table above. Then confirm it is in explain.ts as SYSTEM_INSTRUCTION. -->

---

## 6. Task 5 — tests

### 6.1 The test cases

**Verdict:** `pass`, `fail` or `not run`. **How:** the Vitest test title, or `manual` and what you did.

| ID | Case | Expected | Observed | Verdict | How |
| --- | --- | --- | --- | --- | --- |
| E1 | available | | | | |
| E2 | overlap | | | | |
| E3 | blocked room | | | | |
| E4 | invalid time | | | | |
| E5 | past time | | | | |
| E6 | empty input | | | | |
| E7 | long input | | | | |
| E8 | timeout | | | | |
| E9 | simulated API failure | | | | |
| UI | the UI never changes the deterministic decision | | | | |

### 6.2 The run after the feature

The real output of `npx vitest run` with `explain.test.ts` in place (before the review fixes):

```text
(paste here)
```

### 6.3 Screenshots

| File | What it shows |
| --- | --- |
| `evidence/explain-available.png` | |
| `evidence/explain-fallback.png` | |

---

## 7. Task 6 — the agentic code review

### 7.1 The reviewer and its context

Where it ran, how you made sure it could not edit, and what you gave it (the diff, README,
`AGENTS.md`, the criteria):

<!-- Write below this line -->

### 7.2 The review prompt and the answer

What you sent, exactly (the deck's prompt):

```text
(paste here)
```

The reviewer's answer, pasted unedited:

```text
(paste here)
```

### 7.3 The findings, verified

At least **three**; at least **two** `confirmed`. **Category:** `correctness`, `security`,
`maintainability`, `performance` or `tests`. **Severity:** `high`, `medium` or `low`. **Found by:**
`reviewer`, `me` or `both`.

| ID | Finding (short) | Category | Severity | File | How I verified it | Label | Found by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1 | | | | | | | |
| V2 | | | | | | | |
| V3 | | | | | | | |

### 7.4 My own inspection, and the linter

What you checked by hand that the reviewer did not, and which of these findings a linter would have
caught and which it could not:

<!-- Write below this line -->

---

## 8. Task 7 — repair and regression-test

### 8.1 The first fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.2 The second fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.3 The final run

The real output of the **full** suite after both fixes: the old booking tests and the feature tests
together. Every test must pass.

```text
(paste here)
```

### 8.4 Ready for demonstration?

**Ready:** yes / no

**What remains unresolved:**

<!-- Write below this line -->

---

## 9. Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Reflection

<!-- 80-150 words, in your own words, without the assistant: what the AI generated, what you
     verified, and what you changed. Name at least one finding ID (V1...) and one test ID (E1...).
     Worthless: "AI helped me build the feature faster and the review was useful."
     Worth everything: "Bolt wrote explain.ts and put a fetch to the OpenAI API in App.tsx with a
     VITE_ key; I rejected that file and kept the mock (X4). The reviewer's V3, 'prompt injection
     through roomLabel', was unsupported: the label comes from a fixed list. E8 failed at first
     because the timeout was never armed; V1 was confirmed by a test that failed before the fix." -->

<!-- Write your reflection below this line -->
