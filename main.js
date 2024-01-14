import { ResizeSystem } from "./common/engine/systems/ResizeSystem.js";
import { UpdateSystem } from "./common/engine/systems/UpdateSystem.js";
import { Camera, Model, Node, Transform } from "./common/engine/core.js";
import { GLTFLoader } from "./common/engine/loaders/GLTFLoader.js";
import { Light } from "./common/engine/core/Light.js";
import { Renderer } from "./common/engine/renderers/Renderer.js";
import { OrbitController } from "./common/engine/controllers/OrbitController.js";
import { RotateAnimator } from "./common/engine/animators/RotateAnimator.js";
import { getGlobalModelMatrix } from "./common/engine/core/SceneUtils.js";
import { LinearAnimator } from "./common/engine/animators/LinearAnimator.js";
import { FirstPersonController }from "./common/engine/controllers/FirstPersonController.js";
import { UnlitRenderer } from './common/engine/renderers/UnlitRenderer.js';
import { Physics } from "./Physics.js";
import { calculateAxisAlignedBoundingBox, mergeAxisAlignedBoundingBoxes } from '../../../common/engine/core/MeshUtils.js';
import { obnasanjeCamera, obnasanjeTla, obnasanjeGumb, obnasanjeKocka, obnasanjeStena, obnasanjeVrata } from "./Obnasanje.js";
import { Binary } from "./Binary.js";
async function init()
{
    await initComponents();
    //load bounding boxes
    scene.traverse(node => {
        const model = node.getComponentOfType(Model);
        if (!model) {
            return;
        }
        const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
        node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
    });
}
function initComponents()
{
    //Init tla8
    let tla = gltfLoader.loadNode('tla');
    tla.isGround = true;
    tla.velocity = [0,0,0];
    tla.addComponent(new Physics(scene, tla));
    tla.action = obnasanjeTla;
    let floorBin = gltfLoader.loadNode('floorBinary');
    floorBin.isGround = true;
    floorBin.velocity = [0,0,0];
    floorBin.addComponent(new Physics(scene, floorBin));
    floorBin.action = obnasanjeTla;
    
    
    //Init stene
    let stena01 = initStena('stena01');
    let stena02 = initStena('stena02');
    let stena03 = initStena('stena03');
    let stena04 = initStena('stena04');
    let stena05 = initStena('stena05');
    let stena06 = initStena('stena06');
    let stena07 = initStena('stena07');
    let stena08 = initStena('stena08');
    let stena09 = initStena('stena09');
    let stena10 = initStena('stena10');
    let stena11 = initStena('stena11');
    let stena12 = initStena('stena12');
    let stena13 = initStena('stena13');
    let stena14 = initStena('stena14');
    let stena15 = initStena('stena15');
    let stena16 = initStena('stena16');
    let stena17 = initStena('stena17');
    let stena18 = initStena('stena18');
    let stena19 = initStena('stena19');
    let stena20 = initStena('stena20');
    let stena21 = initStena('stena21');
    let stena22 = initStena('stena22');
    let stena23 = initStena('stena23');
    let stena24 = initStena('stena24');
    let stena25 = initStena('stena25');
    let stena26 = initStena('stena26');
    let stena27 = initStena('stena27');
    let stena28 = initStena('stena28');
    let stena29 = initStena('stena29');
    let stena30 = initStena('stena30');
    let stena31 = initStena('stena31');
    let stena32 = initStena('stena32');
    let pregrada11 = initStena('pregrada1.1');
    let pregrada12 = initStena('pregrada1.2');
    let pregrada13 = initStena('pregrada1.3');
    let pregrada21 = initStena('pregrada2.1');
    let pregrada22 = initStena('pregrada2.2');
    let pregrada23 = initStena('pregrada2.3');
    let pregrada31 = initStena('pregrada3.1');
    let pregrada32 = initStena('pregrada3.2');
    let pregrada33 = initStena('pregrada3.3');
    let pregrada41 = initStena('pregrada4.1');
    let pregrada42 = initStena('pregrada4.2');
    let pregrada43 = initStena('pregrada4.3');
    let pregrada51 = initStena('pregrada5.1');
    let pregrada52 = initStena('pregrada5.2');
    let pregrada53 = initStena('pregrada5.3');
    let door1 = initStena('door1');

    //Init kocke
    let kocka1 = initKocka('kocka1');
    let kocka2 = initKocka('kocka2');
    let kocka3 = initKocka('kocka3');
    let kocka4 = initKocka('kocka4');
    let kocka5 = initKocka('kocka5');
    let kocka6 = initKocka('kocka6');
    let kocka7 = initKocka('kocka7');
    let kocka8 = initKocka('kocka8');
    let kocka9 = initKocka('kocka9');
    let kocka10 = initKocka('kocka10');
    let kocka11 = initKocka('kocka11');
    let kocka12 = initKocka('kocka12');
    let kocka13 = initKocka('kocka13');

    //Init gumbi
    let gumb1 = initGumb('gumb1');
    let gumb2 = initGumb('gumb2');
    let gumb3 = initGumb('gumb3');
    let gumb4 = initGumb('gumb4');
    let gumb5 = initGumb('gumb5');
    let gumb6 = initGumb('gumb6');
    let gumb7 = initGumb('gumb7');
    let gumb8 = initGumb('gumb8');
    let gumb9 = initGumb('gumb9');
    let gumb10 = initGumb('gumb10');
    let gumb11 = initGumb('gumb11');
    let gumb12 = initGumb('gumb12');
    let gumb13 = initGumb('gumb13');
    let gumb14 = initGumb('gumb14');
    let gumb15 = initGumb('gumb15');
    let gumb16 = initGumb('gumb16');
    let gumb17 = initGumb('gumb17');
    let gumb18 = initGumb('gumb18');
    let gumb19 = initGumb('gumb19');
    let gumb20 = initGumb('gumb20');
    let gumb21 = initGumb('gumb21');
    let gumb22 = initGumb('gumb22');
    let gumb23 = initGumb('gumb23');
    let gumb24 = initGumb('gumb24');
    let gumb25 = initGumb('gumb25');

    //Init vrata
    let vrataL1 =  initVrata('vrataL1', 'North');
    let vrataR1 =  initVrata('vrataR1', 'South');
    let platforma1 = initVrata('platforma1', 'West');
    let vrataR2 =  initVrata('vrataR2', 'East');
    let vrataL2 =  initVrata('vrataL2', 'West');


    let platforma2 = initVrata('platforma2', 'North');
    let vrataR3 =  initVrata('vrataR3', 'South');
    let vrataL3 =  initVrata('vrataL3', 'North');

    let vrataR4 = initVrata('vrataR4', 'North');
    let vrataL4 = initVrata('vrataL4', 'South');

    let vrataP1 = initVrata('vrataP1', 'Down');
    let vrataP2 = initVrata('vrataP2', 'Down');
    let vrataP3 = initVrata('vrataP3', 'Down');

    let vrataL5 = initVrata('vrataL5', 'West');
    let vrataR5 = initVrata('vrataR5', 'East');

    //Binding gumbi to vrata
    bind([gumb1], [vrataL1, vrataR1]);
    bind([gumb2, gumb3], [platforma1]);
    bind([gumb4, gumb5], [vrataL2, vrataR2]);
    bind([gumb6, gumb14], [platforma2]);
    bind([gumb8, gumb11, gumb10, gumb12], [vrataL3, vrataR3]);
    bind([gumb15, gumb16, gumb17], [vrataL4, vrataR4]);
    bind([gumb18], [vrataP1]);
    bind([gumb19], [vrataP2]);
    bind([gumb20], [vrataP3]);
    bind([gumb21, gumb22, gumb23], [vrataL5, vrataR5]);
}
function initKocka(a)
{
    let kocka = gltfLoader.loadNode(a);
    kocka.isDynamic = true;
    kocka.velocity = [0, 0, 0];
    kocka.collidingObjects = [];
    kocka.isCube = true;
    kocka.addComponent(new Physics(scene, kocka));
    kocka.action = obnasanjeKocka;
    return kocka;
}
function initGumb(a)
{
    let gumb = gltfLoader.loadNode(a);
    gumb.velocity = [0,0,0];
    gumb.isPushed = false;
    gumb.collidingObjects = [];
    gumb.addComponent(new Physics(scene, gumb, bin));
    gumb.startPos = [...gumb.getComponentOfType(Transform).translation];
    gumb.endPos = [gumb.startPos[0], gumb.startPos[1]-0.25, gumb.startPos[2]];
    gumb.bindings = [];
    gumb.action = obnasanjeGumb;
    if(a == 'gumb24'){
        gumb.add0 = true;
    }else if(a == 'gumb25'){
        gumb.add1 = true;
    }
    return gumb;
}
function initStena(a)
{
    let stena = gltfLoader.loadNode(a);
    stena.isStatic = true;
    stena.isWall = true;
    stena.velocity = [0, 0, 0];
    stena.addComponent(new Physics(scene, stena));
    stena.action = obnasanjeStena;
    return stena;
}
function initVrata(a, openDirection = 'Up')
{
    let vrata =  gltfLoader.loadNode(a);
    let movement = 7;
    vrata.addComponent(new Physics(scene, vrata));
    vrata.velocity = [0,0,0];
    vrata.isStatic = true;
    vrata.startPos = [...vrata.getComponentOfType(Transform).translation];
    switch (openDirection)
    {
        case 'Up' : vrata.endPos = [vrata.startPos[0], vrata.startPos[1] + movement, vrata.startPos[2]]; break;
        case 'Down' : vrata.endPos = [vrata.startPos[0], vrata.startPos[1] - movement, vrata.startPos[2]]; break;
        case 'North' : vrata.endPos = [vrata.startPos[0] + movement, vrata.startPos[1], vrata.startPos[2]]; break;
        case 'South' : vrata.endPos = [vrata.startPos[0] - movement, vrata.startPos[1], vrata.startPos[2]]; break;
        case 'East' : vrata.endPos = [vrata.startPos[0], vrata.startPos[1], vrata.startPos[2] + movement]; break;
        case 'West' : vrata.endPos = [vrata.startPos[0], vrata.startPos[1], vrata.startPos[2] - movement]; break;
    }
    vrata.bindings = [];
    vrata.action = obnasanjeVrata;
    return vrata;
}
function bind(a = [], b = [])
{
    for (let i = 0; i < a.length; i++)
        for (let j = 0; j < b.length; j++)
        {
            a[i].bindings.push(b[j]);
            b[j].bindings.push(a[i]);
        }
}
var dotik = false;
var koga_premaknem = null;

