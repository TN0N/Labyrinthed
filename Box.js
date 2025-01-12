import { quat, vec3, mat4 } from './lib/glm.js';
import { getTransformedAABB, aabbIntersection, calculatePenetration} from "./engine/core/SceneUtils.js";
import { Transform } from './engine/core/Transform.js';

export class Box {
    collisionBehaviour(self, other)
    {
        
        const aabb1 = getTransformedAABB(self.hitbox);
        const aabb2 = getTransformedAABB(other.hitbox);
        let selfTransform = this.box.getComponentOfType(Transform);
        let otherTransform = other.hitbox.getComponentOfType(Transform);

        let movement = [0,0,0];
        const bump_force = 1.2;
            const penetration = calculatePenetration(aabb1, aabb2);
            const min_penetration = Math.min(penetration);

            const min1 = aabb1.min;
            const min2 = aabb2.min;
            const max1 = aabb1.max;
            const max2 = aabb2.max;

            let minDiff = Infinity;
            const diffa = vec3.sub(vec3.create(), aabb2.max, aabb1.min);
            const diffb = vec3.sub(vec3.create(), aabb1.max, aabb2.min);

            if (diffa[0] >= 0 && diffa[0] < minDiff) {
                minDiff = diffa[0];
                movement = [minDiff, 0, 0];
            }
            if (diffa[1] >= 0 && diffa[1] < minDiff) {
                minDiff = diffa[1];
                movement = [0, minDiff, 0];
            }
            if (diffa[2] >= 0 && diffa[2] < minDiff) {
                minDiff = diffa[2];
                movement = [0, 0, minDiff];
            }
            if (diffb[0] >= 0 && diffb[0] < minDiff) {
                minDiff = diffb[0];
                movement = [-minDiff, 0, 0];
            }
            if (diffb[2] >= 0 && diffb[2] < minDiff) {
                minDiff = diffb[2];
                movement = [0, 0, -minDiff];
            }

        if(other.node.static)
        {
            if (penetration[0] < penetration[1] && penetration[0] < penetration[2]) 
                this.velocity[0] = 0
            if (penetration[1] < penetration[2])
                this.velocity[1] = 0
            else
                this.velocity[2] = 0
            //vec3.add(headTransform.translation, headTransform.translation, movement);
            //vec3.add(bodyTransform.translation, bodyTransform.translation, movement);
            //const min_penetration = min(penetration)
            
        }
        //else if (other.node.velocity){
        //    this.velocity=[other.node.velocity[0] * bump_force, this.velocity[1], other.node.velocity[2] * bump_force];
        //}
        if (other.node.static || other.node.player)
        {
            vec3.add(selfTransform.translation, selfTransform.translation, movement);
            if (other.node.player){
                if (other.node.picking && other.node.picked == null)
                {
                    this.picked = true;
                    other.node.picked = this;
                }
                else
                {
                    vec3.scale(other.node.velocity, other.node.velocity, 0.85);
                    this.velocity = [other.node.velocity[0],0,other.node.velocity[2]];
                    const rotation = quat.create();
                    quat.rotateY(rotation, rotation, other.node.yaw);
                    selfTransform.rotation = rotation;
                }
            }
        }
        else if (other.node.box) {
            let otherTransform = other.hitbox.getComponentOfType(Transform);
            vec3.add(selfTransform.translation, selfTransform.translation, vec3.scale(movement, movement, 0.5));
            vec3.add(otherTransform.translation, otherTransform.translation, vec3.scale(movement, movement, 0.5));
        }
        else {
            let otherTransform = other.hitbox.getComponentOfType(Transform);
            selfTransform.translation = [otherTransform.translation[0],selfTransform.translation[1], otherTransform.translation[2]]
        }
    }
   
    constructor(box, domElement, {
        velocity = [0, 0, 0],
        decay = 0.999,
    } = {}) {
        this.box = box;
        this.domElement = domElement;

        this.velocity = velocity;
        this.decay = decay;
        this.picked = false;
    }

    update(t, dt) {
        let boxTransform = this.box.getComponentOfType(Transform);
        
        if(!this.picked) {
            if (boxTransform) {
                vec3.scaleAndAdd(boxTransform.translation,
                boxTransform.translation, this.velocity, dt);
            }
            const decay = Math.exp(dt * Math.log(1 - this.decay));
            let new_speed = [this.velocity[0], 0, this.velocity[2]];
            vec3.scale(new_speed, [this.velocity[0], 0, this.velocity[2]], decay);
            vec3.add(this.velocity, [0, this.velocity[1] ,0], new_speed);
        }
        else {
            const otherTransform = this.box.parent.body.getComponentOfType(Transform);
        
            boxTransform.translation = [otherTransform.translation[0], otherTransform.translation[1] + 2, otherTransform.translation[2]];
            boxTransform.rotation = otherTransform.rotation;
        }
    }
}
