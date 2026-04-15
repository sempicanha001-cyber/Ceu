// Navigation items with JSX icon fragments — kept in .jsx to allow JSX syntax

export const NAV_ITEMS = [
  {
    id: 'hoje',
    label: 'Hoje',
    target: 'sec-hoje',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    id: 'prev',
    label: 'Previsão',
    target: 'sec-prev',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
  {
    id: 'det',
    label: 'Detalhes',
    target: 'sec-det',
    icon: (
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
        <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
        <path d="M20.07 3.93a12 12 0 0 1 0 16.97" />
        <path d="M3.93 20.07a12 12 0 0 1 0-16.97" />
      </>
    ),
  },
];
