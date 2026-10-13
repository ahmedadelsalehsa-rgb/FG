# D12 · Regression Testing (Automation)

| | |
|---|---|
| **Level** | Senior |
| **Tailoring** | Core / Elective by role (see TAILORING.md) |
| **Status** | Skeleton: waiting for source guide |
| **TMMi** | 2.4 (test implementation & execution); 3.3 (integrated lifecycle) |
| **Other references** | CTFL v4.0 §2.2.3 (confirmation & regression testing), §5.1.6 (test pyramid), §2.1.4 (DevOps), §6.2 (automation benefits & risks) |
| **Source guide** | `sources/D12/` |
| **Related chapters** | [B2 Test Strategy (incl. Risk-Based Approach & Quality Attributes)](B2-test-strategy.md) · [B3 Test Lifecycle & Integration with SDLC / Agile](B3-test-lifecycle-integration.md) · [B4 Quality Gates](B4-quality-gates.md) · [D10 Test Design & Execution](D10-test-design-execution.md) · [M11 Innovation & Pilots](../managerial/M11-innovation-pilots.md) |

## 1. Story hook
Every new build risks breaking what already worked. The team builds a risk-based regression suite, decides what to automate, and runs it as a gate in the pipeline.

## 2. Purpose & outcomes
After this chapter, the participant can:
- Build and maintain a risk-based regression suite
- Select regression scope after a change (impact analysis)
- Decide what to automate using the test pyramid and ROI
- Run automated regression as a pipeline quality gate

## 3. Concepts
Planned scope:
- Confirmation (re-test) vs regression testing
- Regression suite design: core / risk-based / change-based selection
- Regression scope from change impact analysis (link to B5)
- Test pyramid and automation candidates
- Automation framework and standards (overview)
- Automated regression in the CI/CD pipeline as G3/G4 checks
- Flaky test management and suite maintenance
- Regression & automation KPIs: coverage, pass rate, flakiness, execution time, ROI

> TODO: write from source guide.

## 4. Process
> TODO: inputs → steps → outputs · entry / exit · RACI.

## 5. Rules / standards
> TODO: mandatory organisational rules (trace each one to the Test Policy).

## 6. Artifacts & templates
- Regression suite definition *(to create)*
- Automation candidate checklist *(to create)*
- Pipeline gate definition *(to create)*

## 7. Tool implementation
> TODO: Jira / Azure DevOps how-to (see [04-tooling-labs.md](../04-tooling-labs.md)).

## 8. Metrics & gates touched
B4 G3/G4 automated checks

## 9. References
- TMMi: 2.4 (test implementation & execution); 3.3 (integrated lifecycle)
- CTFL v4.0 §2.2.3 (confirmation & regression testing), §5.1.6 (test pyramid), §2.1.4 (DevOps), §6.2 (automation benefits & risks)
- Source guide: `sources/D12/` *(pending)*

## 10. Exercise & evidence
> TODO: hands-on task on the running case + the TMMi evidence it produces.

## 11. Senior vs Manager takeaway
> TODO
