import {
  Engine,
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  Vector3,
  MeshBuilder,
  Mesh,
  AbstractMesh,
  Color3,
  PolygonMeshBuilder,
} from '@babylonjs/core';
import earcut from 'earcut';
import '@babylonjs/inspector';
import { FramingBehavior } from '@babylonjs/core/Behaviors/Cameras/framingBehavior';

import { loader } from './loader.ts';

(window as any).earcut = earcut;

// 바빌론 기본 요소
interface BabylonAppContext {
  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene;
}

const createCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.id = 'renderCanvas';
  document.body.appendChild(canvas);

  return canvas;
};

const createScene = (canvas: HTMLCanvasElement, engine: Engine): Scene => {
  const scene = new Scene(engine);

  return scene;
};

const initApp = (): BabylonAppContext => {
  const canvas = createCanvas();
  const engine = new Engine(canvas, true);
  const scene = createScene(canvas, engine);

  return { canvas, engine, scene };
};

window.addEventListener('DOMContentLoaded', async () => {
  const geometry = await loader();
  const { canvas, engine, scene } = initApp();

  // 카메라 세팅
  const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 15, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  // 조명 세팅
  //   const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  //   light.intensity = 0.9;

  // 메테리얼 세팅
  const semiTransparentMaterial = new StandardMaterial('semiTransparentMaterial', scene);
  semiTransparentMaterial.diffuseColor = new Color3(0.6, 0.6, 0.6);
  semiTransparentMaterial.alpha = 0.3;
  semiTransparentMaterial.backFaceCulling = false;

  // 메쉬 세팅
  const polygons = geometry.map(({ name, data }) => {
    return {
      name,
      polygon: new PolygonMeshBuilder(name, data, scene),
    };
  });

  const meshs = polygons.map(({ name, polygon }, idx) => {
    const mesh = polygon.build(true, 30);

    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.material = semiTransparentMaterial;

    return { name, mesh };
  });

  const rootMesh = new Mesh('rootMesh', scene);

  // 모든 meshs의 메쉬를 루트 메쉬의 자식으로 설정
  meshs.forEach(({ mesh }) => {
    mesh.setParent(rootMesh);
  });

  // camera는 ArcRotateCamera라고 가정
  camera.useFramingBehavior = true;

  // FramingBehavior 생성 및 카메라에 추가
  const framingBehavior = new FramingBehavior();
  camera.addBehavior(framingBehavior);

  framingBehavior.framingTime = 0;
  framingBehavior.elevationReturnTime = -1;
  framingBehavior.zoomOnMeshHierarchy(rootMesh);
  //   framingBehavior.zoomOnMeshHierarchy(meshs[0].mesh);

  const boundingInfo = rootMesh.getHierarchyBoundingVectors(true);

  camera.minZ = 0.1;
  camera.maxZ = boundingInfo.max.subtract(boundingInfo.min).length() * 10;

  // 원하는 각도 세팅
  camera.alpha = Math.PI / 15;
  camera.beta = Math.PI / 8;

  // rootMesh 전체 크기(반지름) 기준 계산
  const boundingSize = boundingInfo.max.subtract(boundingInfo.min);
  const maxRadius = boundingSize.length() * 1.5;

  camera.radius = maxRadius;

  rootMesh.position = Vector3.Zero();

  // inspector show!
  scene.debugLayer.show();

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
});
