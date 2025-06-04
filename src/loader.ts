import geo from '../data/LARD_ADM_SECT_SGG.json';
import { Vector2 } from '@babylonjs/core';

import { scale, mFeature, mGeometry } from './type.ts';

function parseData(coords: any): Vector2[][] {
  if (typeof coords[0][0] === 'number')
    return [coords.map(([x, y]: [number, number]) => new Vector2(-y / scale, x / scale))];

  return coords.flatMap(parseData);
}

export async function loader() {
  const geometry = geo.features.map(({ geometry, properties }: mFeature): mGeometry => {
    return {
      name: properties.SGG_NM,
      type: geometry.type,
      data: parseData(geometry.coordinates),
    };
  });

  return geometry;
}
