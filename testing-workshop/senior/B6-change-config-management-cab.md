# B6 · Change Management, Configuration Management & CAB

| | |
|---|---|
| **Level** | Senior |
| **Status** | Skeleton: waiting for source guide |
| **TMMi** | 2.4 SP1.4, SP4.1; GP2.6 (configuration management) |
| **Other references** | CTFL v4.0 §5.4 (configuration management); ITIL 4 Change Enablement |
| **Source guide** | `sources/B6/` |
| **Related chapters** | [A1 Organisation Structure & IT Department Relationships](A1-organisation-structure.md) · [B5 Quality Gates](B5-quality-gates.md) · [D11 Defect Management](D11-defect-management.md) · [F16 Test Closure, Completion Report & Go/No-Go](F16-test-closure-go-no-go.md) |

## 1. Story hook
Halfway through the release the business wants a new rule. The baseline is frozen after G2. Who approves the change? And later, who approves the move to production?

## 2. Purpose & outcomes
After this chapter, the participant can:
- Distinguish a CCB (project scope / baseline change) from a CAB (production change)
- Run a CR through impact analysis and CCB decision
- Prepare testing evidence for a CAB meeting
- Apply configuration management to test assets and builds

## 3. Concepts
Planned scope:
- Baselines and configuration items (requirements, builds, test assets, environments)
- Change sources and classification (minor / normal / major / emergency)
- CR lifecycle and test impact analysis using traceability
- CCB: members, cadence, decisions
- CAB: ITIL change types (standard / normal / emergency), CAB meeting agenda, ECAB
- Testing evidence required by the CAB (link to G5)
- Emergency changes, hotfixes and retrospective approval

> TODO: write from source guide.

## 4. Process
> TODO: inputs → steps → outputs · entry / exit · RACI.

## 5. Rules / standards
> TODO: mandatory organisational rules (trace each one to the Test Policy).

## 6. Artifacts & templates
- [templates/change-request.md](../templates/change-request.md)
- CAB evidence pack checklist *(to create)*
- CCB/CAB minutes template *(to create)*

## 7. Tool implementation
> TODO: Jira / Azure DevOps how-to (see [04-tooling-labs.md](../04-tooling-labs.md)).

## 8. Metrics & gates touched
B5 G5; E14 risk re-assessment; F19 audits

## 9. References
- TMMi: 2.4 SP1.4, SP4.1; GP2.6 (configuration management)
- CTFL v4.0 §5.4 (configuration management); ITIL 4 Change Enablement
- Source guide: `sources/B6/` *(pending)*

## 10. Exercise & evidence
> TODO: hands-on task on the running case + the TMMi evidence it produces.

## 11. Senior vs Manager takeaway
> TODO
