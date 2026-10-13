# Academy Storyline: Senior & Managerial Testing Tracks

> Status: **Structure agreed. Chapters are skeletons waiting for source guides.** Topics are **tailored per batch** (see [TAILORING.md](TAILORING.md)). For how to add guides, see [sources/README.md](sources/README.md).

## 1. The story

The whole track follows **one release of the internal project, from start to finish**. Every chapter opens with a *story hook*, the moment in that release where the topic becomes necessary. Each chapter answers the question *"what happens next, and who decides?"*

```
 A. WHO WE ARE  →  B. THE RULES  →  C. PREPARING  →  D. DOING THE WORK  →  E. CONTROL  →  F. CLOSE & LEARN
 Org, IT &         Strategy,        Planning & Risk,  Grooming & Estim.,    Monitoring,     Closure &
 Test Policy       Lifecycle,       Tool Setup,       Design & Exec,        Risk, KPIs &    Lessons Learned
                   Gates, Change    (Env & Data)      Defects, Regression   Breaches, RCA,
                   & Config Mgmt                      (Automation)          CAPA, Audits
 ─────────────────────────── Senior Level: operate one project well ───────────────────────────
                                               ↓
 ───────────── Managerial Level: run many projects & improve the organisation (TMMi L4–L5) ─────────────
```

**Running case:** the Academy's internal project, release **R1.0**. The capstone in [05-capstone-and-assessment.md](05-capstone-and-assessment.md) plays the same story live.

## 2. Senior Level

| Area | # | Chapter | TMMi | Story moment |
|---|---|---|---|---|
| **A. Who We Are** | A1 | [Organization Structure, IT Relationships & Test Policy](senior/A1-organisation-it-test-policy.md) | 3.1, 2.1 | Who does what, who decides, which rules we committed to |
| **B. The Rules** | B2 | [Test Strategy](senior/B2-test-strategy.md) | 2.1, 3.4 | How we test; which quality attributes matter |
| | B3 | [Lifecycle & Integration](senior/B3-test-lifecycle-integration.md) | 3.3 | Where testing sits on the timeline |
| | B4 | [Quality Gates](senior/B4-quality-gates.md) | 2.3, 3.3 | Gates G0–G6 built from the strategy |
| | B5 | [Change & Configuration Management (CCB & CAB)](senior/B5-change-config-management-cab.md) | 2.4, GP2.6 | Baselines, scope change (CCB), production change (CAB) |
| **C. Preparing** | C6 | [Test Planning & Risk Assessment](senior/C6-test-planning-risk-assessment.md) | 2.2, 3.3 | MTP; risks identified and scored |
| | C7 | [Tool Setup](senior/C7-test-management-tool-setup.md) | 3.3 | Jira / Azure DevOps configured |
| | C8 | [Test Environment & Test Data](senior/C8-test-environment-data.md) *(optional)* | 2.5 | Environment & data ready (feeds G3) |
| **D. Doing the Work** | D9 | [Grooming & Estimation](senior/D9-grooming-estimation.md) | 2.2, 3.3, 3.5 | Refinement, requirements review, DoR, estimates |
| | D10 | [Test Design & Execution](senior/D10-test-design-execution.md) | 2.4 | Risk-prioritised tests, intake, execution |
| | D11 | [Defect Management](senior/D11-defect-management.md) | 2.4 SG4 | Report, triage, fix, tag root cause |
| | D12 | [Regression Testing (Automation)](senior/D12-regression-testing-automation.md) | 2.4, 3.3 | Risk-based regression, automated pipeline gate |
| **E. Control** | E13 | [Monitoring & Control](senior/E13-monitoring-control.md) | 2.3 | Progress & quality vs plan |
| | E14 | [Risk Management](senior/E14-risk-management.md) | 2.3 | Risks re-scored; risk → issue |
| | E15 | [KPIs & Breaches](senior/E15-kpis-breaches.md) | 2.3 | Thresholds, SLA breach, escalation |
| | E16 | [Root Cause Analysis](senior/E16-root-cause-analysis.md) | 2.3 SG3 | Why did it happen? |
| | E17 | [CAPA](senior/E17-capa.md) | 2.3 SG3, 3.1 | Fix cause, prevent, verify effectiveness |
| | E18 | [Audits](senior/E18-audits.md) | GP2.9 | Was the process really followed? |
| **F. Close & Learn** | F19 | [Test Closure & Lessons Learned](senior/F19-test-closure-lessons-learned.md) | 2.3, 3.1 SP5.3 | Completion report, Go/No-Go, hypercare, lessons → process assets |

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

## 4. Structure decisions

| Decision | Applied as |
|---|---|
| Organization and Test Policy merged | A1 |
| Change & Configuration Management under The Rules | B5 (CCB vs CAB explained there; bodies introduced in A1) |
| Test Environment & Data optional | C8, marked Optional in the tailoring matrix |
| Reviews folded into the work | Requirements reviews in D9, test case reviews in D10, advanced reviews in M9 |
| Automation focused on regression | D12 Regression Testing (Automation) |
| RCA, CAPA and Audits moved to Control | E16, E17, E18 |
| Closure merged with Lessons Learned | F19 (includes Go/No-Go, CAB submission, hypercare) |
| Topics tailored per batch | [TAILORING.md](TAILORING.md): role profiles, depth levels, coverage matrix, batch profile |
| Running case | Internal project, release R1.0 |
| Format | Markdown in this repo (can be exported to a doc, Word or slides later) |

## 5. Chapter template

Every chapter file uses the same header (level, **tailoring**, TMMi, references, source guide, related chapters) and 11 sections:

1. Story hook
2. Purpose & outcomes
3. Concepts
4. Process
5. Rules / standards
6. Artifacts & templates
7. Tool implementation
8. Metrics & gates touched
9. References
10. Exercise & evidence
11. Senior vs Manager takeaway

## 6. Folder layout

```
testing-workshop/
├── STORYLINE.md      ← this file: master outline
├── TAILORING.md      ← per-batch tailoring model
├── senior/           ← A1–F19
├── managerial/       ← M1–M11
├── sources/          ← your guides, one folder per chapter id
├── templates/        ← reusable templates
└── 01–05-*.md        ← workshop delivery plan (schedule, labs, capstone, assessment)
```
