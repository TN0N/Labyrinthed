import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';
import { getTransformedAABB, aabbIntersection } from "./engine/core/SceneUtils.js";
import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';
import { Binary } from './Binary.js';
import { Physics } from './Physics.js';
import { getGlobalModelMatrix, getLocalModelMatrix } from './engine/core/SceneUtils.js';
import { OrbitController } from 'engine/controllers/OrbitController.js';
import { RotateAnimator } from 'engine/animators/RotateAnimator.js';
import { LinearAnimator } from 'engine/animators/LinearAnimator.js';
import { calculateAxisAlignedBoundingBox, mergeAxisAlignedBoundingBoxes } from './engine/core/MeshUtils.js';
import { TN0NController } from 'engine/controllers/TN0NController.js';
import { MihaUnlitRenderer } from './engine/renderers/MihaUnlitRenderer.js';
import { Box } from './Box.js';
import { quat, vec3 } from './lib/glm.js';
import { Button } from './Button.js';
import { Door } from './Door.js';
import { RotatePlatform } from './RotatePlatform.js';
import { MovingPlatform } from './MovingPlatform.js';

import {
    Camera,
    Model,
    Node,
    Transform,
} from 'engine/core.js';

import { Renderer } from './Renderer.js';
import { Light } from './Light.js';
const canvas = document.querySelector("canvas");
const renderer = new MihaUnlitRenderer(canvas);
await renderer.initialize();
let light = {
    position: [30, 1, 15],  // Example position
    ambient: [0.1, 0.1, 0.1],  // Ambient color
    diffuse: [1, 1, 1],  // Diffuse color
    specular: [1, 1, 1]  // Specular color
};
const gltfLoader = new GLTFLoader();
await gltfLoader.load("labirint.gltf");

let scene = gltfLoader.loadScene(gltfLoader.defaultScene);
scene.physics_objects = [];
const camera = await gltfLoader.loadNode('Camera');
const bin = new Binary(scene, gltfLoader);

let body;
let player_physics;
let render_physics;
let player_controller;

