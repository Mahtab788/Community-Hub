import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import dat from 'dat.gui';


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100);
camera.position.set(0,0,3);

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x222222);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(3,window.devicePixelRatio));
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera,renderer.domElement);
var gui = new dat.GUI();


var object = {
    color: 0x66ff66
}

var geometry = new THREE.BoxBufferGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: object.color});
var cube = new THREE.Mesh(geometry,material);

scene.add(cube);


gui.addColor(object,'color').onChange(() => {
    cube.material.color.set(object.color)
});



animate();
function animate(){
    requestAnimationFrame(animate);
    cube.rotation.x += 0.009;
    cube.rotation.y += 0.01;
    

    renderer.render(scene,camera);
}