import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

//* antialias para evitar el dentado del modelo
//? RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xa3a3a3); // * color de fondo de la escena
//damos unos retoques
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

//? SCENE
const scene = new THREE.Scene();

//? CAMERA
/*
 * 1 campo de vision de 45
 * 2 aspect-ratio, como se adapta la camara a nuestra pantalla
 * 3 near como de cerca debe estar un elemento de la camara para que deje de renderizar
 * 4 far si un elemento esta mas lejor de 100 deja de renderzarse
 */
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

//? ORBITAL CONTROL
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(6, 6, 6); //* donde posicionamos la camara
orbit.update(); // debe ser colocado despues del cambio de camara, se va a actualizar todo el entorno en funcion al control de orbita

//? GRID
const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

//? IMPORTACION DEL MODELO
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

let myModel; // declaramos esta variable hacer accesible el modelom es este scope

//! la carpeta assets se creara cuando hagamos el deployment
rgbeLoader.load("./assets/MR_INT-005_WhiteNeons_NAD.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; // al entorno de la escena le agregamos las texturas (las luces hrd)

  gltfLoader.load("./assets/scene.gltf", function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    myModel = model; // por si quisiesemos animar al modelo
  });
}); //cargamos el mapa de luces

function animate(time = 1) {
  if (myModel) {
    myModel.rotation.y += 0.05; // Aplicar rotación solo si myModel no es null
  } //ejemplo de animacion del modelo
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

//! por si se cambia el tamaño de la ventana, para que no se rompa la escena
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
