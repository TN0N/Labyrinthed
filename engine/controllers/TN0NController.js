import { quat, vec3, mat4 } from 'glm';
import { getTransformedAABB, aabbIntersection, calculatePenetration} from "../core/SceneUtils.js";
import { Transform } from '../core/Transform.js';

export class TN0NController {
    collisionBehaviour(self, other)
    {
        const aabb1 = getTransformedAABB(self.hitbox);
        const aabb2 = getTransformedAABB(other.hitbox);

        let headTransform = this.head.getComponentOfType(Transform);
        let bodyTransform = this.body.getComponentOfType(Transform);
        if(other.node.static)
        {
            const bump_force = 1.2;
            const penetration = calculatePenetration(aabb1, aabb2);
            const min_penetration = Math.min(penetration);
            const min1 = aabb1.min;
            const min2 = aabb2.min;
            const max1 = aabb1.max;
            const max2 = aabb2.max;

            let movement = [0,0,0];


            let minDiff = Infinity;
            const diffa = vec3.sub(vec3.create(), aabb2.max, aabb1.min);
            const diffb = vec3.sub(vec3.create(), aabb1.max, aabb2.min);

            if (diffa[0] >= 0 && diffa[0] < minDiff) {
                minDiff = diffa[0]* bump_force;
                movement = [minDiff, 0, 0];
            }
            if (diffa[1] >= 0 && diffa[1] < minDiff) {
                minDiff = diffa[1];
                movement = [0, minDiff, 0];
            }
            if (diffa[2] >= 0 && diffa[2] < minDiff) {
                minDiff = diffa[2] * bump_force;
                movement = [0, 0, minDiff];
            }
            if (diffb[0] >= 0 && diffb[0] < minDiff) {
                minDiff = diffb[0]* bump_force;
                movement = [-minDiff, 0, 0];
            }
            if (diffb[2] >= 0 && diffb[2] < minDiff) {
                minDiff = diffb[2]* bump_force;
                movement = [0, 0, -minDiff];
            }

            if (penetration[0] < penetration[1] && penetration[0] < penetration[2]) 
                this.velocity[0] = 0;
            else if (penetration[1] < penetration[2])
                this.velocity[1] = 0
            else
                this.velocity[2] = 0;

            vec3.add(headTransform.translation, headTransform.translation, movement);
            vec3.add(bodyTransform.translation, bodyTransform.translation, movement);

            

            //vec3.add(headTransform.translation, headTransform.translation, movement);
            //vec3.add(bodyTransform.translation, bodyTransform.translation, movement);
            //const min_penetration = min(penetration)
        }
    }
   
    constructor(head, body, domElement, {
        pitch = 0,
        yaw = 0,
        velocity = [0, 0, 0],
        acceleration = 100,
        maxSpeed = 20,
        decay = 0.999,
        pointerSensitivity = 0.002,
        
    } = {}) {
        this.head = head;
        this.body = body;
        this.domElement = domElement;
        this.respawn = null;
        this.death_point = null;

        this.keys = {};

        this.pitch = pitch;
        this.yaw = yaw;

        this.velocity = velocity;
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.decay = decay;
        this.pointerSensitivity = pointerSensitivity;

        this.picking = false;
        this.picked = null;

        this.initHandlers();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);

        element.addEventListener('click', e => element.requestPointerLock(
            {
                unadjustedMovement: true,
            }
        ));
        doc.addEventListener('pointerlockchange', e => {
            if (doc.pointerLockElement === element) {
                doc.addEventListener('pointermove', this.pointermoveHandler);
            } else {
                doc.removeEventListener('pointermove', this.pointermoveHandler);
            }
        });
    }

    update(t, dt) {
        // Calculate forward and right vectors.
        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const forward = [-sin, 0, -cos];
        const right = [cos, 0, -sin];
        //const up = [0, 60, 0];
       
        const vertical_component = this.velocity[1];
        //debugger;
        
        // Map user input to the acceleration vector.
        const acc = vec3.create();
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyE']) {
            this.picking = true;
        }
        if (!this.keys['KeyE']) {
            this.picking = false;
            if (this.picked)
            {
                const throw_acc = vec3.create();
                vec3.add(throw_acc, throw_acc, forward);
                this.picked.velocity = [throw_acc[0] * 40, 20, throw_acc[2] * 40];
                this.picked.picked = false;
                this.picked = null;
            }
        }
        if (this.keys['KeyA']) {
            //vec3.sub(acc, acc, right);
        }
        if (this.keys['Space'] && this.velocity[1] == 0) {
            
            this.velocity[1] = 46;
        }
        // Update velocity based on acceleration.
        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);
        
        // If there is no user input, apply decay.
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            const decay = Math.exp(dt * Math.log(1 - this.decay));
            let new_speed = [this.velocity[0], 0, this.velocity[2]];
            vec3.scale(new_speed, [this.velocity[0], 0, this.velocity[2]], decay);
            vec3.add(this.velocity, [0, this.velocity[1] ,0], new_speed);
        }
        // Limit speed to prevent accelerating to infinity and beyond.
        const speed = vec3.length([this.velocity[0], 0, this.velocity[2]]);
        if (speed > this.maxSpeed){
            let new_speed = [this.velocity[0], 0, this.velocity[2]];
            vec3.scale(new_speed, [this.velocity[0], 0, this.velocity[2]], this.maxSpeed / speed);
            vec3.add(this.velocity, [0, this.velocity[1] ,0], new_speed);
        }
        //vec3.add(this.velocity, this.velocity, [0, vertical_component, 0]);

        let HeadTransform = this.head.getComponentOfType(Transform);
        let BodyTransform = this.body.getComponentOfType(Transform);
        if (HeadTransform) {
            // Update translation based on velocity.
            vec3.scaleAndAdd(HeadTransform.translation,
                HeadTransform.translation, this.velocity, dt);

            // Update rotation based on the Euler angles.
            const rotation = quat.create();
            quat.rotateY(rotation, rotation, this.yaw);
            quat.rotateX(rotation, rotation, this.pitch);
            HeadTransform.rotation = rotation;
        }
        if (BodyTransform) {
            // Update translation based on velocity.
            vec3.scaleAndAdd(BodyTransform.translation,
                BodyTransform.translation, this.velocity, dt);
            const rotation = quat.create();
            quat.rotateY(rotation, rotation, this.yaw);
            BodyTransform.rotation = rotation;
        }

        if (this.death_point && BodyTransform.translation[1] < this.death_point) {
            this.velocity = [0,0,0];
            if (this.respawn) {
                BodyTransform.translation = [...this.respawn];
                HeadTransform.translation = [...this.respawn];
            }
        }
    }
    pointermoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;

        this.pitch -= dy * this.pointerSensitivity;
        this.yaw   -= dx * this.pointerSensitivity;

        const twopi = Math.PI * 2;
        const halfpi = Math.PI / 2;

        this.pitch = Math.min(Math.max(this.pitch, -halfpi), halfpi);
        this.yaw = ((this.yaw % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}
