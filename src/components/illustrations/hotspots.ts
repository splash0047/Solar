export interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
}

/** Hotspot positions in the 820 x 520 viewBox of the cross-section. */
export const HOTSPOTS: Hotspot[] = [
  { id: 'shading', x: 214, y: 186, label: 'Roof shading' },
  { id: 'insulation', x: 400, y: 128, label: 'Insulated cavity' },
  { id: 'cross-ventilation', x: 648, y: 322, label: 'Cross ventilation' },
  { id: 'solar-fan', x: 585, y: 168, label: 'Solar fan' },
];
