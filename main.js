import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
const hdriLoader = new RGBELoader();
import GUI from 'lil-gui';




function getRandomValue() {
 let random=  ((Math.random() * 255)+1 );
  console.log(random);
  return random;
  
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );

const renderer = new THREE.WebGLRenderer({canvas:document.querySelector("canvas")});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

//add hdri
hdriLoader.load("public/pond_bridge_night_1k.hdr",(hdri)=>{
  hdri.mapping=THREE.EquirectangularReflectionMapping;
  scene.background=hdri;
  scene.environment=hdri;
})



loader.load("./normal garage/scene.gltf",(gltf)=>{
  let garage = gltf.scene;
  console.log(gltf)
  // car.scale.set(0.05, 0.05, 0.05);
  scene.add(garage);
  garage.position.y=-0.65
  garage.rotation.y=Math.PI/2

})

loader.load("public/beast/scene.gltf",(gltf)=>{
  const car= gltf.scene;
  // car.scale.set(0.6, 0.6, 0.6)
  scene.add(car);
  
  // car.rotation.y=Math.PI-0.5;
  car.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
})






const cameraDefulatPosition = ()=>{
  camera.position.x=0;
  // camera.position.x=8;
  camera.position.y=2;
  // camera.position.y=2.5;
  camera.position.z=4;
  camera.rotation.x=0;
  camera.rotation.y=0;
  // camera.rotation.y=Math.PI/2;
  camera.rotation.z=0;
}
cameraDefulatPosition();
const controls = new OrbitControls( camera, renderer.domElement );
// controls.enableRotate=false;
controls.maxDistance =5;
controls.minDistance =0;
controls.enablePan=false;
controls.maxPolarAngle=Math.PI/2;
controls.minPolarAngle=Math.PI/2.8;





function animate() {
  renderer.setAnimationLoop( animate );
	renderer.render( scene, camera );
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  controls.update();



}
animate();

window.addEventListener("resize",()=>{
  camera.aspect =( window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth , window.innerHeight);
})

	

	renderer.render( scene, camera );




