# 03 · Quality Governance Track

There are six topics. They form one closed loop, and trainees should learn them as a loop rather than as six separate lists:

```
            ┌───────────── Risk Management ─────────────┐
            │  (decides WHAT to test & how hard)        │
            ▼                                            │
  Quality Gates  ◄──── KPIs (measure) ────► Breaches ────┤
  (decide GO/NO-GO)                     (threshold hit)  │
            ▲                                    │       │
            │                                    ▼       │
   Change Management                           CAPA ─────┘
   (controls what moves the baseline)  (fix cause, update process & risks)
```

Each section below has: **Concept**, **Rules / standard**, **TMMi link**, **Example**, **Exercise**.

---

## 1. Quality Gates

**Concept.** A quality gate is a formal checkpoint where predefined, measurable criteria are checked and an accountable person makes a **decision**. The possible decisions are:

| Decision | Meaning |
|---|---|
| **Go** | All mandatory criteria met |
| **Conditional Go** | Minor gaps accepted, with owner + due date + risk acceptance recorded |
| **No-Go** | Mandatory criteria not met → stay in phase / fix / re-gate |

A gate is not the same thing as exit criteria. Exit criteria belong to one test level or activity (CTFL 5.1.3). A gate aggregates several criteria, including non-test ones such as documentation, ops readiness and open CRs. It also needs an owner who signs.

**Standard gate model (proposal)**

| Gate | Name | Position | Key criteria (examples) | Decision owner |
|---|---|---|---|---|
| G0 | Project Initiation | Kick-off | Scope & objectives defined; test lead assigned; tailoring decided | PM + Test Manager |
| G1 | Requirements Baseline | After analysis | Requirements reviewed (review record); ≥ 95% have acceptance criteria; product risks identified | BA Lead + Test Lead |
| G2 | Test Plan Approved | Before test design ends | MTP/Test Plan approved; estimates agreed; env plan ready; risk register baselined | Test Manager + PM |
| G3 | Build Acceptance (Intake) | Each build to QA | Intake/smoke suite 100% pass; release notes provided; unit test pass ≥ 95% | Test Lead |
| G4 | System Test Exit | End of system test | Planned execution ≥ 98%; pass ≥ 95%; 0 open Critical, ≤ 2 open High with workaround; all High risks covered | Test Manager |
| G5 | UAT / Release Readiness (Go/No-Go) | Before production | UAT signed; test completion report issued; rollback plan; no open CRs in release scope; ops/support ready | Product Owner + Release Manager + Test Manager |
| G6 | Post-Release / Hypercare Exit | 2–4 weeks after release | No P1 incidents in last 7 days; defect leakage within target; lessons learned held | Service Owner + Test Manager |

**In Agile:** DoR is the entry gate for a story and DoD is its exit gate. A sprint review with a stable increment acts as a mini-G4. G5 stays at release level.

**Rules**
1. Criteria must be **measurable**. "Testing done" is not a criterion. "Planned execution ≥ 98%" is.
2. Use **mandatory** and **advisory** criteria. A No-Go happens only on mandatory ones.
3. A Conditional Go always creates tracked actions. If those actions miss their due date, that is a **breach**.
4. Every gate decision is recorded with the date, attendees, criteria status, decision and conditions.

**TMMi link:** 2.3 SP1.7, SP2.1, SP2.4, SP2.7. 3.3 SP1.2, SP2.1, SP2.3. 2.4 SP2.3 and SP3.1 (G3 intake).

**Exercise:** you are given G4 data with execution at 96%, 1 open Critical and 3 open High. Decide, justify the decision, and write any conditions.

Template: [templates/quality-gate-checklist.md](templates/quality-gate-checklist.md)

---

## 2. Change Management

**Concept.** Change management controls modifications to a **baseline**: requirements, scope, design, test basis, environment or release content. The goal is that every change is assessed, approved and traceable, and that testing absorbs its impact.

