import { vec3 } from "./lib/gl-matrix-module.js";
import { Transform } from "./common/engine/core.js";
import { getTransformedAABB } from "./common/engine/core/SceneUtils.js";
import { LinearAnimator } from "./common/engine/animators/LinearAnimator.js";
import { FirstPersonController } from "./common/engine/controllers/FirstPersonController.js";
let bin;
function grounded(a, b)
{
    const aBox = getTransformedAABB(a);
}
export async function obnasanjeKocka(a, b, c)
{
    const transform = a.getComponentOfType(Transform);
    if (!transform) {
        return false;
    }

    const aBox = getTransformedAABB(a);
    const bBox = getTransformedAABB(b);
    let gravity = 0.002;
    if (c)
    {
        if (!a.collidingObjects.includes(b))
            a.collidingObjects.push(b);
        if (aBox.min[1] >= bBox.max[1])
            vec3.add(transform.translation, transform.translation, [0, gravity,0]);
        
        else if (b.isPlayer || b.isStatic || b.isCube)
        {

            let minDiff = Infinity;
            let minDirection = [0, 0, 0];

            const diffa = vec3.sub(vec3.create(), bBox.max, aBox.min);
            const diffb = vec3.sub(vec3.create(), aBox.max, bBox.min);

            if (diffa[0] >= 0 && diffa[0] < minDiff) {
                minDiff = diffa[0];
                minDirection = [minDiff, 0, 0];
            }
            if (diffa[1] >= 0 && diffa[1] < minDiff) {
                minDiff = diffa[1];
                minDirection = [0, minDiff, 0];
            }
            if (diffa[2] >= 0 && diffa[2] < minDiff) {
                minDiff = diffa[2];
                minDirection = [0, 0, minDiff];
            }
            if (diffb[0] >= 0 && diffb[0] < minDiff) {
                minDiff = diffb[0];
                minDirection = [-minDiff, 0, 0];
            }
            if (diffb[2] >= 0 && diffb[2] < minDiff) {
                minDiff = diffb[2];
                minDirection = [0, 0, -minDiff];
            }
            
            vec3.add(transform.translation, transform.translation, minDirection);
            if (b.isPlayer && b.getComponentOfType(FirstPersonController).keys['Space'])
                transform.translation = [...b.getComponentOfType(Transform).translation];
        }
    }
    else
    {
        if (a.collidingObjects.includes(b))
            a.collidingObjects.splice(a.collidingObjects.indexOf(b), 1);
        if (a.collidingObjects.length == 0)
            vec3.sub(transform.translation, transform.translation, [0,gravity,0]);
    }  
}
export function obnasanjeGumb(a, b, c, bin)
{
    if (b.isGround)
        return;
    if (c && a.collidingObjects.length < 1 && a.getComponentOfType(LinearAnimator) == null)
    {
        a.addComponent(new LinearAnimator(a, { startPosition: a.getComponentOfType(Transform).translation, endPosition: a.endPos, duration: 0.5, loop: false }));
        a.collidingObjects.push(b);
        if(a.add1 == true){
            bin.changeNumber(1);
        }else if(a.add0)
            bin.changeNumber(0);
        for (var i in a.bindings)
            openDoor(a.bindings[i]);
    }
    else if (!c && a.collidingObjects.length >= 1 && a.collidingObjects.includes(b) && a.getComponentOfType(LinearAnimator) == null)
    {
        a.addComponent(new LinearAnimator(a, { startPosition: a.getComponentOfType(Transform).translation, endPosition: a.startPos, duration: 0.5, loop: false }));
        a.collidingObjects.splice(a.collidingObjects.indexOf(b), 1);
        for (var i in a.bindings)
            openDoor(a.bindings[i]);

    }
}
export function obnasanjeStena(a, b, c)
{
}
export function obnasanjeCamera(a, b, c)
{
    if (c)
    {
        if (!b.isStatic)
            return false;
        const aBox = getTransformedAABB(a);
        const bBox = getTransformedAABB(b);
        // Move node A minimally to avoid collision.
        const diffa = vec3.sub(vec3.create(), bBox.max, aBox.min);
        const diffb = vec3.sub(vec3.create(), aBox.max, bBox.min);

        let minDiff = Infinity;
        let minDirection = [0, 0, 0];
        
        if (diffa[0] >= 0 && diffa[0] < minDiff) {
            minDiff = diffa[0];
            minDirection = [minDiff, 0, 0];
        }
        if (diffa[1] >= 0 && diffa[1] < minDiff) {
            minDiff = diffa[1];
            minDirection = [0, minDiff, 0];
        }
        if (diffa[2] >= 0 && diffa[2] < minDiff) {
            minDiff = diffa[2];
            minDirection = [0, 0, minDiff];
        }
        if (diffb[0] >= 0 && diffb[0] < minDiff) {
            minDiff = diffb[0];
            minDirection = [-minDiff, 0, 0];
        }
        if (diffb[1] >= 0 && diffb[1] < minDiff) {
            minDiff = diffb[1];
            minDirection = [0, -minDiff, 0];
        }
        if (diffb[2] >= 0 && diffb[2] < minDiff) {
            minDiff = diffb[2];
            minDirection = [0, 0, -minDiff];
        }
        
        const transform = a.getComponentOfType(Transform);
        if (!transform) {
            return false;
        }

        vec3.add(transform.translation, transform.translation, minDirection);
    }
}
function openDoor(a)
{
    for (let i in a.bindings)
        if(a.bindings[i].collidingObjects < 1)
        {
            a.removeComponentsOfType(LinearAnimator);
            a.addComponent(new LinearAnimator(a, { startPosition: a.getComponentOfType(Transform).translation, endPosition: a.startPos, duration: 10, loop: false }));
            return false;
        }
    a.addComponent(new LinearAnimator(a, { startPosition: a.getComponentOfType(Transform).translation, endPosition: a.endPos, duration: 10, loop: false }));
}
export function obnasanjeVrata(a, b, c)
{
    
}
export function obnasanjeTla(a,b,c)
{

}
