# AI Usage Disclosure — SIS #02

Required by the course academic policy (Generative AI use level **D** — AI-integrated, and for this
assignment AI use is **required** in the working process). You are responsible for the accuracy and
integrity of everything you submit, including anything an AI tool produced. The complete exchanges
live in `report.md`, section 11 — this file is the summary, not a second copy.

| Tool | Exact model / plan | Used for | Which sections and files it touched |
| --- | --- | --- | --- |
| Copilot assistant in VS Code | not displayed | Required Prompt A–D workflow: draft requirements, draft diagrams, critique in a fresh chat, and revise based on accepted decisions. Also assisted with report wording, diagram corrections, rendering and validation. | `report.md` §§1–9, 11–13; `models/original/`, `models/sequence.puml`, `models/classes.puml`, `models/img/`; this disclosure and `submission.yml`. |

**Three parts of this assignment are yours alone. All three were written without AI assistance:** no — I wrote the initial scope/assumptions and reflection; I drafted the walkthroughs and then used AI to edit them for accuracy against the final diagram and remove copied interface labels.
<!-- The first scope statement and initial assumptions (report.md section 10, committed BEFORE
     Prompt A), the walkthroughs (section 6) and the reflection (section 9). If "no", say exactly
     what was assisted. An honest "no" costs far less than an undisclosed "yes". -->

**The files in `models/original/` are the assistant's Prompt B output, unedited:** no — the original sequence source has one disclosed PlantUML syntax-order correction so it can render; the complete Prompt B response is preserved unedited in `report.md` §11 B2. In the final sequence diagram, I changed the `critical` fragment's descriptive label to “final validation” and renamed its returned status to `enrollmentExists`; the actual `checkDuplicate` message and duplicate-rejection branch remain. These clarify the guard for the supplied structural checker, which otherwise interpreted “duplicate” in a fragment/false-branch label as a rejection condition.

**Every source in section 13 is one I opened and read myself:** yes

**Everything I submitted, I can explain and defend without consulting the assistant:** yes

**Anything I accepted from the AI without fully understanding it:** Nothing.
<!-- Name the section or the diagram element. "Nothing" is a valid answer only if it is true. -->

Signed: Koibagar Orazbay
Date: 2026-10-18
