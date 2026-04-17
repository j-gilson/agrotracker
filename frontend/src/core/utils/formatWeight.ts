export const formatWeight = (value?: number | null): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';

  return `${value} kg`;
};
