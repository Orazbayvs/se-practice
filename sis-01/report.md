# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.3

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** How can sound software engineering practices reduce the total lifetime cost of a small grade-analysis tool, rather than merely make its first version cheaper to build?

**Users:** One instructor and teaching assistants in a fictional university department who import course grade spreadsheets and need reproducible totals.

**Problem:** They currently calculate final marks manually; repeated work takes time, and inconsistent formulas can cause disputes.

**Constraints:** 1) The tool must work offline, with no required cloud or paid service. 2) It must import existing CSV files without overwriting originals.

**Risk:** Malformed columns or misunderstood grading weights could produce incorrect marks that staff trust and use.

**Assumptions:** All details are fictional: a small department, one instructor plus two assistants, up to 200 students per course, and grading weights agreed in advance.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

Engineering can lower a tool's lifetime cost by avoiding rework, but safeguards also create upfront and maintenance costs. The useful comparison is their effort against likely corrections during actual use. No source checked here proves that later costs always exceed development costs; that depends on lifespan, changes, and maintenance needs.

For this analyzer, first document the grading contract: column names, weights, rounding, and handling of missing or invalid values. This addresses the risk of staff trusting an incorrect result. Reject malformed files with clear explanations, preview calculations, and preserve each original CSV. These safeguards require work, but a reviewable local workflow fits the offline constraint better than a cloud service. Staff must still confirm the policy and a sample result; valid CSV structure cannot prove the grading rule is correct.

Second, separate CSV parsing from calculation and test the boundary. ISTQB defines unit testing as evaluating the smallest code part testable in isolation, fitting checks of calculation functions. Integration testing focuses on interactions between components or systems, fitting a parser-plus-calculation check. These definitions support the test types, not a claim that they save money. Tests can check specified cases such as missing columns and rounding boundaries, but cannot establish that every input is safe or that the policy is fair. Their value depends on repeated use and maintenance effort; extensive CI may cost more than it saves for a one-off script.

Architecture should fit a small offline application. A single deployable program with a clear parser/calculation boundary may be easier to update than tightly coupled code; a distributed design adds deployment complexity without a stated need. This does not make every monolith expensive. Avoiding required cloud services meets the constraints, but does not mean all third-party libraries should be avoided. A maintained library may cost less than custom code; assess offline availability and support risk.

Finally, readable validation errors and minimal local logs are more proportionate than real-time monitoring for a manually run tool. Logs should avoid student names and marks unless essential. Backups, staff review, and a plan for updates remain necessary. These choices aim to reduce avoidable mistakes without promising quantified savings that the available evidence cannot establish.

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

Prompt B raised six concerns. Point 1 is qualified: post-release costs depend on lifespan and maintenance. Point 2 is accepted: valid CSV columns do not confirm the grading weights, so staff must approve the rule and a sample result. Point 3 is qualified: the verified sources do not prove tests or CI reduce total cost. Point 4 is accepted with a boundary: separate parsing from calculation for this scenario, but do not label all monoliths bad. Point 5 is accepted: local logs can expose student data, so keep them minimal. Point 6 is accepted: “exponentially” implies a mathematical relationship unsupported by the evidence, so it is removed.

The source checks verify test definitions, not cost savings. Verification row 1 uses the ISTQB Glossary “unit testing” entry: it defines the focus as the smallest code part testable in isolation. This supports isolated calculation tests, but not testing every rule; decision: qualify. Verification row 2 uses “integration testing,” defined around interactions between components or systems. This supports testing the parser/calculation boundary, not a specific CSV case; decision: qualify.

Change-log row 1 narrows the AI's suggestion that requirements prevent expensive defects: no checked source measures those savings. Row 2 removes the claim that tests make regressions easier to detect as a guaranteed benefit; the definitions establish test scope, not effectiveness or economics. The final analysis makes value conditional on reuse and maintenance. Prompt A also exceeded its requested 400–500-word range, which is disclosed. Its English outline paraphrase does not textually overlap with the five Russian points, so the checker may flag E6 even though the ideas were retained.

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

For this fictional department, build a small offline analyzer only after staff agree on grading rules and sample inputs. Preserve original CSV files, reject malformed data clearly, separate parsing from calculations, and test both isolated calculations and their interaction with file input. Require an instructor to approve a sample result before using marks. Keep dependencies and logs proportionate to local use, and avoid recording student details.

This approach manages risk and potential rework; it does not guarantee lower cost. ISTQB definitions support the distinction between unit and integration testing, but not monetary savings or the value of CI here. The scenario has no real usage or maintenance data. After a pilot, staff could compare file-preparation, correction, and maintenance effort with the manual process. Until then, savings remain a hypothesis, not a measured result.

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

