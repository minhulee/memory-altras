import {
  Engine,
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  Vector3,
  MeshBuilder,
  HemisphericLight,
  Mesh,
  AbstractMesh,
  ParticleSystem,
  Texture,
  Color3,
  Color4,
  PolygonMeshBuilder,
} from '@babylonjs/core';
import earcut from 'earcut';
import '@babylonjs/inspector';

import { loader } from './loader.ts';
import { BabylonContext, mGeometry } from './type.ts';
import {
  addHandler,
  buildBabylonContext,
  buildMesh,
  buildPolygon,
  changeFramingTarget,
} from './viewer.ts';

(window as any).earcut = earcut;

const createCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.id = 'renderCanvas';
  document.body.appendChild(canvas);

  return canvas;
};

window.addEventListener('DOMContentLoaded', async () => {
  const geometry: mGeometry[] = await loader();
  const context: BabylonContext = buildBabylonContext(createCanvas());
  const { canvas, engine, scene, camera } = context;
  const polygons = buildPolygon(geometry, scene);
  const rootMesh = buildMesh(polygons, scene);

  // inspector show!
  context.scene.debugLayer.show();

  changeFramingTarget(rootMesh);
  addHandler(context);

  //   프레이밍 변경을 테스트 하기 위한 임시 버튼
  const btn = document.createElement('button');
  btn.textContent = 'Next';
  btn.style.position = 'absolute';
  btn.style.top = '20px';
  btn.style.left = '20px';
  btn.style.width = '150px';
  btn.style.height = '60px';
  btn.style.fontSize = '18px';
  btn.style.zIndex = '999';
  btn.style.backgroundColor = '#ff5722';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';
  let i = 0;
  const targets = rootMesh.getChildMeshes().filter((e) => e.getChildMeshes().length);
  btn.addEventListener('click', () => {
    console.log(targets[i].name);
    changeFramingTarget(targets[i]);
    i++;
    if (targets.length <= i) i = 0;
  });
  document.body.append(btn);
  console.log(btn);

  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener('resize', () => {
    engine.resize();
  });
});
