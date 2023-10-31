export function generateRandomValue(
  min: number,
  max: number,
  numAfterDigit = 0,
) {
  return Number((Math.random() * (max - min) + min).toFixed(numAfterDigit));
}

export function getRandomItems<T>(items: T[], amount?: number): T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition =
    startPosition + (amount ?? generateRandomValue(startPosition + 1, items.length));
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
