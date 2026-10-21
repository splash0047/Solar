# SolarCool Rural

> **Development of a Low-Cost Solar-Assisted Passive Cooling System for Rural Houses and Workshops**  
> An educational, experimental, and decision-support web platform aligned with **UN SDG 7 (Affordable and Clean Energy)**.

---

## Overview

**SolarCool Rural** is a zero-backend, client-side web application designed to evaluate, document, and analyze low-cost passive and solar-assisted cooling techniques for rural structures (tin-roof workshops, agricultural sheds, and brick/mud dwellings).

The platform emphasizes **scientific rigor and transparency**:
- **No simulated or fabricated telemetry:** Experimental results come directly from user-entered or CSV-imported measurements stored in your browser via IndexedDB.
- **Strict separation of illustrative data:** Sample datasets are explicitly tagged and isolated from actual experimental evidence.
- **Accurate physical & financial formulas:** Paired temperature reductions, transparent wattage-to-kilowatt conversions, and sensitivity scenario comparisons.

---

## What the Platform Showcases

| Section / Route | Purpose & Key Features |
|---|---|
| **Home (`/`)** | Conceptual foundation, heat-stress challenges in rural roofing, the 4-step passive cooling stack, UN SDG 7 targets, and physical boundaries/limitations. |
| **System (`/system`)** | Interactive architectural cross-section diagram with selectable hotspots detailing each envelope layer: radiant roof barrier, ventilated cavity, solar chimney/exhaust, and shaded earth-chilled air intake. Clearly delineates **Passive** components from **Active** (solar-powered fan) equipment. |
| **Experimental Dashboard (`/dashboard`)** | Full session and measurement logging backed by IndexedDB. Displays paired temperature reduction metrics (`Baseline Indoor − System Indoor`), interactive time-series charts (via Recharts), and full CSV import/export with row-by-row validation. |
| **Cost & Payback Calculator (`/calculator`)** | Financial and energy payback analysis based on user-entered appliance wattage, operational schedule, and local electricity tariffs. Includes an editable Bill of Materials (BOM) and sensitivity scenario modeling (Best, Base, Worst case). |
| **Implementation Guide (`/guide`)** | Practical phased construction sequence, maintenance and inspection checklists, material specifications, site suitability requirements, and roof/electrical safety rules. |
| **Research Methodology (`/research`)** | Rigorous scientific testing protocol, sensor placement specifications (shading, heights, calibrated loggers), uncertainty factors, peer literature references, and a print/PDF-ready report stylesheet. |

---

## Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/splash0047/Solar.git
cd Solar

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Verification & Available Scripts

The project includes an automated test and verification suite:

```bash
# Run ESLint across all files
npm run lint

# Run strict TypeScript typechecking
npm run typecheck

# Run unit tests with Vitest (repository, energy math, CSV parser, statistics)
npm run test

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Run Playwright End-to-End browser tests
npm run e2e
```

---

## Step-by-Step Usage Guide & Example Values

### 1. Understanding the Cross-Section (`/system`)
- Click on any numbered hotspot on the house diagram (1 to 5) or select a card below.
- Learn the distinction between **Passive** cooling (e.g., reflective radiant barrier, continuous ridge vents) and **Active** cooling (e.g., 12V 18W solar exhaust fan).

---

### 2. Recording & Importing Field Data (`/dashboard`)

#### A. Loading Sample Data
If you don't have sensor hardware yet, click **"Load illustrative sample"** on `/dashboard`. This loads a clearly badged demo dataset (`isIllustrative: true`) to explore charts and summaries without polluting real research records.

#### B. Entering Your Own Measurements
1. Under **"Experiment sessions"**, click **"New session"**.
2. Enter your site metadata:
   - **Title:** `Workshop Block A - Tin Roof Test`
   - **Location:** `Nagpur District, Maharashtra`
   - **Configuration:** `Under-roof foil + 100mm air gap + solar fan ON`
   - **Sensor details:** `DHT22 / DS18B20 at 1.2m breathing height, shielded from radiation`
