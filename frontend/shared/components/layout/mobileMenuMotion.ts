export const MENU_STATE = { open: 'open', closed: 'closed' } as const;

export const PANEL_VARIANTS = {
  closed: { height: 0, opacity: 0 },
  open: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], when: 'beforeChildren', staggerChildren: 0.04 },
  },
} as const;

export const ITEM_VARIANTS = {
  closed: { opacity: 0, y: -8 },
  open: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
} as const;
