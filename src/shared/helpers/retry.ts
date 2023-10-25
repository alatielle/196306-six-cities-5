import { setTimeout } from 'node:timers/promises';

const RETRY_COUNT = 3;
const RETRY_TIMEOUT = 1000;

export async function retry(config: {
  operation: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (attempt: number, error: unknown) => void;
  attempts?: number;
  timeout?: number;
}) {
  const {
    operation,
    onSuccess,
    onError,
    attempts = RETRY_COUNT,
    timeout = RETRY_TIMEOUT,
  } = config;
  let attempt = 0;

  while (attempt < attempts) {
    try {
      await operation();
      onSuccess?.();
      return;
    } catch (error) {
      attempt++;
      onError?.(attempt, error);
      await setTimeout(timeout);
    }
  }
}
