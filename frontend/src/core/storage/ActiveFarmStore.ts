import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_FARM_KEY = '@agrotracker/activeFarmId';

let cachedActiveFarmId: string | null = null;

export const activeFarmStore = {
  async get(): Promise<string | null> {
    const raw = await AsyncStorage.getItem(ACTIVE_FARM_KEY);
    if (!raw) return null;
    cachedActiveFarmId = raw;
    return raw;
  },

  async set(fazendaId: string): Promise<void> {
    await AsyncStorage.setItem(ACTIVE_FARM_KEY, fazendaId);
    cachedActiveFarmId = fazendaId;
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(ACTIVE_FARM_KEY);
    cachedActiveFarmId = null;
  },

  getCached(): string | null {
    return cachedActiveFarmId;
  },
};
