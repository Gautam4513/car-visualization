import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
const hdriLoader = new RGBELoader();
import GUI from 'lil-gui';
import gsap from "gsap"

const carData = [
  {
    name: "lamborghini",
    scale: new THREE.Vector3(0.5, 0.5, 0.5),
    lookAt: new THREE.Vector3(1, 0, -1),
    img: "./img/lamborghini.jpeg",
    body:"Object_26"
  },
  {
    name: "batman car",
    scale: new THREE.Vector3(0.35, 0.35, 0.35),
    lookAt: new THREE.Vector3(1, 0, 1),
    img: "./img/batman-car.jpeg",
    body:"Tumbler_Main_Body_body__0"
  },
  {
    name: "beast",
    scale: new THREE.Vector3(1, 1, 1),
    lookAt: new THREE.Vector3(1, 0, 1),
    img: "./img/beast.jpeg",
    body:"Object_9"
  },
  {
    name: "cyberpsycho car",
    scale: new THREE.Vector3(1.8, 1.8, 1.8),
    lookAt: new THREE.Vector3(-1, 0, 0),
    img: "./img/cybersycho-car.jpeg",
    body:"Object341_Material_#4631_0"
  }
]



const cardDiv = document.querySelector("#card-div");
let cards = ""
carData.forEach((car, index) => {
  cards += `
  <div  class="card w-full ">
          <div class="img p-2 w-full rounded-xl ">
            <img data-name="${car.name}" key="${index}" class="object-cover active:scale-95 rounded-xl mt-2 border-2 border-black" style="border-color:black;" src=${car.img} alt="not found">
          </div>
        </div>
  `
  console.log(car.img)
})
cardDiv.innerHTML = cards;





function getRandomValue() {
  let random = ((Math.random() * 255) + 1);
  console.log(random);
  return random;

}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("canvas") });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//add hdri
hdriLoader.load("./pond_bridge_night_1k.hdr", (hdri) => {
  hdri.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = hdri;
  scene.environment = hdri;
})



loader.load("./normal garage/scene.gltf", (gltf) => {
  let garage = gltf.scene;
  console.log(gltf)
  // car.scale.set(0.05, 0.05, 0.05);
  scene.add(garage);
  garage.position.y = -0.65
  garage.rotation.y = Math.PI / 2

})
console.log(carData[2].name)


let car;
let body;
const getCar=(index)=>{
  loader.load(`./${carData[index].name}/scene.gltf`, (gltf) => {
    car = gltf.scene;
    car.scale.set(carData[index].scale.x, carData[index].scale.y, carData[index].scale.z)
    scene.add(car);
    console.log(car)
    console.log(car.material)
    car.lookAt(carData[index].lookAt)
    // car.rotation.y=Math.PI-0.5;
    let carParts =[];
    body=scene.getObjectByName(carData[index].body);
    car.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // console.log(child.material.color);
        // carParts.push(child.material.color);
        // console.log(scene.getObjectByName("Object_9"))
        // console.log(child.name)

      }
    });
  })
}
getCar(2);

const disabalCarMenu=()=>{
  gsap.to(cardDiv,{
    x:`-100%`,
    duration:1,
    ease:"power2.inOut"
  })
}
const visibalCarMenu = ()=>{
  gsap.to(cardDiv,{
    x:`100%`,
    duration:1,
    ease:"power2.inOut"
  })
}

cardDiv.addEventListener("click", (e) => {
  // console.dir(e.target.attributes.key.value)
  disabalCarMenu();
  console.log(e.target.getAttribute("key"));
  scene.remove(car);
  getCar(e.target.getAttribute("key"));
  
  
})




const changeCar = document.querySelector("#changeCar");
changeCar.addEventListener("click",()=>{
  visibalCarMenu();
})


document.querySelector("#changeColor").addEventListener("input",(e)=>{
  body.material.color.set(e.target.value)
  
  
})



const cameraDefulatPosition = () => {
  camera.position.x = 0;
  // camera.position.x=8;
  camera.position.y = 2;
  // camera.position.y=2.5;
  camera.position.z = 5;
  camera.rotation.x = 0;
  camera.rotation.y = 0;
  // camera.rotation.y=Math.PI/2;
  camera.rotation.z = 0;
}
cameraDefulatPosition();
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableRotate=false;
controls.maxDistance = 4;
controls.minDistance = 0;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 2.8;
controls.enableDamping=true;
// controls.autoRotate=true;
controls.dampingFactor=0.03;





function animate() {
  renderer.setAnimationLoop(animate);
  renderer.render(scene, camera);
  // cube.rotation.x += 0.01;
  // camera.rotation.y += 0.01;
  controls.update();



}
animate();

window.addEventListener("resize", () => {
  camera.aspect = (window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})



renderer.render(scene, camera);




