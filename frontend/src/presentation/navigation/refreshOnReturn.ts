export interface FocusStateRef {
  current: boolean;
}

export const refreshOnReturn = (
  focusState: FocusStateRef,
  refresh: () => void | Promise<void>
): void | Promise<void> => {
  if (!focusState.current) {
    focusState.current = true;
    return;
  }

  return refresh();
};
