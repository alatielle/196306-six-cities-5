import { setTimeout } from 'node:timers/promises';

const RETRY_COUNT = 3;
const RETRY_TIMEOUT = 1000;

interface RetryConfig {
  operation: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (attempt: number, error: unknown) => void;
  attempts?: number;
  timeout?: number;
}

export async function retry({
  operation,
  onSuccess,
  onError,
  attempts = RETRY_COUNT,
  timeout = RETRY_TIMEOUT
}: RetryConfig): Promise<void> {
  let attempt = 0;

  while (attempt < attempts) {
    try {
      await operation();
      return onSuccess?.();
    } catch (error) {
      attempt++;
      onError?.(attempt, error);
      await setTimeout(timeout);
    }
  }
}
