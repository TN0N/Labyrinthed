//import { GUI } from '../../../lib/dat.gui.module.js';
//import { mat4 } from '../../../lib/gl-matrix-module.js';
import { quat, vec3, mat4 } from '../../../lib/gl-matrix-module.js';

import {
    Camera,
    Material,
    Model,
    Node,
    Primitive,
    Sampler,
    Texture,
    Transform,
} from '../../../common/engine/core.js';

import * as WebGL from '../../../common/engine/WebGL.js';
import { ResizeSystem } from '../../../common/engine/systems/ResizeSystem.js';
import { UpdateSystem } from '../../../common/engine/systems/UpdateSystem.js';
import { ImageLoader } from '../../../common/engine/loaders/ImageLoader.js';
import { JSONLoader } from '../../../common/engine/loaders/JSONLoader.js';
import { UnlitRenderer } from '../../../common/engine/renderers/UnlitRenderer.js';
import { GLTFLoader } from '../../../common/engine/loaders/GLTFLoader.js';
import { Binary } from './Binary.js';

import { FirstPersonController } from '../../../common/engine/controllers/FirstPersonController.js';

import {
    calculateAxisAlignedBoundingBox,
    mergeAxisAlignedBoundingBoxes,
} from '../../../common/engine/core/MeshUtils.js';

import { Physics } from './Physics.js';


const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');



const renderer = new UnlitRenderer(gl);

const loader = new GLTFLoader();

await loader.load('../common/models/noPortal2-better/noPortal2-better.gltf');

const scene = loader.loadScene(loader.defaultScene);
const loader2 = new GLTFLoader();
await loader2.load('../common/models/binary/numbers.gltf');
await loader2.loadScene('../common/models/binary/equasions.gltf');
await loader2.loadScene('../common/models/binary/doors.gltf');
await loader2.loadScene('../common/models/binary/platforms.gltf');
const camera = loader.loadNode('Camera');
camera.addComponent(new FirstPersonController(camera, canvas));
const bin = new Binary(scene, loader2);
camera.isDynamic = true;
//displays only 0
bin.display0();
//displays random equasion and sests the value
bin.getEquasion();
//initializes the doors
let indexDoos = [5, 6, 11, 15];
let doorArray = [];
for (let i = 0; i < 4; i++) {
    doorArray.push(loader2.loadNode(indexDoos[i]));
    scene.addChild(doorArray[i]);
}
doorArray[0].isStatic = true;
doorArray[1].isStatic = true;
//picks wich platforms destroy
bin.pickRandom();
//initializes them
bin.fillPlatforms();
/*
camera.aabb = {
    min: [-0.2, -0.2, -0.2],
    max: [0.2, 0.2, 0.2],
};
*/
//camera.body = loader.loadNode('Player');
camera.aabb = {     // x, z, y
    min: [-0.2, -1.2, -0.2],
    max: [0.2, 1.2, 0.2],
};

//loader.loadNode('kocka1').isDynamic = true;
loader.loadNode('kocka1').isMovable = true;
loader.loadNode('kocka2').isMovable = true;
loader.loadNode('kocka3').isMovable = true;
loader.loadNode('kocka4').isMovable = true;
loader.loadNode('kocka5').isMovable = true;
//loader.loadNode('kocka5').isStatic = false;
loader.loadNode('kocka1').isCube = true;
loader.loadNode('kocka2').isCube = true;
loader.loadNode('kocka3').isCube = true;
loader.loadNode('kocka4').isCube = true;
loader.loadNode('kocka5').isCube = true;

loader.loadNode('zid1').isStatic = true;
loader.loadNode('zid2').isStatic = true;
loader.loadNode('zid3').isStatic = true;
loader.loadNode('zid4').isStatic = true;

loader.loadNode('tla').isStatic = true;

loader.loadNode('vrataL1').isStatic = true;
loader.loadNode('vrataR1').isStatic = true;

loader.loadNode('vrataL2').isStatic = true;
loader.loadNode('vrataR2').isStatic = true;

