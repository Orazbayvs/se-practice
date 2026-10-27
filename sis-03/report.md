# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Copilot SDK in VS Code (recorded in Week 05; this SIS session's model is not displayed) |
| Coding assistant model | GPT-6 Luna (Week 05 report; current SIS session model not displayed) |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/~/sb1-byt5w3qv (login required); published preview: https://smart-campus-room-av-iqh7.bolt.host/ |
| Language | Python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** Данный программный модуль и веб-интерфейс реализуют систему проверки доступности комнат в интеллектуальном кампусе (Smart Campus Room Availability Checker), позволяя студентам и сотрудникам в режиме реального времени валидировать выбранные временные интервалы для бронирования конкретного помещения без создания реальных записей в базе данных.

**Process note:** Этот baseline был подготовлен с помощью ИИ и проверен студентом после начала этой SIS-сессии. Он не был написан и закоммичен до обращения к ИИ; это несоответствие порядку задания не скрывается.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Значения начала и окончания бронирования должны выражаться целыми минутами в диапазоне от 0 до 1440 минут (сутки), причем время начала (start) должно быть строго больше текущего момента (now). |
| AC2 | Общая продолжительность одного бронирования не может превышать 120 минут (двух часов), при этом ровно 120 минут разрешено. |
| AC3 | Запрос на бронирование должен отклоняться в любой ситуации, если комната помечена как заблокированная (blocked = True). |
| AC4 | Запрос отклоняется при пересечении с любыми существующими бронированиями. Касание в граничных точках пересечением не считается и разрешено. |
| AC5 | Функция должна возвращать однозначный логический или текстовый статус (Available / Unavailable), категорически запрещая любые мутации массива существующих бронирований. |
| AC6 | Пользователь должен получать понятные сообщения о результатах валидации, а графический интерфейс — корректно адаптироваться под узкие мобильные экраны. |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Граничное касание интервалов может ошибочно считаться пересечением. | AC4 | Запустить T1: запрос 660–720 должен быть Available, так как предыдущее бронирование заканчивается в 660. |
| 2 | Проверка может забыть флаг блокировки комнаты. | AC3 | Запустить T3 с blocked=True; результат должен быть Unavailable. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Планируемая минута начала бронирования, отсчитываемая от начала суток. | Целое число от 0 до 1440; должно быть строго больше `now`. |
| `end` | Планируемая минута окончания бронирования. | Целое число, строго больше `start` и не превышающее 1440. |
| `now` | Текущая минута времени, относительно которой проверяется запрос. | Целое число от 0 до 1439; согласно условию считается корректным. |
| `blocked` | Флаг административной блокировки выбранной комнаты. | Boolean: True или False. |
| `existing` | Уже существующие бронирования в виде пар начала и окончания. | Коллекция пар целых минут `(start_time, end_time)`; не изменяется функцией. |
| returns | Однозначный результат доступности интервала. | Boolean: True только если соблюдены AC1–AC4, иначе False. |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. Все временные параметры `start` и `end` задаются в пределах 0–1440 минут; `now` находится в диапазоне 0–1439 минут.
2. Функция должна обрабатывать `existing` независимо от порядка бронирований; список не обязан быть отсортирован на входе.

**Checked manually:**

- Проверить веб-интерфейс при ширине около 375 px и сообщения при недопустимой длительности и времени за пределами суток; фактические результаты указаны в таблице T1–T12, а непроверяемые сценарии отмечены отдельно.

## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440 and start > now):` | AC1 | Yes | Rejects out-of-day, empty/reversed intervals and starts at or before `now`. |
| `if end - start > 120:` | AC2 | Yes | Rejects durations above 120 minutes while permitting exactly 120. |
| `if blocked:` | AC3 | Yes | Immediately rejects requests when the room is blocked. |
| `if start < existing_end and existing_start < end:` | AC4 | Yes | Strict inequalities detect overlap while allowing intervals that only touch. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.

This is the exact prompt recorded in the Week 06 lab report. It forbids authentication and backend services, but does not explicitly say “login” or “database”; the SIS 03 prompt wording requirement was therefore not fully met by the reused prompt.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| `src/lib/availability.ts` | `src/lib/availability.ts` | Availability validation for AC1–AC4 and non-mutating result generation. |
| `src/App.tsx` | `src/App.tsx` | Room/time inputs, result panel, room information and bookings list. |
| `src/lib/sampleData.ts` | `src/lib/sampleData.ts` | Fictional room and booking fixtures. |

**What v1 does:**

