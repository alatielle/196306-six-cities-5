import { createHmac } from 'node:crypto';

export const createSHA256 = (line: string, salt: string): string => createHmac('sha256', salt).update(line).digest('hex');
