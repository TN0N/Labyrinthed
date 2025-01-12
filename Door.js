import { quat, vec3, mat4 } from './lib/glm.js';
import { getTransformedAABB, aabbIntersection, calculatePenetration} from "./engine/core/SceneUtils.js";
import { Transform } from './engine/core/Transform.js';

export class Door {
    collisionBehaviour(self, other)
    {

    }
   
    constructor(door, open_direction, open_amount, buttons, domElement, {
        door_speed = 12
    } = {
        

    }) {
        this.door = door;
        this.domElement = domElement;
        this.doorTranslation = door.getComponentOfType(Transform).translation
        this.closed_position =[...this.doorTranslation];
        this.open_amount = open_amount;
        this.open_position = [...this.closed_position];
        this.buttons = buttons;
        this.open_cotrol = [0,0,0]

        switch (open_direction)
        {
            case 'up': this.open_position[1] += open_amount;  this.open_cotrol = [0, 1, 0]; break;
            case 'down': this.open_position[1] -= open_amount; this.open_cotrol = [0, -1, 0]; break;
            case 'right': this.open_position[0] += open_amount; this.open_cotrol = [1, 0, 0]; break;
            case 'left': this.open_position[0] -= open_amount; this.open_cotrol = [-1, 0, 0]; break;
            case 'forward': this.open_position[2] += open_amount; this.open_cotrol = [0, 0, 1]; break;
            case 'back': this.open_position[2] -= open_amount; this.open_cotrol = [0, 0, -1]; break;
        }

        this.door_speed = door_speed;
        this.opened = false;
    }

    update(t, dt) {
        this.opened = true;
        for (let button of this.buttons){
            if (!button.pushed)
                this.opened = false;
        }
        
        const speed = this.door_speed * dt;
        
        if (this.opened)
        {
            if (this.doorTranslation[0] < this.open_position[0])
                this.doorTranslation[0] += speed;
            else if (this.doorTranslation[0] > this.open_position[0])
                this.doorTranslation[0] -= speed;

            else if (this.doorTranslation[1] < this.open_position[1])
                this.doorTranslation[1] += speed;
            else if (this.doorTranslation[1] > this.open_position[1])
                this.doorTranslation[1] -= speed;

            else if (this.doorTranslation[2] < this.open_position[2])
                this.doorTranslation[2] += speed;
            else if (this.doorTranslation[0] > this.open_position[2])
                this.doorTranslation[2] -= speed;
        }
        else {
            if (this.doorTranslation[0] < this.closed_position[0])
                this.doorTranslation[0] += speed;
            else if (this.doorTranslation[0] > this.closed_position[0])
                this.doorTranslation[0] -= speed;

            else if (this.doorTranslation[1] < this.closed_position[1])
                this.doorTranslation[1] += speed;
            else if (this.doorTranslation[1] > this.closed_position[1])
                this.doorTranslation[1] -= speed;

            else if (this.doorTranslation[2] < this.closed_position[2])
                this.doorTranslation[2] += speed;
            else if (this.doorTranslation[0] > this.closed_position[2])
                this.doorTranslation[2] -= speed;
        }
        /*
        else if (!this.opened && this.doorTranslation != this.closed_position)
            vec3.scaleAndAdd(this.doorTranslation, this.doorTranslation, this.open_cotrol, this.door_speed);
        */
    }
}
