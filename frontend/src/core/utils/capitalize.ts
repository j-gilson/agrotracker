export const capitalize = (value: string): string => {
  if (!value.trim()) return '';

  return value.charAt(0).toUpperCase() + value.slice(1);
};