**Change sources:** a business request, a defect fix that alters behaviour, a regulatory change, an environment or infrastructure change, or a scope change after G1 or G2.

**CR lifecycle**

```
Raised → Impact Analysis → CCB Review → Approved / Rejected / Deferred
       → Implemented → Verified (tests) → Closed
```

**Test impact analysis.** This is the tester's main job in a CR.
- Use traceability (TMMi 2.4 SP1.4) to find the affected requirements, test cases and risks.
- Estimate the new and updated test cases and the **regression scope**.
- Report the effect on schedule and effort, and on gate dates.
- Re-assess the product risks. A change can create or raise a risk.

**Classification**

| Type | Example | Route |
|---|---|---|
| Standard / minor | Label text change, inside sprint goal | Backlog refinement, PO approves |
| Normal | New field + validation after G1 | CR → CCB |
| Major | New interface or scope after G2 | CR → CCB + re-plan + possibly re-gate G2 |
| Emergency | Production hotfix | Expedited CR, retro-CCB within 48h, mandatory regression + CAPA review |

**Rules**
1. No change to a baselined item without an approved CR. A violation is a **process breach**.
2. Every CR must include a **test impact** section before the CCB decides.
3. CRs approved after G4 trigger at least the targeted regression and a G4 re-check.
4. Defects and CRs are separate. A defect means the system does not meet the baseline. A CR means the baseline itself changes.

**TMMi link:** 2.4 SP1.4 and SP4.1 (CCB). 2.3 SP1.1 (re-plan) and SP2.3 (risk change). GP2.6 configuration management.

**Exercise:** classify 10 scenarios (defect, story or CR) and write a test impact analysis for one CR.

Template: [templates/change-request.md](templates/change-request.md)

---

## 3. Risk Management

**Concept.** Risk-based testing (CTFL 5.2) at organisational scale.
- **Product risk:** the quality risk that the product fails. It drives test scope, techniques and depth.
- **Project risk:** a risk to the test project, such as late builds, unavailable environments or missing skills. It drives the plan and its contingencies.

**Process:** Identify → Analyse (Likelihood × Impact) → Plan responses → Monitor → Close

**Scoring (1–5 × 1–5)**

| Score | Level | Test response (product risk) |
|---|---|---|
| 15–25 | High | Formal techniques, both positive and negative cases, early testing, independent review, included in every regression run |
| 8–14 | Medium | Standard techniques, sampled regression |
| 1–7 | Low | Experience-based / exploratory, smoke coverage |

**Responses for project risks:** avoid, mitigate, transfer or accept, each with an owner and a trigger.

**Rules**
1. Product risks are assessed **before** G2. The risk register is a G2 mandatory criterion.
2. Every High product risk must trace to test cases. **Risk coverage** is a KPI.
3. Review the register weekly, at every gate, and after any CR or CAPA.
4. When a risk materialises it becomes an **issue**, which may trigger a breach or a CAPA.

**TMMi link:** 3.3 SP3.1 (product risk assessment) and SP3.2 (approach). 2.3 SP1.4 (project risks) and SP2.3 (product risks). 2.4 SP1.1 and SP1.2 (prioritisation).

**Exercise:** run a product risk workshop on the capstone app, then derive the test approach per risk level.

Template: [templates/risk-register.md](templates/risk-register.md)

---

## 4. KPIs

**Concept.** A KPI is a metric with a **target** and **thresholds**, and someone acts on it. A metric that nobody acts on is only a number.

**KPI catalogue (proposal)**

