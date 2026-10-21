/**
 * Research / methodology content.
 *
 * The recorded figures quoted below are the *procedure*, not the outcome. Any
 * result published later must come from the dashboard's stored measurements.
 */

export const researchQuestion =
  'To what extent can a low-cost combination of roof shading, roof insulation with a ventilated cavity, cross ventilation and an optional solar-powered exhaust fan reduce indoor temperature in a rural house or workshop, and under what conditions?';

export const objectives = [
  {
    title: 'Quantify paired indoor temperature difference',
    body: 'Measure baseline and retrofitted indoor temperatures at matched timestamps so the comparison is made from the same rows, not from averages of unrelated periods.',
  },
  {
    title: 'Establish the conditions under which the system works',
    body: 'Relate the measured difference to outdoor temperature, relative humidity and solar irradiance, so the team can state where and when the system is effective and where it is not.',
  },
  {
    title: 'Separate passive from active contributions',
    body: 'Record which features were installed and in which configuration, and document the fan power and runtime when the active component is used, so passive and assisted results are never conflated.',
  },
  {
    title: 'Estimate energy and cost implications transparently',
    body: 'Compare the electrical energy of the proposed arrangement against an explicitly stated baseline, with every assumption recorded alongside the result.',
  },
  {
    title: 'Document a reproducible protocol',
    body: 'Publish the measurement procedure so another team can repeat the study and compare results on equal terms.',
  },
];

export const protocolSteps = [
  {
    step: 1,
    title: 'Define and record the baseline condition',
    body: 'Before any retrofit, document the existing building: orientation, roof material, insulation status, openings, glazing and adjacent shading. Photograph the site. Record a full baseline test day under clear conditions.',
  },
  {
    step: 2,
    title: 'Install and document the sensors',
    body: 'Use sensors with a stated accuracy figure. Record the manufacturer, model, accuracy, calibration date and the exact position of every sensor relative to the room. Photograph each position.',
  },
  {
    step: 3,
    title: 'Fix the sampling interval in advance',
    body: 'Choose one interval and use it for every test, baseline and retrofitted. A shorter interval is not automatically better; consistency matters more than density. Record the interval in the session metadata.',
  },
  {
    step: 4,
    title: 'Match the test conditions',
    body: 'Run baseline and system tests over the same time-of-day window and, where possible, on comparable weather days. Record outdoor temperature, humidity and irradiance for every session.',
  },
  {
    step: 5,
    title: 'Record the configuration actually in use',
    body: 'State which components were installed, which were open or closed during the test, and the fan power and runtime if the active component operated.',
  },
  {
    step: 6,
    title: 'Repeat, and do not cherry-pick',
    body: 'A single measurement cannot establish performance. Repeat each condition across multiple days, retain every row, and report the number of observations behind each average together with the number of rows excluded and why.',
  },
  {
    step: 7,
    title: 'Report uncertainty',
    body: 'State sensor accuracy, the measurement interval, the number of paired observations and the spread of the paired differences. Where the spread overlaps zero, say so plainly.',
  },
];

export const sensorPlacement = [
  {
    location: 'Baseline reference point',
    guidance:
      'A single fixed point in the occupied zone, away from direct sun, away from the wall, and at a documented height above the floor.',
  },
  {
    location: 'System reference point',
    guidance:
      'The same height and the same relationship to the room geometry, in the comparable test space. If baseline and system readings come from different rooms, that difference must be stated.',
  },
  {
    location: 'Outdoor point',
    guidance:
      'Shaded from direct sun and from the building, at roughly roof height, with air flowing past the sensor rather than trapped in a cavity.',
  },
  {
    location: 'Cavity point (if applicable)',
    guidance:
      'Inside the ventilated roof cavity to confirm that the cavity is actually moving air rather than acting as a sealed conduction path.',
  },
];

