// r124
import * as THREE from "three";
import "./css.css";

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
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  //*
  // morph box into a sphere
  for (var i = 0; i < geometry.vertices.length; i++) {
    geometry.vertices[i].normalize().multiplyScalar(1); // or whatever size you want
  }

  // texture is a collage; set offset/repeat per material index
  var repeat = new THREE.Vector2(1 / 3, 1 / 2);
  var offsets = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0, 1 / 2),
    new THREE.Vector2(1 / 3, 0),
    new THREE.Vector2(1 / 3, 1 / 2),
    new THREE.Vector2(2 / 3, 0),
    new THREE.Vector2(2 / 3, 1 / 2),
  ];

  // redefine vertex normals consistent with a sphere; reset UVs
  /*
  for (var i = 0; i < geometry.faces.length; i++) {
    var face = geometry.faces[i];

    face.vertexNormals[0].copy(geometry.vertices[face.a]).normalize();
    face.vertexNormals[1].copy(geometry.vertices[face.b]).normalize();
    face.vertexNormals[2].copy(geometry.vertices[face.c]).normalize();

    var uvs = geometry.faceVertexUvs[0];

    for (var j = 0; j < 3; j++) {
      uvs[i][j].multiply(repeat).add(offsets[face.materialIndex]);
    }

    // face.normal - will not be used; don't worry about it
  }
  */

  geometry.normalsNeedUpdate = true;
  geometry.verticesNeedUpdate = true;

  //*/
  var loader = new THREE.TextureLoader();
  var texture = loader.load("./img/ismail.jpg");

  // mesh
  var mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ map: texture })
  );
  scene.add(mesh);

  /*
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // greenish blue

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
*/
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

    mesh.rotation.x = time;
    mesh.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