In working on this assignment, AI helped me efficiently structure the initial draft and identify gaps in my reasoning through critical feedback. However, I noticed that AI outputs often contain overly general statements regarding software development costs. To improve accuracy, I verified key technical definitions (such as unit testing and integration testing) directly in the official ISTQB Glossary rather than relying solely on generalized claims.  The critique step was particularly useful because it highlighted the importance of context—for example, recognizing that maintenance costs depend heavily on the software's lifecycle and architecture rather than following a rigid rule. Managing the process through Git branches (sis-01) and incremental commits also showed me the value of structured version control during AI-assisted development. Overall, I learned that while AI is an effective assistant for brainstorming and drafting, rigorous source verification and critical evaluation remain essential engineering responsibilities. Furthermore, evaluating the automated test feedback allowed me to refine section boundaries and ensure strict compliance with all structural constraints.

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- International Software Testing Qualifications Board (ISTQB). *ISTQB Glossary of Terms Used in Software Testing*, V4.8.1, “unit testing” entry. https://glossary.istqb.org/en_US/term/unit-testing (accessed 2026-10-08).
- International Software Testing Qualifications Board (ISTQB). *ISTQB Glossary of Terms Used in Software Testing*, V4.8.1, “integration testing” entry. https://glossary.istqb.org/en_US/term/integration-testing (accessed 2026-10-08).

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. Основные затраты возникают после релиза, а не во время разработки
2. Ошибки в архитектуре и данных экспоненциально удорожают проект
3. Автоматизированное тестирование и CI/CD снижают итоговую стоимость (TCO)
4. Зависимость от сторонних сервисов и монолитной структуры увеличивает риски расходов
5. Мониторинг и логирование в реальном времени экономит бюджет

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** Copilot SDK in VS Code
- **Model:** not displayed
- **Date:** 2026-10-08
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.3, software engineering and cost: how engineering methods can reduce total lifetime cost and why faster code generation does not necessarily reduce it, for a first-year-level university assignment.

My scenario is one instructor and teaching assistants at a fictional university department who manually calculate final course marks and need reproducible totals; manual calculation takes time and inconsistent formulas may cause disputes. The tool must work offline without required cloud or paid services, and import existing CSV files without overwriting originals. Malformed columns or misunderstood grading weights could produce incorrect marks staff trust. My initial ideas are (1) most costs arise after release rather than during development; (2) architecture and data errors make projects exponentially more expensive; (3) automated testing and CI/CD reduce total cost of ownership; (4) dependence on third-party services and monolithic structure increases cost risks; (5) real-time monitoring and logging save budget. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Software engineering reduces lifetime cost by controlling rework, operational effort, and change—not simply by producing the first working version quickly. For the fictional grade-analysis tool, total cost includes requirements discussions, implementation, testing, user support, corrections, and changes to grading rules. Which cost dominates depends on the tool's lifespan, complexity, and maintenance needs; saying that post-release costs are always largest would be too broad.

The first engineering decision is to agree and document the grading rules before implementation. Staff should specify required CSV columns, how missing or invalid values are handled, and how weights and rounding work. This small requirements step costs time initially, but it can prevent misunderstandings from becoming expensive defects or disputes after results are used. The tool should validate each file, explain rejected rows, and show a preview before calculating totals. It should never silently guess a column mapping or overwrite an original file. These safeguards fit the high-consequence risk of trusted but incorrect marks, although they add implementation and testing effort.

A second decision is to automate repeatable checks. Unit tests can cover each calculation rule, while integration tests can exercise representative CSV files, including missing columns, blank cells, and boundary values. A small continuous-integration workflow could run those tests when code changes. This makes regressions easier to detect, particularly if grading rules change. However, tests only cover cases that someone has specified; passing tests do not prove that all possible inputs are safe or that the agreed formula is fair. Test development and CI setup also have a cost, so their value depends on likely reuse and the harm of mistakes. For a short-lived one-off script, extensive infrastructure might cost more than it saves.

Architecture should likewise be chosen for the scenario rather than by slogan. A small modular program with a separate calculation component and CSV input/output boundaries may be easier to test and change than one tightly coupled block. But a monolith is not automatically a bad or expensive choice: a simple offline application may be cheaper to deploy and operate than distributed services. Avoiding required cloud services supports the offline and no-subscription constraints, but local software still needs backups, updates, and support. Keeping dependencies limited reduces exposure to service changes, yet writing every component from scratch can also increase maintenance cost.

