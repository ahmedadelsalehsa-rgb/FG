# Fair Football Team Generator

A small web app for organising football games. Keep a reusable list of players with a rank (1 = strongest), pick who is playing today, and get fair, balanced teams in one click. Everything runs in the browser. There's no backend, no login and no API keys.

## Run it locally

Requires Node.js 18+ (tested with Node 22).

```bash
npm install
npm run dev        # start the dev server → http://localhost:5173
npm test           # unit tests for the balancing algorithm, storage and import/export
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

`dist/` is a static site (relative paths), so you can host it on any static host or open it from a sub-folder.

### Shared version (claude.ai Artifact)

```bash
npm run build:artifact   # → dist-artifact/fair-football.html (one self-contained file)
```

When this file is published as a claude.ai Artifact with the `db` capability, the player list is stored in the Artifact's shared database (collection `players`) and syncs live for everyone the page is shared with. Opened anywhere else, the app falls back to this browser's `localStorage`. Each person's team count and selected players stay in their own browser. See `src/platform.ts` and `src/hooks/usePlayers.ts`.

## Features

**Players page**
- **Add New Player** form with exactly two fields: Name (required) and Rank (required dropdown, 1–10).
- Table with name, rank and actions. You can change rank directly in the table, **Edit** both fields, or **Delete** a player after confirming.
- Names must be unique. The check ignores case and extra spaces, so "ahmed" is rejected if "Ahmed" exists.
- Search, rank filter, player count, and a rank-distribution chart (click a bar to filter by that rank).
- Saved automatically in `localStorage`. If the browser refuses to save (for example in private mode), a warning appears.
- **Export** to JSON or CSV. **Import** JSON or CSV: either *merge* (adds new names and updates ranks of existing ones) or *replace* the whole list. Invalid rows are skipped and listed.

**Sort Teams workflow**
1. Choose the number of teams: 2, 3, 4 or 5 (default 3).
2. Tick today's players. Includes search, Select All / Deselect All and a live selected count. You need at least 2 players per team; below that the app shows a validation message and the Generate button stays disabled.
3. **Generate Teams**. Nothing is generated until you click it.

**Results**
- Each team gets its own card (Team A, B, C…) showing player names and ranks, player count and total estimated strength.
- A strength comparison chart and a fairness summary showing the gap between the strongest and weakest team, in points and as a % of an average team.
- A note explaining that strength is an estimate based on ranks.
- **Copy Teams** copies clean text for WhatsApp or any chat. Ranks are left out so the message is friendly to share. **Share on WhatsApp**, **Regenerate Teams**, **Back to Player Selection**, **Start Over**.

## The balancing algorithm

Code: [`src/utils/teamBalancer.ts`](src/utils/teamBalancer.ts). Settings: [`src/config.ts`](src/config.ts).

### Strength score

All tuning lives in `config.ts`: `RANK_OPTIONS`, `STRENGTH_SCALE` and `rankToScore()`.

| Scale | Formula | Rank 1 → 10 | Notes |
|---|---|---|---|
| `linear` **(default)** | `10 × (11 − rank)` | 100, 90, 80 … 10 | Every rank step is worth the same. Two rank-6 players equal one rank-1. |
| `inverse` | `100 / rank` | 100, 50, 33 … 10 | Very steep at the top (rank 1 = 2× rank 2) and almost flat at the bottom (rank 9 vs 10 is only 1.1 apart). |
| `gentle` | `100 × 0.85^(rank−1)` | 100, 85, 72 … 23 | Halfway between the two. |

`100 / rank` was evaluated and **not** chosen as the default. It treats the gap between ranks 1 and 2 as 45 times bigger than the gap between ranks 9 and 10. That doesn't match how people use a 1–10 rating. The assumption behind `linear` is that ranks are evenly spaced levels of ability.

### Goals (in order)

1. **Team sizes differ by at most one** (hard constraint). With 10 players in 3 teams you get 4/3/3, with 12 you get 4/4/4.
2. **Equal total strength.** The cost is `(strongest − weakest) + 0.25 × standard deviation`.
3. **Every rank group is spread evenly.** Each team gets ⌊c/k⌋ or ⌈c/k⌉ of the *c* players with a given rank. Each player beyond an even spread adds a penalty equal to that player's score (`rankSpreadWeight = 1`). So two rank-1 players are never put together to save a few points. Two rank-10 players may share a team only if that removes a gap bigger than their own score.

### Search

The search is deterministic for a given seed.

1. It builds 24 starting arrangements:
   - a **snake draft** (A B C C B A …) of players sorted strongest first;
   - a **greedy** allocation, where each next-best player joins the weakest team that has room;
   - **random size-balanced** starts, for variety.

   Players with the same rank are put in a seeded random order, so ties are handled without bias.
2. Each start is improved by **local search**. It tries every swap of two players between teams, plus moves from a bigger team to a smaller one (this decides which team gets the extra player). It applies the best improvement and repeats until nothing improves. Costs are updated incrementally, so 60 players across 5 teams take only milliseconds.
3. It keeps the lowest-cost arrangement.

**Regenerate** uses a new seed and excludes the arrangement on screen. It picks a different arrangement that is equally fair (within 2 points of the best). Usually it re-deals players of the same rank between teams, so the fairness stays the same but the line-ups change.

### Tests

[`src/utils/teamBalancer.test.ts`](src/utils/teamBalancer.test.ts) covers every scenario from the brief:
- 9 players / 3 teams with three rank-1 players get one each;
- rank-2 and rank-3 groups are spread;
- 10 players → 4/3/3 and 12 players → 4/4/4;
- only selected players appear;
- fewer rank-1 players than teams, and more rank-1 players than teams;
- uneven distributions and all-equal ranks;
- a rank change changes the result;
- no duplicates or missing players across all team counts and many random squads;
- regeneration and determinism.

It also compares the balancer with two baselines over 40 random squads:

```
Average strength gap — optimised: 12.0, naive round-robin: 67.0, random: 109.3, best of 20 random: 34.8
```

[`src/utils/storage.test.ts`](src/utils/storage.test.ts) covers persistence across a simulated refresh, recovery from corrupted storage, and JSON/CSV import/export.

## Project structure

```
src/
  config.ts                 rank options, team counts, score mapping, balancer weights
  types.ts
  App.tsx                   navigation between Players and Sort Teams, toasts
  hooks/usePlayers.ts       player state + automatic localStorage persistence
  components/
    PlayerList.tsx          table, search/filter, stats, import/export
    PlayerForm.tsx          add/edit dialog (name + rank)
    SortTeams.tsx           workflow container
    TeamSelection.tsx       steps 1–3: team count, player checklist, generate
    TeamResults.tsx         team cards, comparison, fairness summary, actions
    Modal.tsx, RankBadge.tsx
  utils/
    teamBalancer.ts         the balancing algorithm + fairness summary
    storage.ts              localStorage load/save with validation
    importExport.ts         JSON/CSV parse, export, merge
    shareText.ts            WhatsApp-friendly text
    random.ts               seeded PRNG
```

Tech: React 19, TypeScript, Vite, Vitest. No runtime dependencies besides React.