async function init()
{
    bin.display0();
    bin.getEquasion();
    initPlayer();
    initObjects();
}
async function initObjects()
{
    let respawn_point00 = await initButton('respawn00');
    respawn_point00.respawn00 = true;
    
    respawn_point00.player_controller = player_controller
    let respawn_point01 = await initButton('respawn01');
    respawn_point01.respawn01 = true;
    respawn_point01.player_controller = player_controller


    let button00 = await initButton('button00');
    let button01 = await initButton('button01');
    let button02 = await initButton('button02');
    let button03 = await initButton('button03');
    let button04 = await initButton('button04');
    let button05 = await initButton('button05');
    let button06 = await initButton('button06');
    let button07 = await initButton('button07');
    let button08 = await initButton('button08');
    let button09 = await initButton('button09');
    let button10 = await initButton('button10');
    let button11 = await initButton('button11');
    let button12 = await initButton('button12');
    let button13 = await initButton('button13');
    let button14 = await initButton('button14');
    let button15 = await initButton('button15');
    let button16 = await initButton('button16');
    let button17 = await initButton('button17');
    let button18 = await initButton('button18');
    let button19 = await initButton('button19');
    let button20 = await initButton('button20');
    let button21 = await initButton('button21');
    let button22 = await initButton('button22');
    let gumb24 = await initButton('gumb24');

    gumb24.add0 = true;
    gumb24.bin = bin;
    let gumb25 = await initButton('gumb25');
    gumb25.add1 = true;
    gumb25.bin = bin;

    initDoor('door00', 'left', 40, [button00]);
    initDoor('door01', 'up', 10, [button01]);
    initDoor('door02', 'up', 10, [button02, button03, button04, button05]);
    initDoor('door03', 'up', 10, [button06, button07, button08]);
    initDoor('door04', 'right', 3, [button09, button10]);
    initDoor('door05', 'up', 10, [button11]);
    initDoor('door06', 'up', 10, [button12, button13]);
    initDoor('door07', 'right', 3, [button14, button15]);
    initDoor('door08', 'forward', 3, [button16]);
    initDoor('door09', 'forward', 3, [button16, button17]);
    initDoor('door10', 'forward', 3, [button16, button17, button18]);
    initDoor('door11', 'up', 10, [button16, button17, button18]);
    initDoor('door12', 'up', 20, [button22], {door_speed: 2});
    initBox('box00');
    initBox('box01');
    initBox('box02');
    initBox('box03');
    initBox('box04');
    initBox('box05');
    initBox('box06');
    initBox('box07');
    initBox('box08');
    initBox('box09');
    initBox('box10');
    initBox('box11');
    initBox('box12');
    initBox('box13');
    initRotatingPlatform('platform00', 0.26,'z');
    initRotatingPlatform('platform01', 0.25, 'z');
    initRotatingPlatform('platform02', 0.23,'y');
    initRotatingPlatform('platform03', 0.24,'y');
    initRotatingPlatform('platform04', 0.25,'y');
    initRotatingPlatform('platform05', 0.26,'y');
    initRotatingPlatform('platform06', 0.27,'y');

    initMovingPlatform('platform07', 'forward', 50, 9);
    initMovingPlatform('platform08', 'forward', 50, 11);
    initMovingPlatform('platform09', 'forward', 50, 7);
    initMovingPlatform('platform10', 'forward', 50, 8);
    initMovingPlatform('platform11', 'forward', 50, 5);
    initMovingPlatform('platform12', 'forward', 50, 12);
    initMovingPlatform('platform13', 'forward', 50, 9);
    initMovingPlatform('platform14', 'forward', 50, 12);
    initMovingPlatform('platform15', 'forward', 50, 10);
    initMovingPlatform('platform16', 'forward', 50, 13);

    initStatic('tla00');
    initStatic('tla01');
    initStatic('tla02');
    initStatic('tla03');
    initStatic('tla04');
    initStatic('tla05');
    initStatic('tla06');
    initStatic('tla07');
    initStatic('tla08');
    initStatic('tla09');
    initStatic('tla10');
    initStatic('tla11');
    initStatic('tla12');
    initStatic('tla13');
    initStatic('tla14');
    initStatic('tla15');
    initStatic('tla16');
    initStatic('tla17');
    initStatic('tla18');
    initStatic('tla19');
    initStatic('tla20');
    initStatic('tla21');
    initStatic('tla22');
    initStatic('tla23');
    initStatic('tla24');
    initStatic('tla25');
    initStatic('tla26');
    initStatic('tla27');
    initStatic('tla28');
    initStatic('tla29');
    initStatic('tla30');
    initStatic('tla31');
    initStatic('tla33');
    initStatic('tla34');
    initStatic('tla35');
    initStatic('tla36');
    initStatic('tla37');
    initStatic('wall00');
    initStatic('wall01');
    initStatic('wall02');
    initStatic('wall03');
    initStatic('wall04');
    initStatic('wall05');
    initStatic('wall06');
    initStatic('wall07');
    initStatic('wall08');
    initStatic('wall09');
    initStatic('wall10');
    initStatic('wall11');
    initStatic('wall12');
    initStatic('wall13');
    initStatic('wall14');
    initStatic('wall15');
    initStatic('wall16');
    initStatic('wall17');
    initStatic('wall18');
    initStatic('wall19');
    initStatic('wall20');
    initStatic('wall21');
    initStatic('wall22');
    initStatic('wall23');
    initStatic('wall24');
    initStatic('wall25');
    initStatic('wall26');
    initStatic('wall27');
    initStatic('wall28');
    initStatic('wall29');
    initStatic('wall30');
    initStatic('wall31');
    initStatic('wall32');
    initStatic('wall33');
    initStatic('wall34');
    initStatic('wall35');
    initStatic('wall36');
    initStatic('wall37');
    initStatic('wall38');
}
async function initMovingPlatform(name, direction, amount, speed) {
    const platform = await gltfLoader.loadNode(name);
    const platformComponent = new MovingPlatform(platform, direction, amount, document.body, {speed});
    const boxes = platform.getComponentOfType(Model).primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    platform.aabb = mergeAxisAlignedBoundingBoxes(boxes);
    platformComponent.static = true;
    const platform_physics = new Physics(scene, platformComponent, platform, null);
    scene.addComponent(platformComponent);
    scene.addComponent(platform_physics);
}
async function initDoor(name, direction, amount, buttons) {
    const door = await gltfLoader.loadNode(name);
    const doorComponent = new Door(door, direction, amount, buttons, document.body);
    const boxes = door.getComponentOfType(Model).primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    door.aabb = mergeAxisAlignedBoundingBoxes(boxes);
    doorComponent.static = true;
    const door_physics = new Physics(scene, doorComponent, door, null);
    scene.addComponent(doorComponent);
    scene.addComponent(door_physics);
}
async function initButton(name) {
    const button = await gltfLoader.loadNode(name);
    const buttonComponent = new Button(button, document.body);
    const boxes = button.getComponentOfType(Model).primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    button.aabb = mergeAxisAlignedBoundingBoxes(boxes);
    const button_physics = new Physics(scene, buttonComponent, button, null);
    scene.addComponent(buttonComponent);
    scene.addComponent(button_physics);

    return buttonComponent;
}
async function initRotatingPlatform(name, speed, axis){
    const platform = await gltfLoader.loadNode(name);
    const platformComponent = new RotatePlatform(platform, speed, axis, document.body);
    scene.addComponent(platformComponent);
}
async function initStatic(name)
{
    const staticObject = await gltfLoader.loadNode(name);
    const boxes = staticObject.getComponentOfType(Model).primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    staticObject.aabb = mergeAxisAlignedBoundingBoxes(boxes);
    staticObject.static = true;
    scene.addComponent(new Physics(scene, staticObject, staticObject, null));
}
async function initBox(name)
{
    const box = await gltfLoader.loadNode(name);
    const boxComponent = new Box(box, document.body);
    const boxes = box.getComponentOfType(Model).primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    box.aabb = mergeAxisAlignedBoundingBoxes(boxes);
    boxComponent.gravity = true;
    box.box = true;
    const box_physics = new Physics(scene, boxComponent, box, null);
    scene.addComponent(boxComponent);
    scene.addComponent(box_physics);
    
}
async function initPlayer(){
    const head =  await gltfLoader.loadNode('head');
    body =    await gltfLoader.loadNode('body');
    player_controller = new TN0NController(head, body, document.body);
    const boxes = body.getComponentOfType(Model).primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    body.aabb = mergeAxisAlignedBoundingBoxes(boxes);
    player_controller.gravity = true;
    player_controller.player = true;
    player_controller.death_point = (await gltfLoader.loadNode('void')).getComponentOfType(Transform).translation[1];
    player_physics = new Physics(scene, player_controller, body, null);


    render_physics = await gltfLoader.loadNode('render_physics');
    const boxes2 = render_physics.getComponentOfType(Model).primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    render_physics.aabb = mergeAxisAlignedBoundingBoxes(boxes2);

    scene.body = body;
    scene.addComponent(player_controller);
    scene.addComponent(player_physics);
}
function update(time, dt) {
    scene.physics_objects = [player_physics];

    scene.traverse(node => {
        for (const component of node.components) {
            if (component instanceof Door || component instanceof RotatePlatform || component instanceof MovingPlatform){
                component.update?.(time, dt);
            }
            if ((component instanceof Physics) && aabbIntersection(getTransformedAABB(component.hitbox), getTransformedAABB(render_physics))){
                if (!(component.node instanceof Door || component.node instanceof RotatePlatform || component.node instanceof MovingPlatform)){
                    component.node.update?.(time, dt);
                }
                scene.physics_objects.push(component);
            }
        }
    });

    for (let a of scene.physics_objects) {
            a.update?.(time, dt);
    }

}
function render() {
    renderer.render(scene, camera, light);
}
function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

await init();
new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
