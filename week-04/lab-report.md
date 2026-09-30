# Week 04 — Lab report: Modeling the System with UML

> Working draft prepared with GitHub Copilot. Review the judgments and complete the separate-chat critique before submission.

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

The three task prompts below are copied unchanged from the Week 04 README. The student reports sending them to the AI and copying the resulting PlantUML into `models/original/`. The earlier working drafts were removed from those files; each currently contains one response. Keep those files unchanged from this point. Confirm before submission that the captured blocks are the complete first replies and that Tasks 1–3 were sent in the required same chat.

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

**Assumptions the AI listed:** None. The response omitted the requested assumptions. The revised class and sequence diagrams declare the two scenario decisions: touching bookings are allowed, and blocking a room does not cancel existing bookings.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Send confirmation | The diagram makes confirmation a direct student goal, although US-06 describes receiving it as the outcome of a successful request. | R4, US-06 | Removed the actor association and renamed the use case `Receive confirmation`. |
| 2 | Book room / Cancel booking → confirmation | The response shows no condition or relationship explaining when confirmation occurs. R4 only states the booking rule; cancellation confirmation comes from US-06 and the scenario. | R4, US-06, Scenario | Added success-guarded extend relationships; the booking reason cites R4/US-06 and the cancellation reason cites US-06/Scenario. |
| 3 | Assumptions | The prompt asked for assumptions, but none were listed. | R2, R3 | Declared the touching-bookings and blocked-room assumptions in the revised behavior diagram. |
| 4 | Six scenario use cases | All six required functions are present and actor responsibilities for the five directly initiated goals match the stories. | US-01–US-06 | Kept the six use cases; confirmation remains unassociated with actors. |

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
| 1 | `Student.name`, `Room.name`, and `receiveConfirmation()` | The response adds member details not needed to express R1–R3; confirmation is a system outcome, not a Student domain operation required by the stories. | R1–R3, R4, US-06 | Removed those unsupported members; kept `Room.block/unblock` and `Booking.cancel/overlaps` because US-03, US-04, and R2 justify them. |
| 2 | `Booking` has no `status` | Cancellation and the R2 phrase “active bookings” need a way to distinguish active from cancelled bookings. | R2, US-03 | Added `status: BookingStatus` with `ACTIVE` and `CANCELLED`. |
| 3 | No explicit R2 constraint note | An `overlaps()` operation alone does not state the required invariant on the class diagram. | R2 | Added a note to `Booking` stating active bookings for one room do not overlap; the behavior note labels the touching-bookings decision as assumption A1. |
| 4 | R1 note omits the positive lower bound | “Up to two hours” alone does not make the required duration greater than zero explicit. | R1 | Made the revised `Booking` note state duration is greater than zero and at most two hours. |
| 5 | No explicit R3 constraint note on `Room` | The `blocked` attribute is present, but the class view did not state its booking consequence. | R3, US-04 | Added a `Room` note: a blocked room cannot be booked. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence, because it makes the order of validation, availability checks, persistence, and confirmation explicit.

**Design components added beyond the domain model:** `BookingService` validates the requested time and coordinates the booking; `BookingRepository` checks blocked/overlapping reservations and saves a booking only after the checks pass. These are sequence lifelines, not domain classes.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `checkRoomAvailability` | One opaque call does not show the separate blocked-room and overlap checks required by R3 and R2. | R2, R3 | Replaced it with explicit `isRoomBlocked` and `hasOverlappingActiveBooking` calls, both before saving. |
| 2 | Generic `Room unavailable` alternative | It does not tell the student whether the room is blocked or the requested time overlaps another booking. | R2, R3 | Added separately guarded rejection branches for blocked room and overlapping booking. |
| 3 | No visible failed-time branch | The R1 validation is named, but the response does not show rejection when the time range is invalid. | R1 | Added an `alt` branch for invalid time range before any repository call or save. |
| 4 | Confirmation and assumptions | The response does not visibly tag confirmation with R4 or identify the interval/blocking decisions as assumptions. | R4, R2, R3 | Send a confirmation after persistence; label A1 and A2 explicitly in the note and declare them in §4.3. |

---

## 6. AI critique

The critique was run in a separate Copilot chat using the approved stories and revised diagrams. I checked its claims against the actual files and the Week 04 instructions; several suggestions were accepted, while assumptions explicitly required by the lab were retained.

