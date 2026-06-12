export interface HomeStats {
  animais: number;
  manejos: number;
  fazendas: number;
}

export const buildHomeStats = (
  animalCount: number,
  eventCount: number,
  fazendaCount: number
): HomeStats => ({
  animais: animalCount,
  manejos: eventCount,
  fazendas: fazendaCount,
});
