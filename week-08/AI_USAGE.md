# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
Copilot assisted with code, the skill file, and report drafting. The student must review the
work and complete the remaining personal review and signature before submission.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Copilot in VS Code | Not displayed | Diagnosis without the skill; review of failures; implementation of BUG-A and BUG-B fixes; creating the skill from the deck text; drafting the report, disclosure, and declaration | `app/src/booking.ts`, `app/src/booking.test.ts`, `skills/bug-detector/SKILL.md`, `skills/bug-detector.zip`, `lab-report.md`, `AI_USAGE.md`, `submission.yml` |
| Copilot task-agent contexts (two isolated runs) | Not displayed | Prompt-only comparison: one diagnosis without the skill text and one with the skill text supplied as an instruction; neither agent edited project files | No files |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** no — Copilot created the file from the deck text. The handout's manual-typing requirement is not met.

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** no — the assistant made the local edits; I must review and understand them before submitting.

**I used another assistant as well:** yes — the two isolated Copilot task-agent contexts above provided the comparative diagnoses. The exact model was not displayed.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** no — sections 2.2–2.3 contain selected output excerpts; sections 8.1–8.2 record the actual targeted/full-run results.

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the
fix — without the assistant:** pending student confirmation

**Anything I accepted from the AI without fully understanding it:**
The proposed BUG-B diagnostic examples from both assistant contexts also touched an endpoint, so BUG-A could mask BUG-B. The committed BUG-B regression instead uses a non-touching request. I need to review and explain this reasoning myself.

Student signature: pending student review
Date: pending student signature
