# Risk Register

Scoring: Likelihood (L) 1–5 × Impact (I) 1–5 → Score. **High ≥ 15 · Medium 8–14 · Low ≤ 7**

| ID | Category (Product/Project) | Description | L | I | Score | Level | Response (Avoid/Mitigate/Transfer/Accept) | Test approach / mitigation | Linked tests | Owner | Trigger | Status | Last reviewed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-01 | Product | Incorrect VAT rounding on invoices | 3 | 5 | 15 | High | Mitigate | BVA + decision table on monetary fields; included in every regression | TC-101..TC-112 | Test Analyst | Any change to pricing module | Open | |
| R-02 | Project | Test environment instability | 4 | 3 | 12 | Medium | Mitigate | Daily env health check; backup env booked | — | Test Lead | Env down > 2h | Open | |

## Review history

| Date | Event (weekly / gate / CR / CAPA) | Changes made |
|---|---|---|
