import { colors } from '../constants/colors';
import { sizes } from '../constants/sizes';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 18,
  pill: 20,
  round: 30,
} as const;

const shadows = {
  none: {
    elevation: 0,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  sm: {
    elevation: 2,
    shadowColor: '#0E1A12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  md: {
    elevation: 3,
    shadowColor: '#0E1A12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lg: {
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
} as const;

export const theme = {
  colors,
  spacing,
  typography,
  sizes,
  radius,
  shadows,
} as const;

export type AppTheme = typeof theme;
