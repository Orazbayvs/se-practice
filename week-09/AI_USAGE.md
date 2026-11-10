# AI Usage Disclosure — Week 09

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Copilot in VS Code | not displayed | Part 2: one fresh chat per request generated the replies; these were saved unedited | `calls/r1.json`, `calls/r2.json`, `calls/r3.txt` |
| Copilot in VS Code | not displayed | Drafted the tool definition, analyzed checker requirements, and drafted the worksheet and declaration | `tool/check_room.json`, `lab-report.md`, `AI_USAGE.md`, `submission.yml` |

**I wrote `tool/check_room.json` myself:** no. AI drafted the definition; it was checked with the provided fixed-call checker, and the final schema passed D1–D6 and S01–S12.

**I used an AI to explain a JSON Schema keyword or a check:** yes. AI explained the purpose of the supported shape and range constraints and why cross-field availability rules cannot be guaranteed by this schema. I verified the actual schema behavior with `tests/check_tool.py`.

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes.

**Anything I accepted from the AI without fully understanding:** The AI drafted the report analysis and permissions rationale as well as the schema. These are not verified by the checker; I need to review and be able to explain them before submission.

Signed: Koibagar Orazbay
Date: 2026-11-10
