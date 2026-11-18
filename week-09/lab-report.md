# Week 09 — Lab Report: canBook as a Tool

**Name:** Koibagar Orazbay
**Student ID:** 24B032151
**GitHub:** Orazbayvs

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Copilot in VS Code |
| Exact model (or "not displayed") | not displayed |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.14.6 |

## 2. Your tool definition — a reason for every constraint

```json
{
  "name": "check_room",
  "description": "Check whether a room is available for a requested time interval. All times are whole minutes since midnight in the range 0–1440, with 1440 meaning 24:00. Provide the current time, blocked status, and existing bookings using the same units. The tool only checks availability; it does not save, create, or change a booking.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start time in whole minutes since midnight."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end time in whole minutes since midnight."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time in whole minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is blocked."
      },
      "bookings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Existing booking start in whole minutes since midnight."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Existing booking end in whole minutes since midnight."
            }
          },
          "required": [
            "start",
            "end"
          ],
          "additionalProperties": false
        },
        "description": "Existing bookings as objects with start and end times in whole minutes since midnight; an empty list means no bookings."
      }
    },
    "required": [
      "start",
      "end",
      "now",
      "blocked",
      "bookings"
    ],
    "additionalProperties": false
  }
}
```

| Field | Constraint | What goes wrong without it |
| --- | --- | --- |
| Root | `"type": "object"` | A scalar or list would not be a well-formed tool argument object. |
| Root | `"required": ["start", "end", "now", "blocked", "bookings"]` | Missing inputs would leave the availability check under-specified. |
| Root | `"additionalProperties": false` | The model could invent unsupported fields such as `room`, which the client cannot use. |
| `start`, `end`, `now`; booking `start`, `end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Strings, fractions, and times outside the day would be accepted as minutes. |
| `blocked` | `"type": "boolean"` | A string such as `"false"` could be mistaken for a real false value. |
| `bookings` | `"type": "array"` | A single object or unrelated value could be mistaken for the list of existing bookings. |
| Each booking | `"type": "object"` with required `start` and `end` | A pair/list or incomplete booking would not identify both endpoints. |
| Each booking | `"additionalProperties": false` | Unsupported data in a booking item could mask an argument-shape error. |
| Description | Minutes since midnight, range 0–1440, and read-only/no-save behavior | A model could use clock strings, another time unit, or tell the user it booked the room. |

## 3. The twelve calls — first run and final run

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | Already accepted correctly shaped R1 arguments. |
| S02 | PASS | PASS | Already accepted an empty bookings array. |
| S03 | FAIL | PASS | Added integer types to numeric fields; `end` must not be a clock string. |
| S04 | FAIL | PASS | Added `now` to the required root properties. |
| S05 | FAIL | PASS | Set root `additionalProperties` to false. |
| S06 | FAIL | PASS | Added minimum 0 to minute fields. |
| S07 | FAIL | PASS | Added maximum 1440 to minute fields. |
| S08 | FAIL | PASS | Made both endpoints required on each booking object. |
| S09 | FAIL | PASS | Set `blocked` to boolean type. |
| S10 | FAIL | PASS | Set minute fields to integer type, rejecting fractions. |
| S11 | PASS | PASS | Kept 1440 inclusive as the end-of-day maximum. |
| S12 | FAIL | PASS | Required each bookings item to be an object with named endpoints. |

## 4. Function calling — what the model wrote

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

Match: yes. The model converted 9:00, 10:00, 11:00, and 12:00 to 540, 600, 660, and 720 minutes and included every required argument.

### R2

```text
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}
```

Match: yes. It made a call even though the room is blocked, which is correct: the tool, not the model or schema, should return Unavailable. It converted 16:30 to 990 minutes.

### R3

```text
What start time should I check for the two-hour booking?
```

The model asked instead of calling. It interpreted “a couple of hours” as two hours, but “tomorrow afternoon” does not give a precise start time; the request also omits the current time, blocked status, and existing bookings. Asking for the start time avoids inventing it, although the model should also collect the other missing values before it can call.

## 5. What the schema cannot check

AC1 has two parts the schema cannot compare: it cannot enforce `start < end`, or that `start > now`, because those are relationships between separate values. It can enforce the other stated part of AC1: each time is an integer from 0 through 1440. AC2 (at most 120 minutes) needs subtraction between `end` and `start`, which these allowed schema keywords cannot express. AC3 requires interpreting `blocked` as a business rule, and AC4 requires checking the requested interval against every booking and treating touching endpoints as non-overlap; both require logic over values, not just shape validation. AC5 is about side effects: a schema does not control whether an implementation writes or saves a booking. AC6 is about the page's feedback and is a UI responsibility, outside the input schema.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | It is the requested read-only availability check using user-provided inputs, and it does not book or save anything. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading project source is relevant and does not change files or disclose data externally. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | This changes an acceptance rule and may permit bookings the agreed policy rejects, so a user request alone is not authorization to rewrite the rule. |
| A4 | run `npm test` in `week-08/app` | ask | A package test script can execute arbitrary code or mutate files, so inspect the script and get approval before running it. |
| A5 | `git reset --hard` to undo its own last three edits | ask | The command can erase other tracked work as well as the agent's edits, so inspect the exact diff and obtain approval before discarding anything. |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit creates a durable project-history change, so the agent should show the diff and wait for the user's review and approval. |
| A7 | `git push` to `main` | block | Pushing an unreviewed change directly to the shared main branch bypasses review and can affect everyone using the repository. |
| A8 | send the contents of `.env` to an MCP server it found online | block | `.env` may contain secrets, and sending them to an untrusted external server would disclose credentials. |

## 7. Checkpoint

Checkpoint commit: `e45e9ea` (`Week 09: define check_room tool schema`). The exact recovery command is `git reset --hard e45e9ea`. It would discard staged and unstaged tracked changes made after this checkpoint, but would leave untracked files alone.

## 8. Checker output

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

None; the final checker run passes all 30 checks.

## 10. Conclusion (80–150 words)

This lab showed me that the schema protects the request's shape, not whether the requested booking makes sense. S03 was refused because `end` was a string, and S08 was refused because a booking lacked its `end`; those are useful schema checks. But a structurally valid call could still set `start` equal to `end`, ask for more than 120 minutes, or overlap a booking. The model's R2 call should still be made even though `blocked` is true: `canBook` decides availability, while the schema only validates fields. In R3, the model correctly asked rather than making up a start time, but the eventual tool caller must collect all missing values. I would allow the read-only A1 call, but block sending `.env` in A8 because tool access does not justify exposing secrets.
