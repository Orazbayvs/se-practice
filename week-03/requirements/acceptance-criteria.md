# Acceptance criteria — three selected stories

Assumptions first, then three sets of Given/When/Then criteria. Boundary and invalid cases are included.

## Assumptions

- **Overlap:** bookings that touch at an endpoint are allowed; a booking ending at 14:00 does not overlap one starting at 14:00 under R3. This treats occupied intervals as half-open.
- **Duration:** exactly two hours is allowed under R2; only a duration greater than two hours is invalid.
- The system's current time is the reference for deciding whether a booking starts in the future.

## US-01 — View availability

### AC-01
- **Given** the Student requests availability for a future date and time
- **When** the system checks rooms for the requested time slot
- **Then** the available rooms are shown for that time slot

### AC-02
- **Given** a room is marked as blocked
- **When** the Student views availability for that time slot
- **Then** that room is shown as unavailable

### AC-03
- **Given** a room has a booking that overlaps the requested time slot
- **When** the Student views availability for that time slot
- **Then** that room is shown as unavailable for the requested time

## US-02 — Book room

### AC-04
- **Given** a room is free, unblocked, and the requested duration is no more than two hours
- **When** a Student submits a booking whose start time is in the future
- **Then** the booking is accepted, including when its duration is exactly two hours

### AC-05
- **Given** a room is free and unblocked
- **When** a Student submits a booking starting at the current time or earlier
- **Then** the booking is rejected because R1 requires a future start

### AC-06
- **Given** a room is free and unblocked
- **When** a Student submits a booking lasting more than two hours
- **Then** the booking is rejected under R2

### AC-07
- **Given** a room is free and unblocked
- **When** a Student submits a booking for a time interval that overlaps another booking for that room
- **Then** the booking is rejected under R3

### AC-08
- **Given** the selected room is blocked
- **When** a Student submits the booking
- **Then** the booking is rejected under R4

## US-06 — Receive confirmation

### AC-09
- **Given** a Student's booking request has succeeded
- **When** the system completes the successful booking
- **Then** the Student receives a confirmation of the booking

### AC-10
- **Given** a Student's cancellation request for a booking they made has succeeded
- **When** the system completes the cancellation
- **Then** the Student receives a confirmation of the cancellation

### AC-11
- **Given** a booking request is rejected because it violates R1, R2, R3, or R4
- **When** the system finishes processing the request
- **Then** no confirmation of a successful booking is sent
