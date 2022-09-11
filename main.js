import './style.css';

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer({
  antialias: true,
  alpha: true,
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(4.7751722142184505,
  12.150891707812992,
  -10.83873167290473);
camera.rotation.set(-3.0939422954120586, 0.29416131958834432, 3.132392112977501);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass({
  x: window.innerWidth,
  y: window.innerHeight
}, 1.0, 1.0, 0.99));

const NUM_PROJECTS = 4;
const PROJECT_DESCRIPTIONS = ["Welcome to my portfolio website! Click the road signs to explore my projects, and click the billboards to go to the project source.",
"A real-time raytracing engine in Unity, running in parallel on the GPU via compute shaders.",
"'Return to Hogwarts' 3D animation made using Cinema 4D, Redshift, and After Effects, submitted to a worldwide competition.",
"3D Portfolio website built with Three.js and Vite.js."];
const PROJECT_URLS = ['https://www.linkedin.com/in/ameer-taher/',
'',
'https://www.youtube.com/watch?v=Jb9NrY4_gTM',
'']

var progressBar = document.getElementById('progress');
var descriptionContainer = document.querySelector('.project-description');
var projectDescription = document.getElementById('description');
descriptionContainer.style.opacity = '0';
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = function(url, loaded, total) {
  var num = Math.ceil(((loaded/total) * 100));
  progressBar.textContent = num.toString() + "%";
}
var progressBarContainer = document.querySelector('.progress-bar-container');
var loaded = false;
loadingManager.onLoad = function() {
  projectDescription.textContent = projectMeshes[0].userData.description;
  updateInitials();
  progressBarContainer.addEventListener('click', () => {
    progressBarContainer.style.opacity = '0';
});
  progressBarContainer.addEventListener('transitionend', () => {
    progressBarContainer.remove();
    loaded = true;
    tween3.start();
});
  
}

const texloader = new THREE.TextureLoader(loadingManager);
const loader = new GLTFLoader(loadingManager);

let pjnames = [NUM_PROJECTS];
for (let i = 1; i < NUM_PROJECTS + 1; i++) {
  pjnames[i-1] = 'projects/project' + i + '.gltf';
}

var planet;
loader.load(
    'planet.gltf',
    function (gltf) {
      scene.add( gltf.scene );
      gltf.scene.scale.set(.01,.01,.01);
      gltf.scene.rotateY(Math.PI);
      gltf.scene.rotation.x += 0.08
      gltf.scene.translateX(-4.75);
      gltf.scene.castShadow = true;
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          o.userData.name = "planet";
        }
      });
      planet = gltf.scene;
    },
    (error) => {
        console.log(error)
    }
);


var car;
loader.load(
    'car.gltf',
    function (gltf) {
      scene.add( gltf.scene );
      gltf.scene.scale.set(.01,.01,.01);
      gltf.scene.rotateY(Math.PI);
      gltf.scene.translateX(-4.8);
      gltf.scene.translateY(-.05);
      gltf.scene.rotateX(0.5);
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.rotateX(-.01);
          o.castShadow = true;
          o.receiveShadow = true;
          o.userData.name = "car";
        }
      });
      car = gltf.scene;
    },
    (error) => {
        console.log(error)
    }
);

var interactives = new THREE.Group();

for(let i = 0; i < 4; i++){
  loader.load(
      'billboards.gltf',
      function (gltf) {
        scene.add(gltf.scene);
        gltf.scene.scale.set(.01,.01,.01);
        gltf.scene.rotateY(Math.PI);
        gltf.scene.rotation.x += 0.08 + (i*Math.PI/2);
        gltf.scene.translateX(-4.75);
        gltf.scene.traverse((o) => {
        if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.userData.name = "billboards" + i;
        }
      });
      interactives.add(gltf.scene);
      },
      (error) => {
          console.log(error)
      }
      );
}

loader.load(
    'landscape.gltf',
    function (gltf) {
      scene.add( gltf.scene );
      gltf.scene.scale.set(.01,.01,.01);
      gltf.scene.translateZ(200);
      gltf.scene.translateY(-25);
      gltf.scene.translateX(-40);
      gltf.scene.rotateX(0.1);
      // const groundbump = texloader.load('tex/groundbump.jpg');
      // const groundtex = texloader.load('tex/groundtex_r.png');
      // const groundmat = new THREE.MeshStandardMaterial(
      //   {
      //     map: groundtex,
      //     //bumpMap: groundbump
      //   }
      // );
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          //o.material = groundmat;
          o.castShadow = true;
          o.receiveShadow = true;
          o.userData.name = "landscape";
        }
      });
    },
    (error) => {
        console.log(error)
    }
);

var geo;
loader.load(
  'geo.gltf',
  function (gltf) {
    scene.add( gltf.scene );
    gltf.scene.scale.set(.01,.01,.01);
    gltf.scene.rotateY(Math.PI);
    gltf.scene.rotation.x += 0.08
    gltf.scene.translateX(-4.75);
    gltf.scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.userData.name = "geo";
      }
    });
    geo = gltf.scene;
  },
  (error) => {
      console.log(error)
  }
);

