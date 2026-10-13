# Academy Storyline: Senior & Managerial Testing Tracks

> Status: **Structure agreed. Chapters are skeletons waiting for source guides.** For how to add guides, see [sources/README.md](sources/README.md).

## 1. The story

The whole track follows **one release of the internal project, from start to finish**. Every chapter opens with a *story hook*, the moment in that release where the topic becomes necessary. Each chapter answers the question *"what happens next, and who decides?"*

```
 WHO are we?  →  WHAT are the rules?  →  HOW do we prepare?  →  DO the work  →  STEER it  →  CLOSE & LEARN
 (Org, Policy)    (Strategy, Lifecycle,   (Planning + Risk,      (Grooming &,   (Monitoring,   (Closure & Go/No-Go,
                   Gates, Change/CAB)      Tool setup)            Design, Exec,  Risk, KPIs &   RCA, CAPA,
                                                                  Defects, Auto) Breaches)      Audits)
                 side topics:  S1 Test Environment & Data  ·  S2 Reviews
 ──────────────────────────── Senior Level: operate one project well ────────────────────────────
                                               ↓
 ───────────── Managerial Level: run many projects & improve the organisation (TMMi L4–L5) ─────────────
   Assess → Measure & benchmark → Report trends → Executive story → Money → People → Partners → Prevent → Innovate
```

**Running case:** the Academy's internal project, release **R1.0**. Teams follow it from kick-off to hypercare. The capstone in [05-capstone-and-assessment.md](05-capstone-and-assessment.md) is the same story, played live.

## 2. Senior Level

| Part | # | Chapter | TMMi | Story moment |
|---|---|---|---|---|
| **A · Who we are** | A1 | [Organisation Structure & IT Department Relationships](senior/A1-organisation-structure.md) | 3.1 | Who does what; governance bodies (Steering, CCB, CAB) introduced |
| | A2 | [Test Policy](senior/A2-test-policy.md) | 2.1 | Why testing has rules |
| **B · The rules** | B3 | [Test Strategy (Risk-Based Approach & Quality Attributes)](senior/B3-test-strategy.md) | 2.1, 3.4 | How we test, and which quality attributes matter |
| | B4 | [Test Lifecycle & Integration](senior/B4-test-lifecycle-integration.md) | 3.3 | Where testing sits on the timeline |
| | B5 | [Quality Gates](senior/B5-quality-gates.md) | 2.3, 3.3 | Gates G0–G6, built from the strategy |
| | B6 | [Change Management, Configuration Management & CAB](senior/B6-change-config-management-cab.md) | 2.4, GP2.6 | CCB (scope) vs CAB (production) |
| **C · Preparing** | C7 | [Test Planning & Risk Assessment](senior/C7-test-planning-risk-assessment.md) | 2.2, 3.3 | MTP; risks identified and scored |
| | C8 | [Test Management Tool Setup](senior/C8-test-management-tool-setup.md) | 3.3 | Jira / Azure DevOps configured |
| *side* | S1 | [Test Environment & Test Data](senior/side/S1-test-environment-data.md) | 2.5 | Env & data ready (feeds G3) |
| **D · Doing the work** | D9 | [Grooming & Estimation](senior/D9-grooming-estimation.md) | 2.2, 3.3 | Refinement, DoR, test estimates |
| *side* | S2 | [Reviews](senior/side/S2-reviews.md) | 3.5 | Static testing (feeds G1) |
| | D10 | [Test Design & Execution](senior/D10-test-design-execution.md) | 2.4 | Risk-prioritised tests, intake, execution |
| | D11 | [Defect Management](senior/D11-defect-management.md) | 2.4 SG4 | Report, triage, fix, tag root cause |
| | D12 | [Test Automation & CI/CD](senior/D12-test-automation-cicd.md) | 2.4, 3.3 | Automated suites as pipeline gates |
| **E · Steering** | E13 | [Test Monitoring & Control](senior/E13-monitoring-control.md) | 2.3 | Progress & quality vs plan |
| | E14 | [Risk Management (Monitoring)](senior/E14-risk-management.md) | 2.3 | Risks re-scored; risk → issue |
| | E15 | [KPIs & Breaches](senior/E15-kpis-breaches.md) | 2.3 | Thresholds, SLA breach, escalation |
| **F · Close & learn** | F16 | [Test Closure, Completion Report & Go/No-Go](senior/F16-test-closure-go-no-go.md) | 2.3 | G5, CAB, hypercare G6 |
| | F17 | [Root Cause Analysis](senior/F17-root-cause-analysis.md) | 2.3 | Why did the escape happen? |
| | F18 | [CAPA & Lessons Learned](senior/F18-capa-lessons-learned.md) | 2.3, 3.1 | Fix cause, prevent, verify, update process |
| | F19 | [Audits](senior/F19-audits.md) | GP2.9 | Was the process really followed? |

