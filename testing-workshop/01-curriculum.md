# 01 · Curriculum

## Schedule overview

| Day | Module | Core (existing v1) | Added in v2 (TMMi + Governance) |
|---|---|---|---|
| 1 | M1 Fundamentals | CTFL Ch.1: why test, principles, test process, roles | Test organisation (TMMi **3.1**): test functions, roles, career paths |
| 2 | M2 Testing in the SDLC | CTFL Ch.2: SDLC models, levels, types, maintenance | Test lifecycle integration (TMMi **3.3**), **Quality Gates** introduced |
| 3 | M3 Agile | Scrum/Kanban, user stories, DoR/DoD, whole-team, agile testing quadrants | Gates mapped to DoR/DoD; **Change Management** in Agile (backlog vs CR) |
| 4 | M4 Static testing | CTFL Ch.3: reviews, static analysis | Review as gate evidence (G1); traceability from requirements (TMMi 2.4 SP1.4) |
| 5–6 | M5 Test analysis & design | CTFL Ch.4: black-box, white-box, experience-based, ATDD/BDD | TMMi **2.4 SG1/SG2**: prioritised conditions and cases, test data, intake test, execution schedule |
| 7 | M6 Test management I: planning & risk | CTFL Ch.5.1–5.2: planning, estimation, entry/exit, risk-based testing | **Risk Management**, Master Test Plan (TMMi **3.3 SG3**) |
| 8 | M7 Test management II: monitoring & control | CTFL Ch.5.3–5.5: monitoring, reporting, config mgmt, defect mgmt | TMMi **2.3** in full, **KPIs**, **Breaches**, **CAPA** |
| 9 | M8 Tools | CTFL Ch.6 | Jira / Azure DevOps lab: build the governance setup ([04](04-tooling-labs.md)) |
| 10 | M9 Execution & incidents | Hands-on execution in tool | TMMi **2.4 SG3/SG4**: intake test, test log, incident CCB, CAPA trigger |
| 11–14 | M10 Capstone | Internal project (2 mini-sprints) | Run gates, risk register, KPI dashboard, handle injected CR / breach / escape ([05](05-capstone-and-assessment.md)) |
| 15 | M11 Assessment | CTFL mock exam + review | Capstone defence: evidence pack mapped to TMMi |

**12-day compressed variant:** merge Days 5–6 into one day (move the white-box drills to self-study). Merge Day 9 into Day 10. Shorten the capstone to 3 days.

---

## Module detail

### M1 · Fundamentals + Test Organisation (Day 1)

**Existing:** CTFL 1.1–1.5.

**Added: TMMi 3.1 Test Organisation**
- Why an independent test function matters. Levels of independence (CTFL 1.5.3) linked to the TMMi 3.1 test organisation.
- Test functions and job descriptions: Test Analyst, Technical Test Analyst, Test Lead, Test Manager, Quality Gatekeeper, Automation Engineer.
- Test career paths. Each trainee drafts a **personal development plan** (TMMi 3.1 SP3.2).
- Test process improvement cycle: assess → identify → plan → implement → deploy → lessons learned (3.1 SG4/SG5). This is the hook for CAPA later.

**Learning objectives:** a trainee can
- explain the organisation's test roles and their RACI
- place themselves on a career path
- describe how process improvements and lessons learned flow back into the standard process

**Exercise:** build the RACI for a release (who owns each gate decision, who raises CRs, who owns CAPA).

### M2 · Testing in the SDLC + Lifecycle Integration + Quality Gates (Day 2)

**Existing:** CTFL 2.1–2.3.

**Added: TMMi 3.3 Test Lifecycle and Integration**
- Standard test process, and tailoring criteria for small, large and regulated projects (3.3 SP1.1, SP1.3).
- An integrated lifecycle model, where test activities are pinned to development phases and sprints (3.3 SG2).
- Organisational test process asset library: templates, checklists, past metrics (3.3 SP1.4, SP1.5).