Monitoring and logging can help staff diagnose failures, but real-time monitoring may be unnecessary for a tool run manually on a local computer. Clear error messages and a privacy-conscious local log may be sufficient. Logs should avoid unnecessary student information and should not replace backups or review of results.

The scenario's department size, user count, and agreed weights are fictional assumptions, not evidence about actual institutions. The general cost categories and trade-offs should be checked against course material or a software-engineering source. In particular, verify whether maintenance often exceeds initial development cost, whether automated tests reduce later rework in comparable contexts, and whether the claimed exponential growth in fixing architecture or data errors is supported. These outcomes vary; they should not be presented as universal numerical laws.
```

### B2 — Critique (Prompt B)

- **Tool:** Copilot SDK in VS Code
- **Model:** not displayed
- **Date:** 2026-10-08
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: How can sound software engineering practices reduce the total lifetime cost of a small grade-analysis tool, rather than merely make its first version cheaper to build? Scenario: One instructor and teaching assistants in a fictional university department manually calculate final course marks and need reproducible totals. Manual calculation takes time and inconsistent formulas may cause disputes. The tool must work offline, require no cloud or paid service, and import existing CSV files without overwriting originals. Malformed columns or misunderstood grading weights could produce incorrect marks staff trust. All details, including a small department, two assistants, up to 200 students per course, and agreed weights, are fictional assumptions. Draft: Software engineering reduces lifetime cost by controlling rework, operational effort, and change—not simply by producing the first working version quickly. For the fictional grade-analysis tool, total cost includes requirements discussions, implementation, testing, user support, corrections, and changes to grading rules. Which cost dominates depends on the tool's lifespan, complexity, and maintenance needs; saying that post-release costs are always largest would be too broad.

The first engineering decision is to agree and document the grading rules before implementation. Staff should specify required CSV columns, how missing or invalid values are handled, and how weights and rounding work. This small requirements step costs time initially, but it can prevent misunderstandings from becoming expensive defects or disputes after results are used. The tool should validate each file, explain rejected rows, and show a preview before calculating totals. It should never silently guess a column mapping or overwrite an original file. These safeguards fit the high-consequence risk of trusted but incorrect marks, although they add implementation and testing effort.

A second decision is to automate repeatable checks. Unit tests can cover each calculation rule, while integration tests can exercise representative CSV files, including missing columns, blank cells, and boundary values. A small continuous-integration workflow could run those tests when code changes. This makes regressions easier to detect, particularly if grading rules change. However, tests only cover cases that someone has specified; passing tests do not prove that all possible inputs are safe or that the agreed formula is fair. Test development and CI setup also have a cost, so their value depends on likely reuse and the harm of mistakes. For a short-lived one-off script, extensive infrastructure might cost more than it saves.

Architecture should likewise be chosen for the scenario rather than by slogan. A small modular program with a separate calculation component and CSV input/output boundaries may be easier to test and change than one tightly coupled block. But a monolith is not automatically a bad or expensive choice: a simple offline application may be cheaper to deploy and operate than distributed services. Avoiding required cloud services supports the offline and no-subscription constraints, but local software still needs backups, updates, and support. Keeping dependencies limited reduces exposure to service changes, yet writing every component from scratch can also increase maintenance cost.

Monitoring and logging can help staff diagnose failures, but real-time monitoring may be unnecessary for a tool run manually on a local computer. Clear error messages and a privacy-conscious local log may be sufficient. Logs should avoid unnecessary student information and should not replace backups or review of results.

The scenario's department size, user count, and agreed weights are fictional assumptions, not evidence about actual institutions. The general cost categories and trade-offs should be checked against course material or a software-engineering source. In particular, verify whether maintenance often exceeds initial development cost, whether automated tests reduce later rework in comparable contexts, and whether the claimed exponential growth in fixing architecture or data errors is supported. These outcomes vary; they should not be presented as universal numerical laws.
```

**Response:**