| # | KPI | Formula | Target (G) | Amber | Red (= breach) | Used at |
|---|---|---|---|---|---|---|
| K1 | Test Execution Progress | executed ÷ planned × 100 | on plan ±5% | −5 to −10% | > 10% behind | weekly, G4 |
| K2 | Test Pass Rate | passed ÷ executed × 100 | ≥ 95% | 90–95% | < 90% | G4 |
| K3 | Requirements Coverage | reqs with ≥1 test ÷ total reqs × 100 | 100% | 95–99% | < 95% | G2, G4 |
| K4 | High-Risk Coverage | High risks with executed tests ÷ High risks × 100 | 100% | — | < 100% | G4, G5 |
| K5 | Defect Detection Percentage (DDP) | defects found pre-release ÷ (pre-release + post-release) × 100 | ≥ 90% | 85–90% | < 85% | G6 |
| K6 | Defect Leakage | post-release defects ÷ total defects × 100 | ≤ 10% | 10–15% | > 15% | G6 |
| K7 | Defect Density | defects ÷ size (story points / KLOC / FP) | baseline from history | +20% | +40% | G4 |
| K8 | Mean Time to Resolve (by severity) | Σ(resolve − open) ÷ count | Critical ≤ 1d, High ≤ 3d | up to 1.5× | > 1.5× | weekly |
| K9 | Defect Reopen Rate | reopened ÷ fixed × 100 | ≤ 5% | 5–10% | > 10% | weekly |
| K10 | Defect Rejection Rate | rejected ÷ reported × 100 | ≤ 10% | 10–20% | > 20% | weekly |
| K11 | Schedule Variance (test) | (actual − planned duration) ÷ planned × 100 | ≤ 5% | 5–10% | > 10% | gates |
| K12 | Effort Variance (test) | (actual − estimated effort) ÷ estimated × 100 | ≤ 10% | 10–20% | > 20% | gates |
| K13 | Environment Availability | available hrs ÷ planned hrs × 100 | ≥ 95% | 90–95% | < 90% | weekly |
| K14 | Gate First-Pass Rate | gates passed first time ÷ gates held × 100 | ≥ 80% | 60–80% | < 60% | quarterly |
| K15 | CAPA On-Time Closure | CAPAs closed by due date ÷ CAPAs due × 100 | ≥ 90% | 75–90% | < 75% | monthly |
| K16 | CAPA Effectiveness | CAPAs verified effective ÷ CAPAs closed × 100 | ≥ 85% | 70–85% | < 70% | quarterly |

**Rules**
1. Each KPI has an **owner**, a **data source** (the tool query), a **frequency** and a **reaction rule**.
2. Use the **trend** as well as the snapshot. Three consecutive Amber readings escalate the same way as a Red.
3. Store the history. That history is your TMMi 3.3 SP1.4 test process database, and it feeds future estimates.
4. Don't use KPIs to rank individual people. Doing so destroys reporting honesty.

**TMMi link:** 2.3 SG1 and SG2 (all monitoring practices). 3.3 SP1.4 (process database) and SP3.3 (estimates). 3.1 SP5.2 (monitor implementation).

**Exercise:** given raw counts for one week, compute K1, K2, K5, K8 and K9, colour them RAG and write a 5-line status summary.

Template: [templates/kpi-catalogue.md](templates/kpi-catalogue.md)

---

## 5. Breaches

**Concept.** A breach happens when an agreed threshold, commitment or rule is not met. It is the trigger that moves a situation from *monitoring* to *control*.

**Breach types**

| Type | Examples |
|---|---|
| **KPI breach** | Any KPI in Red; 3 consecutive Ambers |
| **SLA breach** | Critical defect not fixed within 24h; env not restored within 4h; test report not issued on time |
| **Gate breach** | Release went live with No-Go criteria unmet; Conditional-Go action overdue |
| **Process breach** | Baseline changed without CR; gate skipped; production deploy without G5 record |
| **Quality breach** | Critical defect leaked to production (escape) |

**Severity & escalation (proposal)**

| Severity | Definition | Escalate to | Within | CAPA required? |
|---|---|---|---|---|
| S1 Critical | Production impact, release gate bypassed, data/security exposure | Head of QA + Delivery Director | 2 hours | **Yes, mandatory** |
| S2 Major | Red KPI affecting a gate; SLA missed on Critical/High defects; process breach | Test Manager + PM | 1 business day | Yes |
| S3 Minor | Single Red on a non-gate KPI; Amber trend | Test Lead | Next status meeting | At owner's discretion |

