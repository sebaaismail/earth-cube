const computeGeometry = (geometry) => {
  //geometry.makeGroups();
  geometry.computeVertexNormals();
  geometry.computeFaceNormals();
  geometry.computeMorphNormals();
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
  //geometry.computeLineDistances();

  geometry.verticesNeedUpdate = true;
  geometry.elementsNeedUpdate = true;
  geometry.uvsNeedUpdate = true;
  geometry.normalsNeedUpdate = true;
  geometry.tangentsNeedUpdate = true;
  geometry.colorsNeedUpdate = true;
  geometry.lineDistancesNeedUpdate = true;
  geometry.buffersNeedUpdate = true;
  geometry.groupsNeedUpdate = true;
};

const computeVertexNormals = (geometry) => {
  for (var f = 0; f < geometry.faces.length; f++) {
    var face = geometry.faces[f];
    face.vertexNormals[0] = geometry.vertices[face.a].clone().normalize();
    face.vertexNormals[1] = geometry.vertices[face.b].clone().normalize();
    face.vertexNormals[2] = geometry.vertices[face.c].clone().normalize();
  }
};

export { computeGeometry as default, computeVertexNormals };
