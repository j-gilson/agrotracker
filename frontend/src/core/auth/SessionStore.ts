import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthSession } from '../../domain/entities/AuthSession';
import { AuthUser } from '../../domain/entities/AuthUser';

type StoredSession = {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
  };
};

const SESSION_KEY = '@agrotracker/session';

let cachedSession: AuthSession | null = null;

export const sessionStore = {
  async get(): Promise<AuthSession | null> {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.token || !parsed.user?.id) return null;

    const user = new AuthUser({
      id: parsed.user.id,
      nome: parsed.user.nome,
      email: parsed.user.email,
    });

    const session = new AuthSession({ token: parsed.token, user });
    cachedSession = session;
    return session;
  },

  async set(session: AuthSession): Promise<void> {
    const payload: StoredSession = {
      token: session.token,
      user: {
        id: session.user.id,
        nome: session.user.nome,
        email: session.user.email,
      },
    };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    cachedSession = session;
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
    cachedSession = null;
  },

  getCached(): AuthSession | null {
    return cachedSession;
  },
};
