import geo from '../data/TL_SCCO_SIG.json';
import { Vector2 } from '@babylonjs/core';

const scale = 1000;

export async function loader() {
  const geometry = geo.features.map(({ geometry, properties }) => {
    return {
      name: properties.SIG_KOR_NM,
      data: geometry.coordinates[0].map(([x, y]) => {
        return new Vector2(-(y - 36.5) * scale, (x - 127.5) * scale);
      }),
    };
  });
  console.log(geometry);
  return geometry;
}
