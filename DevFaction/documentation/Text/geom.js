import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import dat from 'dat.gui';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100);
camera.position.set(0,1,3);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(Math.min(2,window.devicePixelRatio));
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera,renderer.domElement);

//lights
var ambLight = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambLight);

var pointLight = new THREE.PointLight(0xffffff,0.9,1);
pointLight.position.set(2,1,2);
scene.add(pointLight);


// defining material to be used
var material = new THREE.MeshStandardMaterial({color: 0xff6666});

// actual geometries
var geom1 = new THREE.BoxBufferGeometry(1,1,1);
var geom2 = new THREE.SphereBufferGeometry(0.7,32,32);
var geom3 = new THREE.TorusBufferGeometry(0.7,0.4,64,64);
var geom4 = new THREE.ConeBufferGeometry(0.7,0.7,64);



// meshes
var cube = new THREE.Mesh(geom1,material);
scene.add(cube);

var sphere = new THREE.Mesh(geom2,material);
sphere.position.x = -2;
scene.add(sphere);

var torus = new THREE.Mesh(geom3,material);
torus.position.x = 2;
scene.add(torus);

var cone = new THREE.Mesh(geom4,material);
cone.position.y = -1.3;
scene.add(cone);


var floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(4,4),
    new THREE.MeshStandardMaterial({color:0x333333})
);
floor.position.y = -1.65;
floor.rotation.x = -Math.PI/2
scene.add(floor);

function animate(){
    requestAnimationFrame(animate);

    renderer.render(scene,camera);
}
animate();