function update(t, dt)
{
    scene.traverse(node => {
        for (const component of node.components)
        {
            component.update?.(t, dt);
        }
    })
    //[dotik, koga_premaknem] = physics.updateD(dt);
  
    if(koga_premaknem != null){
        bin.destroyPlatform(koga_premaknem);
    }
}

function render()
{
    renderer.render(scene, camera);
}
function resize({ displaySize: { width, height }})
{
    camera.getComponentOfType(Camera).aspect = width / height;
}

const canvas = document.querySelector("canvas");
//Init renderer
const renderer = new UnlitRenderer(canvas);
await renderer.initialize();

//Init scene
const gltfLoader = new GLTFLoader();
await gltfLoader.load("labirint.gltf");

const scene = gltfLoader.loadScene(gltfLoader.defaultScene);
const bin = new Binary(scene, gltfLoader);

const physics = new Physics(scene);
bin.display0();

bin.getEquasion();

const camera = await gltfLoader.loadNode('Camera');
camera.addComponent(new FirstPersonController(camera, document.body));
camera.addComponent(new Physics(scene, camera));
camera.isDynamic = true;
camera.isPlayer = true;
camera.velocity = camera.getComponentOfType(FirstPersonController).velocity;
camera.action = obnasanjeCamera;
const model = await gltfLoader.loadMesh('playerbox');
const box = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
camera.aabb = mergeAxisAlignedBoundingBoxes(box);


await init();
new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();