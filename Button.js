import { quat, vec3, mat4 } from './lib/glm.js';
import { getTransformedAABB, aabbIntersection, calculatePenetration} from "./engine/core/SceneUtils.js";
import { Transform } from './engine/core/Transform.js';

export class Button {
    collisionBehaviour(self, other)
    {
        if (!other.node.static){
            if (!this.pushed)
            {
                if (this.add0)
                    this.bin.changeNumber(0);
                else if (this.add1)
                    this.bin.changeNumber(1);
                else if (this.respawn00){
                    this.player_controller.respawn = this.button.getComponentOfType(Transform).translation;
                }
                else if (this.respawn01)
                    this.player_controller.respawn = this.button.getComponentOfType(Transform).translation;
            }
            this.collision = true;
        }
    }
   
    constructor(button, door, domElement, {
    } = {}) {
        this.button = button;
        this.domElement = domElement;
        this.buttonTranslation = button.getComponentOfType(Transform).translation
        this.up_position =[this.buttonTranslation[0], this.buttonTranslation[1], this.buttonTranslation[2]];
        this.down_position = [this.up_position[0], this.up_position[1] - 0.2, this.up_position[2]];
        this.button_speed = 0.01;
        this.pushed = false;
        this.collision = false;
        this.door = door;
    }

    update(t, dt) {
        let buttonTransform = this.button.getComponentOfType(Transform);
        this.pushed = this.collision;
        if (this.pushed){
            if (buttonTransform.translation[1] > this.down_position[1])
                vec3.sub(buttonTransform.translation, buttonTransform.translation, [0, this.button_speed, 0]);
        }
        else if (!this.pushed && buttonTransform.translation[1] < this.up_position[1])
            vec3.add(buttonTransform.translation, buttonTransform.translation, [0, this.button_speed, 0]);
        this.collision = false;
    }
}