## 3. Managerial Level

| # | Chapter | TMMi | Arc |
|---|---|---|---|
| M1 | [Test Process Assessment & Improvement Roadmap](managerial/M1-assessment-improvement-roadmap.md) | 3.1 SG4 | **Assess:** where are we? |
| M2 | [KPI Benchmarking & Cross-Project Use](managerial/M2-kpi-benchmarking.md) | 4.1 | **Measure:** make numbers comparable |
| M3 | [Quality Gate Reporting & Trends](managerial/M3-gate-reporting-trends.md) | 4.2, 5.2 | **Report trends:** signal vs noise |
| M4 | [Executive Reporting & Stakeholder Management](managerial/M4-executive-reporting.md) | GP2.10 | **Tell the story** upward |
| M5 | [Cost of Quality & Test Budgeting](managerial/M5-cost-of-quality-budgeting.md) | 3.3 | **Money** |
| M6 | [Capacity & Resource Planning](managerial/M6-capacity-resource-planning.md) | 3.1 | **People: allocation** |
| M7 | [Competency Matrix & Career Paths](managerial/M7-competency-career-paths.md) | 3.1, 3.2 | **People: growth** (Academy link) |
| M8 | [Vendor & Outsourced Testing Management](managerial/M8-vendor-outsourced-testing.md) | 2.3, 3.1 | **Partners** |
| M9 | [Advanced Reviews](managerial/M9-advanced-reviews.md) | 4.3 | **Prevent:** cheapest defect removal |
| M10 | [Defect Prevention](managerial/M10-defect-prevention.md) | 5.1 | **Prevent:** attack common causes |
| M11 | [Innovation & Pilots](managerial/M11-innovation-pilots.md) | 5.3 | **Innovate:** pilot → measure → deploy |

## 4. Decisions applied

| Decision | Applied as |
|---|---|
| Change Management & CAB placed after Quality Gates | B6. Governance bodies are only *introduced* in A1. |
| Risk split into assessment and monitoring | Assessment in C7, monitoring in E14 |
| Quality attributes moved into Strategy | B3 (ISO 25010) |
| Grooming and Estimation merged | D9 |
| Missing topics added | D11 Defect Management, F16 Closure & Go/No-Go, configuration management (in B6), test data (in S1), lessons learned (in F18) |
| Test Automation as its own chapter | D12 |
| Managerial extras all kept | M1, M4–M9 |
| Running case | Internal project, release R1.0 |
| Format | Markdown in this repo (can be exported to a doc, Word or slides later) |

## 5. Chapter template

Every chapter file uses the same 11 sections:

1. Story hook
2. Purpose & outcomes
3. Concepts
4. Process (inputs → steps → outputs, RACI)
5. Rules / standards
6. Artifacts & templates
7. Tool implementation
8. Metrics & gates touched
9. References
10. Exercise & evidence
11. Senior vs Manager takeaway

Sections 1, 2, 3 (planned scope), 6, 8 and 9 are pre-filled. The rest are marked `TODO` until the source guide arrives.

## 6. How the files relate

```
testing-workshop/
├── STORYLINE.md            ← this file: master outline (body of knowledge)
├── senior/                 ← A1–F19 chapters
│   └── side/               ← S1, S2
├── managerial/             ← M1–M11 chapters
├── sources/                ← your guides, one folder per chapter id
├── templates/              ← reusable templates
└── 01–05-*.md              ← workshop delivery plan (schedule, labs, capstone, assessment)
```
