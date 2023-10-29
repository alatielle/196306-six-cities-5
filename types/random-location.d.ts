import { Coordinates } from '../src/shared/types/index.js';

declare module 'random-location' {
  export function randomCirclePoint(
    centerPoint: Coordinates,
    radius: number,
  ): Coordinates;
}