| # | Issue the AI raised | Element | Verdict | Why / action |
| --- | --- | --- | --- | --- |
| 1 | The use-case name should describe the student receiving, not the system sending, a confirmation. | `Send confirmation` | accept | US-06 says the student receives confirmation. Renamed it `Receive confirmation` and retained no actor association. |
| 2 | The cancellation-confirmation relationship should cite US-06 and the scenario, not R4 alone. | Cancellation extension | accept | R4 covers successful booking; US-06 and the scenario also require confirmation after successful cancellation. Updated the direct-above `why:` comment. |
| 3 | State R3’s effect on the class diagram near the blocked-room attribute. | `Room.blocked` | accept | Added a `Room` note that a blocked room cannot be booked, directly reflecting R3. |
| 4 | `BookingStatus` is a reasonable inference, not an explicitly named requirement element. | `BookingStatus` | accept | Kept it as a minimal design choice derived from US-03 cancellation and R2’s “active bookings”; do not describe the enum itself as explicitly prescribed. |
| 5 | Remove the half-open interval and existing-bookings-after-block decisions as unsupported assumptions. | A1, A2 | reject | README §3 explicitly says both questions are undecided and must be declared as assumptions when a diagram depends on them. Kept both in §4.3 and labeled them A1/A2 in the sequence note. |
| 6 | Consider removing `BookingService` and `BookingRepository` as implementation-level elements. | Sequence lifelines | reject | The required sequence prompt explicitly requires both lifelines; §5 explains them as design components, and they are not added to the domain class diagram. |
| 7 | Remove `Room.isAvailable()` as an unjustified operation. | `Room.isAvailable()` | reject / not applicable | That operation is not in the submitted class diagram. The retained `block()`, `unblock()`, `cancel()`, and `overlaps()` operations are supported by US-04, US-03, and R2. |
| 8 | `DateTime` is a modeling choice rather than a specified datatype. | `startTime`, `endTime` | accept | Kept the attributes needed by R1/R2; treat `DateTime` as a reasonable representation choice, not a mandated type. |

---

## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | `Booking.startTime`, `Booking.endTime`; Booking note | `validateTimeRange` checks a future start and a positive duration of at most two hours; invalid-time alternative rejects. |
| R2 | Book room | `Booking.status`, `Booking.startTime`, `Booking.endTime`; non-overlap note | `hasOverlappingActiveBooking`; overlap alternative rejects before save. |
| R3 | Book room | `Room.blocked` | `isRoomBlocked`; blocked-room alternative rejects before save. |
| R4 | Receive confirmation | `Booking` is created with reservation state | Success branch returns confirmation only after save returns created. |
| US-01 | View availability | `Room.blocked`, `Booking` interval/status | Not part of the selected Book room sequence; availability is a separate use case. |
| US-02 | Book room | `Student`, `Room`, `Booking` | Student requests booking; validations precede save. |
| US-03 | Cancel booking | `Student`, `Booking`, `Booking.status` | Not part of the selected Book room sequence; cancellation is outside this behavior diagram. |
| US-04 | Block / unblock room | `Room.blocked` | The sequence reads blocked status for the booking decision; administrator changes are outside this behavior diagram. |
| US-05 | Review usage | `Room`, `Booking` | Not part of the selected Book room sequence; review is outside this behavior diagram. |
| US-06 | Receive confirmation | `Booking` success state | Success branch returns the booking confirmation after persistence; cancellation confirmation is represented in the use-case view but is outside the selected behavior. |

---

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Student directly linked to Send confirmation; missing condition; cancellation rationale attributed to R4 | Removed direct actor link, renamed the goal to Receive confirmation, and documented distinct booking/cancellation rationale | US-06 describes receipt; R4 applies to booking, while US-06 and the scenario cover cancellation. |
| 2 | class | Extra member details; no `Booking.status`; no R2/R3 notes; R1 bound omitted duration > 0 | Added `BookingStatus`, full R1 bound, and R2/R3 notes; kept plain `1` / `0..*` associations | R1–R3, US-03 and US-04 support the state and constraints. |
| 3 | sequence | One generic availability check and generic unavailable branch; assumptions were not distinguished from rules | Added separate R3 and R2 checks plus an R1 failure branch; labeled A1/A2; confirmation follows persistence | Every rule is visible, failures stop before persistence, and the two undecided choices are explicitly assumptions. |

---

## 9. Checker output
Latest run: `python tests/check_models.py`.

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
LR6  PASS  8 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```
