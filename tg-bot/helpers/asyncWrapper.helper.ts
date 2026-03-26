export function asyncHandler<Args extends unknown[]>(
  fn: (...args: Args) => Promise<void>,
  contextName = 'Handler',
) {
  return async (...args: Args) => {
    try {
      await fn(...args);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(`${contextName} error:`, e.message);
      } else {
        console.error(`${contextName} error:`, e);
      }
    }
  };
}