loader.loadNode('floorBinary').isStatic = true;
loader.loadNode('floorBinary2').isStatic = true;
loader.loadNode('wall1').isStatic = true;
loader.loadNode('wall2').isStatic = true;
loader.loadNode('wall3').isStatic = true;
loader.loadNode('Cylinder.006').isStatic = true;
/*
loader.loadNode('ogrodjeVrata1').isStatic = true;
loader.loadNode('ogrodjeVrata1.001').isStatic = true;
loader.loadNode('ogrodjeVrata2').isStatic = true;
loader.loadNode('ogrodjeVrata2.001').isStatic = true;
*/

loader.loadNode('pregrada1.1').isStatic = true;
loader.loadNode('pregrada1.2').isStatic = true;
loader.loadNode('pregrada1.3').isStatic = true;

loader.loadNode('pregrada2.1').isStatic = true;
loader.loadNode('pregrada2.2').isStatic = true;
loader.loadNode('pregrada2.3').isStatic = true;

loader.loadNode('ogrodjeVrataL1').isStatic = true;
loader.loadNode('ogrodjeVrataR1').isStatic = true;
loader.loadNode('ogrodjeVrataL2').isStatic = true;
loader.loadNode('ogrodjeVrataR2').isStatic = true;

loader.loadNode('platforma').isStatic = true;


//loader.loadNode('gumb').isButton = true;
loader.loadNode('gumb1').isButton = true;
loader.loadNode('gumb2').isButton = true;
loader.loadNode('gumb3').isButton = true;
loader.loadNode('gumb4').isButton = true;
loader.loadNode('gumb5').isButton = true;
loader.loadNode('gumb6').isButton = true;
loader.loadNode('gumb7').isButton = true;
loader.loadNode('gumb8').isButton = true;

loader.loadNode('gumb1').isPushed = false;
loader.loadNode('gumb2').isPushed = false;
loader.loadNode('gumb3').isPushed = false;
loader.loadNode('gumb4').isPushed = false;
loader.loadNode('gumb5').isPushed = false;
loader.loadNode('gumb6').isPushed = false;
loader.loadNode('gumb7').isPushed = false;
loader.loadNode('gumb8').isPushed = false;


const physics = new Physics(scene);
scene.traverse(node => {
    const model = node.getComponentOfType(Model);
    if (!model) {
        return;
    }

    const boxes = model.primitives.map(primitive => calculateAxisAlignedBoundingBox(primitive.mesh));
    node.aabb = mergeAxisAlignedBoundingBoxes(boxes);
});


var dotik = false;
var koga_premaknem = null;
function update(time, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            //console.log(component)
            component.update?.(time, dt, dotik, koga_premaknem);
        }
    });
    //var dotik = false;
    [dotik, koga_premaknem] = physics.update(time, dt);
  
    if(koga_premaknem != null){
        bin.destroyPlatform(koga_premaknem);
    }
        
    //console.log(dotik);
    //console.log(koga_premaknem);
    //console.log(loader.loadNode('gumb1').isPushed);

    doorOpen(dt, "gumb1", null, "vrataL1", "vrataR1");

    platformMove(dt, "gumb2", "gumb3", "platforma");

    doorOpen(dt, "gumb4", "gumb5", "vrataL2", "vrataR2");

    gravitacijaKocka("kocka1", dt);
    gravitacijaKocka("kocka2", dt);
    gravitacijaKocka("kocka3", dt);

    gumbUp(dt, "gumb1");
    gumbUp(dt, "gumb2");
    gumbUp(dt, "gumb3");
    gumbUp(dt, "gumb4");
    gumbUp(dt, "gumb5");
    gumbUp(dt, "gumb6");
    gumbUp(dt, "gumb7");
    gumbUp(dt, "gumb8");
    binaryButtonPressed();
    lastDoorOpen();
    //console.log(loader.loadNode("gumb4"));
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height } }) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();

