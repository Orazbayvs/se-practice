# AI Usage Disclosure — SIS #03

AI was used in this assignment and is disclosed below. This draft is not signed on behalf of the student; review and confirmation are still required.

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| Copilot SDK in VS Code | GPT-6 Luna (recorded in the Week 05 report) | Plan, Python v1, critique and Python tests | `code/original/booking_v1.py`, `code/booking.py`, `code/test_booking.py` | week-05 |
| Bolt.new | Model not displayed in the Week 06 report | Generated the room-availability page and subsequent fixes | `web/original/`, prior final project in `web/final/` | week-06 |
| Copilot SDK in VS Code | Current session model not displayed | Reviewed repository state, copied prior-practice source files, added the local T10 scenario preset, ran browser/build/lint/type checks, and drafted report/disclosure content | SIS 03 files, including `web/final/project/src/App.tsx`, `report.md` and this file | this SIS |

The original exact Python Plan/Generate/Critique prompts were not retained in the saved Week 05 report or source files. The answers and generated v1 are preserved where available; missing prompts are explicitly identified in `report.md` rather than reconstructed.

**The assistant wrote, or helped write, my tests in `code/`:** yes. The Week 05 test suite was reused. Its expected values are based on the stated rules and boundary cases; the SIS checker also ran the suite against the function and its own faulty variants.

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes, they were copied from the Week 05 and Week 06 originals; the Python v1 and Week 06 screenshot hashes were checked against their source branches.

**Every result in report.md section 5 was actually run or seen, not assumed:** yes, subject to the stated evidence sources: Python T1–T11 were run by the SIS checker; the browser results are from the saved Week 06 report or the browser run in this session. UI cases that could not be configured are marked `Not testable`.

**Everything I submitted, I can explain and defend in class — including the overlap condition and what the agent did in section 9:** student confirmation required; this statement is not signed or certified by the assistant.

**Anything I accepted from the AI without fully understanding it:**

The student should confirm whether every implementation detail in `code/booking.py` and `web/final/project/src/lib/availability.ts` is understood before submission.

Unsigned — the student must review and sign this disclosure.