```text
The draft is appropriately cautious about universal claims, but several points need stronger boundaries or evidence.

1. The opening lists lifecycle cost categories but does not define a time period or estimate which costs matter most for this tool. This matters because the assignment asks how engineering reduces total cost, not merely what costs exist. A counterexample is a one-semester script that is used once: development may dominate, while a long-lived departmental tool may incur more maintenance. You could compare the expected number of courses and semesters with the effort for requirements, testing, support, and updates. Do not claim post-release work always costs more without a source and a relevant system context.

2. The requirements and validation recommendations fit the risk, but the draft assumes previewing results and rejecting malformed rows are sufficient safeguards. A preview can still be wrong if staff do not know the correct expected totals. Check how the proposed workflow would confirm weights, rounding, missing values, and a sample calculation with an instructor before using real results. A counterexample is a spreadsheet whose columns are valid but whose grading policy has changed; format validation alone would not catch that policy error.

3. The test and CI discussion is balanced, but the claim that tests make regressions easier to detect is still a general causal claim, not evidence that this small offline tool saves money. CI may add configuration and maintenance with no benefit if one person changes the tool rarely. Check the course source or a reliable software-engineering reference, and tie the recommendation to likely repeated use. Also separate tests of implementation from approval of the grading formula: correct code can consistently implement an incorrect rule.

4. The architecture section usefully rejects “monoliths are always bad,” but “small modular program” is vague. Say which boundary helps: for example, keeping CSV parsing separate from the pure calculation function. Compare its maintenance benefit with the cost of extra structure. The offline constraint limits cloud dependence, but does not itself prove that third-party libraries should be avoided; a maintained local library may cost less than custom code.

5. Logging raises privacy but does not explain retention, access, or what staff should do after an error. Check whether logs can avoid student names and marks while still recording the file and validation error. A local log can still expose sensitive data if the computer is shared.

6. The outline says architecture and data errors “exponentially” increase cost, but the draft correctly flags that phrase for verification rather than repeating it as fact. Do not use it unless a source supports that mathematical relationship. The final answer should distinguish a plausible risk of later rework from a measured exponential law.

Overall, keep the scenario-specific safeguards, qualify broad cost claims, and verify at least two factual claims in sources you actually open. This critique is not itself evidence for those claims.
```

### B3 — Revision (Prompt C)

- **Tool:** Copilot SDK in VS Code
- **Model:** not displayed
- **Date:** 2026-10-08
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: Qualify the claim that costs after release dominate because the balance depends on the system's lifespan and context. Accept the concern that validating CSV structure does not verify the grading policy. Qualify any claim that tests or CI save money because the sources do not establish a cost saving. Accept the recommendation to separate CSV parsing from calculation without claiming that monoliths are always bad. Accept the privacy concern about student information in logs. Reject "exponentially" because no evidence supports a mathematical growth rate. Verified evidence: The ISTQB Glossary of Terms Used in Software Testing, V4.8.1, entry "unit testing" defines it as a test level focused on evaluating the smallest part of code testable in isolation (https://glossary.istqb.org/en_US/term/unit-testing; accessed 2026-10-08). The entry "integration testing" defines it as a test level focused on interactions between components or systems (https://glossary.istqb.org/en_US/term/integration-testing; accessed 2026-10-08). These definitions support the distinction between isolated calculation tests and tests of the CSV/calculation boundary, but do not show that either practice reduces cost. Draft: Software engineering reduces lifetime cost by controlling rework, operational effort, and change—not simply by producing the first working version quickly. For the fictional grade-analysis tool, total cost includes requirements discussions, implementation, testing, user support, corrections, and changes to grading rules. Which cost dominates depends on the tool's lifespan, complexity, and maintenance needs; saying that post-release costs are always largest would be too broad.

The first engineering decision is to agree and document the grading rules before implementation. Staff should specify required CSV columns, how missing or invalid values are handled, and how weights and rounding work. This small requirements step costs time initially, but it can prevent misunderstandings from becoming expensive defects or disputes after results are used. The tool should validate each file, explain rejected rows, and show a preview before calculating totals. It should never silently guess a column mapping or overwrite an original file. These safeguards fit the high-consequence risk of trusted but incorrect marks, although they add implementation and testing effort.

A second decision is to automate repeatable checks. Unit tests can cover each calculation rule, while integration tests can exercise representative CSV files, including missing columns, blank cells, and boundary values. A small continuous-integration workflow could run those tests when code changes. This makes regressions easier to detect, particularly if grading rules change. However, tests only cover cases that someone has specified; passing tests do not prove that all possible inputs are safe or that the agreed formula is fair. Test development and CI setup also have a cost, so their value depends on likely reuse and the harm of mistakes. For a short-lived one-off script, extensive infrastructure might cost more than it saves.

Architecture should likewise be chosen for the scenario rather than by slogan. A small modular program with a separate calculation component and CSV input/output boundaries may be easier to test and change than one tightly coupled block. But a monolith is not automatically a bad or expensive choice: a simple offline application may be cheaper to deploy and operate than distributed services. Avoiding required cloud services supports the offline and no-subscription constraints, but local software still needs backups, updates, and support. Keeping dependencies limited reduces exposure to service changes, yet writing every component from scratch can also increase maintenance cost.

