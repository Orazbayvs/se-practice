# Week 04 — Lab report: Modeling the System with UML

> Working draft prepared with GitHub Copilot in the current session. Verify every judgment, and replace the preliminary critique with the output from the required new chat before submitting.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Koibagar Orazbay |
| Group | Not provided — fill in |
| AI assistant | GitHub Copilot |
| Exact model | GPT-6 Luna |
| Renderer | PlantUML web server |
| Behaviour diagram | sequence |
| Stories used | my revised Week 03 stories |

The six approved stories were copied, with their original IDs and wording, from Week 03 into `models/approved-stories.md`.

---

## 2. Prompts as sent

The prompt text below is copied unchanged from the Week 04 README. The model drafts were prepared in this Copilot session; they were not obtained by opening a separate chat and sending these prompts as messages. The files in `models/original/` are the draft originals for this work, but they do not substitute for evidence from the required one-chat workflow if the instructor expects that literal process.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** It assumed both actors can review usage, that an administrator sends confirmation, and that booking/cancellation always include confirmation. These assumptions are not supported by the scenario; confirmation is system behavior after success.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Review usage | The scenario assigns usage review to the Administrator, not the Student. | US-05 | Removed the Student association. |
| 2 | Administrator → Send confirmation | A person does not directly initiate this system action; it follows a successful student request. | R4, US-06 | Removed the Administrator association; modeled confirmation as a conditional extension. |
| 3 | Book room / Cancel booking include Send confirmation | An unconditional include wrongly suggests a confirmation is sent even when the request fails. | R4, US-06 | Replaced includes with success-guarded extensions. |
| 4 | Send confirmation | This is the sixth required scenario function and must remain represented, despite not being a direct actor goal. | US-06 | Retained it as a conditional use case extended only on success. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One Student can make zero or many Bookings. | Each Booking belongs to exactly one Student. | Student `1`; Booking `0..*` |
| Room — Booking | One Room can be reserved by zero or many Bookings over time. | Each Booking reserves exactly one Room. | Room `1`; Booking `0..*` |

### 4.2 Constraints the multiplicities cannot show

- R2: a note attached to `Booking` states that active bookings for the same room do not overlap. R2 is a time-interval constraint, not a multiplicity.
- R1 is also stated in the `Booking` note: start time is in the future, end is after start, and duration is at most two hours.

### 4.3 Assumptions

- A1: Touching bookings are allowed. Booking intervals are half-open, so 10:00–12:00 and 12:00–13:00 do not overlap.
- A2: Blocking a room prevents new bookings but keeps existing bookings; blocking alone does not cancel reservations.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `Room *-- Booking` | Composition says a booking is a lifetime-dependent part of a room. The scenario does not establish that ownership; a booking is a separate reservation associated with one room. | US-02, US-03 | Replaced composition with a plain association. |
| 2 | Room–Booking multiplicity `1..*` at Booking | It requires every room to have an existing booking, which is false for a free room. | US-01, US-02 | Changed the Booking end to `0..*`. |
| 3 | Booking operations `confirm()` | The domain class should represent reservation state; confirmation is a system outcome, not a booking lifecycle operation specified by the domain stories. | R4, US-06 | Removed the operation; kept status and confirmation in the use-case/sequence views. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence, because it makes the order of validation, availability checks, persistence, and confirmation explicit.

**Design components added beyond the domain model:** `BookingService` validates the requested time and coordinates the booking; `BookingRepository` checks blocked/overlapping reservations and saves a booking only after the checks pass. These are sequence lifelines, not domain classes.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Save before validation in the original sequence | Invalid or conflicting requests could be persisted before the rules are checked. | R1–R3 | Moved all checks before `saveBooking`; only the no-overlap branch saves. |
| 2 | Availability check after save | The original could create a booking before discovering that the room is blocked or unavailable. | R2, R3 | Check blocked status and overlapping active bookings before saving. |
| 3 | One vague `unavailable` alternative | It did not make the distinct rule failures or the no-save behavior explicit. | R1–R3 | Added guarded rejection alternatives for invalid time, blocked room, and overlap; each exits before save. |
| 4 | Confirmation | The original success path did not establish that confirmation followed all successful checks and persistence. | R4 | Send confirmation only after the repository returns a created booking. |

