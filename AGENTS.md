# AGENTS.md — SolarCool Rural

You are the lead software engineer responsible for delivering **SolarCool Rural**, a production-quality
educational and experimental platform for the project *"Development of a Low-Cost Solar-Assisted Passive
Cooling System for Rural Houses and Workshops"*, aligned with UN SDG 7.

## 0. Non-negotiable rules

1. **Never fabricate scientific results.** No invented temperature reductions, energy savings, prices,
   citations, sensor readings, test outcomes, or statistics. Every quantitative claim on a public page
   must be either (a) derived from user-recorded data stored in the app, or (b) explicitly labelled as
   *illustrative / conceptual / to be measured*.
2. **No fake live data.** No simulated ESP32 feed, no random sensor stream, no "connected" badge that
   reads from a generator. If a demonstration dataset is offered it must live in a separate namespace
   (`isIllustrative: true`), be visibly badged in the UI, and be resettable.
3. **No silent fallbacks.** Malformed CSV rows, invalid numbers, missing fields → explicit errors with
   the affected row numbers. Never coerce an invalid value to `0`.
4. **Units are explicit and consistent.** W → kW conversion happens exactly once, at the boundary.
   Minutes → hours likewise. Every field name carries its unit suffix (`...W`, `...KWh`, `...C`, `...Percent`).
5. **Passive vs active is always distinguished.** A passive system does not replace an AC unit; savings
   claims against a baseline require an explicitly justified, user-editable baseline.
6. **All visible controls work.** No dead links, no placeholder buttons, no `href="#"`.
7. **Assumptions are visible.** Every projection states the assumptions it rests on.

## 1. Stack

| Concern        | Choice                                     |
| -------------- | ------------------------------------------ |
| Build          | Vite                                       |
| UI             | React + TypeScript (strict)                 |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite`)       |
| Components     | shadcn/ui conventions (hand-rolled, local)  |
| Routing        | React Router                               |
| Charts         | Recharts                                   |
| Icons          | Lucide React (never emoji in UI chrome)    |
| Animation      | Motion (`motion/react`)                    |
| Forms          | React Hook Form + Zod                      |
| Dates          | date-fns                                   |
| CSV            | Papa Parse                                 |
| Persistence    | Dexie (IndexedDB)                          |
| Unit tests     | Vitest + React Testing Library             |
| E2E            | Playwright                                 |
| Lint / types   | ESLint + `tsc --noEmit`                    |

Reuse existing compatible dependencies. **Do not add a backend, authentication, paid APIs, or IoT
simulation to the MVP.**

## 2. Visual system

| Token    | Hex       | Use                          |
| -------- | --------- | ---------------------------- |
| Ivory    | `#F7F5EE` | Page background              |
| Forest   | `#244B3B` | Primary, headings, nav       |
| Sage     | `#A8BE9A` | Secondary surfaces, accents  |
| Solar    | `#E9A94B` | Highlights, CTAs, data       |
| Charcoal | `#252D2A` | Body text                    |

- Headings: **Manrope**. Body: **Inter**. Self-host via `@fontsource` (no runtime CDN dependency).
- Restrained palette, generous whitespace, thin borders, subtle shadows. Rounded cards used sparingly.
- Respect `prefers-reduced-motion`. Visible keyboard focus. Accessible contrast.
- Conceptual illustrations must be labelled *conceptual*. No AI-generated imagery presented as a photo
  of a real prototype.
- Light theme is the priority. Dark theme only if it is consistent throughout.

## 3. Pages

| Route        | Purpose                                                          |
| ------------ | ---------------------------------------------------------------- |
| `/`          | Home — hero, problem/solution, 4-step concept, SDG 7, limitations |
| `/system`    | How it works — interactive cross-section diagram, components      |
| `/dashboard` | Experimental data — sessions, measurements, charts, CSV I/O       |
| `/calculator`| Cost & savings — pure calculation core, scenarios, payback        |
| `/guide`     | Implementation guide — materials, sequence, maintenance, safety  |
| `/research`  | Methodology — protocol, uncertainty, references, printable report |

## 4. Data model (typed, repository-backed)

- `ExperimentSession`: `id, title, date, locationLabel, configuration, sensorDetails, notes,
  isIllustrative, createdAt, updatedAt`
- `Measurement`: `id, sessionId, timestamp, outdoorTemperatureC, baselineIndoorTemperatureC,
  systemIndoorTemperatureC, relativeHumidityPercent?, solarIrradianceWm2?, fanPowerW?`
- `CostConfiguration`: materials[], installationCost, baselinePowerW, proposedPowerW,
  operatingHoursPerDay, operatingDaysPerYear, electricityTariffPerKWh, incrementalCost

ISO timestamps. Zod schemas validate every write path and every imported CSV row.

## 5. Required formulas

| Metric                        | Formula                                          |
| ----------------------------- | ------------------------------------------------ |
| Indoor temperature reduction | `baselineIndoorTemperatureC − systemIndoorTemperatureC` (paired, per row) |
| Indoor − outdoor difference    | `indoorTemperatureC − outdoorTemperatureC`        |
| Electrical energy consumed   | `powerKW × operatingHours`                        |
| Annual energy savings        | `baselineAnnualKWh − proposedAnnualKWh`          |
| Annual cost savings          | `annualEnergySavingsKWh × tariffPerKWh`          |
| Simple payback               | `incrementalCost ÷ annualCostSavings` (only if both > 0) |

Mean paired difference must be computed from the **same rows**, never by subtracting averages taken
from unrelated periods. Report the count of observations behind every average, and state how many rows
were excluded and why.

## 6. Workflow rules

1. Inspect the repository before modifying files.
2. Implement **one phase at a time**. Do not generate the whole application in one pass.
3. After every meaningful change run: `npm run lint`, `npm run typecheck`, `npm run test`,
   `npm run build`. Fix failures before adding features.
4. Report changed files, commands run, test outcomes, and unresolved issues.
5. Never claim a test passed unless it was actually executed. Never claim a build succeeded without
   running it.
6. Commit a working version to git before starting a risky phase. Only commit when explicitly asked.

## 7. Definition of done

- All six pages share one design system; mobile nav and all internal links work.
- Measurements can be created, edited, deleted; records survive refresh.
- Charts reflect only the selected session's data.
- CSV import validates per row; export preserves units and timestamps.
- Paired temperature comparisons are correct; energy units are consistent.
- Savings/payback disclose assumptions; illustrative data is visually separated from real records.
- `tsc --noEmit`, lint, unit tests, production build, and E2E all pass.
- No console errors, broken images, dead links, or unused dependencies.
