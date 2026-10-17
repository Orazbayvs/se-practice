# AI Usage Disclosure — Week 06

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Bolt.new | model not displayed; free plan | initial prototype v1; one focused functional fix prompt (remove extra B-204 booking and suppress overlap message for overlong requests); two cleanup prompts. Bolt reported removing the unused Supabase dependency and later removing `optimizeDeps.exclude` for `lucide-react` from `vite.config.ts`; build and typecheck passed after that config change. | `original/project/` is the unedited v1 export. Bolt's functional fix was applied in the final local copy. The later Bolt export was not downloaded; the Supabase dependency removal already exists in the local final copy, while the out-of-scope Vite config change was rejected and not applied locally. |
| Copilot assistant in VS Code | exact model not displayed | inspected the export, ran browser tests, documented findings, and applied the described Bolt functional fix plus a local hand cleanup of the unused Supabase dependency before Bolt's second cleanup response. | `week-06/lab-report.md`, `week-06/prototype/project/src/lib/sampleData.ts`, `week-06/prototype/project/src/lib/availability.ts`, `week-06/prototype/project/package.json`, `week-06/prototype/project/package-lock.json`, and screenshots in `week-06/evidence/`. |

**I used another assistant as well (to explain code, to draft text in lab-report.md, …):** yes — Copilot assistant in VS Code; exact model not displayed. It helped inspect code, test cases, and draft technical report entries. The student must write their own section 8 explanation and section 10 conclusion.

**`original/` holds Bolt's first version exactly as downloaded, and `evidence/v1.png` shows it:** yes

**Every screenshot in `evidence/` is an unedited capture of the page as it behaved:** yes

**I can explain the component I chose in lab-report.md section 8 — and how the page decides
availability — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
None. The accepted duration check and overlap-check condition are explained in `lab-report.md` section 8.

Signed: Orazbay
Date: 2026-10-18
