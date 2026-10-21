/**
 * Static project content.
 *
 * IMPORTANT: no numeric performance claims live in this file. Quantities that
 * would normally be "expected results" are either absent, or explicitly marked
 * as to-be-measured / illustrative. Prices are intentionally NOT included —
 * material costs must be entered by the user from local supplier quotes.
 */

export type CoolingMode = 'passive' | 'active';

export interface SystemComponent {
  id: string;
  name: string;
  mode: CoolingMode;
  tagline: string;
  mechanism: string;
  limitation: string;
}

export const systemComponents: SystemComponent[] = [
  {
    id: 'shading',
    name: 'Roof & overhang shading',
    mode: 'passive',
    tagline: 'Blocks solar heat before it enters the building envelope.',
    mechanism:
      'A projecting overhang, a lightweight shade structure or a reflective roof coating reduces the solar radiation absorbed by the roof surface. Less radiant heat enters the attic, so less reaches the occupied space. The benefit scales with the shading ratio and the solar altitude angle, and it is strongest for roofs that receive high direct sun.',
    limitation:
      'Shading alone does nothing at night and cannot remove heat that has already entered the building. Its effect is also strongly seasonal — near zero in winter when low-angle sun is desirable.',
  },
  {
    id: 'insulation',
    name: 'Roof insulation & ventilated cavity',
    mode: 'passive',
    tagline: 'Slows heat transfer and lets trapped air escape.',
    mechanism:
      'A reflective or insulated layer above the ceiling and a ventilated gap between the roof sheet and that layer reduce the rate of heat flow into the building. Air in the cavity is heated by the roof, becomes less dense and leaves through a high-level opening, so the cavity behaves as a buffer rather than a conductor.',
    limitation:
      'Insulation performance depends on continuity, moisture control and workmanship. A gap without a clear outlet path will not ventilate, and the effect is a steady-state rate change rather than instant cooling.',
  },
  {
    id: 'cross-ventilation',
    name: 'Cross ventilation',
    mode: 'passive',
    tagline: 'Uses wind and stack effect to flush warm air out.',
    mechanism:
      'Low-level inlets and high-level outlets on opposite walls create a pressure path driven by wind and by the buoyancy difference between indoor and outdoor air. Warm indoor air rises and leaves through the high opening while cooler air enters at low level.',
    limitation:
      'This only cools the space when the outdoor air is cooler than the indoor air. During hot, humid afternoons outdoor air can be warmer than the indoor air, in which case ventilation raises indoor temperature instead of lowering it. It also depends on local wind conditions and on openings that are actually usable (screened, unobstructed, controllable).',
  },
  {
    id: 'solar-fan',
    name: 'Solar-powered roof exhaust fan',
    mode: 'active',
    tagline: 'Drives air through the cavity and interior when passive paths are weak.',
    mechanism:
      'A small photovoltaic panel powers a DC fan that exhausts the roof cavity and, where configured, the interior air. The fan runs only when the generated power exceeds the draw, so it naturally operates during sunny hours. This is the only part of the concept that consumes electricity, and that electricity is generated on site.',
    limitation:
      'An active component needs sunlight and a battery or direct-drive wiring to work at night. Fan power, runtime and the resulting airflow must be measured — they cannot be assumed. If the fan is not present in the prototype, remove it from the analysis rather than describing it as built.',
  },
];

export interface ConceptStep {
  step: number;
  title: string;
  summary: string;
  detail: string;
}