//checks if the last door needs to be opened
function lastDoorOpen(){
    const gumb = loader.loadNode("gumb8");
    if(gumb.isPushed){
        openDoor(1);
    }
}
//checks if anny of the buttons for binary game are pressed and sets the number if so
let pressedTime = 0;
let firstPress = false;
function binaryButtonPressed() {
    var gumb1 = loader.loadNode("gumb6");
    var gumb2 = loader.loadNode("gumb7");
    if (gumb1.isPushed) {
        if (firstPress == false) {
            pressedTime = performance.now();
            firstPress = true;
        } else {
            if (performance.now() - pressedTime > 700) {
                bin.changeNumber(0);
                firstPress = false;
            }
        }
    } else if (gumb2.isPushed) {
        if (firstPress == false) {
            pressedTime = performance.now();
            firstPress = true;
        } else {
            if (performance.now() - pressedTime > 700) {
                bin.changeNumber(1);
                if (bin.value == bin.goalValue)
                    openDoor(0);
                firstPress = false;
            }
        }

    } else if (firstPress)
        firstPress = false;
}
var prvaPosL = null;
var prvaPosR = null;
function doorOpen(dt, gumb, gumbDrugi, vrataL, vrataR) {
    var gumb1 = loader.loadNode(gumb);
    if (gumbDrugi == null) {
        if (gumb1.isPushed) {
            var vrataL1 = loader.loadNode(vrataL);
            const transform = vrataL1.getComponentOfType(Transform);
            const trenutniPos = transform.translation[2];
            if (prvaPosL == null) {
                prvaPosL = transform.translation[2];
            }
            //console.log(trenutniPos);
            //console.log(transform.translation[1]);
            if (transform && Math.abs(prvaPosL - trenutniPos) < 2) {
                vec3.scaleAndAdd(transform.translation,
                    transform.translation, [0, 0, 1], dt);
            }
            //console.log(transform.translation)
            if (vrataR != null) {
                var vrataR1 = loader.loadNode(vrataR);

                const transformR = vrataR1.getComponentOfType(Transform);
                const trenutniPosR = transformR.translation[2];
                if (prvaPosR == null) {
                    prvaPosR = transformR.translation[2];
                }

                if (transformR && Math.abs(prvaPosR - trenutniPosR) < 2) {
                    vec3.scaleAndAdd(transformR.translation,
                        transformR.translation, [0, 0, -1], dt);
                }
            }
            //console.log(transformR);
        }
        else {
            var vrataL1 = loader.loadNode(vrataL);

            const transform = vrataL1.getComponentOfType(Transform);
            const trenutniPos = transform.translation[2];
            if (prvaPosL == null) {
                prvaPosL = transform.translation[2];
            }

            if (transform && Math.abs(prvaPosL - trenutniPos) > 0.01) {
                vec3.scaleAndAdd(transform.translation,
                    transform.translation, [0, 0, -1], dt);
            }
            //console.log(transform.translation)

            if (vrataR != null) {
                var vrataR1 = loader.loadNode(vrataR);

                const transformR = vrataR1.getComponentOfType(Transform);
                const trenutniPosR = transformR.translation[2];
                if (prvaPosR == null) {
                    prvaPosR = transformR.translation[2];
                }

                if (transformR && Math.abs(prvaPosR - trenutniPosR) > 0.01) {
                    vec3.scaleAndAdd(transformR.translation,
                        transformR.translation, [0, 0, 1], dt);
                }
            }
        }
    }



    else {        // z dvemi gumbi
        var gumb2 = loader.loadNode(gumbDrugi);
        if (gumb1.isPushed && gumb2.isPushed) {
            var vrataL1 = loader.loadNode(vrataL);

            const transform = vrataL1.getComponentOfType(Transform);
            const trenutniPos = transform.translation[2];
            if (prvaPosL == null) {
                prvaPosL = transform.translation[2];
            }
            //console.log(trenutniPos);
            //console.log(transform.translation[1]);
            if (transform && Math.abs(prvaPosL - trenutniPos) < 2) {
                vec3.scaleAndAdd(transform.translation,
                    transform.translation, [0, 0, 1], dt);
            }
            //console.log(transform.translation)
            if (vrataR != null) {
                var vrataR1 = loader.loadNode(vrataR);

                const transformR = vrataR1.getComponentOfType(Transform);
                const trenutniPosR = transformR.translation[2];
                if (prvaPosR == null) {
                    prvaPosR = transformR.translation[2];
                }

                if (transformR && Math.abs(prvaPosR - trenutniPosR) < 2) {
                    vec3.scaleAndAdd(transformR.translation,
                        transformR.translation, [0, 0, -1], dt);
                }
            }
            //console.log(transformR);
        }
        else {
            var vrataL1 = loader.loadNode(vrataL);

            const transform = vrataL1.getComponentOfType(Transform);
            const trenutniPos = transform.translation[2];
            if (prvaPosL == null) {
                prvaPosL = transform.translation[2];
            }

            if (transform && Math.abs(prvaPosL - trenutniPos) > 0.01) {
                vec3.scaleAndAdd(transform.translation,
                    transform.translation, [0, 0, -1], dt);
            }
            //console.log(transform.translation)

            if (vrataR != null) {
                var vrataR1 = loader.loadNode(vrataR);

                const transformR = vrataR1.getComponentOfType(Transform);
                const trenutniPosR = transformR.translation[2];
                if (prvaPosR == null) {
                    prvaPosR = transformR.translation[2];
                }

                if (transformR && Math.abs(prvaPosR - trenutniPosR) > 0.01) {
                    vec3.scaleAndAdd(transformR.translation,
                        transformR.translation, [0, 0, 1], dt);
                }
            }
        }
    }
}

