/**
 * Implementation guidance content.
 *
 * Material prices are deliberately excluded. `unit` describes what must be
 * purchased; the price must come from the team's own local supplier quotes and
 * is entered in the calculator.
 */

export interface MaterialItem {
  id: string;
  name: string;
  specification: string;
  unit: string;
  /** Why this material is in the build. */
  purpose: string;
  passive: boolean;
}

export const materialList: MaterialItem[] = [
  {
    id: 'shade-structure',
    name: 'Roof shade structure',
    specification:
      'Timber or light-gauge-steel frame with a locally available shade cloth, or a corrugated overhang extension sized for the solar altitude.',
    unit: 'linear metre',
    purpose:
      'Intercepts direct sun before it reaches the roof sheet. Sized from the local solar altitude so that the sun is shaded at the hottest hours of the year.',
    passive: true,
  },
  {
    id: 'reflective-coating',
    name: 'Roof reflective coating',
    specification:
      'White or aluminium-pigmented, exterior-grade, UV-stable roof coating applied over the existing roof sheet.',
    unit: 'square metre',
    purpose:
      'Raises the roof surface solar reflectance so less radiation is converted into heat inside the building.',
    passive: true,
  },
  {
    id: 'insulation',
    name: 'Roof insulation',
    specification:
      'Low-density insulation board or a foil-faced blanket sized to sit continuously above the ceiling, free of thermal bridges.',
    unit: 'square metre',
    purpose:
      'Lowers the rate of heat flow through the roof, which is the dominant heat path in an uninsulated single-storey building.',
    passive: true,
  },
  {
    id: 'cavity-duct',
    name: 'Cavity duct and outlet',
    specification:
      'Sheet-metal or PVC ducting connecting the roof cavity to a high-level, externally vented outlet protected by insect mesh.',
    unit: 'metre',
    purpose:
      'Gives the heated cavity air a clear escape path so the cavity ventilates instead of acting as a solid conductive layer.',
    passive: true,
  },
  {
    id: 'louvers',
    name: 'Louvered openings and mesh',
    specification:
      'Louvered high-level outlet, low-level inlet, galvanised insect mesh sized for local insects, and hardware for permanent fixing.',
    unit: 'set',
    purpose:
      'Creates a controllable ventilation path that excludes insects and rain while allowing air movement.',
    passive: true,
  },
  {
    id: 'pv-panel',
    name: 'Photovoltaic panel',
    specification:
      'Small panel sized to the measured fan power draw with margin, mounted with an appropriate tilt and cable routing.',
    unit: 'unit',
    purpose:
      'Generates the electricity for the exhaust fan so the active component does not depend on the grid.',
    passive: false,
  },
  {
    id: 'dc-fan',
    name: 'DC exhaust fan',
    specification:
      'Low-voltage brushless fan rated for the required airflow, with a controller that only runs the fan when generated power is sufficient.',
    unit: 'unit',
    purpose:
      'Provides mechanical extraction during still conditions when passive airflow is weakest.',
    passive: false,
  },
  {
    id: 'battery',
    name: 'Battery and charge controller',
    specification:
      'Small rechargeable battery with a charge controller matched to the panel and load.',
    unit: 'unit',
    purpose:
      'Stores surplus daytime generation so the fan can run into the early evening if required.',
    passive: false,
  },
  {
    id: 'sensors',
    name: 'Temperature and humidity sensors',
    specification:
      'Calibrated sensors with a documented accuracy figure, plus a logging device that stores timestamped readings.',
    unit: 'unit',
    purpose:
      'Provides the paired baseline and system temperature readings that the experimental protocol depends on.',
    passive: false,
  },
  {
    id: 'mounting',
    name: 'Fixings, sealants and flashings',
    specification:
      'Corrosion-appropriate fixings, flashing tape, sealant and gaskets for every roof penetration made by the build.',
    unit: 'lot',
    purpose:
      'Weather-seals roof penetrations. Unsealed penetrations are a common cause of water ingress after a roof retrofit.',
    passive: true,
  },
];

export interface ConstructionStep {
  phase: string;
  title: string;
  detail: string;
  checks: string[];
}