export const coolingSteps: ConceptStep[] = [
  {
    step: 1,
    title: 'Stop the heat at the roof',
    summary: 'Shading and a reflective surface cut the solar load before it reaches the ceiling.',
    detail:
      'The roof is the largest sun-facing surface in most single-storey rural buildings. Reflective coating, a shade gap, or a projecting overhang reduces the radiant heat that would otherwise be conducted through the roof deck into the rooms below.',
  },
  {
    step: 2,
    title: 'Slow what gets through',
    summary: 'Insulation and a ventilated cavity reduce the rate of heat transfer.',
    detail:
      'A continuous insulation layer above the ceiling lowers the heat that reaches the interior. A ventilated cavity adds a second barrier: the air in the gap is heated, expands and is expelled through a high-level outlet.',
  },
  {
    step: 3,
    title: 'Flush the warm air out',
    summary: 'Cross ventilation removes accumulated heat when outdoor air is genuinely cooler.',
    detail:
      'Inlets near floor level and outlets near ceiling level create a natural flow path. The driving force is wind pressure difference and the stack effect. The team must check outdoor-versus-indoor conditions at the time of each test before claiming any cooling benefit.',
  },
  {
    step: 4,
    title: 'Assist when passive paths stall',
    summary: 'A solar-powered fan covers calm, still, or very hot periods.',
    detail:
      'When outdoor air is as warm as indoor air, or when there is no wind, passive ventilation loses its driving force. The optional solar fan adds mechanical extraction, powered from the same roof. Its power draw and runtime are measured and reported, not assumed.',
  },
];

export const problemStatements = [
  {
    title: 'Rural buildings overheat from solar gain',
    body: 'Single-storey houses and workshops with light metal or tiled roofs receive large amounts of direct solar radiation. During the hottest part of the day the indoor temperature can rise well above the outdoor temperature, because the roof converts solar radiation into heat that accumulates in the building.',
  },
  {
    title: 'The usual answer is an air conditioner',
    body: 'Cooling by air conditioning is effective but needs grid electricity, a capital cost and regular maintenance. In many rural locations the grid is distant, the connection is expensive or unavailable, and the running cost is a significant share of household income.',
  },
  {
    title: 'Cooling demand is rising faster than supply',
    body: 'Heat exposure in hot rural regions is a recognised public-health concern, and the number of people who need mechanical cooling is growing. Any reduction in cooling demand therefore also reduces the electricity that would otherwise have to be generated and delivered.',
  },
];

export const solutionStatements = [
  {
    title: 'Reduce the load first',
    body: 'The cheapest kilowatt-hour is the one never used. Shading, reflective roofs and insulation lower the heat that enters the building, and this part of the system costs little and needs no electricity.',
  },
  {
    title: 'Remove heat with air that is already there',
    body: 'Where the outdoor air is cooler than the indoor air, ventilation carries heat away at no running cost. This is entirely passive and depends on site layout, wind and opening design.',
  },
  {
    title: 'Add solar assistance for the remaining hours',
    body: 'A small photovoltaic fan covers the still, hot periods when passive airflow is weakest. The electricity comes from the same roof, so the operating cost approaches zero and the energy is generated where it is used.',
  },
];

export const sdgContributions = [
  {
    code: '7.1',
    title: 'Affordable and clean energy',
    body: 'The optional fan is powered by a photovoltaic panel on the roof, so the operating energy is produced on site rather than drawn from a grid that may be distant or unreliable.',
  },
  {
    code: '7.3',
    title: 'Energy efficiency',
    body: 'Reducing solar heat gain and improving air exchange lowers the energy a household would otherwise need for comfort. Any saving is claimed only against a baseline the user defines and justifies.',
  },
  {
    code: '7.a',
    title: 'International cooperation',
    body: 'The method, the measurement protocol and the open source platform are published so that the same approach can be reproduced and improved in other regions and by other teams.',
  },
];

export const projectLimitations = [
  'Passive measures reduce heat gain; they cannot bring a room below the outdoor air temperature and they do not remove humidity. No claim of dehumidification is made.',
  'Ventilation only cools when outdoor air is cooler than indoor air. During hot, still, humid afternoons it can raise indoor temperature.',
  'Evaporative cooling is not part of this concept: it needs available water and low humidity, and neither can be assumed for every site.',
  'The prototype is a small-scale demonstrator. Results from one building, one climate and one season do not generalise to all rural housing.',
  'Costs vary by region, supplier and season. No price is published on this site; the team records its own quotes.',
  'Thermal comfort depends on humidity, radiant temperature, air speed and clothing, not on air temperature alone.',
];
