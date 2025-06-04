import { Engine, Scene, PolygonMeshBuilder, Mesh, Vector2 } from '@babylonjs/core';

export const scale = 1000;

// 바빌론 기본 요소
export interface BabylonAppContext {
  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene;
}

// loader
export interface mFeature {
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    SGG_NM: string;
  };
}

export interface mGeometry {
  name: string;
  type: string;
  data: Vector2[][];
}

export interface mPolygon {
  name: string;
  type: string;
  polygon: PolygonMeshBuilder[];
}

// data -> polygon

// number[][] -> Vector2[][] -바빌론 js가 정의한 타입
// Vector2[][] -> Polygon 객체
// Polygon -> Mesh
// Mesh -> 추상화 계층
// rootMesh -> regionMesh -> Mesh 291개지역

// -> 사용자의 선택에 따른 카메라 뷰포트 이동
// -> 프레이밍 -> 단일 Mesh를 기준으로 카메라를 변경
// Mesh -> rootMesh -> region -> Mesh

// ...
