export const sizes = {
  buttonHeight: 52,
  inputHeight: 52,
  chipHeight: 40,
  fabSize: 60,
  badgeHeight: 28,
  iconSm: 18,
  iconMd: 24,
  iconLg: 32,
  iconXl: 64,
  scanArea: 250,
  timelineIcon: 40,
} as const;

export type AppSizes = typeof sizes;
