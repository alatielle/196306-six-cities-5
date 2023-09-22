import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export function getFilesByPattern(dirPath: string, pattern: string) {
  const dirContent = readdirSync(resolve(dirPath));
  const regExp = new RegExp(pattern, 'i');

  return dirContent
    .filter((fileName) => regExp.test(fileName))
    .map((fileName) => resolve(dirPath, fileName));
}