export const constructionSequence: ConstructionStep[] = [
  {
    phase: 'Phase 1',
    title: 'Survey and baseline',
    detail:
      'Record the building geometry, orientation, roof construction, existing openings, shading from neighbouring structures and trees, and the indoor comfort complaint that motivates the project. Install the measurement sensors and collect baseline readings before any retrofit is carried out.',
    checks: [
      'Sensor accuracy figures and calibration date recorded.',
      'Baseline readings cover at least a full clear-sky day.',
      'Building orientation and neighbouring obstructions documented with photographs.',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Envelope preparation',
    detail:
      'Repair the existing roof sheet, replace damaged or corroded panels, and remove any material that would obstruct airflow in the cavity. This work must be complete before the cavity is closed off, otherwise the ventilation path cannot be inspected later.',
    checks: [
      'Roof is watertight before new layers are added.',
      'Cavity path is clear and the outlet is unobstructed.',
      'Existing roof penetrations are identified and recorded.',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Shading and reflective layer',
    detail:
      'Install the shade structure at the designed overhang depth and fix the reflective coating onto a clean, dry roof sheet. Apply the coating in the manufacturer\'s specified coverage and allow it to cure before the insulation is placed.',
    checks: [
      'Shade is checked against the solar altitude at the hottest hours.',
      'Coating coverage matches the specification and no bare metal is exposed.',
      'All fixings are corrosion-appropriate for the material.',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Insulation and ventilated cavity',
    detail:
      'Fit the insulation continuously above the ceiling, sealing junctions and any service penetrations with a vapour-closed tape or appropriate sealant. Install the cavity framing and outlet duct so the warm cavity air has an unobstructed path to the outside.',
    checks: [
      'No gaps or compression in the insulation layer.',
      'Outlet duct is sealed and free of kinks.',
      'Insect mesh is fitted to the outlet before it is closed.',
    ],
  },
  {
    phase: 'Phase 5',
    title: 'Openings and ventilation',
    detail:
      'Cut and fit the low-level inlets and high-level outlets, ensuring that each opening can be closed at night for security and against insects. Fit louvres and mesh and confirm that the openings can be operated from inside.',
    checks: [
      'Openings are reachable and operable from inside the space.',
      'No direct path for rain into the building.',
      'Mesh is fixed and will not detach in wind.',
    ],
  },
  {
    phase: 'Phase 6',
    title: 'Active components (optional)',
    detail:
      'If the solar fan is part of the build, mount the panel clear of the roof shade, run the cables so they are protected from UV and abrasion, and mount the fan in the cavity or duct with a short, straight airflow path. Commission the controller so the fan does not run below its minimum supply voltage.',
    checks: [
      'Panel is not shaded by the structure it is mounted on.',
      'All cable entries are sealed.',
      'Fan power draw is measured with a meter, not estimated.',
    ],
  },
  {
    phase: 'Phase 7',
    title: 'Verification',
    detail:
      'Run the full test protocol on the retrofitted building, using the same sensor placement, the same sampling interval and the same time-of-day windows as the baseline. Record the conditions so that each comparison is like-for-like.',
    checks: [
      'Same sensor positions and same logging interval as the baseline.',
      'Test windows match the baseline windows.',
      'Weather conditions recorded for every test day.',
    ],
  },
];

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
  frequency: string;
}

export const maintenanceChecklist: ChecklistItem[] = [
  {
    id: 'inspect-roof',
    title: 'Inspect roof surface and coating',
    detail:
      'Look for coating loss, corrosion, loose fixings and water ingress. Touch up coating loss early; a degraded reflective surface loses most of its benefit.',
    frequency: 'Every 3 months, and after every heavy storm',
  },
  {
    id: 'inspect-insulation',
    title: 'Check insulation and cavity',
    detail:
      'Confirm that insulation has not settled or been displaced and that the cavity is still open along its full path. A blocked cavity silently turns the design into a solid conductive layer.',
    frequency: 'Every 6 months',
  },
  {
    id: 'clean-openings',
    title: 'Clean and clear openings',
    detail:
      'Remove dust, cobwebs, leaves and insects from the louvres and mesh. Blocked openings silently end the ventilation path.',
    frequency: 'Every 2 months',
  },
  {
    id: 'inspect-fan',
    title: 'Check fan and panel',
    detail:
      'Confirm the fan spins freely, the panel face is clean and free of bird droppings, and the cable insulation is not damaged by UV.',
    frequency: 'Every 3 months',
  },
  {
    id: 'calibrate-sensors',
    title: 'Calibrate and re-site sensors',
    detail:
      'Compare every sensor against a reference thermometer, note any drift, and confirm that sensors have not been moved or shaded since the last test.',
    frequency: 'Before every test campaign',
  },
  {
    id: 'check-infiltration',
    title: 'Check seals and security',
    detail:
      'Verify that closing panels at night does not leave the building unsecured, and that no gap has opened around new penetrations.',
    frequency: 'Every 6 months',
  },
];

export const safetyConsiderations = [
  {
    title: 'Working at height',
    body: 'All roof work must use a stable platform or ladder with a securing arrangement, and must not be attempted in strong winds or during rain. Where the roof pitch or height exceeds safe practice, a scaffold or a qualified installer is required.',
  },
  {
    title: 'Electrical safety',
    body: 'Photovoltaic wiring is live whenever the panel is illuminated. Isolate the battery and cover the panel before working on the fan circuit, and never work on the wiring in wet conditions.',
  },
  {
    title: 'Structural loading',
    body: 'The shade structure, the panel and the cavity framing add load to the roof. For a lightweight metal roof, the local span and fastener pull-out capacity must be checked before the retrofit.',
  },
  {
    title: 'Heat, dust and sun exposure',
    body: 'The test environment is itself hazardous: roof surfaces reach high temperatures, and heat stress during a full-day test is a real risk. Water, rest breaks and a shaded working area are required.',
  },
  {
    title: 'Water and sanitation',
    body: 'Low-level inlets close off part of the wall, and the mesh and gaskets are potential ingress paths. Every opening must be checked after the first heavy rain.',
  },
  {
    title: 'Data and electrical faults',
    body: 'Low-voltage PV systems are low risk, but battery terminals must be protected, and all logger wiring should be routed away from standing water.',
  },
];

export const suitabilityNotes = [
  {
    title: 'Best suited to',
    body: 'Single-storey homes and workshops with a shallow or single-pitch roof, low thermal mass, and rooms that can be cross-ventilated through opposite walls.',
  },
  {
    title: 'Needs adaptation',
    body: 'Multi-storey buildings, internal partitions that block a cross-ventilation path, and rooms with only one external wall.',
  },
  {
    title: 'Poor candidates',
    body: 'Damp, humid climates with high night-time temperatures, densely shaded sites, and any situation where indoor humidity is already high enough for mould risk.',
  },
];
