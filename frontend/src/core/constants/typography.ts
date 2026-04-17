export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 28,
    hero: 32,
    icon: 64,
  },
  lineHeight: {
    sm: 18,
    md: 22,
    lg: 24,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export type AppTypography = typeof typography;
