export async function safeApiCall<T>(fn: () => Promise<T>, contextMessage: string): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ ${contextMessage}:`, error.message);
      throw new Error(contextMessage);
    }

    console.error(`❌ Unexpected ${contextMessage}:`, error);
    throw new Error(contextMessage);
  }
}
