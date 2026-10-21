import * as React from 'react';
import { cn } from '@/lib/utils';
import { HOTSPOTS, type Hotspot } from './hotspots';

export type { Hotspot };

/**
 * Conceptual cross-section of a single-storey rural house fitted with the
 * SolarCool Rural concept.
 *
 * This is a SCHEMATIC, not a photograph and not a rendering of a built
 * prototype. It is labelled as conceptual wherever it appears.
 */

const AIRFLOW_DASH = '10 12';

export function HouseCrossSection({
  activeId = null,
  onSelect,
  className,
  showHotspots = true,
  idPrefix = 'hx',
}: {
  activeId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  showHotspots?: boolean;
  idPrefix?: string;
}) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const gid = (name: string) => `${idPrefix}-${uid}-${name}`;

  const interactive = typeof onSelect === 'function';

  const handleKey = (event: React.KeyboardEvent<SVGGElement>, id: string) => {
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(id);
    }
  };

  return (
    <svg
      viewBox="0 0 820 520"
      role="img"
      aria-labelledby={`${gid('title')} ${gid('desc')}`}
      className={cn('h-auto w-full', className)}
    >
      <title id={`${gid('title')}`}>
        Conceptual cross-section of a rural house with the SolarCool Rural
        cooling features
      </title>
      <desc id={`${gid('desc')}`}>
        Schematic diagram showing roof shading, an insulated ventilated roof
        cavity, cross ventilation between a low-level inlet and a high-level
        outlet, and an optional solar-powered exhaust fan in the roof cavity.
      </desc>

      <defs>
        <linearGradient id={gid('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBFAF5" />
          <stop offset="100%" stopColor="#DCE5D4" />
        </linearGradient>
        <linearGradient id={gid('cavity')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F5EE" />
          <stop offset="100%" stopColor="#EFEce0" />
        </linearGradient>
        <pattern
          id={gid('hatch')}
          width="8"
          height="8"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="8" stroke="#A8BE9A" strokeWidth="2.2" />
        </pattern>
        <pattern
          id={gid('hatchDark')}
          width="7"
          height="7"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke="#6c8360" strokeWidth="1.6" />
        </pattern>
        <marker
          id={gid('arrow')}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#C1803A" />
        </marker>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="820" height="472" fill={`url(#${gid('sky')})`} />

      {/* Sun */}
      <g opacity="0.9">
        <circle cx="96" cy="82" r="34" fill="#E9A94B" />
        <circle cx="96" cy="82" r="46" fill="#E9A94B" opacity="0.16" />
        <g stroke="#E9A94B" strokeWidth="3" strokeLinecap="round" opacity="0.75">
          <path d="M96 22v-12M96 154v12M36 82H24M168 82h-12M53 39l-9-9M148 134l9 9M148 39l9-9M53 134l-9 9" />
        </g>
      </g>

      {/* Ground */}
      <rect x="0" y="470" width="820" height="50" fill="#DCE5D4" />
      <path d="M0 470h820" stroke="#6c8360" strokeWidth="2" />

      {/* Shade structure band above the roof */}
      <path
        d="M108 226 L410 86 L712 226 L702 240 L410 100 L118 240 Z"
        fill={`url(#${gid('hatchDark')})`}
        opacity="0.55"
      />
      <path
        d="M108 226 L410 86 L712 226"
        fill="none"
        stroke="#244B3B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Roof sheet */}
      <path
        d="M120 254 L410 114 L700 254"
        fill="none"
        stroke="#244B3B"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Insulation band */}
      <path
        d="M154 268 L410 140 L666 268 L648 284 L410 158 L172 284 Z"
        fill="#DCE5D4"
        stroke="#6c8360"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M154 268 L410 140 L666 268 L648 284 L410 158 L172 284 Z"
        fill={`url(#${gid('hatch')})`}
        opacity="0.85"
      />

      {/* Cavity */}
      <path
        d="M172 284 L410 158 L648 284 L648 300 L172 300 Z"
        fill={`url(#${gid('cavity')})`}
        stroke="#cdc7b4"
        strokeWidth="1.2"
        strokeDasharray="5 4"
      />

      {/* Walls + interior */}
      <rect
        x="182"
        y="298"
        width="458"
        height="172"
        fill="#FDFCF7"
        stroke="#cdc7b4"
        strokeWidth="1.6"
      />
      {/* Interior floor */}
      <rect x="182" y="452" width="458" height="18" fill="#EFEce0" />
      <path d="M182 452h458" stroke="#cdc7b4" strokeWidth="1.2" />

      {/* Ceiling insulation */}
      <rect x="190" y="292" width="442" height="8" fill="#DCE5D4" />
      <rect x="190" y="292" width="442" height="8" fill={`url(#${gid('hatch')})`} />

      {/* Solar panel on the left roof slope */}
      <g transform="rotate(-25.6 300 156)">
        <rect
          x="258"
          y="149"
          width="84"
          height="14"
          rx="2"
          fill="#17302A"
          stroke="#0f211c"
          strokeWidth="1"
        />
        <g stroke="#4d6d5c" strokeWidth="0.9">
          <path d="M278 149v14M300 149v14M322 149v14" />
        </g>
      </g>
      <path
        d="M300 172 L300 190"
        stroke="#244B3B"
        strokeWidth="2"
        strokeDasharray="4 3"
        opacity="0.6"
      />

      {/* Fan + duct in the cavity */}
      <g>
        <rect
          x="576"
          y="196"
          width="18"
          height="58"
          fill="#FDFCF7"
          stroke="#cdc7b4"
          strokeWidth="1.2"
        />
        {/* exhaust stack */}
        <path
          d="M570 190 L600 190 L600 168 L570 168 Z"
          fill="#FDFCF7"
          stroke="#244B3B"
          strokeWidth="1.6"
        />
        <g stroke="#244B3B" strokeWidth="1.2" opacity="0.7">
          <path d="M572 176h26M572 182h26" />
        </g>
        {/* fan */}
        <g>
          <circle cx="470" cy="212" r="17" fill="#FDFCF7" stroke="#244B3B" strokeWidth="1.8" />
          <g className="animate-breathe" style={{ transformOrigin: '470px 212px' }}>
            <path
              d="M470 212 C470 202 476 196 484 196 C486 204 480 212 470 212 Z"
              fill="#E9A94B"
            />
            <path
              d="M470 212 C480 212 486 218 486 226 C478 228 470 222 470 212 Z"
              fill="#E9A94B"
            />
            <path
              d="M470 212 C470 222 464 228 456 228 C454 220 460 212 470 212 Z"
              fill="#E9A94B"
            />
          </g>
          <circle cx="470" cy="212" r="3.2" fill="#244B3B" />
        </g>
        {/* fan support */}
        <path d="M470 229 L470 246" stroke="#cdc7b4" strokeWidth="1.4" />
      </g>

      {/* Low-level inlet (left wall) */}
      <g>
        <rect x="174" y="418" width="16" height="32" fill="#FDFCF7" stroke="#244B3B" strokeWidth="1.6" />
        <g stroke="#244B3B" strokeWidth="1" opacity="0.55">
          <path d="M174 424h16M174 430h16M174 436h16M174 442h16" />
        </g>
      </g>

      {/* High-level outlet (right wall) */}
      <g>
        <rect x="634" y="306" width="16" height="36" fill="#FDFCF7" stroke="#244B3B" strokeWidth="1.6" />
        <g stroke="#244B3B" strokeWidth="1" opacity="0.55">
          <path d="M634 313h16M634 320h16M634 327h16M634 334h16" />
        </g>
      </g>

      {/* Cross-ventilation airflow */}
      <g>
        <path
          d="M176 434 C260 430 330 418 400 400 C500 375 580 350 648 324"
          fill="none"
          stroke="#C1803A"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={AIRFLOW_DASH}
          markerEnd={`url(#${gid('arrow')})`}
          className="animate-flow"
        />
        <path
          d="M186 446 C270 442 340 432 410 414 C500 392 570 372 640 348"
          fill="none"
          stroke="#C1803A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={AIRFLOW_DASH}
          strokeOpacity="0.55"
          markerEnd={`url(#${gid('arrow')})`}
          className="animate-flow"
        />
      </g>

      {/* Cavity airflow */}
      <g>
        <path
          d="M190 292 C300 272 400 236 470 214 C530 196 560 190 585 180"
          fill="none"
          stroke="#6c8360"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeDasharray={AIRFLOW_DASH}
          markerEnd={`url(#${gid('arrow')})`}
          className="animate-flow"
        />
      </g>

      {/* Indoor sensor marker */}
      <g>
        <circle cx="300" cy="392" r="8" fill="#E9A94B" stroke="#17302A" strokeWidth="1.6" />
        <path d="M300 392 L246 356" stroke="#17302A" strokeWidth="1.2" />
        <text
          x="240"
          y="350"
          textAnchor="end"
          className="fill-charcoal text-[12px] font-medium"
        >
          Indoor sensor
        </text>
        <text
          x="240"
          y="365"
          textAnchor="end"
          className="fill-charcoal-faint text-[10.5px]"
        >
          same position for baseline and system
        </text>
      </g>

      {/* Conceptual watermark */}
      <text
        x="806"
        y="506"
        textAnchor="end"
        className="fill-charcoal-faint text-[11px] italic"
      >
        Conceptual schematic — not a photograph of a built prototype
      </text>

      {showHotspots
        ? HOTSPOTS.map((spot, index) => {
            const isActive = activeId === spot.id;
            return (
              <g
                key={spot.id}
                role={interactive ? 'button' : undefined}
                tabIndex={interactive ? 0 : undefined}
                aria-label={
                  interactive
                    ? `Select component: ${spot.label}`
                    : undefined
                }
                aria-pressed={interactive ? isActive : undefined}
                onClick={interactive ? () => onSelect?.(spot.id) : undefined}
                onKeyDown={interactive ? (e) => handleKey(e, spot.id) : undefined}
                className={cn(interactive && 'cursor-pointer')}
              >
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r="15"
                  fill={isActive ? '#244B3B' : '#FDFCF7'}
                  stroke={isActive ? '#17302A' : '#244B3B'}
                  strokeWidth="1.8"
                />
                <text
                  x={spot.x}
                  y={spot.y + 4.5}
                  textAnchor="middle"
                  className={cn(
                    'text-[12px] font-semibold',
                    isActive ? 'fill-ivory-soft' : 'fill-forest',
                  )}
                >
                  {index + 1}
                </text>
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r="15"
                  fill="transparent"
                  className={cn(interactive && 'hover:opacity-100')}
                />
              </g>
            );
          })
        : null}
    </svg>
  );
}
