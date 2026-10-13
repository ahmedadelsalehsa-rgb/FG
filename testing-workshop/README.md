# Testing Workshop: ISTQB + Agile + Tooling + TMMi Quality Governance

This is the Academy's Testing Workshop curriculum, version 2.

| Version | What it covers |
|---|---|
| v1 (current) | ISTQB CTFL complete, Agile essentials, Jira / Azure DevOps hands-on, internal project |
| **v2 (this)** | Everything in v1, **plus** TMMi PA 2.3, 2.4, 3.1 and 3.3, **plus** a Quality Governance track: Quality Gates, Change Management, Risk Management, KPIs, Breaches, CAPA |

## Design principle: weave, don't bolt on

TMMi and governance are **not** added as a separate block at the end. Each topic goes into the ISTQB or Agile module it extends, then gets practised in Jira/Azure, and is then **run for real** in the internal project.

```
 Learn (ISTQB/Agile)  →  Extend (TMMi practice)  →  Configure (Jira/Azure)  →  Operate (internal project)
   "what is an           "TMMi 2.3 SP2.4:          "Exit-criteria            "Gate G3 fails →
    exit criterion"       monitor exit criteria"    checklist on the          breach → CAPA"
                                                    Test Plan"
```

Graduates leave able to pass the CTFL exam. They can also **operate a TMMi Level 2/3-compliant test process**, and the capstone produces evidence you can reuse in your TMMi assessment.

## Two layers

| Layer | What it is | Where |
|---|---|---|
| **Body of knowledge** | The story: one chapter per topic, Senior (A1–F20) and Managerial (M1–M11) | [STORYLINE.md](STORYLINE.md) → `senior/`, `managerial/` |
| **Workshop delivery plan** | How the chapters are taught: schedule, labs, capstone, assessment | files `01`–`05` below |

### Workshop module → chapters

| Workshop module ([01](01-curriculum.md)) | Chapters |
|---|---|
| M1 Fundamentals | A1, A2 |
| M2 Testing in the SDLC | B3, B4, B5 |
| M3 Agile | B6, D10 |
| M4 Static testing | E14 Reviews |
| M5 Test analysis & design | D11 |
| M6 Planning & risk | C7, C9 (optional) |
| M7 Monitoring & control | E13, E15–E19 |
| M8 Tools | C8 |
| M9 Execution & incidents | D11, D12 |
| M10 Capstone | F20 (+ all above in practice) |
| Managerial track | M1–M11 (separate programme) |

Chapters and depth are **tailored per batch**. See [TAILORING.md](TAILORING.md).

## Files

| File | Contents |
|---|---|
| [STORYLINE.md](STORYLINE.md) | Master outline: chapter order, story, decisions |
| [TAILORING.md](TAILORING.md) | Per-batch tailoring: role profiles, depth levels, coverage matrix, batch profile |
| [sources/](sources/) | Where your guides go, with a per-chapter checklist |
| [01-curriculum.md](01-curriculum.md) | Module-by-module plan, day schedule, learning objectives |
| [02-tmmi-mapping.md](02-tmmi-mapping.md) | TMMi 2.3 / 2.4 / 3.1 / 3.3 specific goals and practices → workshop module → artifact |
| [03-governance-track.md](03-governance-track.md) | Quality Gates, Change Management, Risk, KPIs, Breaches, CAPA: content, rules, examples |
| [04-tooling-labs.md](04-tooling-labs.md) | How to configure each governance item in **Jira** and **Azure DevOps** (labs) |
| [05-capstone-and-assessment.md](05-capstone-and-assessment.md) | Internal-project capstone with facilitator "injects", evidence pack, grading rubric |
| [templates/](templates/) | Ready-to-use templates: gate checklist, risk register, KPI catalogue, breach log, CR form, CAPA form |

## At a glance

- **Duration:** 15 training days (3 weeks full-time, or 6 weeks at 2.5 days/week). The [timing table](01-curriculum.md#schedule-overview) shows how to compress it to 12 days.
- **Audience:** junior or cross-skilling testers, plus BA/dev staff who join the quality process.
- **Prerequisites:** none for CTFL. Basic Jira or Azure DevOps navigation helps.
- **Outputs per trainee:** CTFL exam readiness, a configured Jira/Azure project, and a capstone evidence pack mapped to TMMi practices.

> Assumptions to confirm: the 15-day length, the gate names (G0–G6) and the KPI targets are **proposals**. Align them with your organisation's test policy and the Academy and TMMi structure you plan to define later.