**Added: Quality Gates (introduction).** See [03 § Quality Gates](03-governance-track.md#1-quality-gates).
- Gate model G0–G6 overlaid on both a V-model and a Scrum release.
- Entry criteria, exit criteria and gate criteria compared. Decision outcomes: Go, Conditional Go, No-Go.

**Exercise:** given a project description, the team selects a lifecycle, tailors the standard process and places the gates on the timeline.

### M3 · Agile + Change Management (Day 3)

**Existing:** Agile Manifesto, Scrum events and roles, user stories and INVEST, DoR/DoD, testing quadrants, test pyramid, CI/CD basics.

**Added**
- **Gates in Agile:** the DoR acts as a story-level entry gate and the DoD as a story-level exit gate. The release-level gates G4–G6 remain.
- **Change Management in Agile:** a change inside the sprint goal goes through backlog refinement. A change to committed scope, a release or a baseline needs a **Change Request (CR)**. See [03 § Change Management](03-governance-track.md#2-change-management).

**Exercise:** classify 10 change scenarios as backlog item, CR, or defect.

### M4 · Static Testing + Traceability (Day 4)

**Existing:** CTFL 3.1–3.2.

**Added**
- A review record is **mandatory evidence for G1** (Requirements Baseline).
- Horizontal traceability: requirement → test condition → test case → defect (TMMi 2.4 SP1.4). This is also the basis for change impact analysis.

**Exercise:** review a requirements document. Log the findings and build a traceability matrix in the tool.

### M5 · Test Analysis & Design (Days 5–6)

**Existing:** CTFL 4.1–4.5, covering EP, BVA, decision tables, state transition, statement and branch coverage, error guessing, exploratory testing, checklists, ATDD/BDD.

**Added: TMMi 2.4 SG1 & SG2**
- Identify and **prioritise** test conditions and cases by product risk (SP1.1, SP1.2).
- Identify and create specific test data (SP1.3, SP2.2).
- Develop test procedures and prioritise them (SP2.1).
- Specify the **intake test** (smoke test) that decides whether a build is accepted for testing (SP2.3). This is the G3 Build Acceptance gate.
- Develop the test execution schedule (SP2.4).

**Exercise:** design tests for the capstone application. Tag each case with risk priority and requirement ID, then write the intake test suite.

### M6 · Test Planning + Risk Management + Master Test Plan (Day 7)

**Existing:** CTFL 5.1–5.2.

**Added**
- **Risk Management** in full: see [03 § Risk Management](03-governance-track.md#3-risk-management).
- **Master Test Plan** (TMMi 3.3 SG3): product risk assessment, test approach per level, estimates, organisation, commitment.
- Exit criteria are written so they are **measurable**, because KPIs and gates depend on them.

**Exercise:** run a product risk workshop for the capstone. Write the risk register and an MTP lite (template set).

### M7 · Monitoring & Control + KPIs + Breaches + CAPA (Day 8)

**Existing:** CTFL 5.3–5.5.

**Added: TMMi 2.3 Test Monitoring and Control, covered end to end**
- SG1: monitor progress against the plan, including effort, schedule, environment, commitments, risks and stakeholders. Covers progress reviews and milestone reviews.
- SG2: monitor product quality, including entry and exit criteria, defects, risks, and suspension and resumption criteria. Covers quality reviews.
- SG3: manage corrective actions to closure.
- **KPIs:** catalogue, formulas and RAG thresholds. See [03 § KPIs](03-governance-track.md#4-kpis).
- **Breaches:** what a breach is, severity, escalation and timelines. See [03 § Breaches](03-governance-track.md#5-breaches).
- **CAPA:** correction compared with corrective and preventive action, RCA (5 Whys, fishbone) and effectiveness checks. See [03 § CAPA](03-governance-track.md#6-capa).

**Exercise:** you receive a week of fake project data. Compute the KPIs, identify two breaches and write one CAPA with RCA.

### M8 · Tool Support + Governance Configuration (Day 9)

**Existing:** CTFL Ch.6, then Jira or Azure DevOps navigation and test management.

**Added:** each trainee configures the governance setup in their tool. See [04-tooling-labs.md](04-tooling-labs.md).

### M9 · Execution & Incident Management (Day 10)

**Existing:** hands-on execution, defect reporting and the defect lifecycle.

**Added: TMMi 2.4 SG3 & SG4**
- Run the intake test and record the G3 decision (SP3.1).
- Execute tests and keep a **test log** (SP3.2, SP3.4).
- Run an incident triage or **CCB** meeting to decide the disposition of each incident (SP4.1), then track it to closure (SP4.2, SP4.3).
- Know when an incident becomes a CAPA trigger: production escapes, repeated reopens, and Critical defects that reach a later stage.

### M10 · Capstone: Internal Project (Days 11–14)

See [05-capstone-and-assessment.md](05-capstone-and-assessment.md).

### M11 · Assessment (Day 15)

- CTFL mock exam (40 questions, 60 minutes, pass mark 65%).
- Capstone defence: the team presents its evidence pack and the gate decisions it made.