for (let i = 0; i < 4; i++) {
  loader.load(
    'sign.gltf',
    function (gltf) {
      scene.add(gltf.scene);
      gltf.scene.scale.set(.01,.01,.01);
      gltf.scene.rotateY(Math.PI);
      gltf.scene.rotation.x += 0.08 + (i*Math.PI/2);
      gltf.scene.translateX(-4.75);
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          o.userData.name = "sign" + i;
        }
      });
      interactives.add(gltf.scene);

    },
    (error) => {
        console.log(error)
    }
  );
}

for(let i = 0; i < 4; i ++) {
  loader.load(
    'signboxprev.gltf',
    function (gltf) {
      scene.add(gltf.scene);
      gltf.scene.scale.set(.01,.01,.01);
      gltf.scene.rotateY(Math.PI);
      gltf.scene.rotation.x += 0.08 + (i*Math.PI/2);
      gltf.scene.translateX(-4.75);
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          o.visible = false;
          o.userData.name = "sp" + i;
        }
      });
      interactives.add(gltf.scene);

    },
    (error) => {
        console.log(error)
    }
  );
}

for(let i = 0; i < 4; i ++) {
  loader.load(
    'signboxnext.gltf',
    function (gltf) {
      scene.add(gltf.scene);
      gltf.scene.scale.set(.01,.01,.01);
      gltf.scene.rotateY(Math.PI);
      gltf.scene.rotation.x += 0.08 + (i*Math.PI/2);
      gltf.scene.translateX(-4.75);
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          o.visible = false;
          o.userData.name = "sn" + i;
        }
      });
      interactives.add(gltf.scene);
      scene.add(interactives);
    },
    (error) => {
        console.log(error)
    }
  );
}

