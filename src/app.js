// r124
import * as THREE from "three";
import "./styles.css";
import computeGeometry, { computeVertexNormals } from "./utils";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(
    boxWidth,
    boxHeight,
    boxDepth,
    64,
    64,
    64
  );

  //*
  // morph box into a sphere
  for (var i = 0; i < geometry.vertices.length; i++) {
    geometry.vertices[i].normalize().multiplyScalar(1); // or whatever size you want
  }

  computeGeometry(geometry);

  computeVertexNormals(geometry);

  var materialArray = [
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("../img/left.png"),
    }),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("../img/right.png"),
    }),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("../img/up.png"),
    }),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("../img/down.png"),
    }),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("../img/back.png"),
    }),
    new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture("../img/front.png"),
    }),
  ];

  var sphereMaterial = new THREE.MeshFaceMaterial(materialArray);
  var sphere = new THREE.Mesh(geometry, sphereMaterial);

  scene.add(sphere);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  function render(time) {
    time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    let mesh = sphere;
    mesh.rotation.x = time;
    mesh.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