- The user selects a room and enters current, start and end times; the page displays Available/Unavailable feedback and existing bookings. Week 06 testing found the T5 fixture had an extra booking in v1, causing a second overlap reason; the final local copy removes it and suppresses overlap checks for intervals already rejected for duration.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Not testable |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Not testable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

Page results for T1–T7 and the repeated/narrow cases are carried over from the Week 06 lab report. T5 on the published v1 was also re-run in this session: it displayed Unavailable with both a duration warning and an overlap warning. For this SIS, a fictional T10 preset was added to the final page. Selecting it configures Room B-204, request 12:00–13:00 (720–780), and bookings 10:00–11:00 (600–660) and 11:40–12:40 (700–760); the browser run displayed Unavailable due to the second booking. The original v1 has no preset, so its T10 remains Not testable. The native time inputs do not permit 24:00 or 24:01, so T8/T9 cannot be entered. Python values were executed by `tests/check_sis.py`; T11 uses the second function call.

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py`; `web/*/project/src/lib/availability.ts`, input checks in `src/App.tsx` | T6–T9 | Range/order and start-after-now rules | Python v1/final: T6 False, T7 False, T8 True, T9 False; page T6/T7 Unavailable; T8/T9 Not testable | Same recorded outcomes |
| AC2 | `booking.py`; `availability.ts` duration check | T4–T5 | 120 allowed; 121 rejected | T4 True, T5 False; page T4 Available, T5 Unavailable | Same; T5 reports duration reason only |
| AC3 | `booking.py`; selected room `blocked` check in `availability.ts` | T3 | Blocked request unavailable | False / Unavailable | False / Unavailable |
| AC4 | `booking.py` overlap loop; `availability.ts` strict interval comparison; T10 fixture in `src/App.tsx` | T1–T2, T10 | Touching allowed; any overlap rejected | Python T1 True, T2 False, T10 False; page T10 Not testable | T1 Available, T2 Unavailable, T10 Unavailable due to overlap with booking 2 |
| AC5 | Boolean return; page result state and bookings kept separate | T11 | Repeat check yields same result; existing data unchanged | True on second Python call; page Available both times | Same |
| AC6 | UI labels, validation messages and responsive classes in `src/App.tsx`/`src/index.css` | T6–T7, T12 | Understandable feedback and usable narrow layout | Page: T6/T7 Unavailable; T12 Available | Page: T6/T7 Unavailable; T12 Available |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | v1 contains an extra B-204 booking, so T5 also reports an overlap unrelated to the 121-minute limit. | T5 on published Week 06 v1: set 12:00–14:01 at 09:00; expected one duration explanation, observed duration plus “Study Group” overlap. | Medium | Week 06 focused Bolt prompt: remove the extra B-204 fixture and skip overlap reporting when duration already exceeds 120; final `sampleData.ts` removes the booking and `availability.ts` gates overlap checking. | v1 re-run in this session showed both warnings; Week 06 final T5 evidence shows only the duration warning. |
| 2 | v1 included unused `@supabase/supabase-js`, outside the frontend-only AC1–AC6 scope. | AC1–AC6 / scope inspection: Week 06 dependency inspection recorded the package in original `package.json` and no application imports; the final local manifest removes it. | Low | Week 06 focused prompt asked Bolt to confirm no source use, remove only the unused dependency and update the lockfile. | Prior Week 06 report records its checks; in this SIS environment `npm ci`, build, lint and typecheck all passed after the same dependency cleanup. |
| 3 | Before this SIS change, T10 could not be configured on the page because B-204 bookings were fixed. | T10: select the new preset and check 12:00–13:00 against 10:00–11:00 and 11:40–12:40; expect Unavailable due to the second interval. | Medium | SIS 03 focused prompt in B5: add a local T10 booking preset that displays both bookings and applies the case values, without adding persistence or backend services. | Browser run returned Unavailable and identified overlap with “Existing booking 2” (11:40–12:40); fresh screenshot is `evidence/t10-final.png`. |

**Before / after:** Issue #1 (T5's extra overlap warning): `evidence/before-1.png` is an unedited Week 06 capture copied from `week-06/evidence/issue-1.png`; `evidence/after-1.png` is an unedited Week 06 final T5 capture copied from `week-06/evidence/final-T5.png`. Both source images are byte-identical to their Week 06 copies. `evidence/final-narrow.png` is an unedited Week 06 final T9 capture, byte-identical to the prior screenshot; it is reused because the prior final project was copied unchanged. The new SIS T10 state was captured separately as `evidence/t10-final.png`.

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | The Python v1 overlap condition `start < existing_end and existing_start < end` implements half-open intervals. | Existing Week 05 tests and SIS checker cases T1/T2: touching returns True and overlap returns False. | accept | AC4 defines endpoint touching as non-overlap. |
| 2 | The generated v1 has no explicit integer-type guard for `start` and `end`; a float can pass range comparisons. | Week 05 recorded `can_book(600.5, 660, 540, False, [])` returning True; the final suite tests the selected additional assumption that non-integer requests return False. | modify | The contract specifies integer minutes, so this is not an AC violation for valid inputs, but rejecting non-integers is a disclosed defensive policy in the final implementation. |
| 3 | Bolt's T5 v1 result reports an overlap with a second sample booking in addition to the >120-minute violation. | Direct browser re-run of v1 T5 in this session displayed both messages; Week 06 final T5 screenshot shows only the duration message. | accept | AC2 requires rejection above 120 minutes; removing confusing fixture/report noise improves validation feedback without changing the decision. |
| 4 | Week 06 Bolt suggested removing a Vite optimization setting outside the requested dependency-file scope. | Week 06 report says the change was not downloaded or included in the tested local final project. | reject | The cleanup prompt limited changes to `package.json` and `package-lock.json`; unrelated configuration edits were not necessary. |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | Assemble the saved Week 05 Python checker and Week 06 Bolt prototype into the SIS 03 structure, preserve v1, and verify behavior. |
| Model / plan | The Week 05 plan checked AC1–AC4 in order, then tested boundaries, touching intervals and immutability; it was reused from the dated Week 05 lab report. |
| Tool call | Copied the verified source files into the SIS 03 branch, ran the SIS checker and Python unittest suite, and exercised the published Week 06 v1 in a browser. |
| Observation | The 19 Python tests passed. Browser T5 on v1 showed Unavailable with both a 121-minute warning and a Study Group overlap warning. The v1 contains a second B-204 booking. |
| Next step | Preserve the real v1 observation, rely only on recorded final-page cases from the Week 06 report, and leave unperformed cases/screenshots marked as unavailable rather than infer them. |
| Human review | The student must review the implementation and report, supply the missing unedited screenshots and personal reflection, and confirm the teacher's instructions about the baseline order. |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Copilot SDK in VS Code | The Week 05 prompt and function contract; current task also included the SIS template and copied artifacts. | Read/write files and run local Python commands with user approval in the VS Code workspace. | Observed |
| Bolt.new | The room-checker prompt and Bolt project files; Week 06 report records its file reads/edits and build checks. | Browser-based project generation and editing as recorded in the Week 06 lab report. | Observed in the saved Week 06 report |
| Published Bolt preview | Rendered page, selected room, fixed sample bookings and time inputs. | Browser interaction and viewport testing; no local project-file permissions through the preview. | Observed |
| Model/Bolt internals | Internal training data, hidden context and services are not exposed by the UI. | Any claims about internal reasoning or hidden services would be inference, not inspection. | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting copied or generated files, I compared the saved Python v1 and page export with their Week 05 and Week 06 sources, kept v1 separate from final, checked the branch, and ran the Python suite and visible browser cases. I did not treat a claimed build as a local build.

**Reliability, security, responsibility:** AI-generated code can mishandle an endpoint or report distracting validation messages even when the final Boolean is correct. A frontend-only prototype can still expose risks if an assistant adds login, network calls, storage or secrets. Reviewing files and limiting tool permissions reduce those risks; tests provide evidence for specific cases, not a proof of every behavior. The student remains responsible for confirming the criteria, actual outputs, and report claims before submission.

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

Working on the Python function and the Bolt.new web prototype highlighted the difference between strict algorithmic logic and interface layout, where mobile-width testing is critical. The main risks were overlooking boundary conditions at time intervals (AC4) and carrying an unnecessary dependency into a frontend-only prototype. I rejected Bolt's suggestion to change `vite.config.ts` because the prompt was limited to reviewing dependency manifests, so that edit was outside the requested scope. This experience showed that humans must retain control: a reported build result still needs verification in the project environment. My code review and test execution verified touching and overlapping intervals and exposed that the original Python version accepts a float, although the assignment expects integer-minute inputs. In the future, without expanding the task, I would improve the test data setup for case T10 and refine mobile responsiveness at 375 px, while keeping the prototype isolated without databases or authentication.

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** Copilot SDK in VS Code
- **Model:** GPT-6 Luna (as recorded in Week 05)
- **Date:** 2026-10-11
- **Stage:** Plan
- **Source:** week-05; reused from the dated lab report

**Prompt:**

~~~~text
The initiating prompt for this Week 05 exchange was not retained in the saved lab report or files. It is not reconstructed here.
~~~~

**Response:**

~~~~text
### Implementation plan
1. Check AC1: `0 <= start < end <= 1440` and `start > now`; otherwise return `False`.
2. Check AC2: duration `end - start` is at most 120 minutes; otherwise return `False`.
3. Check AC3: return `False` if the room is blocked.
4. Check AC4: return `False` if any existing interval overlaps the requested interval. Treat intervals as `[start, end)`, so touching endpoints are allowed.
5. Return `True` only if all checks pass. Do not modify any inputs.

**Assumptions:** `now` is valid, `blocked` is Boolean, and `existing` contains valid bookings for this room, as stated. Invalid requested times return `False`.

**Boundary cases to test:** start equal to `now` versus `now + 1`; start at `0`; end at `1440`; equal start and end; duration exactly 120 versus 121; existing booking ending exactly at the requested start or starting exactly at the requested end; and overlaps by one minute at either endpoint. Also verify that `existing` remains unchanged.
~~~~

### B2

- **Tool:** Copilot SDK in VS Code
- **Model:** GPT-6 Luna (as recorded in Week 05)
- **Date:** 2026-10-11
- **Stage:** Generate
- **Source:** week-05; v1 copied unchanged

**Prompt:**

~~~~text
The exact generation prompt was not retained in the saved Week 05 report or source files. It is not reconstructed here.
~~~~

**Response:**

~~~~text
def can_book(start, end, now, blocked, existing):
    """Return whether the requested time is valid and available."""
    if not (0 <= start < end <= 1440 and start > now):
        return False

    if end - start > 120:
        return False

    if blocked:
        return False

    for existing_start, existing_end in existing:
        if start < existing_end and existing_start < end:
            return False

    return True
~~~~

### B3

- **Tool:** Copilot SDK in VS Code
- **Model:** GPT-6 Luna (as recorded in Week 05)
- **Date:** 2026-10-11
- **Stage:** Critique
- **Source:** week-05; exact critique retained in lab report

**Prompt:**

~~~~text
The original critique prompt was not retained in the Week 05 report.
~~~~

**Response:**

~~~~text
- **Issue — rejects integer subclasses:** `if type(start) is not int or type(end) is not int:` rejects values of subclasses of `int`, even when they represent valid integer minutes and satisfy all other checks. The contract requires integer times but does not restrict them to exact built-in `int` objects. This concerns the **function contract**.
~~~~

### B4

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-18
- **Stage:** Repair
- **Source:** week-06; exact prompt and answer reused from the lab report

**Prompt:**

~~~~text
In the current prototype, selecting Room B-204, setting current time to 09:00, and checking 12:00–14:01 also reports an overlap with "Study Group" (14:00–15:30), but AC2 requires this 121-minute request to be rejected for exceeding 120 minutes, and the specified T5 setup gives the room only one booking (10:00–11:00). Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
~~~~

**Response:**

~~~~text
Let me read the current sample data and availability logic to identify the exact issue.

0123456789

 files read

There are two problems to fix:

1. **Sample data (T5 setup):** Room B-204 currently has two bookings — "Organic Chem Lab" (10:00–11:00) and "Study Group" (14:00–15:30). The T5 test case requires B-204 to have only one booking (10:00–11:00). The "Study Group" booking is what's causing the false overlap message. I'll remove it.
2. **AC2 reporting logic:** When a request exceeds 120 minutes (AC2 violation), the overlap check (AC4) still runs and can report spurious overlaps alongside the duration violation. The fix is to skip the overlap check when AC2 already rejects the request — a request that's too long should be rejected purely for that reason, not cluttered with overlap messages.

0123456789

 file edits

Now let me verify the build passes.

**
Built to verify changes compile

Open
Build passes. Here's what I changed and why:

**Two files changed:**

1. **`src/lib/sampleData.ts`** — Removed the "Study Group" (14:00–15:30) booking from Room B-204. The T5 test case requires B-204 to have only one existing booking (10:00–11:00, "Organic Chem Lab"). The extra booking was causing a false overlap message when testing the 12:00–14:01 request.
2. **`src/lib/availability.ts`** — Changed the overlap check (AC4) to skip when the request is already rejected for exceeding the 120-minute limit (AC2). Previously, a 121-minute request would trigger both the duration-violation message and any overlap messages. Now, when a request is too long, it's rejected solely for that reason — the overlap check only runs for requests that pass the duration check. All other criteria (AC1, AC3, AC4 for valid-length requests) are preserved.
Now selecting Room B-204, current time 09:00, and checking 12:00–14:01 will report only the duration violation (121 min exceeds 120 min) — no spurious overlap.
~~~~

### B5

- **Tool:** Copilot SDK in VS Code
- **Model:** not displayed
- **Date:** 2026-10-27
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
Исправить проблему с тест-кейсом T10 на странице Bolt.new
Вам нужно сделать так, чтобы страница позволяла протестировать T10 (второе бронирование / пересечение нескольких броней) или отразить это в отчете:

1. Попросите ИИ (в Bolt.new или Copilot) добавить в прототип возможность переключать / добавлять тестовые сценарии бронирований (например, выпадающий список пресетов для кейсов T1–T12, включая T10 со второй бронью).
2. Добейтесь того, чтобы интерфейс корректно обрабатывал кейс T10 и выводил `Unavailable` при наложении двух броней.
3. Сделайте свежий скриншот.
~~~~

**Response:**

~~~~text
Added a “Booking test scenario” selector to `web/final/project/src/App.tsx`. The T10 option switches the fictional booking fixture to 10:00–11:00 and 11:40–12:40 for Room B-204 and sets the request to 12:00–13:00. The existing availability function checks both intervals without changing the booking data; the second booking overlaps the candidate interval. I verified the actual browser result: the page displayed “Unavailable” and “Overlaps with Existing booking 2 (11:40–12:40).” I saved a fresh full-page screenshot at `evidence/t10-final.png`. Build, lint and TypeScript checks passed.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_blocked_room_is_rejected (test_booking.BookingTests) ... ok
test_boolean_start_returns_false_by_declared_assumption (test_booking.BookingTests) ... ok
test_empty_existing_bookings_allow_request (test_booking.BookingTests) ... ok
test_end_after_1440_is_rejected (test_booking.BookingTests) ... ok
test_end_at_1440_is_allowed (test_booking.BookingTests) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests) ... ok
test_existing_is_unchanged_after_rejection (test_booking.BookingTests) ... ok
test_existing_is_unchanged_after_success (test_booking.BookingTests) ... ok
test_integer_subclass_is_accepted (test_booking.BookingTests) ... ok
test_non_integer_start_returns_false_by_declared_assumption (test_booking.BookingTests) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests) ... ok
test_overlap_with_second_of_several_bookings_is_rejected (test_booking.BookingTests) ... ok
test_partial_overlap_is_rejected (test_booking.BookingTests) ... ok
test_request_containing_existing_booking_is_rejected (test_booking.BookingTests) ... ok
test_reversed_interval_is_rejected (test_booking.BookingTests) ... ok
test_starting_now_is_rejected (test_booking.BookingTests) ... ok
test_touching_end_is_allowed (test_booking.BookingTests) ... ok
test_touching_existing_start_is_allowed (test_booking.BookingTests) ... ok
test_zero_length_is_rejected (test_booking.BookingTests) ... ok

----------------------------------------------------------------------
Ran 19 tests in 0.000s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| T10 v1 page configuration | The reused Week 06 v1 has fixed fictional bookings and no control to configure the exact two intervals required by T10; its result remains Not testable. | The final SIS page now has a T10 preset; retain the v1 limitation honestly and use the fresh final screenshot as evidence. |
| X2 | The exact Week 05 prompts and complete responses were not retained. The checker identifies missing/short B2 and B3 evidence; reconstructing those historical exchanges as if verbatim would be misleading. | Retrieve the original chat if available; otherwise keep the missing evidence disclosed. |
| SIS 03 baseline sequence | The baseline was drafted with AI after the current session began, and no SIS 03 baseline commit was made before AI use. | Ask the instructor how to document/continue; do not claim the required ordering was met. |
| Missing historical Python prompts | Week 05 report preserves the Plan response, Generate output and Critique but not their exact initiating prompts. | Retrieve original chats if available; otherwise disclose that the exchanges cannot be fully reproduced. |
| Reused screenshots | The before/after and narrow captures are from Week 06 evidence; they were copied without modification. | Capture a fresh final narrow view if required by the grader; verify the reused evidence remains accepted. |
| Midnight inputs | The native time controls cannot enter 24:00/24:01, so T8/T9 are not testable through the page. | Retain `Not testable` for these page cases; the Python tests cover the boundaries. |
