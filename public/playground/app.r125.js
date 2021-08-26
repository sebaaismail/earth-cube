import * as THREE from "three";
import "./css.css";

let camera, scene, renderer;
let geometry, material, mesh;

init();

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
  camera.position.z = 1;

  scene = new THREE.Scene();

  geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5, 32, 32, 32);
  material = new THREE.MeshNormalMaterial();

  //mesh = new THREE.Mesh(geometry, material);
  //scene.add(mesh);

  // morph box into a sphere
  const positionAttribute = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);

    vertex.normalize().multiplyScalar(0.5);

    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex, 1);
  }

  positionAttribute.needsUpdate = true;
  geometry.computeVertexNormals();

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
  for (
    let vertexIndex = 0;
    vertexIndex < positionAttribute.count;
    vertexIndex++
  ) {
    //for (var vertexIndex = 0; vertexIndex < geometry.faces.length; vertexIndex++) {
    var face = geometry.faces[vertexIndex];

    face.vertexNormals[0].copy(geometry.vertices[face.a]).normalize();
    face.vertexNormals[1].copy(geometry.vertices[face.b]).normalize();
    face.vertexNormals[2].copy(geometry.vertices[face.c]).normalize();

    var uvs = geometry.faceVertexUvs[0];

    for (var j = 0; j < 3; j++) {
      uvs[vertexIndex][j].multiply(repeat).add(offsets[face.materialIndex]);
    }

    // face.normal - will not be used; don't worry about it
  }

  var loader = new THREE.TextureLoader();
  var texture = loader.load("./img/res.png");

  // mesh
  mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({ map: texture })
  );
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);
}

function animation(time) {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  renderer.render(scene, camera);
}

/**
 * 
 * 
  i want to cut this image into six squres of 1028 pixels in sides of each square


  
 */
