import {
  PolygonMeshBuilder,
  Mesh,
  Vector2,
  Scene,
  Material,
  Polygon,
  AbstractMesh,
} from '@babylonjs/core';
import { mPolygon, mGeometry } from './type.ts';

export function buildPolygon(geometry: mGeometry[], scene: Scene): mPolygon[] {
  return geometry.map(({ name, type, data }) => {
    const polygon = data.map((d) => new PolygonMeshBuilder(name, d, scene));

    return {
      name,
      type,
      polygon,
    };
  });
}

export function createMesh(polygon: PolygonMeshBuilder, rootMesh: AbstractMesh): Mesh {
  const mesh = polygon.build(true, 5);

  mesh.position.x = 0;
  mesh.position.y = 0;
  mesh.setParent(rootMesh);

  return mesh;
}

// 계층 구조를 참고하여 메쉬 생성
export function buildMesh(polygons: mPolygon[], scene: Scene): AbstractMesh {
  const rootMesh = new Mesh('rootMesh', scene);

  polygons.forEach(({ name, type, polygon }) => {
    if (type == 'Polygon') {
      createMesh(polygon[0], rootMesh);
    } else if (type == 'MultiPolygon') {
      const regionMesh = new Mesh(name, scene);
      polygon.forEach((p) => createMesh(p, regionMesh));
      regionMesh.setParent(rootMesh);
    }
  });
  return rootMesh;
}
