import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, SunMedium } from 'lucide-react';
import { navItems } from './nav-items';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const closeMenu = () => setOpen(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      data-print="hide"
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled || open
          ? 'border-line bg-ivory/85 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-control focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:text-ivory-soft"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-control"
          aria-label="SolarCool Rural — home"
        >
          <span className="flex size-9 items-center justify-center rounded-control bg-forest text-solar transition-colors group-hover:bg-forest-mid">
            <SunMedium className="size-[1.15rem]" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[0.95rem] font-bold tracking-tight text-forest">
              SolarCool Rural
            </span>
            <span className="mt-0.5 text-[0.6875rem] font-medium tracking-wide text-charcoal-faint">
              Passive cooling research
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-control px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-forest-soft text-forest'
                    : 'text-charcoal-soft hover:bg-ivory-deep hover:text-forest',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/dashboard"
            className="inline-flex h-9 items-center rounded-control bg-forest px-4 text-[0.8125rem] font-medium text-ivory-soft shadow-soft transition-colors hover:bg-forest-mid"
          >
            Open dashboard
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex size-10 items-center justify-center rounded-control border border-line-strong bg-ivory-soft text-forest transition-colors hover:border-forest lg:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-line bg-ivory-soft lg:hidden"
        >
          <nav aria-label="Primary (mobile)" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      cn(
                        'flex flex-col gap-0.5 rounded-control px-4 py-3 transition-colors',
                        isActive
                          ? 'bg-forest-soft text-forest'
                          : 'text-charcoal hover:bg-ivory-deep',
                      )
                    }
                  >
                    <span className="font-display text-sm font-semibold">
                      {item.label}
                    </span>
                    <span className="text-xs text-charcoal-faint">
                      {item.description}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="mt-3 flex h-11 items-center justify-center rounded-control bg-forest px-4 text-sm font-medium text-ivory-soft"
            >
              Open dashboard
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