**Breach handling flow** (TMMi 2.3 SG3)
1. **Detect:** dashboard rule, SLA timer, or gate review.
2. **Log:** breach record with ID, type, severity, KPI or rule, actual value against the threshold, and detection date.
3. **Contain:** take an immediate correction. Examples: suspend testing according to the suspension criteria (2.3 SP2.5), add resources, or roll back.
4. **Escalate:** use the matrix above.
5. **Analyse:** decide whether this is a one-off or systemic. If it is systemic, or if the severity is S1/S2, raise a **CAPA**.
6. **Close:** confirm the metric is back in Green and link the CAPA.

**Rules**
1. Never hide a breach by re-baselining the target in silence. A target change itself needs a CR.
2. Every breach is either closed with a justification or linked to a CAPA.
3. Breach counts per release go in the test completion report and in the G5 and G6 reviews.

**Exercise:** find the breaches in a given status report, classify them, and write the escalation emails.

Template: [templates/breach-log.md](templates/breach-log.md)

---

## 6. CAPA (Corrective and Preventive Action)

**Concept.** CAPA fixes the **cause** of a problem, not just its symptom. Trainees need to tell these three apart:

| Term | Question it answers | Example (critical payment defect escaped) |
|---|---|---|
| **Correction** | How do we fix this instance now? | Hotfix the defect, add a test case |
| **Corrective action** | Why did it happen, and how do we stop it recurring? | RCA: boundary value of currency rounding not in design checklist → add BVA rule for monetary fields to design checklist; train team |
| **Preventive action** | Where else could this happen before it does? | Scan all other modules with monetary fields; add rounding risk to the standard product-risk catalogue |

Note: ISO 9001:2015 folds "preventive action" into risk-based thinking. In practice the preventive step often **updates the risk catalogue**, which closes the loop back to Risk Management.

**CAPA lifecycle**

```
Trigger → Register → Contain/Correct → Root Cause Analysis → Action Plan
       → Implement → Verify Effectiveness → Close → Lessons Learned → Update process assets
```

**Triggers:** an S1/S2 breach, a production escape, a repeated defect pattern (the same root cause three times or more), an audit or TMMi assessment finding, a failed gate, or a retrospective finding.

**Root cause analysis tools**
- **5 Whys:** good for linear causes. Stop when you reach a process or system cause, never "person X made a mistake".
- **Fishbone (Ishikawa):** categories People, Process, Tools, Environment, Requirements, Measurement.
- **Pareto:** across many defects, find the 20% of causes that produce 80% of the effect.
- **Defect root-cause taxonomy:** requirement, design, code, test gap, environment, config or data. Tag every closed defect in the tool with one of these.

**Effectiveness check.** This is what separates a real CAPA from paperwork.
- Define the measurable success criterion up front, for example "zero rounding defects in the next 2 releases" or "K9 reopen rate < 5% for 6 weeks".
- Verify it after the agreed period. If the action was not effective, reopen the CAPA with a new RCA.

**Rules**
1. A CAPA needs an owner, a due date and an effectiveness criterion before it is accepted.
2. Every CAPA ends with a **lessons learned** entry, and if needed an **update to a process asset** such as a template, checklist or risk catalogue. This is how TMMi 3.1 SP4.4 and SP5.3 are satisfied.
3. CAPA KPIs K15 and K16 are reviewed monthly by QA management.

**TMMi link:** 2.3 SG3 (SP3.1–3.3). 3.1 SG4 (process improvement) and SP5.3 (lessons learned). 3.3 SP1.5 (asset library updates).

**Exercise:** given a production escape scenario, write the full CAPA. Include the correction, a 5 Whys, the corrective and preventive actions, the effectiveness criterion, and the process asset you would change.

Template: [templates/capa-form.md](templates/capa-form.md)
