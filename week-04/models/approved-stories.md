# Approved stories — Smart Campus study room booking

**Source of this set:** my revised Week 03 stories in `week-03/requirements/user-stories.md`. The IDs and story wording are carried forward unchanged.

## Scenario

The KBTU library has small study rooms reserved by students through a campus web application. Students view availability, book rooms for individual or group study, and cancel their own bookings. Administrators block/unblock rooms and review usage over a period. A successful booking or cancellation is confirmed to the student.

- **R1** A booking starts in the future and lasts greater than zero and at most two hours.
- **R2** Two bookings for the same room may not overlap.
- **R3** A blocked room cannot be booked.
- **R4** A successful booking produces a confirmation.

## Approved stories

### US-01
As a Student, I want to view which study rooms are free and when, so that I can choose a suitable time for individual or group study.

### US-02
As a Student, I want to reserve a free study room for a time slot, so that I can plan my study session.

### US-03
As a Student, I want to cancel a booking I made, so that the room can be made available again.

### US-04
As an Administrator, I want to block or unblock a study room, so that I can take it out of service or return it to use.

### US-05
As an Administrator, I want to review room usage over a period, so that I can understand how the library rooms are being used.

### US-06
As a Student, I want to receive a confirmation when my booking is made or cancelled, so that I know the result of my request.

## Scope boundary

Do not model payments, fees, fines or penalties; check-in, attendance or QR codes; equipment, cleaning or maintenance requests; SMS, push or reminder notifications beyond confirmation; account registration, passwords or authentication; waiting lists or queues; or screens, colours, databases or servers.
