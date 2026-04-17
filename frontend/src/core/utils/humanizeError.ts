export const humanizeError = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    const message = error.message.trim();

    if (!message) {
      return fallback;
    }

    if (message.includes('Failed to fetch') || message.includes('Network request failed')) {
      return 'Nao foi possivel conectar ao servidor. Verifique sua internet e tente novamente.';
    }

    return message;
  }

  return fallback;
};
