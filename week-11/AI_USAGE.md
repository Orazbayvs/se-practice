# AI Usage Disclosure — Week 11

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude agent (claude.ai, linked to the Claude desktop app) | Claude Opus 5.5 (`claude-opus-5-5`) | the feature: mock adapter, explain.ts, the button (Task 3) | `app/src/booking.ts`, `app/src/explain.ts`, `app/src/App.tsx` |
| Claude sub-agents, one fresh conversation per prompt, no tools | Claude Haiku 5.5 (`claude-haiku-5-5`) | the three prompts compared (Task 4) | none — a fresh chat per prompt |
| Claude read-only Explore sub-agent | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | read-only agentic review (Task 6) | none — "Do not edit files"; it worked on a read-only copy, md5-checked afterwards |
| Claude agent (same as Task 3) | Claude Opus 5.5 (`claude-opus-5-5`) | the two fixes (Task 7), the tests E1–E9 and V2, the screenshots (headless browser on the built page) | `app/src/App.tsx` (V1), `app/src/explain.ts` and `app/src/explain.test.ts` (V2), `app/src/explain.test.ts` (E1–E9), `evidence/*.png` |

**Every file the assistant changed in Task 3 was reviewed by me before I accepted it (§4.2):** yes
<!-- Name anything you accepted without reading. -->

**No API key, token or provider call is anywhere in `app/src/`:** yes
<!-- checker X4 and X5 pass; there is no fetch at all in src/ -->

**The review in Task 6 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- It had no edit tools, worked on a read-only copy (md5 unchanged), and git status in my repo showed only the pre-existing untracked app/.vite/ cache. -->

**I labelled every finding in §7.3 after verifying it myself:** yes

**I used another assistant as well (to explain an error, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
Claude Opus 5.5 (`claude-opus-5-5`), the same agent that built the feature, also ran the commands
and drafted the text of lab-report.md §1–§8 (the tables, the answer of §4.1, the comparison in §5,
the verification notes in §7.3–§7.4 and the reasons in §8). It also drafted this file and
`submission.yml`. §9 and §10 are mine. The git commits were made from my machine under my name.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
<!-- The Vitest outputs in §2.2, §6.2 and §8.3 were copied from the runs on my computer. In §8.2 only the
lines with ×, ✓ and the totals are kept from the failing run before the V2 fix. The reviewer's
answer in §7.2 and the model answers in §5.2 are pasted as they came. -->

**I can explain how explainAvailability handles a timeout and a contradicting answer, without the
assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
The exact regular expressions used for time-format matching in `explain.ts` (`OTHER_TIME`) and how `useRef` prevents race conditions across React re-renders in `App.tsx`.

Signed: Оразбай Койбагар
Date: 2026-11-26
