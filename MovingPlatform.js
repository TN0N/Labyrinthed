import { quat, vec3, mat4 } from './lib/glm.js';
import { getTransformedAABB, aabbIntersection, calculatePenetration} from "./engine/core/SceneUtils.js";
import { Transform } from './engine/core/Transform.js';

export class MovingPlatform {
    collisionBehaviour(self, other)
    {

    }
   
    constructor(platform, direction, movement_amount, domElement, {
        speed = 12
    } = {
        

    }) {
        this.platform = platform;
        this.domElement = domElement;
        this.platformTranslation = platform.getComponentOfType(Transform).translation
        this.first_position =[...this.platformTranslation];
        this.movement_amount = movement_amount;
        this.second_position = [...this.first_position];
        this.move_cotrol = [0,0,0]
        this.position = 1;

        switch (direction)
        {
            case 'up': this.second_position[1] += movement_amount;  this.move_cotrol = [0, 1, 0]; break;
            case 'down': this.second_position[1] -= movement_amount; this.move_cotrol = [0, -1, 0]; break;
            case 'right': this.second_position[0] += movement_amount; this.move_cotrol = [1, 0, 0]; break;
            case 'left': this.second_position[0] -= movement_amount; this.move_cotrol = [-1, 0, 0]; break;
            case 'forward': this.second_position[2] += movement_amount; this.move_cotrol = [0, 0, 1]; break;
            case 'back': this.second_position[2] -= movement_amount; this.move_cotrol = [0, 0, -1]; break;
        }

        this.speed = speed;
    }

    update(t, dt) {
        const speed = this.speed * dt;
    const tolerance = 1;

    // Check and update position based on platformTranslation and tolerance
    if (
        Math.abs(this.platformTranslation[0] - this.second_position[0]) <= tolerance &&
        Math.abs(this.platformTranslation[1] - this.second_position[1]) <= tolerance &&
        Math.abs(this.platformTranslation[2] - this.second_position[2]) <= tolerance
    ) {
        this.position = 2;
    } else if (
        Math.abs(this.platformTranslation[0] - this.first_position[0]) <= tolerance &&
        Math.abs(this.platformTranslation[1] - this.first_position[1]) <= tolerance &&
        Math.abs(this.platformTranslation[2] - this.first_position[2]) <= tolerance
    ) {
        this.position = 1;
    }

    // Helper function to update translation
    const moveTowards = (current, target, speed) => {
        if (current < target) {
            return Math.min(current + speed, target);
        } else if (current > target) {
            return Math.max(current - speed, target);
        }
        return current; // No change needed
        };

        // Move the platform based on the current position
        if (this.position === 1) {
            this.platformTranslation[0] = moveTowards(this.platformTranslation[0], this.second_position[0], speed);
            this.platformTranslation[1] = moveTowards(this.platformTranslation[1], this.second_position[1], speed);
            this.platformTranslation[2] = moveTowards(this.platformTranslation[2], this.second_position[2], speed);
        } else if (this.position === 2) {
            this.platformTranslation[0] = moveTowards(this.platformTranslation[0], this.first_position[0], speed);
            this.platformTranslation[1] = moveTowards(this.platformTranslation[1], this.first_position[1], speed);
            this.platformTranslation[2] = moveTowards(this.platformTranslation[2], this.first_position[2], speed);
        }
    }
}
