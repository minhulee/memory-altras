import geo from '../data/LARD_ADM_SECT_SGG.json';
import { Vector2 } from '@babylonjs/core';

import { scale, mFeature, mGeometry } from './type.ts';

function parseData(coords: any): Vector2[][] {
  if (typeof coords[0][0] === 'number')
    return [coords.map(([x, y]: [number, number]) => new Vector2(-y / scale, x / scale))];

  return coords.flatMap(parseData);
}

export async function loader(): Promise<mGeometry[]> {
  let geometry = geo.features.map(({ geometry, properties }) => {
    let name = properties.SGG_NM.split(' ');
    name = name[0].endsWith('도') ? name.slice(1) : name;
    return {
      region: name[0],
      name: name.length > 1 ? name[1] : name[0],
      type: geometry.type,
      data: parseData(geometry.coordinates),
    };
  });
  //   console.log(geometry);
  return geometry;
}
