# Batch Tailoring

Topics are tailored for each batch based on the participants' **expected roles**, **experience** and **work requirements**. The storyline stays the same for every batch. What changes is **which chapters are included** and **how deep each one goes**.

## 1. Depth levels

| Level | Meaning | Typical time per chapter | Evidence expected |
|---|---|---|---|
| **K – Awareness** | Knows what it is, why it exists, and who owns it | 30–60 min | Quiz / discussion |
| **P – Practitioner** | Can do it on a project using the templates | 2–4 h incl. exercise | Completed exercise on running case |
| **E – Expert** | Can own, adapt and coach it; can defend it in an audit | 4–8 h incl. capstone role | Capstone artifact + defence |
| **–** | Not included for this profile | — | — |

## 2. Role profiles

| Code | Profile | Typical participants |
|---|---|---|
| **TA** | Test Analyst (functional) | Testers moving to senior |
| **TTA** | Technical Test Analyst / Automation | Automation engineers, SDETs |
| **TL** | Test Lead / Senior Tester leading a team | Senior testers, QA leads |
| **TM** | Test Manager (pre-managerial track) | Leads moving to management |
| **QG** | Quality Governance / QA (process) | Process QA, PMO quality, auditors |
| **XF** | Cross-functional joiners | BAs, developers, POs, PMs |

## 3. Default coverage matrix

Use this as the **starting point**. Adjust it in the batch profile (section 5).

| Area | Chapter | TA | TTA | TL | TM | QG | XF |
|---|---|---|---|---|---|---|---|
| **A. Who We Are** | A1 Organization Structure & IT Relationships | K | K | P | E | E | K |
| | A2 Test Policy | K | K | P | E | E | K |
| **B. The Rules** | B3 Test Strategy | K | P | P | E | P | K |
| | B4 Lifecycle & Integration | P | P | P | E | E | P |
| | B5 Quality Gates | P | P | E | E | E | P |
| | B6 Change & Configuration Management | P | P | E | E | E | P |
| **C. Preparing** | C7 Test Planning & Risk Assessment | P | K | E | E | P | K |
| | C8 Tool Setup | P | E | P | K | P | K |
| | C9 Test Environment & Test Data *(optional)* | – | P | P | K | – | – |
| **D. Doing the Work** | D10 Grooming & Estimation | E | P | E | P | K | P |
| | D11 Test Design & Execution | E | P | P | K | K | K |
| | D12 Defect Management | E | P | E | P | P | P |
| | D13 Regression Testing (Automation) | P | E | P | K | K | K |
| **E. Control** | E14 Monitoring & Control | P | K | E | E | E | K |
| | E15 Risk Management | P | K | E | E | E | K |
| | E16 KPIs & Breaches | P | P | E | E | E | K |
| | E17 Root Cause Analysis | P | P | E | E | E | P |
| | E18 CAPA | K | K | P | E | E | K |
| | E19 Audits | K | K | P | P | E | – |
| **F. Close & Learn** | F20 Test Closure & Lessons Learned | P | P | E | E | P | K |

**Always included, whatever the batch:** B5 Quality Gates, D12 Defect Management, E16 KPIs & Breaches, F20 Closure & Lessons Learned (at least at K level). They hold the story together.

## 4. Tailoring rules

1. **Keep the story order.** Drop or shrink chapters, but never reorder them. Later chapters assume the earlier story moments happened.
2. **A chapter set to `–` still gets one line in the story.** The facilitator narrates what happened ("the environment was ready on day 2") so the running case stays coherent.
3. **Experience shifts depth by one level.**
   - With 5 or more years in the role, move K→P or P→E on chapters the participants already practise.
   - Fresh joiners move down one level on E chapters.
4. **Work requirements override defaults.** Examples:
   - A team on regulated or audited projects sets E19 Audits and B6 Change Mgmt to E.
   - A team without automation sets D13 to K.
   - A team that owns its environments includes C9.
5. **Mixed batches:** use the **highest** depth needed by more than 30% of participants. Give the others pre-reading or follow-up material.
6. **Capstone roles follow profiles.**
   - TL and TM rotate as Test Manager and Gatekeeper.
   - TTA owns regression and the pipeline.
   - QG runs the audit (E19).
   - XF play PO, BA or Dev in the injects.
7. **Record the tailoring.** Each batch's profile is kept as evidence for TMMi 3.2 (Test Training Program) and GP2.5.

## 5. Batch profile (fill before each batch)

```markdown
# Batch <ID> – Tailoring Profile

| Field | Value |
|---|---|
| Batch dates | |
| Number of participants | |
| Role mix | TA: _ · TTA: _ · TL: _ · TM: _ · QG: _ · XF: _ |
| Experience (avg years in testing) | |
| Tool in use | Jira / Azure DevOps / other |
| Delivery model of their projects | Scrum / Kanban / V-model / hybrid |
| Work requirements / constraints | e.g. regulated, heavy automation, vendor-tested, owns environments |
| Pre-assessment results | (link) |

## Selected chapters & depth
| Chapter | Default (from matrix) | Tailored | Reason |
|---|---|---|---|
| A1 | | | |
| ... | | | |

## Schedule
Total days: __  (see sizing guide)

## Approved by
Academy Manager: ________  Date: ______
```

## 6. Sizing guide

| Depth mix | Approx. duration |
|---|---|
| Mostly K (awareness batch, e.g. XF) | 3–4 days |
| Mostly P (TA / TTA batch) | 8–10 days + 3-day capstone |
| Mostly E (TL / TM / QG batch) | 10–12 days + 4-day capstone |

## 7. Pre-assessment (optional)

A short self-assessment per chapter, rated 0–3 ("never heard of it" to "I own it at work"), helps set the depth objectively. Re-run it after the batch to measure the training's effect. Those results also feed M7 Competency Matrix on the managerial track.
