import {
  Engine,
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  Camera,
  Color3,
  Vector2,
  PolygonMeshBuilder,
} from '@babylonjs/core';
import earcut from 'earcut';
import '@babylonjs/inspector';

(window as any).earcut = earcut;

// 바빌론 기본 요소
interface BabylonAppContext {
  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene;
}

// Dummy data
const shape = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 4 },
  { x: 0, y: 4 },
];

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

window.addEventListener('DOMContentLoaded', () => {
  const { canvas, engine, scene } = initApp();

  // 카메라 세팅
  const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 15, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  // 메쉬 세팅
  const polygon = new PolygonMeshBuilder('mesh', shape, scene);
  const mesh = polygon.build(false, 0.5); // 높이는 0.1 정도로 낮게 설정
  mesh.position.y = 0;
  mesh.position.x = -2;

  // 메테리얼 세팅
  const semiTransparentMaterial = new StandardMaterial('semiTransparentMaterial', scene);
  semiTransparentMaterial.diffuseColor = new Color3(0, 0, 0);
  semiTransparentMaterial.alpha = 0.3;
  mesh.material = semiTransparentMaterial;

  // inspector show!
  scene.debugLayer.show();

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
});
