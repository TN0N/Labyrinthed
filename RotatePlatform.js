import { quat, vec3, mat4 } from './lib/glm.js';
import { getTransformedAABB, aabbIntersection, calculatePenetration } from "./engine/core/SceneUtils.js";
import { Transform } from './engine/core/Transform.js';

export class RotatePlatform {
    collisionBehaviour(self, other) {
        // Handle collision behavior here if needed
    }

    constructor(platform, speed, direction, domElement, {
    } = {}) {
        this.platform = platform;
        this.speed = speed;
        this.direction = direction;
        this.rotationAxis = [1, 0, 0, 0];

        switch (direction) {
            case 'x':
                this.rotationAxis = [1, 0, 0, 0];
                break;
            case 'y':
                this.rotationAxis = [0, 1, 0, 0];
                break;
            case 'z':
                this.rotationAxis = [0, 0, 1, 0];
                break;
        }
    }

    update(t, dt) {
        let transform = this.platform.getComponentOfType(Transform);
        const angle = this.speed * dt;
        const rotationQuat = quat.create();
        quat.setAxisAngle(rotationQuat, this.rotationAxis, angle);
        quat.multiply(transform.rotation, transform.rotation, rotationQuat);
    }
}