// r124
import * as THREE from "three";
import { log } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./styles.css";
import computeGeometry, { computeVertexNormals } from "./utils";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });

  var targetRotationX = 0.5; // TODO
  var slowingFactor = 0.25;

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  var targetList = [];
  var projector = new THREE.Vector2();

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1.2;
  controls.maxDistance = 4;
  //controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("orange");

  scene.add(new THREE.AmbientLight(0xffffff));

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
  const loader = new THREE.TextureLoader();

  let textureWidth, textureHeight;

  const lefTexture = loader.load("../img/res2.png", () => {
    // left.png
    textureWidth = lefTexture.image.width;
    textureHeight = lefTexture.image.height;
  });

  var materialArray = [
    new THREE.MeshLambertMaterial({
      map: lefTexture,
    }),
    new THREE.MeshLambertMaterial({
      map: loader.load("../img/right.png"),
    }),
    new THREE.MeshLambertMaterial({
      map: loader.load("../img/up.png"),
    }),
    new THREE.MeshLambertMaterial({
      map: loader.load("../img/down.png"),
    }),
    new THREE.MeshLambertMaterial({
      map: loader.load("../img/back.png"),
    }),
    new THREE.MeshLambertMaterial({
      map: loader.load("../img/front.png"),
    }),
  ];

  const fragmentShaderReplacements = [
    {
      from: "#include <common>",
      to: `
        #include <common>
        uniform sampler2D indexTexture;
        uniform sampler2D paletteTexture;
        uniform float paletteTextureWidth;
      `,
    },
    {
      from: "#include <color_fragment>",
      to: `
        #include <color_fragment>
        {
          vec4 indexColor = texture2D(indexTexture, vUv);
          float index = indexColor.r * 255.0 + indexColor.g * 255.0 * 256.0;
          vec2 paletteUV = vec2((index + 0.5) / paletteTextureWidth, 0.5);
          vec4 paletteColor = texture2D(paletteTexture, paletteUV);
          // diffuseColor.rgb += paletteColor.rgb;   // white outlines
          diffuseColor.rgb = paletteColor.rgb - diffuseColor.rgb;  // black outlines
        }
      `,
    },
  ];

  var sphereMaterial = new THREE.MeshFaceMaterial(materialArray);

  /*
  sphereMaterial.onBeforeCompile = function (shader) {
    fragmentShaderReplacements.forEach((rep) => {
      shader.fragmentShader = shader.fragmentShader.replace(rep.from, rep.to);
    });

    shader.uniforms.paletteTexture = { value: paletteTexture };
    shader.uniforms.indexTexture = { value: indexTexture };
    shader.uniforms.paletteTextureWidth = { value: paletteTextureWidth };
  };
      //*/

  var sphere = new THREE.Mesh(geometry, sphereMaterial);
  targetList.push(sphere);
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

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let renderRequested = false;
  /*
  function render() {
    renderRequested = undefined;
    drawRandomDot();

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();

    updateLabels();


    //rotateAroundWorldAxis(mesh, new THREE.Vector3(0, 1, 0), targetRotationX);

    targetRotationX = targetRotationX * (1 - slowingFactor);

    renderer.render(scene, camera);
  }
  //*/
  //*
  function render() {
    //time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    /*
    let mesh = sphere;
    mesh.rotation.x = time;
    mesh.rotation.y = time;
    */

    controls.update();
    rotateAroundWorldAxis(sphere, new THREE.Vector3(0, 1, 0), targetRotationX);
    targetRotationX = targetRotationX * (1 - slowingFactor);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function rotateAroundWorldAxis(object, axis, radians) {
    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    rotationMatrix.multiply(object.matrix); // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
  }

  function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }
  requestAnimationFrame(render);

  //controls.addEventListener("change", requestRenderIfNotRequested);

  //************* */
  var raycaster = new THREE.Raycaster();

  canvas.addEventListener("pointerdown", onDocumentMouseDown, false);

  function onDocumentMouseDown(event) {
    event.preventDefault();
    const mouse = new THREE.Vector3();
    let target = new THREE.Vector2();

    /*** add here */
    /*
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // find intersections

    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    //projector.unprojectVector(vector, camera);
    var ray = new THREE.Raycaster(
      camera.position,
      vector.sub(camera.position).normalize()
    );

    // create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects(targetList);

    // if there is one (or more) intersections
    if (intersects.length > 0) {
      console.log("Hit @ " + toString(intersects[0].point));
      // change the color of the closest face.
      intersects[0].face.color.setRGB(0.8 * Math.random() + 0.2, 0, 0);
      intersects[0].object.geometry.colorsNeedUpdate = true;
    }
    /*** end here */
    //*
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.z = 0.5;

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera(mouse, camera);

    //3. compute intersections
    var intersects = raycaster.intersectObjects(scene.children);
    console.log("intersects[0].uv ", intersects[0].uv);
    console.log("intersects[0].object ", intersects[0].object);
    console.log("intersects[0].distance ", intersects[0].distance);
    console.log("intersects[0].face ", intersects[0].face);
    console.log("intersects[0].faceIndex ", intersects[0].faceIndex);
    console.log("intersects[0].point ", intersects[0].point);
    /*
    let block = getBlock({
      x: Math.round(intersects[0].uv.x * textureWidth),
      y: Math.round(intersects[0].uv.y * textureHeight),
    });
    */
    //*
    console.log(
      `textureWidth: ${textureWidth}, textureHeight: ${textureHeight}`
    );
    intersects[0].face.color.setRGB(0.8 * Math.random() + 0.2, 0, 0);
    console.log("face: ", intersects[0].face);

    //* v1 and v2
    target = {
      x: Math.round(intersects[0].uv.x * textureWidth),
      y: textureHeight - Math.round(intersects[0].uv.y * textureHeight),
    };

    console.log("canvas: ", canvas);
    console.log("Height: ", canvas.height);

    console.log("target: ", target);
    console.log("red should 374 x 366");
    //*/
  }
}

main();

function onDocumentMouseDown(event) {
  event.preventDefault();
  const mouse = new THREE.Vector3();
  let target = new THREE.Vector2();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //2. set the picking ray from the camera position and mouse coordinates
  raycaster.setFromCamera(mouse, camera);

  //3. compute intersections
  var intersects = raycaster.intersectObjects(scene.children);
  console.log(`textureWidth: ${textureWidth}, textureHeight: ${textureHeight}`);

  //* v1 and v2
  target = {
    x: Math.round(intersects[0].uv.x * textureWidth),
    y: textureHeight - Math.round(intersects[0].uv.y * textureHeight),
  };

  console.log("Height: ", canvas.height);
  //*/
  console.log("target: ", target);
  console.log("red should 374 x 366");
}