---

## 6. AI critique

> Preliminary review written by Copilot in this session, not the required critique from a separate new chat. Replace or verify these rows against the actual new-chat response before submission.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | The use-case diagram omits an actor association for Send confirmation. | Send confirmation | reject | R4 and US-06 describe confirmation as an outcome after success, not a goal a person directly triggers; the diagram intentionally has no actor link. |
| 2 | `BookingStatus` is not explicitly required by a story. | BookingStatus | accept | The sequence and R2 need a distinction between active and cancelled bookings to define which reservations participate in overlap checks. It is a minimal domain state, not a new feature. |
| 3 | The sequence could show duration validation more visibly. | `validateTimeRange` | accept | The call names the check and the note gives the future-start and maximum-duration details. To make the bound directly visible, the message/note could be made more explicit if a reviewer finds the present wording insufficient. |
| 4 | The class diagram does not model Administrator as a class. | Administrator | reject | An actor is not necessarily a domain class. The required minimum domain classes are Student, Room, and Booking; administrator actions belong to the use-case view and are covered by US-04/US-05. |

---

## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | `Booking.startTime`, `Booking.endTime`; Booking note | `validateTimeRange` checks a future start and a positive duration of at most two hours; invalid-time alternative rejects. |
| R2 | Book room | `Booking.status`, `Booking.startTime`, `Booking.endTime`; non-overlap note | `hasOverlappingActiveBooking`; overlap alternative rejects before save. |
| R3 | Book room | `Room.blocked` | `isRoomBlocked`; blocked-room alternative rejects before save. |
| R4 | Send confirmation | `Booking` is created with reservation state | Success branch sends confirmation only after save returns created. |
| US-01 | View availability | `Room.blocked`, `Booking` interval/status | Not part of the selected Book room sequence; availability is a separate use case. |
| US-02 | Book room | `Student`, `Room`, `Booking` | Student requests booking; validations precede save. |
| US-03 | Cancel booking | `Student`, `Booking`, `Booking.status` | Not part of the selected Book room sequence; cancellation is outside this behavior diagram. |
| US-04 | Block / unblock room | `Room.blocked` | The sequence reads blocked status for the booking decision; administrator changes are outside this behavior diagram. |
| US-05 | Review usage | `Room`, `Booking` | Not part of the selected Book room sequence; review is outside this behavior diagram. |
| US-06 | Send confirmation | `Booking` success state | Success branch sends the booking confirmation after persistence. |

---

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Student linked to Review usage; Administrator linked to Send confirmation; unconditional includes | Correct actor responsibilities; success-guarded extensions for confirmation; six supplied goals retained | US-05 assigns review to Administrator; R4/US-06 make confirmation conditional. |
| 2 | class | Room composed of Booking with multiplicity `1..*`; Booking had `confirm()` | Plain Room–Booking association with `1` / `0..*`; removed unsupported `confirm()` | A booking is not a lifecycle-dependent part of a room; free rooms can have no bookings; confirmation is a system outcome. |
| 3 | sequence | Saved before validation and checked availability after save | R1, R3, and R2 checks precede persistence; each failure rejects without saving | Rules must be validated before creating a booking; R4 confirmation follows successful save. |

---

## 9. Checker output

Checker has not yet been run. Paste the complete output of `python tests/check_models.py` here after the final worksheet and images are in place, then list and explain every FAIL being kept. Do not submit this placeholder.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus study room booking system"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (6 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  4 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  4 behaviour-diagram findings in §5
LR6  PASS  4 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```
