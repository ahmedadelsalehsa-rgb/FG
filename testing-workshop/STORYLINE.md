# Academy Storyline: Senior & Managerial Testing Tracks

> Status: **DRAFT for discussion**. The order and the chapter list still need to be agreed. Chapter content will be written after the source guides are provided.

## 1. The story idea

The whole track follows **one release of one product, from start to finish**. Every chapter answers the question *"what happens next, and who decides?"* It uses one running case: the internal project.

```
 WHO are we?  →  WHAT are the rules?  →  HOW do we prepare?  →  DO the work  →  STEER it  →  CLOSE & LEARN
 (Org, Policy)    (Strategy, Lifecycle,   (Planning, Tool,       (Grooming,     (Monitoring    (Release, RCA,
                   Gates, Change/CAB)      Env, Estimation)       Design, Exec,  & Control,     CAPA, Audits)
                                                                  Defects)       Risk, KPIs)
 ───────────────────────────── Senior Level (operate one project) ─────────────────────────────
                                              ↓
 ─────────────── Managerial Level (run many projects & improve the organisation) ───────────────
    Benchmarking KPIs across projects → Gate reporting & trends → Defect prevention → Innovation & pilots
```

---

## 2. Proposed order: Senior Level

`★` marks a topic that was not in the original list. `↕` marks a topic that moved from its original position.

