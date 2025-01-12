import { getTransformedAABB, aabbIntersection } from "./engine/core/SceneUtils.js";
import { quat, vec3, mat4 } from 'glm';
import { Transform } from './engine/core/Transform.js';

const gravity_strength = 50.8;

export class Physics {
    
    constructor(scene, node, hitbox, bin) {
        this.scene = scene;
        this.node = node;
        this.hitbox = hitbox;
        this.bin = bin;
    }

    update(t, dt) {
        const down = [0, -gravity_strength, 0];
        const up = [0, gravity_strength, 0];
        // Preveri za gravitacijo
        if (this.node.gravity == true)
        {
            
            
            const g = vec3.create();
            vec3.add(g, g, down);
            vec3.scaleAndAdd(this.node.velocity, this.node.velocity, down, dt);
            
        }
        
        for (let p of this.scene.physics_objects){
            { 
                if (p!= this){
                    if (this.resolveCollision(p.hitbox, this.hitbox)){
                        //console.log(this.node);
                        this.node.collisionBehaviour(this, p);
                    }
                }
            }
        }
        
    }


    resolveCollision(a, b) {
        const aBox = getTransformedAABB(a);
        const bBox = getTransformedAABB(b);

        return aabbIntersection(aBox, bBox);
    }
}
