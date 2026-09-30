# Traceability — use cases → stories → criteria

All six scenario use cases are retained. `none` means no acceptance criterion directly tests that use case in this submission; it is a coverage gap, not a missing scenario function.

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | AC-01, AC-02, AC-03 | No |
| UC-02 Book room | US-02 | AC-04, AC-05, AC-06, AC-07, AC-08 | No |
| UC-03 Cancel booking | US-03 | none | Yes — no direct cancellation criteria |
| UC-04 Block or unblock room | US-04 | none | Yes — no direct block/unblock criteria |
| UC-05 Review usage | US-05 | none | Yes — no direct usage-review criteria |
| UC-06 Send confirmation | US-06 | AC-09, AC-10, AC-11 | No |

**Stories that belong to no use case:** none

**What the gaps tell you:** Each use case has a story, but the three selected acceptance-criteria sets do not test cancellation, room blocking, or usage review. Story traceability alone does not establish test coverage.
