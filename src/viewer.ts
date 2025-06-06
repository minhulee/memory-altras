import {
  PolygonMeshBuilder,
  Mesh,
  Vector2,
  Vector3,
  Scene,
  Material,
  Polygon,
  StandardMaterial,
  Color3,
  Color4,
  AbstractMesh,
  DynamicTexture,
  Engine,
  ArcRotateCamera,
  HemisphericLight,
  Polar,
  Nullable,
} from '@babylonjs/core';
import { FramingBehavior } from '@babylonjs/core/Behaviors/Cameras/framingBehavior';
import { BabylonContext, mPolygon, mGeometry } from './type.ts';
import { updateCameraFrame } from './handler/updateCameraFrame.ts';

let nextFramingTarget: AbstractMesh | Mesh | null = null;

export function changeFramingTarget(target: AbstractMesh | Mesh | null) {
  if (target === null) {
    nextFramingTarget = null;
    return;
  }
  nextFramingTarget = target;
}

export function addHandler(context: BabylonContext) {
  context.scene.onBeforeRenderObservable.add(() => {
    updateCameraFrame(context.camera, nextFramingTarget);
    nextFramingTarget = null;
  });
}

export function buildBabylonContext(canvas: HTMLCanvasElement): BabylonContext {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  const camera = new ArcRotateCamera('camera', 0, 0, 10, Vector3.Zero(), scene);
  const framingBehavior = new FramingBehavior();
  camera.addBehavior(framingBehavior);

  framingBehavior.framingTime = 1000; // 프레이밍 애니메이션 시간 (ms)
  //   framingBehavior.elevationReturnTime = 1500; // 카메라 elevation 복귀 시간
  //   framingBehavior.radiusScale = 2.0; // 프레이밍 대상 기준으로 거리 배율
  //   framingBehavior.defaultElevation = Math.PI / 8; // 기본 elevation 각도
  framingBehavior.elevationReturnTime = -1;

  // Inspector option
  camera.attachControl(canvas, true);

  // 은은한 하늘빛 조명
  const light = new HemisphericLight('softLight', new Vector3(0, 1, 0), scene);
  light.intensity = 0.6; // 부드럽게 낮춰줌
  light.diffuse = new Color3(1, 1, 1); // 기본 흰색
  light.groundColor = new Color3(0.8, 0.85, 1.0);

  return {
    canvas,
    engine,
    scene,
    camera,
  };
}

export function buildPolygon(geometry: mGeometry[], scene: Scene): mPolygon[] {
  return geometry.map(({ region, name, type, data }) => {
    return {
      region,
      name: name,
      type,
      polygon:
        type === 'Polygon'
          ? [new PolygonMeshBuilder(name, data[0], scene)]
          : data.map((p) => new PolygonMeshBuilder(name, p, scene)),
    };
  });
}

// function createTextLabel(text: string, scene: Scene): Mesh {
//   const texture = new DynamicTexture('label', { width: 256, height: 64 }, scene);
//   texture.drawText(text, 10, 40, 'bold 24px Arial', 'white', 'transparent', true);

//   const mat = new StandardMaterial('labelMat', scene);
//   mat.diffuseTexture = texture;
//   mat.emissiveColor = new Color3(1, 1, 1); // 빛을 받지 않고 항상 보이게

//   const plane = Mesh.CreatePlane('textLabel', 5, scene);
//   plane.material = mat;
//   plane.position.y = 1.5; // 위로 띄우기

//   return plane;
// }

const pastelColors: Color3[] = [
  Color3.FromHexString('#A7F3D0'), // Soft Mint
  Color3.FromHexString('#FBCFE8'), // Coral Pink
  Color3.FromHexString('#E9D5FF'), // Lavender
  Color3.FromHexString('#FFEDD5'), // Cream Peach
  Color3.FromHexString('#BAE6FD'), // Sky Blue
  Color3.FromHexString('#FEF08A'), // Lemon Yellow
  Color3.FromHexString('#E5E7EB'), // Mist Grey
];

export function getColorByRegion(name: string): Color3 {
  const index = Array.from(name[0]).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return pastelColors[index % pastelColors.length];
}

function buildMaterial(scene: Scene, name: string): StandardMaterial {
  const color = getColorByRegion(name);
  const mat = new StandardMaterial(`mat-${name}`, scene);
  mat.diffuseColor = color;
  mat.alpha = 0.6;
  mat.backFaceCulling = false;
  return mat;
}

// function buildMeterial(scene: Scene): StandardMaterial {
//   const semiTransparentMaterial = new StandardMaterial('semiTransparentMaterial', scene);
//   semiTransparentMaterial.diffuseColor = new Color3(0.6, 0.6, 0.6);
//   semiTransparentMaterial.alpha = 0.3;
//   semiTransparentMaterial.backFaceCulling = false;
//   return semiTransparentMaterial;
// }

function createMesh(polygon: PolygonMeshBuilder, rootMesh: AbstractMesh): Mesh {
  const mesh = polygon.build(true, 1);

  mesh.position.x = 0;
  mesh.position.y = 0;
  mesh.enableEdgesRendering();
  mesh.edgesWidth = 1.0;
  mesh.edgesColor = new Color4(0, 0, 0, 1);
  mesh.setParent(rootMesh);

  return mesh;
}

export function buildMesh(polygons: mPolygon[], scene: Scene): AbstractMesh {
  console.log(polygons);
  const rootMesh: AbstractMesh = new Mesh('rootMesh', scene);
  let regionMesh: AbstractMesh = new Mesh(polygons[0].region, scene);
  polygons.forEach(({ region, name, polygon, type }) => {
    if (regionMesh.name !== region) {
      regionMesh.material = buildMaterial(scene, regionMesh.name);
      regionMesh.setParent(rootMesh);
      regionMesh = new Mesh(region, scene);
    }
    if (type === 'Polygon') {
      createMesh(polygon[0], regionMesh);
    } else if (type === 'MultiPolygon') polygon.forEach((p) => createMesh(p, regionMesh));
  });
  regionMesh.setParent(rootMesh);
  rootMesh.getChildMeshes().forEach((m) => {
    if (m.material) {
      m.getChildMeshes().forEach((m2) => (m2.material = m.material));
    }
  });
  return rootMesh;
}
