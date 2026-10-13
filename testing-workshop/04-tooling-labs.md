# 04 · Tooling Labs: Jira & Azure DevOps

Each trainee team configures **one** tool, Jira or Azure DevOps, to run the governance track. The labs follow the order of the modules. Names in `code` are suggested; adapt them to your instance. Admin rights may be needed for custom fields and workflows, so prepare a sandbox project per team in advance.

## Lab overview

| Lab | Topic | Jira | Azure DevOps |
|---|---|---|---|
| L1 | Traceability | Story ↔ Test (Xray/Zephyr) links, coverage report | Requirement ↔ Test Case links, Test Plans "requirement-based suites" |
| L2 | Risk register | Issue type `Risk` | Work item type `Risk` (inherited process) |
| L3 | Change requests | Issue type `Change Request` + CCB workflow | Work item type `Change Request` + states |
| L4 | Quality gates | Issue type `Gate Review` + checklist | Work item `Gate Review` **and** pipeline approvals & checks |
| L5 | KPIs | Dashboards + JQL filters | Dashboards + queries + Analytics widgets |
| L6 | Breaches | Issue type `Breach` + SLA (JSM) or automation timers | Work item `Breach` + queries/alerts |
| L7 | CAPA | Issue type `CAPA` + workflow incl. "Effectiveness Check" | Work item `CAPA` + states |

---

## Jira

### Issue types & key fields

| Issue type | Key custom fields |
|---|---|
| `Risk` | Risk Category (Product/Project), Likelihood (1–5), Impact (1–5), Risk Score (automation: L×I), Risk Level, Response, Owner, Trigger, Linked Tests |
| `Change Request` | Change Type (Minor/Normal/Major/Emergency), Baseline Affected, Test Impact (text), Regression Scope, Effort Impact (h), CCB Decision, CCB Date |
| `Gate Review` | Gate (G0–G6), Release/Fix Version, Decision (Go/Conditional/No-Go), Conditions, Decision Owner, Checklist (checklist app or sub-tasks) |
| `Breach` | Breach Type, Severity (S1–S3), KPI/Rule, Threshold, Actual, Containment, Escalated To, Linked CAPA |
| `CAPA` | Trigger Source, Correction, Root Cause Category, RCA (5 Whys), Corrective Action, Preventive Action, Effectiveness Criterion, Verification Date, Effective? (Y/N), Process Asset Updated |

On `Bug`, add **Root Cause Category** (Requirement / Design / Code / Test Gap / Environment / Data / Config) and **Detected In** (Phase/Gate). DDP, leakage and Pareto analysis need these fields.

### Workflows

- **Change Request:** `Raised → Impact Analysis → CCB Review → Approved | Rejected | Deferred → Implemented → Verified → Closed`
  - Validator: you cannot move from `Impact Analysis` to `CCB Review` while the *Test Impact* field is empty.
- **CAPA:** `Open → Containment → RCA → Action Plan → In Progress → Effectiveness Check → Closed | Reopened`
  - Validator: `Action Plan` requires both *Effectiveness Criterion* and *Due date*.
- **Breach:** `Detected → Contained → Escalated → Under Analysis → Closed (No CAPA) | Closed (CAPA linked)`

### JQL starter pack

```sql
-- K8 input: open Critical defects older than 1 day (SLA breach candidates)
project = WS AND issuetype = Bug AND priority = Highest AND statusCategory != Done AND created <= -1d

-- K9: reopened defects this release
project = WS AND issuetype = Bug AND fixVersion = "R1.0" AND status CHANGED FROM Done TO "Reopened"

-- K6 / DDP input: defects found in production
project = WS AND issuetype = Bug AND "Detected In" = Production AND fixVersion = "R1.0"

-- High product risks without linked tests (K4 gap)
project = WS AND issuetype = Risk AND "Risk Level" = High AND issueFunction not in hasLinkType("is tested by")
-- (requires ScriptRunner; otherwise use a saved filter + manual check, or Xray's coverage report)

-- CRs waiting for CCB
project = WS AND issuetype = "Change Request" AND status = "CCB Review"

-- Overdue CAPAs (K15)
project = WS AND issuetype = CAPA AND statusCategory != Done AND due < now()
```

### Automation rules (Jira Automation)

