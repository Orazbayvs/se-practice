# AI Usage Disclosure — Week 04

AI assistance was used for UML drafts, diagram revisions, review analysis, and worksheet text. The student remains responsible for checking every claim against the Week 04 scenario and explaining the submitted diagrams.

| Tool | Exact model | Used for | Which files it touched |
| --- | --- | --- | --- |
| GitHub Copilot | GPT-6 Luna | Generated the three initial PlantUML responses from the prescribed task prompts; helped revise the diagrams | `models/original/use-case.puml`, `models/use-case.puml`, `models/original/class.puml`, `models/class.puml`, `models/original/sequence.puml`, `models/sequence.puml` |
| GitHub Copilot | GPT-6 Luna | Carried forward approved stories; drafted worksheet reviews, consistency table, and change log | `models/approved-stories.md`, `lab-report.md` |
| GitHub Copilot | GPT-6 Luna | Critiqued the revised diagrams in a separate chat; the student reviewed each suggestion and recorded verdicts | `lab-report.md`, `models/use-case.puml`, `models/class.puml`, `models/sequence.puml` |
| GitHub Copilot | GPT-6 Luna | Drafted this disclosure and the declaration template content | `AI_USAGE.md`, `submission.yml` |

**Workflow disclosure:** The student reports sending the three required diagram prompts to Copilot and copying the resulting PlantUML into `models/original/`. Earlier working drafts were removed from those files, leaving one captured PlantUML response per file. The student also provided the response from a separate-chat critique; Copilot helped assess its claims and update the revisions/report. Verify that Tasks 1–3 were sent in the same chat and that each captured block is the complete first response.

**Renderer:** PlantUML web server; revised source files were rendered to PNG images in `models/img/`.

**The files in `models/original/` are the AI's first replies, unedited:** The student reports that they are the prompt responses. The prior working-draft blocks were removed; do not edit the retained response blocks.

**The revised diagrams in `models/` were corrected by me, and I can explain every element:** Copilot helped revise the diagrams. The student must review and confirm understanding of every element before submission.

**Did an AI write any part of `lab-report.md` other than the critique it produced?** Yes — Copilot drafted the model reviews, consistency table, change log, and other worksheet text. The student must verify and edit them to match their own analysis and actual workflow. The separate-chat critique was also AI-generated and is disclosed above.

**Anything I accepted from the AI without fully understanding it:** The student must identify any such element after reviewing the diagrams; none should be claimed without that review.

Signed: Koibagar Orazbay
Date: 2026-09-30
