import { AbstractMesh, ArcRotateCamera, Mesh } from '@babylonjs/core';
import { FramingBehavior } from '@babylonjs/core/Behaviors/Cameras/framingBehavior';
import { changeFramingTarget } from '../viewer';

export function updateCameraFrame(camera: ArcRotateCamera, target: Mesh | AbstractMesh | null) {
  // 모듈 내부의 상태변화를 통해 프레이밍 대상을 변경하고 카메라를 재조정한다.
  if (target === null) return;
  camera.getBehaviorByName('Framing').zoomOnMeshHierarchy(target);
  camera.minZ = 0.1;
}
