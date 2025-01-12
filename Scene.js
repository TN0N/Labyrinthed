
import {
    Camera,
    Model,
    Node,
    Transform,
} from 'engine/core.js';

const scene_url = 'labirint.gltf';

export const gltfLoader = new GLTFLoader();
export const canvas = document.querySelector("canvas");
export const renderer = new MihaUnlitRenderer(canvas);
await renderer.initialize();

export const scene  = loadScene(gltfLoader, scene_url);
export const camera = loadCamera(gltfLoader);
async function loadScene(scene_url)
{
    return 
}
async function loadCamera(gltfLoader)
{
    return 
}
async function loadPlayer(){
    
}
async function loadObjects() {
    loadBin();
}
async function loadBin(scene)
{
    const bin = new Binary(scene, gltfLoader);
    bin.display0();
    bin.getEquasion();
}