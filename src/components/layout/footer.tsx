import { Link } from 'react-router-dom';
import { SunMedium, Github, ExternalLink } from 'lucide-react';
import { navItems } from './nav-items';

const references = [
  {
    label: 'UN SDG 7 — Affordable and Clean Energy',
    href: 'https://sdgs.un.org/goals/goal7',
  },
  {
    label: 'WHO — Heat and health',
    href: 'https://www.who.int/news-room/fact-sheets/detail/climate-change-heat-and-health',
  },
  {
    label: 'IEA — Cooling',
    href: 'https://www.iea.org/energy-system/buildings/cooling',
  },
];

export function Footer() {
  return (
    <footer
      data-print="hide"
      className="mt-auto border-t border-line bg-forest-deep text-ivory-soft"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-control bg-solar text-forest-deep">
              <SunMedium className="size-[1.15rem]" aria-hidden="true" />
            </span>
            <span className="font-display text-base font-bold tracking-tight">
              SolarCool Rural
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ivory-soft/70">
            An open educational and experimental platform for the development of
            a low-cost, solar-assisted passive cooling system for rural houses
            and workshops.
          </p>
          <p className="max-w-sm text-xs leading-relaxed text-ivory-soft/50">
            Figures shown in this site are either measured from data you record
            in the dashboard, or explicitly marked as illustrative estimates.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="font-display text-xs font-semibold tracking-[0.16em] text-solar uppercase">
            Explore
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-ivory-soft/75 transition-colors hover:text-solar"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-xs font-semibold tracking-[0.16em] text-solar uppercase">
            References
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {references.map((ref) => (
              <li key={ref.href}>
                <a
                  href={ref.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-start gap-1.5 text-sm text-ivory-soft/75 transition-colors hover:text-solar"
                >
                  <span>{ref.label}</span>
                  <ExternalLink
                    className="mt-0.5 size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-ivory-soft/45">
            Built with React, TypeScript and Tailwind CSS. Experimental records
            are stored locally in your browser.
          </p>
        </div>
      </div>

      <div className="border-t border-ivory-soft/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-ivory-soft/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            Academic project prototype — results are experimental and not a
            certified performance claim.
          </p>
          <p className="flex items-center gap-1.5">
            <Github className="size-3.5" aria-hidden="true" />
            No account, no server, no data leaves this device.
          </p>
        </div>
      </div>
    </footer>
  );
}
