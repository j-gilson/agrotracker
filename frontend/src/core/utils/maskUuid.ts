export const maskUuid = (value?: string | null, visibleChars = 8): string => {
  if (!value) return '-';

  return value.slice(0, visibleChars);
};
