# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
The assistant produced code and draft report text in this chat; the submitter is responsible
for reviewing and defending everything before submission.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Copilot in VS Code (current chat) | not displayed | Extracting `canBook`, generating the initial Vitest suite, reviewing and strengthening AC5, and drafting the report | `app/src/booking.ts`, `app/src/App.tsx`, `app/src/lib/availability.ts`, `app/src/lib/sampleData.ts`, `app/src/booking.test.ts`, `suites/first/booking.test.ts`, `lab-report.md`, `submission.yml`, `AI_USAGE.md`, `app/package.json`, `app/package-lock.json`, `.gitignore` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes. The
assistant moved the Week 06 boolean rules to `app/src/booking.ts`; the page calls that function.
The expected decisions were checked against AC1–AC4, the 17-test suite passed, and M1–M3 were
run against the suite.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):**
no.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes.
The AC5 assertion was improved only in the final suite.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. The
first/final runs and each mutant summary were observed in the local terminal.

**I can explain every test in my final suite — its input, its expected result and the AC behind
it — without the assistant:** no, not yet confirmed by the submitter. The suite and explanations
were drafted with Copilot and must be reviewed by the submitter before submission.

**Anything I accepted from the AI without fully understanding it:** the submitter has not yet
confirmed independent understanding of the assistant-authored `app/src/booking.ts`, test files,
and report draft. Review them before signing or submitting.

Signed: pending student confirmation  
Date: 2 November 2026
