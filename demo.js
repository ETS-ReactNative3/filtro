"use strict";

var THREECAMERA;
var hatMesh;
var opu = 1;
var mat;

// callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback() : DETECTED');
  } else {
    console.log('INFO in detect_callback() : LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);

   // CREATE A CUBE
  // const cubeGeometry = new THREE.BoxGeometry(2,0.2,0.2);
  // const cubeMaterial = new THREE.MeshNormalMaterial();
  // const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // threeCube.frustumCulled = false;
  // threeStuffs.faceObject.add(threeCube);

  var loader = new THREE.BufferGeometryLoader()
  loader.load(
    "models/maskMesh2.json",
    function (geometry, materials) {
      mat=new THREE.MeshBasicMaterial({
      // load the texture using a TextureLoader
      map: new THREE.TextureLoader().load( "models/Texture.png" ),
      transparent: true,
      opacity: opu,
    });
    hatMesh = new THREE.Mesh(geometry, mat)
    hatMesh.scale.multiplyScalar(1.5);
    hatMesh.position.set(0.0, 0.4, -0.5);
    threeStuffs.faceObject.add(hatMesh)
    }
  )
  //CREATE THE CAMERA
  THREECAMERA = THREE.JeelizHelper.create_camera();
} // end init_threeScene()

// launched by body.onload():
function main(){
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  })
} //end main()

function init_faceFilter(videoSettings){
  JEEFACEFILTERAPI.init({
    followZRot: true,
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: '../../../dist/', // root of NNC.json file
    maxFacesDetected: 1,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. ERR =', errCode);
        return;
      }

      console.log('INFO : JEEFACEFILTERAPI IS READY');
      init_threeScene(spec);
    }, //end callbackReady()

    //called at each render iteration (drawing loop) :
    callbackTrack: function(detectState){
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    } //end callbackTrack()
  }); //end JEEFACEFILTERAPI.init call
} // end main()
