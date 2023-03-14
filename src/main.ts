import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

// scene 場面
// camera 撮る
// renderer 映像化
// object 写っているもの
// gui ユーザーインターフェース

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // 画角
  window.innerWidth / window.innerHeight, // アスペクト比
  0.1, // クリップする最小距離
  1000, // クリップする最大距離
);
const renderer = new THREE.WebGLRenderer();
const gui = new GUI();

// app という id を持つ要素に renderer を追加する
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// geometry 形状
// material 材質

// 正十二面体
const geometry = new THREE.IcosahedronGeometry(2, 2);
// const material1 = new THREE.MeshNormalMaterial();
// 透明
const material1 = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0xff0000,
  transparent: true,
  opacity: 0.5,
});
// const material2 = new THREE.MeshPhysicalMaterial({ color: 0xf00f00 });
// const material3 = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const cube = new THREE.Mesh(geometry, material1);
// const cube = new THREE.Mesh(geometry, material2);
// const cube = new THREE.Mesh(geometry, material3);

// シーンに追加
scene.add(cube);

// レンダリング
let animated = true;
function animate() {
  if (!animated) return;
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// オブジェクトをクリックした時に実行される
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const onClick = (event: MouseEvent) => {
  // マウスの位置を取得
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // マウスの位置からレイを飛ばす
  raycaster.setFromCamera(mouse, camera);
  // レイと衝突したオブジェクトを取得
  const intersects = raycaster.intersectObjects(scene.children);
  console.log(intersects);
  if (intersects.length > 0) {
    animated = !animated;
    animate();

    console.log(intersects[0].object);
    // オブジェクトの色を変更
    intersects[0].object.material.color = animated
      ? new THREE.Color(0xffff00)
      : new THREE.Color(0x0000ff);
  }
};
// document.getElementById('app')?.addEventListener('click', onClick);
renderer.domElement.addEventListener('click', onClick);

// cube.position.set(0, 0, 50); // オブジェクトの位置を設定
// camera.position.z = 5; // カメラの位置を z 軸方向に 5 だけ移動
camera.position.set(0, 0, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0)); // カメラの向きを設定

// GUI で操作できるようにする
gui.add(camera.position, 'x', -5, 5);
gui.add(camera.position, 'y', -5, 5);
gui.add(camera.position, 'z', -5, 5);
renderer.render(scene, camera);

// リサイズ（Windowのサイズが変わった時に実行される）
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// 光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

// helperを追加
const helper = new THREE.DirectionalLightHelper(light, 0.2);
scene.add(helper);

// 光源を回転
const tick1 = () => {
  light.position.x = Math.sin(Date.now() / 1000) * 3;
  light.position.z = Math.cos(Date.now() / 1000) * 3;
  light.position.y = Math.cos(Date.now() / 1000) * 3;
  renderer.render(scene, camera);
  requestAnimationFrame(tick1);
};
tick1();

/* rendererを無限に動かし続ける方法 */
// const tick = () => {
//   renderer.render(scene, camera);
//   requestAnimationFrame(tick);
// };
// tick();

// マウスで回転
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
