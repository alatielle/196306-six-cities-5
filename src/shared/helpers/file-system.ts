import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getCurrentDirectoryPath() {
  const filePath = fileURLToPath(import.meta.url);

  return dirname(filePath);
}
