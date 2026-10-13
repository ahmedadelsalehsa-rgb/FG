# S1 · Side Topic · Test Environment & Test Data Management

| | |
|---|---|
| **Level** | Senior |
| **Status** | Skeleton: waiting for source guide |
| **TMMi** | 2.5 Test Environment |
| **Other references** | CTFL v4.0 §1.4 (test environment), §5.1 (planning) |
| **Source guide** | `sources/S1/` |
| **Related chapters** | [C7 Test Planning & Product/Project Risk Assessment](../C7-test-planning-risk-assessment.md) · [C8 Test Management Tool Setup (Jira / Azure DevOps)](../C8-test-management-tool-setup.md) · [D10 Test Design & Execution](../D10-test-design-execution.md) |

## 1. Story hook
The first build is ready, but the QA environment isn't. This side chapter covers how environments and data are requested, built, checked and kept stable.

## 2. Purpose & outcomes
After this chapter, the participant can:
- Specify environment requirements and readiness criteria
- Plan and manage test data (creation, masking, refresh)
- Handle environment incidents and availability KPIs

## 3. Concepts
Planned scope:
- Environment landscape (DEV / SIT / QA / UAT / Pre-prod / Prod)
- Environment requirements, booking and ownership (Infra/Ops interface)
- Environment readiness check / smoke (link to G3)
- Test data: sources, synthetic data, masking/anonymisation (privacy), refresh
- Environment incidents, availability KPI (K13)
- Service virtualisation / stubs

> TODO: write from source guide.

## 4. Process
> TODO: inputs → steps → outputs · entry / exit · RACI.

## 5. Rules / standards
> TODO: mandatory organisational rules (trace each one to the Test Policy).

## 6. Artifacts & templates
- Environment request & readiness checklist *(to create)*
- Test data specification *(to create)*

## 7. Tool implementation
> TODO: Jira / Azure DevOps how-to (see [04-tooling-labs.md](../../04-tooling-labs.md)).

## 8. Metrics & gates touched
B5 G3; E15 K13

## 9. References
- TMMi: 2.5 Test Environment
- CTFL v4.0 §1.4 (test environment), §5.1 (planning)
- Source guide: `sources/S1/` *(pending)*

## 10. Exercise & evidence
> TODO: hands-on task on the running case + the TMMi evidence it produces.

## 11. Senior vs Manager takeaway
> TODO
