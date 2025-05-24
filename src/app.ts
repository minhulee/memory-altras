import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder } from "@babylonjs/core";
import "@babylonjs/inspector";

// window.addEventListener("DOMContentLoaded", () => {
// 	const canvas = document.createElement("canvas");
// })

window.addEventListener("DOMContentLoaded", () => {
  // canvas 생성 및 DOM에 추가
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.id = "renderCanvas";
  document.body.appendChild(canvas);

  const engine = new Engine(canvas, true);

  const createScene = () => {
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    light.intensity = 0.9;

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
	const sphere2 = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
    sphere.position.y = 0.8;

    MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

    return scene;
  };

  const scene = createScene();
  scene.debugLayer.show(); // 개발용 inspector

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
});