1. **Risk score:** when Likelihood or Impact changes, set Risk Score = L×I and set Risk Level (High ≥ 15, Medium 8–14, Low ≤ 7).
2. **Critical defect SLA:** on a schedule, every hour, find Highest-priority bugs open longer than 24h that have no linked Breach. Create a `Breach` (Severity S2, Type SLA) and link it.
3. **S1/S2 breach → CAPA:** when a Breach is created with Severity S1 or S2, create a `CAPA` and link it.
4. **Production escape:** when a Bug is created with Detected In = Production and priority ≥ High, create a `Breach` (Quality, S1/S2).

### Dashboard "Quality Governance"

- Gadgets: filter results for open Gates, CCB queue, open Breaches by severity and overdue CAPAs.
- Two-dimensional filter statistics: Bugs by Root Cause × Detected In.
- Created vs Resolved chart, and average age chart for K8.
- Xray/Zephyr test execution progress and coverage for K1–K3.

---

## Azure DevOps

### Process customisation

Organization settings → Process → create an **inherited** process from Agile or Scrum. Then:

| Work item type | Key fields (same as Jira above) | States |
|---|---|---|
| `Risk` | Category, Likelihood, Impact, Score, Level, Response, Owner | Identified → Assessed → Mitigating → Closed / Occurred |
| `Change Request` | Change Type, Test Impact, Regression Scope, CCB Decision | Raised → Impact Analysis → CCB Review → Approved / Rejected → Implemented → Verified → Closed |
| `Gate Review` | Gate, Iteration/Release, Decision, Conditions | Scheduled → In Review → Go / Conditional / No-Go |
| `Breach` | Type, Severity, KPI, Threshold, Actual | Detected → Contained → Escalated → Closed |
| `CAPA` | Correction, RCA, Corrective, Preventive, Effectiveness Criterion | Open → RCA → Action Plan → In Progress → Effectiveness Check → Closed |

On `Bug`, add **Root Cause Category** and **Detected In**. Mark Test Impact as required in the state rules (*rule: when state = CCB Review, Test Impact is required*).

### Traceability & tests (L1)

- Test Plans → create **requirement-based suites** so coverage per requirement is automatic.
- Use the **Requirements quality** and **Test results trend** widgets.

### Gates in pipelines (L4)

This is where Azure DevOps is strongest. Map the gates to **Environments → Approvals and checks**:

| Gate | Pipeline mechanism |
|---|---|
| G3 Build Acceptance | Stage `QA` runs the smoke suite. The stage fails if the pass rate is below 100%. |
| G4 System Test Exit | Environment `UAT`: **Invoke REST API / Azure Function check** or **Query Work Items** check (e.g. *0 active Bugs with Severity 1*) + manual approval by the Test Manager |
| G5 Release Readiness | Environment `Production`: **approval** by PO + Release Manager + Test Manager, **business hours** check, **Query Work Items** check (no open CRs with tag `R1.0`) |

The `Gate Review` work item still holds the decision record. Link it to the pipeline run.

### Queries (WIQL examples)

```sql
-- Open Severity-1 bugs (G4 blocker)
SELECT [System.Id], [System.Title] FROM WorkItems
WHERE [System.WorkItemType] = 'Bug' AND [Microsoft.VSTS.Common.Severity] = '1 - Critical'
  AND [System.State] <> 'Closed'

-- Overdue CAPAs
SELECT [System.Id] FROM WorkItems
WHERE [System.WorkItemType] = 'CAPA' AND [System.State] <> 'Closed'
  AND [Microsoft.VSTS.Scheduling.DueDate] < @Today
```

### Dashboard "Quality Governance"

Use Query tiles (open breaches by severity, CCB queue, overdue CAPAs), Chart for work items (Bugs by Root Cause × Detected In), Test results trend, Lead/Cycle time for K8, and Analytics views with Power BI for KPI history (TMMi 3.3 SP1.4).

For notifications, set up project settings → Notifications → a subscription for when a `Breach` is created with Severity = S1, to email the Head of QA.

---

## Lab completion checklist

- [ ] 5 custom issue / work item types created with required fields
- [ ] CR workflow blocks CCB review without Test Impact
- [ ] CAPA workflow has Effectiveness Check state
- [ ] Bugs carry Root Cause Category + Detected In
- [ ] At least 3 automation rules / checks working (risk score, SLA breach, escape → breach)
- [ ] Governance dashboard shows K1, K2, K3, K4, K8, K9 + open breaches + overdue CAPAs
- [ ] (Azure) G4/G5 environment checks configured
