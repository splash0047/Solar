export const navItems = [
  { to: '/', label: 'Home', description: 'Project overview' },
  { to: '/system', label: 'How It Works', description: 'System breakdown' },
  { to: '/dashboard', label: 'Dashboard', description: 'Experimental data' },
  { to: '/calculator', label: 'Calculator', description: 'Cost & savings' },
  { to: '/guide', label: 'Guide', description: 'Build & maintain' },
  { to: '/research', label: 'Research', description: 'Methodology' },
] as const;

export type NavItem = (typeof navItems)[number];