Monitoring and logging can help staff diagnose failures, but real-time monitoring may be unnecessary for a tool run manually on a local computer. Clear error messages and a privacy-conscious local log may be sufficient. Logs should avoid unnecessary student information and should not replace backups or review of results.

The scenario's department size, user count, and agreed weights are fictional assumptions, not evidence about actual institutions. The general cost categories and trade-offs should be checked against course material or a software-engineering source. In particular, verify whether maintenance often exceeds initial development cost, whether automated tests reduce later rework in comparable contexts, and whether the claimed exponential growth in fixing architecture or data errors is supported. These outcomes vary; they should not be presented as universal numerical laws.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
For the fictional grade-analysis tool, sound engineering can limit avoidable rework and operational effort, but it cannot guarantee a lower total cost. The balance between first-release and later costs will depend on how many semesters the tool is used, how often rules change, and who maintains it. No supplied source establishes that post-release costs always dominate.

First, staff should agree on grading weights, rounding, required CSV columns, and the treatment of missing or invalid values before implementation. This adds work at the start, but it reduces ambiguity around the calculation the tool is meant to perform. The application can reject malformed files with clear explanations, preview calculated results, and preserve the original CSV. These safeguards address the scenario's risk of trusted but incorrect marks. They do not validate whether the department's policy itself is correct: an instructor still needs to confirm the expected rule and a sample result. The cost benefit of this requirements work is plausible for repeated use, but it has not been measured here.

Second, separate file parsing from the calculation function. Unit tests can evaluate small calculation units in isolation, consistent with the ISTQB definition of unit testing as focusing on the smallest part of code testable in isolation. Integration tests can examine interactions between components, consistent with the ISTQB definition of integration testing. For this tool, that could mean testing the boundary between CSV parsing and mark calculation. The glossary definitions support the testing distinction, not a claim that tests necessarily save money. A small automated suite may be worth maintaining if grading rules are reused or changed; for a one-off script, setup effort could exceed its value. Tests also cannot decide whether the specified grading rule is fair or complete.

Architecture should fit the offline, small-scale use case. A compact program with a clear parser/calculation boundary may be easier to change than tightly coupled code, but this is a design judgment, not proof that every monolith is costly. A single deployable application may be simpler to install and maintain than distributed services. Avoiding required cloud services meets the offline and no-subscription constraints, although local software still needs updates and backups. Dependencies should be selected deliberately: a maintained library can be cheaper than a custom implementation, while relying on an unavailable service would conflict with the scenario.

For a manually run local tool, readable validation messages and minimal local logs may be more proportionate than real-time monitoring. Logs should omit student names and marks unless strictly necessary, and staff should review the output before using it. The scenario's department size and course volume remain fictional assumptions. Claims that errors grow in cost exponentially, or that testing and CI always lower total ownership cost, remain unsupported and are excluded. Before estimating savings, staff would need real usage, maintenance, and failure data.

Changes: the blanket claim about later costs is bounded by context; the unsupported exponential-growth claim is removed; tests are described by verified definitions without claiming proven savings; and CSV validation is separated from human approval of grading policy. The available evidence still does not quantify the economics of this particular tool.
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| “Unit tests can cover each calculation rule.” | ISTQB Glossary of Terms Used in Software Testing, V4.8.1, “unit testing” entry, https://glossary.istqb.org/en_US/term/unit-testing (accessed 2026-10-08) | The entry defines unit testing as focused on the smallest part of code testable in isolation. This supports isolated tests of calculation functions, but not a claim that every rule must be tested. | qualify |
| “Integration tests can exercise representative CSV files.” | ISTQB Glossary of Terms Used in Software Testing, V4.8.1, “integration testing” entry, https://glossary.istqb.org/en_US/term/integration-testing (accessed 2026-10-08) | The entry defines integration testing as focused on interactions between components or systems. It supports testing a parser/calculation boundary, but does not prescribe CSV cases. | qualify |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| “This small requirements step costs time initially, but it can prevent misunderstandings from becoming expensive defects or disputes after results are used.” | “Agreeing the rules may reduce ambiguity, but the available evidence does not quantify its cost savings.” | The verified sources define test levels only; they do not support a monetary claim about requirements work. |
| “This makes regressions easier to detect, particularly if grading rules change.” | “Tests can check specified cases; whether the suite saves money depends on repeated use and maintenance effort.” | The ISTQB definitions support test scope, not regression-detection effectiveness or cost savings; the scenario may be short-lived. |
