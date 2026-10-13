# 05 · Capstone (Internal Project) & Assessment

## Capstone setup

- **Teams:** 4–6 trainees, with **rotating roles** (TMMi 3.1 SP2.3): Test Manager, Test Lead, Test Analyst ×2, Technical Test Analyst / Automation, and Quality Gatekeeper (who audits gate evidence and process compliance).
- **System under test:** the existing internal project application used in v1.
- **Format:** 2 mini-sprints of 2 days each (Days 11–14), followed by a G5 Go/No-Go and a simulated G6.
- **Facilitators:** play the PO, Dev Lead, Ops and Head of QA. They inject events (see below).

## Capstone timeline

| When | Activity | Gate | Governance artifacts produced |
|---|---|---|---|
| Day 11 AM | Kick-off, tailoring, RACI | **G0** | Tailoring record, RACI |
| Day 11 PM | Requirements review, traceability, product risk workshop | **G1** | Review log, traceability matrix, risk register v1 |
| Day 11 end | MTP lite + estimates | **G2** | MTP, KPI targets confirmed |
| Day 12 | Sprint 1: design + intake + execute | **G3** per build | Intake records, test log, defects |
| Day 13 | Sprint 2: design + execute + regression | **G3** | CRs, updated risks, KPI dashboard |
| Day 14 AM | System test exit + completion report | **G4** | Gate checklist, test completion report |
| Day 14 PM | Go/No-Go | **G5** | Gate decision record |
| Day 14 end | Simulated hypercare + retro | **G6** | Breach log, CAPAs, lessons learned |

## Facilitator injects

These injects make the governance real. Release them at the times shown. Teams don't know they are coming.

| # | When | Inject | Expected team response | Topics exercised |
|---|---|---|---|---|
| I1 | Day 12 AM | Build delivered with no release notes; 2 of 10 smoke tests fail | Reject build at **G3**, log it, report schedule impact | Gates, 2.4 SP3.1 |
| I2 | Day 12 PM | Test environment down for 3 hours | Log env issue, check suspension criteria, K13 → Amber/Red, project risk materialised | Breaches, Risk, 2.3 SP1.2/SP2.5 |
| I3 | Day 13 AM | PO asks for a new discount rule "just add it, it's small" | Refuse to change the baseline silently. Raise a **CR**, do the test impact analysis, take it to the CCB, re-assess risks. | Change Mgmt, 2.4 SP4.1 |
| I4 | Day 13 PM | Critical defect open for 26h (SLA = 24h) | Automation or manual detection creates an S2 **Breach**, which is escalated | Breaches, KPIs (K8) |
| I5 | Day 14 AM | Dev Lead pushes for Go with 1 open Critical "we'll fix after release" | Team holds **No-Go**, or a Conditional Go only with risk acceptance signed by the PO, owner and date | Gates, Risk |
| I6 | Day 14 PM (post-G5) | Production escape: wrong VAT rounding reported by "customer" | S1 Breach → **CAPA** with correction, RCA (5 Whys), corrective and preventive actions, an effectiveness criterion, and an update to the design checklist or risk catalogue | CAPA, 3.1 SP5.3 |

## Evidence pack (team deliverable)

Each team submits a folder or a Confluence/Wiki page with an index mapped to TMMi. This is a mock version of what an assessor would ask for.

| # | Artifact | TMMi SPs evidenced |
|---|---|---|
| 1 | Tailoring record + lifecycle with gates | 3.3 SP1.2, SP1.3, SP2.1 |
| 2 | RACI + role assignment | 3.1 SP1.1, SP2.3 |
| 3 | Product & project risk register (with history) | 3.3 SP3.1, 2.3 SP1.4, SP2.3 |
| 4 | MTP lite | 3.3 SP3.2–SP3.6 |
| 5 | Traceability matrix / coverage report | 2.4 SP1.4 |
| 6 | Prioritised test cases, data, intake suite, schedule | 2.4 SG1, SG2 |
| 7 | Test log + defects with root cause | 2.4 SG3 |
| 8 | CCB / triage minutes + CR records | 2.4 SP4.1 |
| 9 | Gate decision records G0–G6 | 2.3 SP1.7, SP2.1, SP2.4, SP2.7 |
| 10 | KPI dashboard screenshots + weekly status reports | 2.3 SG1, SG2 |
| 11 | Breach log | 2.3 SP2.5, SP3.1 |
| 12 | CAPA records incl. effectiveness criterion | 2.3 SG3, 3.1 SG4 |
| 13 | Lessons learned + proposed asset updates | 3.1 SP5.3, 3.3 SP1.5 |

## Assessment

### 1. CTFL readiness (individual), 40%
- Mock exam: 40 questions, 60 minutes, pass mark 65% (26/40).
- Trainees below 65% get a remediation plan before booking the official exam.

### 2. Governance practical (individual), 20%
Short scenario test, 45 minutes:
- one gate decision
- one CR impact analysis
- KPI calculation and RAG for 5 KPIs
- breach classification and escalation
- one CAPA with 5 Whys

### 3. Capstone (team), 40%

| Criterion | Weight | 1 – Weak | 3 – Adequate | 5 – Strong |
|---|---|---|---|---|
| Gate discipline | 20% | Gates skipped or rubber-stamped | All gates held, criteria checked | Evidence-based decisions, conditions tracked to closure, held No-Go under pressure (I5) |
| Risk management | 15% | Register created once, never updated | Register updated at gates | Risk drives test priority; updated after CR and incidents; coverage traced |
| Change management | 15% | Change absorbed silently (I3) | CR raised and approved | Solid test impact analysis, regression scope, re-planning, risk re-assessed |
| KPIs & reporting | 15% | Numbers without targets | KPIs with RAG | Trends, actions per Red/Amber, clear stakeholder summary |
| Breach handling | 10% | Breaches unnoticed | Logged and escalated | Contained, escalated on time, linked to CAPA appropriately |
| CAPA quality | 15% | Correction only | RCA + corrective action | Systemic root cause, preventive action, measurable effectiveness check, asset updated |
| Tool usage | 10% | Spreadsheets outside tool | Configured types/workflows | Automation, dashboard and queries working end to end |

**Pass:** at least 60% overall and at least 3 on Gate discipline and CAPA quality.

### 4. Individual outputs
- Personal test career development plan (3.1 SP3.2)
- Peer feedback from the role rotation