| # | Part | Chapter | Main TMMi PA | Notes |
|---|---|---|---|---|
| **A** | **Who we are** | | | |
| 1 | A | Organisation structure & relationship between IT departments (Dev, BA, PMO, Ops/Infra, Security, Service Desk, Release Mgmt, QA) + RACI | 3.1 | Also introduce the **governance bodies** here (CAB, CCB, Steering Committee) without going deep |
| 2 | A | Test Policy | 2.1 | The "why" and the commitments. Every later chapter traces back to it. |
| **B** | **The rules of the road** | | | |
| 3 | B | Test Strategy (incl. **risk-based approach** and **quality attributes / ISO 25010**) ↕ | 2.1, 3.4 | Quality attributes moved here because they decide *which* test types we do |
| 4 | B | Test Lifecycle & Integration with SDLC/Agile | 3.3 | |
| 5 | B | Quality Gates (criteria set from quality attributes and risks) | 2.3, 3.3 | |
| 6 | B | Change Management: **CCB (project scope)** vs **CAB (production change)** + ★ Configuration Management (baselines, versions) ↕ | 2.4 SP4.1, GP2.6 | Moved after Gates: the CAB approves releases to production, so it depends on G5 |
| **C** | **Preparing the journey** | | | |
| 7 | C | Test Planning (MTP + level plans) incl. **product & project risk assessment** ↕ | 2.2, 3.3 SG3 | Risk *identification* belongs here. Risk *monitoring* stays in Part E. |
| 8 | C | Test Management Tool Setup (Jira / Azure DevOps) | 3.3 SP1.6 | |
| 🔹 | side | **Test Environment** + ★ **Test Data Management** | 2.5 | Side chapter, referenced from 7, 8 and G3 |
| **D** | **Doing the work** | | | |
| 9 | D | Grooming / Refinement meetings (tester's role, DoR, testability) | — | |
| 10 | D | Estimation from requirements (planning poker, WBS, test points, historical data) | 2.2, 3.3 SP3.3 | Usually done **inside** grooming. Could be merged with 9. |
| 🔹 | side | **Reviews** (static testing of requirements, test cases, code) | 3.5 (4.3 at manager level) | Side chapter, referenced from 9, 11 and G1 |
| 11 | D | Test Design & Execution (techniques, intake test, test log) | 2.4 | |
| 12 | D | ★ **Defect Management** (lifecycle, severity/priority, triage, root-cause tagging) | 2.4 SG4 | **Missing in the original list.** RCA and KPIs depend on it. |
| ★ | D | ★ **Test Automation & CI/CD in the process** (optional) | — | Decide: own chapter, or a thread through 3, 4 and 11 |
| **E** | **Steering** | | | |
| 13 | E | Test Monitoring & Control: progress & quality monitoring, status reporting | 2.3 | |
| 14 | E | Risk Management (monitoring, re-assessment, issue handling) | 2.3 | |
| 15 | E | KPIs & **Breaches** (thresholds, SLA, escalation) | 2.3 | |
| **F** | **Close & learn** | | | |
| 16 | F | ★ **Test Closure, Completion Report & Go/No-Go** (G5, hypercare G6) | 2.3 SP2.7 | **Missing.** This is where the story "lands". |
| 17 | F | RCA (5 Whys, Fishbone, Pareto) | 2.3 SG3 | |
| 18 | F | CAPA Actions + ★ Lessons Learned | 2.3 SG3, 3.1 SG5 | |
| 19 | F | Audits (process compliance, gate evidence, audit findings → CAPA) | GP2.9 | |

## 3. Proposed order: Managerial Level

The four managerial topics map almost exactly onto **TMMi Levels 4–5**, which gives the managerial track a clear backbone:

| # | Chapter | TMMi PA | Notes |
|---|---|---|---|
| M1 | ★ Test Process Assessment & Improvement Roadmap (TMMi self-assessment, maturity plan) | 3.1 SG4 | **Suggested opener.** It explains *why* the rest exists. |
| M2 | KPI Benchmarking & cross-project use (normalisation, measurement programme, baselines) | **4.1 Test Measurement** | |
| M3 | Quality Gate Reporting & Trends (portfolio dashboards, control charts) | **4.2 Product Quality Evaluation**, **5.2 Quality Control** | |
| M4 | ★ Advanced Reviews (review programme, review metrics) | **4.3 Advanced Reviews** | Managerial extension of the Reviews side topic |
| M5 | Defect Prevention (defect-cause analysis across projects, prevention actions) | **5.1 Defect Prevention** | |
| M6 | Innovation & Pilots (tools, AI in testing, automation; pilot → evaluate → deploy) | **5.3 Test Process Optimization** | |
| ★ | Candidate additions: Capacity & resource planning, test budgeting / **Cost of Quality**, competency matrix & career paths (3.1/3.2), vendor/outsourced testing management, executive reporting | — | Choose which to keep |

---

## 4. Chapter template (every chapter uses the same skeleton)

```markdown
# <Chapter #> · <Title>

## 1. Story hook          – what is happening now in the running case (1 paragraph)
## 2. Purpose & outcomes  – what a senior / manager can do after this chapter
## 3. Concepts            – definitions, models (with diagram)
## 4. Process             – inputs → steps → outputs, entry/exit, RACI
## 5. Rules / standards   – the organisation's mandatory rules (from Policy)
## 6. Artifacts & templates – links to templates/
## 7. Tool implementation – Jira / Azure DevOps how-to
## 8. Metrics & gates touched – which KPIs / gates this chapter feeds
## 9. References          – TMMi PA/SG/SP · ISTQB syllabus section · source guide (your docs)
## 10. Exercise & evidence – hands-on task + evidence it produces for TMMi
## 11. Senior vs Manager takeaway
```

## 5. Proposed folder structure for documentation

```
testing-workshop/
├── STORYLINE.md                 ← this file (master outline)
├── senior/
│   ├── A1-organisation-structure.md
│   ├── A2-test-policy.md
│   ├── B3-test-strategy.md
│   ├── B4-test-lifecycle-integration.md
│   ├── B5-quality-gates.md
│   ├── B6-change-management-cab.md
│   ├── C7-test-planning.md
│   ├── C8-tool-setup.md
│   ├── D9-grooming.md
│   ├── D10-estimation.md
│   ├── D11-test-design-execution.md
│   ├── D12-defect-management.md
│   ├── E13-monitoring-control.md
│   ├── E14-risk-management.md
│   ├── E15-kpis-breaches.md
│   ├── F16-closure-go-no-go.md
│   ├── F17-rca.md
│   ├── F18-capa-lessons-learned.md
│   ├── F19-audits.md
│   └── side/
│       ├── S1-test-environment-data.md
│       └── S2-reviews.md
├── managerial/
│   ├── M1-assessment-improvement.md
│   ├── M2-kpi-benchmarking.md
│   ├── M3-gate-reporting-trends.md
│   ├── M4-advanced-reviews.md
│   ├── M5-defect-prevention.md
│   └── M6-innovation-pilots.md
├── templates/                   ← already exists; grows per chapter
└── sources/                     ← your guides go here (or links), one per chapter
```

The existing files (`01`–`05`) become the **workshop delivery plan**: schedule, labs and capstone. The chapters above become the **body of knowledge** that those files point to.

## 6. Open decisions

1. Where do **Change Management & CAB** go? (a) after Quality Gates, which is proposed, or (b) right after Policy, as in the original order.
2. Should **Grooming + Estimation** be merged into one chapter?
3. Should **Test Automation / CI-CD** be its own chapter or a thread through other chapters?
4. Which managerial candidates to keep (Cost of Quality, capacity, vendor management, etc.)?
5. Running case: use the internal project, or a fictional product?
6. Final documentation format: Markdown here, a shared doc, Word, or slides?