3. Enter paired readings throughout the day:
   - **Outdoor Temperature (°C):** e.g. `38.5`
   - **Baseline Indoor (°C):** e.g. `41.2` (measured in an uncooled control room)
   - **System Indoor (°C):** e.g. `34.8` (measured in the cooled space)
   - *(Optional)* Relative humidity (`%`), Solar irradiance (`W/m²`), Fan power (`W`).
4. The dashboard calculates:
   $$\text{Paired Reduction} = \text{Baseline Indoor} - \text{System Indoor} = 41.2 - 34.8 = 6.4\ ^\circ\text{C}$$
   along with observation counts and excluded row counts.

#### C. CSV Import & Export Format
You can bulk upload logger data using CSV. Headers must use explicit units:
```csv
timestamp_ISO,outdoorTemperature_C,baselineIndoorTemperature_C,systemIndoorTemperature_C,relativeHumidity_percent,solarIrradiance_W_m2,fanPower_W
2024-05-12T08:00:00.000Z,31.2,33.8,32.4,48,420,
2024-05-12T10:00:00.000Z,34.6,37.1,35.2,42,710,18
2024-05-12T12:00:00.000Z,37.4,40.2,37.9,36,890,18
```
*Note: Timestamps must adhere to ISO-8601 (`YYYY-MM-DDTHH:mm:ssZ`). Missing values in required columns are reported with exact row numbers and never coerced to 0.*

---

### 3. Calculating Cost & Energy Payback (`/calculator`)

#### Where to get your input values:
1. **Baseline Power (W):**
   - Check the nameplate rating or power meter of the existing electric cooling equipment (e.g., standard ceiling fan: `75 W`, desert air cooler: `200 W`, or small 1-ton window AC: `1200 W`).
2. **Proposed Power (W):**
   - For a purely passive design: `0 W`.
   - If using a solar exhaust fan: `18 W` to `35 W`.
3. **Daily Operating Hours & Days:**
   - Hot season runtime (e.g., `8 hours/day` for `180 days/year`).
4. **Electricity Tariff (INR / kWh):**
   - Check your local utility bill (e.g., standard rural slab: `₹6.50 – ₹8.00 / kWh`).
5. **Bill of Materials (BOM):**
   - Enter local market quotes for materials (double-sided reflective bubble foil, bamboo purlins, wire mesh, fasteners).

#### Example Calculation:
- **Baseline Load:** `200 W` (Desert cooler)
- **Proposed Load:** `18 W` (Solar-assisted DC fan)
- **Usage:** `8 hours/day` × `180 days/year` = `1,440 hours`
- **Avoided Consumption:**
  $$(200\text{ W} - 18\text{ W}) \div 1000 \times 1,440\text{ h} = 262.08\text{ kWh/year}$$
- **Tariff:** `₹7.50 / kWh`
- **Annual Savings:** $262.08 \times 7.50 = \text{₹1,965.60 / year}$
- **Incremental Investment:** `₹4,200`
- **Simple Payback:**
  $$\frac{\text{Incremental Cost}}{\text{Annual Savings}} = \frac{4200}{1965.60} \approx 2.14\text{ years}$$

---

### 4. Following Field Protocols (`/research`)
- Consult the **Sensor Placement Guide** before installing loggers:
  - Minimum 1.2 m height above floor (breathing zone).
  - Minimum 1.0 m away from exterior walls and doors.
  - Outdoor sensors must have ventilated white radiation shields.
- Use **"Print or save as PDF"** at the top right of `/research` to generate a standardized print report for project advisors or documentation.

---

## Tech Stack

- **Framework:** React 19 + TypeScript (Strict)
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **UI Components:** Custom accessible components following shadcn/ui patterns
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **Local Database:** Dexie.js (IndexedDB)
- **Form & Validation:** React Hook Form + Zod v4
- **CSV Engine:** Papa Parse
- **Testing:** Vitest (unit & integration) + Playwright (end-to-end browser tests)

---

## License

Developed under the educational and open research initiative for UN SDG 7. All source code is open for academic and community implementation.
