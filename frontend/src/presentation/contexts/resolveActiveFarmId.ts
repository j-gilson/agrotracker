interface FarmWithOptionalId {
  id?: string;
}

export const resolveActiveFarmId = (
  farms: FarmWithOptionalId[],
  currentId: string | null,
  savedId: string | null
): string | null => {
  if (currentId && farms.some((farm) => farm.id === currentId)) {
    return currentId;
  }

  if (savedId && farms.some((farm) => farm.id === savedId)) {
    return savedId;
  }

  return farms.find((farm) => Boolean(farm.id))?.id ?? null;
};