export const uncertaintyFactors = [
  {
    factor: 'Sensor accuracy',
    handling:
      'Use the manufacturer figure for each sensor and state it in the session metadata. A difference smaller than the combined accuracy of the two sensors is not evidence of a real effect.',
  },
  {
    factor: 'Sampling interval',
    handling:
      'A fast interval can flatter short-lived effects. Report the interval alongside every average so the reader can judge the resolution of the result.',
  },
  {
    factor: 'Observer placement',
    handling:
      'A sensor placed near a hot wall, in a sunbeam, or beside a heat source will not represent the room. Fix the position and document it.',
  },
  {
    factor: 'Test-to-test variation',
    handling:
      'Weather, occupancy and door opening change results between sessions. Run repeated tests and report the spread, not only the mean.',
  },
  {
    factor: 'Small sample size',
    handling:
      'Report the observation count next to every average. Where the count is small, describe the result as an indication rather than a measurement.',
  },
];

export interface Reference {
  id: string;
  label: string;
  organisation: string;
  url: string;
  usedFor: string;
}

export const references: Reference[] = [
  {
    id: 'sdg7',
    label: 'Goal 7: Affordable and Clean Energy',
    organisation: 'United Nations',
    url: 'https://sdgs.un.org/goals/goal7',
    usedFor: 'The SDG 7 framing used across this project.',
  },
  {
    id: 'who-heat',
    label: 'Climate change, heat and health',
    organisation: 'World Health Organization',
    url: 'https://www.who.int/news-room/fact-sheets/detail/climate-change-heat-and-health',
    usedFor: 'Health framing for heat exposure in the problem statement.',
  },
  {
    id: 'ipcc-cities',
    label: 'Chapter 6 — Cities, Settlements and Key Infrastructure',
    organisation: 'IPCC AR6 Working Group II',
    url: 'https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-6/',
    usedFor: 'Urban heat, passive design and the passive-vs-active framing.',
  },
  {
    id: 'unep-cooling',
    label: 'Global Cooling Watch',
    organisation: 'United Nations Environment Programme',
    url: 'https://www.unep.org/resources/report/global-cooling-watch-2023',
    usedFor: 'Cooling demand growth and the electricity argument.',
  },
  {
    id: 'iea-cooling',
    label: 'Cooling',
    organisation: 'International Energy Agency',
    url: 'https://www.iea.org/energy-system/buildings/cooling',
    usedFor: 'The share of electricity used for cooling and the efficiency argument.',
  },
  {
    id: 'ashrae-handbook',
    label: 'ASHRAE Handbook — Fundamentals',
    organisation: 'ASHRAE',
    url: 'https://www.ashrae.org/technical-resources/ashrae-handbook',
    usedFor: 'Solar heat gain through the building envelope and shielding methods.',
  },
  {
    id: 'ashrae-55',
    label: 'Standard 55 — Thermal Environmental Conditions for Human Thermal Comfort',
    organisation: 'ASHRAE',
    url: 'https://www.ashrae.org/technical-resources/bookstore/standard-55-thermal-environmental-conditions-for-human-thermal-comfort',
    usedFor: 'Why air temperature alone does not define comfort.',
  },
  {
    id: 'iso-7730',
    label: 'ISO 7730 — Ergonomics of the thermal environment',
    organisation: 'International Organization for Standardization',
    url: 'https://www.iso.org/standard/39155.html',
    usedFor: 'Thermal comfort and acceptable indoor temperature methods.',
  },
  {
    id: 'cibse-tm59',
    label: 'TM59:2017 — Design methodology for the assessment of overheating risk in homes',
    organisation: 'CIBSE',
    url: 'https://www.cibse.org/knowledge-research/knowledge-portal/tm59-design-methodology-for-the-assessment-of-overheating-risk-in-homes',
    usedFor: 'Overheating assessment methodology for the residential case.',
  },
];

export const referenceCaveat =
  'These references are provided as the starting points for the project literature review. Each citation must be read and verified in its original form before it is included in the final submitted report; no page numbers, quotations or results have been reproduced here.';

export const dataProcessingNotes = [
  'Paired rows only. The mean indoor temperature reduction is computed row by row as baseline minus system, then averaged over the same rows.',
  'Rows missing either indoor temperature are excluded from the paired statistic and counted in the exclusion report, with the reason.',
  'Outdoor temperature is used for context and for the indoor-minus-outdoor difference, never as a substitute for a missing indoor reading.',
  'Optional fields (humidity, irradiance, fan power) stay empty when they were not measured; they are never filled with a default value.',
  'Every stored session records whether it is illustrative. Illustrative rows are excluded from any summary that is presented as experimental evidence.',
];