var projectMeshes = [NUM_PROJECTS];
var projectScenes = [NUM_PROJECTS];
for (let i = 0; i < NUM_PROJECTS; i++) {
  loader.load(
      pjnames[i],
      function (gltf) {
        scene.add( gltf.scene );
        gltf.scene.scale.set(.01,.01,.01);
        gltf.scene.rotateY(Math.PI);
        gltf.scene.rotation.x += 0.08 + (i*Math.PI/2);
        gltf.scene.translateX(-4.75);
        gltf.scene.traverse((o) => {
        if (o.isMesh) {
            o.userData.name = "pr" + i;
            o.userData.description = PROJECT_DESCRIPTIONS[i];
            projectMeshes[i] = o;
        }
    });
    projectScenes[i] = gltf.scene;

    },
    (error) => {
        console.log(error)
    }
  );
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
  pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

  if(pointIsWorld){
      obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if(pointIsWorld){
      obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}



const dLight = new THREE.DirectionalLight(0xffffff, 0.2);
const dLight1 = new THREE.DirectionalLight(0xffffff, 0.2);
let spheregeo = new THREE.SphereGeometry(20, 64, 64);
let spheremat = new THREE.MeshStandardMaterial(
  {
    color: new THREE.Color("rgb(253, 184, 19)"),
    emissive: new THREE.Color("rgb(253, 184, 50)"),
    emissiveIntensity: 10,
    flatShading: true
  }
);
let sphere = new THREE.Mesh(spheregeo, spheremat);
sphere.position.set(-90,90,300);
scene.add(sphere);

let moongeo = new THREE.SphereGeometry(20, 64, 64);
let moonmat = new THREE.MeshStandardMaterial(
  {
    map: texloader.load('tex/moontex.jpg'),
    emissive: new THREE.Color("rgb(255, 255, 255)"),
    emissiveIntensity: .4
  }
);
let moon = new THREE.Mesh(moongeo, moonmat);

let hemgeo = new THREE.SphereGeometry(500, 64, 64);
let hemmat = new THREE.MeshStandardMaterial(
  {
    map: texloader.load('tex/hemtex.png'),
    side: THREE.BackSide
  }
);
let hem = new THREE.Mesh(hemgeo, hemmat);
hem.rotateZ(-Math.PI/2);
moon.position.set(-90,90,300);
rotateAboutPoint(moon, new Vector3(0,0,0), new Vector3(1,0,0), Math.PI, false);
scene.add(moon);
scene.add(hem);
dLight.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
dLight.target.position.set(3,10,0);
dLight.castShadow = true;
dLight1.position.set(moon.position.x, moon.position.y, moon.position.z);
dLight1.target.position.set(3,10,0);
dLight1.castShadow = true;

const hemlight = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);

scene.add(dLight, dLight.target, dLight1, dLight1.target);
scene.add(hemlight);

var pivot = new THREE.Group();
scene.add( pivot );
pivot.add( sphere, dLight, dLight1, moon );

hem.userData.name = "sky";
moon.userData.name = "moon";
sphere.userData.name = "sun";

window.addEventListener("resize", function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


let index = 0;
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

window.addEventListener( 'click', event => {
  if (!moving && loaded) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const found = raycaster.intersectObjects(scene.children);
  
  if (found.length > 0) {
      let oname = found[0].object.userData.name;
      if (oname.substring(0, 2) == "sp") {
        clickedPrev();
      }
      else if (oname.substring(0, 2) == "sn") {
        clickedNext();
      }
      else if (oname.substring(0, 2) == 'pr') {
        clickedProj(Number(oname[2]));
      }
    }
  }
});

let raycaster1 = new THREE.Raycaster();

window.addEventListener( 'mousemove', event => {
  if (!moving) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster1.setFromCamera(mouse, camera);
    const found = raycaster1.intersectObjects(scene.children);
    
    if (found.length > 0) {
      let oname = found[0].object.userData.name;
      if (oname.substring(0, 2) == "sp" || oname.substring(0, 2) == "sn" || oname.substring(0, 2) == 'pr') {

        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    }
  }
});


function clickedPrev() {
  if (index == 0) {
    index = NUM_PROJECTS - 1;
  } else {
    index--;
  }
  for (let i = 0; i < NUM_PROJECTS; i++) {
    projectMeshes[i].visible = false;
  }
  if (index == NUM_PROJECTS - 1) {
    projectMeshes[0].visible = true;
  } else {
    projectMeshes[index + 1].visible = true;
  }
  projectMeshes[index].visible = true;
  descriptionContainer.style.opacity = '0';
  descriptionContainer.addEventListener('transitionend', () => {
    projectDescription.textContent = PROJECT_DESCRIPTIONS[index];
  });
  tween2.start();
}
function clickedNext() {
  if (index == NUM_PROJECTS - 1) {
    index = 0;
  } else {
    index++;
  }
  for (let i = 0; i < NUM_PROJECTS; i++) {
    projectMeshes[i].visible = false;
  }
  if (index == 0) {
    projectMeshes[NUM_PROJECTS - 1].visible = true;
  } else {
    projectMeshes[index - 1].visible = true;
  }
  projectMeshes[index].visible = true;
  descriptionContainer.style.opacity = '0';
  descriptionContainer.addEventListener('transitionend', () => {
    projectDescription.textContent = PROJECT_DESCRIPTIONS[index];
  });
  tween1.start();
}
function clickedProj(pidx) {
  window.open(PROJECT_URLS[pidx]);
}

let moving = false;

let ip;
let im;
function updateInitials() {
  ip = planet.rotation.x;
  im = pivot.rotation.x;
}

let prevxn = 0;
const tween1 = new TWEEN.Tween({x: 0}).to({x: -Math.PI/2}, 4000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate((coords) => {
    moving = true;
    planet.rotation.x = ip + coords.x;
    geo.rotation.x = ip + coords.x;
    pivot.rotation.x = im - coords.x;
    hem.rotation.x = -im + coords.x;
    let it = 1 + Math.sin(coords.x - prevxn + (Math.PI/2));
    hemlight.intensity = it > 0.5 ? it : 0.5;
    interactives.rotation.x = coords.x;
    for (let i = 0; i < NUM_PROJECTS; i++) {
      projectScenes[i].rotation.x = ip + (( Math.PI/2) * i) + coords.x;
    }
});
tween1.onComplete(function() {
  moving = false;
  prevxn += Math.PI/2;
  updateInitials();
  descriptionContainer.style.opacity = '1';
});

const tween2 = new TWEEN.Tween({x: 0}).to({x: Math.PI/2}, 4000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate((coords) => {
    moving = true;
    planet.rotation.x = ip + coords.x;
    geo.rotation.x = ip + coords.x;
    pivot.rotation.x = im + coords.x;
    hem.rotation.x = -im - coords.x;
    let it = 1 + Math.sin(-coords.x - prevxn + (Math.PI/2));
    hemlight.intensity = it > 0.5 ? it : 0.5;
    interactives.rotation.x = coords.x;
    for (let i = 0; i < NUM_PROJECTS; i++) {
      projectScenes[i].rotation.x = ip + (( Math.PI/2) * i) + coords.x;
    }
  });
  tween2.onComplete(function() {
    moving = false;
    prevxn += Math.PI/2;
    updateInitials();
    descriptionContainer.style.opacity = '1';
  });

  const tween3 = new TWEEN.Tween({x: -0.002}).to({x: 0.002}, 3000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate((coords) => {
    moving = true;
    car.rotateX(-0.0025);
  });
  tween3.onComplete(function() {
    moving = false;
    descriptionContainer.style.opacity = '1';
  });


//var controls = new OrbitControls(camera, renderer.domElement);
const animate = (t) => {
  
  if (loaded) {
    TWEEN.update(t);
    car.position.y = -.05 + .01*Math.sin(t/40);
    car.position.x += .001*Math.sin(t/60);
  }
  requestAnimationFrame(animate);
  //controls.update();
  //console.log(camera.position);
  //console.log(camera.rotation);
  composer.render();
  
}
animate();