var prvaPosPlatform = null;
function platformMove(dt, gumbPrvi, gumbDrugi, platforma) {
    var gumb1 = loader.loadNode(gumbPrvi);
    var gumb2 = loader.loadNode(gumbDrugi);
    if (gumb1.isPushed && gumb2.isPushed) {
        var vrataL1 = loader.loadNode(platforma);

        const transform = vrataL1.getComponentOfType(Transform);
        const trenutniPos = transform.translation[2];
        if (prvaPosPlatform == null) {
            prvaPosPlatform = transform.translation[2];
        }
        //console.log(trenutniPos);
        //console.log(transform.translation[1]);
        if (transform && Math.abs(prvaPosPlatform - trenutniPos) < 2.5) {
            vec3.scaleAndAdd(transform.translation,
                transform.translation, [0, 0, 1], dt);
        }
    }
    else {
        var vrataL1 = loader.loadNode(platforma);

        const transform = vrataL1.getComponentOfType(Transform);
        const trenutniPos = transform.translation[2];
        if (prvaPosPlatform == null) {
            prvaPosPlatform = transform.translation[2];
        }

        if (transform && Math.abs(prvaPosPlatform - trenutniPos) > 0.01) {
            vec3.scaleAndAdd(transform.translation,
                transform.translation, [0, 0, -1], dt);
        }

    }
}

var gumbOrigPos = null;         // deluje samo zato, ker so vsi gumbi na isti višini... oh well
function gumbUp(dt, gumb) {
    var gumb1 = loader.loadNode(gumb);
    const transform = gumb1.getComponentOfType(Transform);
    if (gumbOrigPos == null) {
        gumbOrigPos = transform.translation[1];
    }
    if (transform.translation[1] < gumbOrigPos) {
        vec3.scaleAndAdd(transform.translation,
            transform.translation, [0, 1, 0], dt);
    }
    if (gumbOrigPos - 0.01 <= transform.translation[1] <= gumbOrigPos + 0.01) {
        gumb1.isPushed = false;
        //console.log("FALSE")
    }
    //console.log(transform.translation[1])
}


function gravitacijaKocka(objekt, dt) {
    var kocka = loader.loadNode(objekt);
    const transform = kocka.getComponentOfType(Transform);

    //if (transform.translation[1] > 5.99) {
    vec3.scaleAndAdd(transform.translation,
        transform.translation, [0, -1, 0], 0.05);
    //}

}

//opens the correct door
function openDoor(door) {
    if (door == 0) {
        scene.removeChild(doorArray[0]);
        scene.removeChild(doorArray[1]);
    } else {
        scene.removeChild(doorArray[2]);
        scene.removeChild(doorArray[3]);
    }
}




/*
const gui = new GUI();
const controller = camera.getComponentOfType(FirstPersonController);
gui.add(controller, 'pointerSensitivity', 0.0001, 0.01);
gui.add(controller, 'maxSpeed', 0, 10);
gui.add(controller, 'decay', 0, 1);
gui.add(controller, 'acceleration', 1, 100);
*/
document.querySelector('.loader-container').remove();
