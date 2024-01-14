import { Transform } from '../core.js';

import { vec3 } from '../../../lib/gl-matrix-module.js';

export class LinearAnimator {

    constructor(node, {
        startPosition = [0, 0, 0],
        endPosition = [0, 0, 0],
        startTime = performance.now() / 1000,
        duration = 1,
        loop = false,
    } = {}) {
        this.node = node;

        this.startPosition = startPosition;
        this.endPosition = endPosition;

        this.startTime = startTime;
        this.duration = duration;
        this.loop = loop;

        this.playing = true;
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    update(t, dt) {
        if (!this.playing) {
            return;
        }
        const linearInterpolation = (t - this.startTime) / this.duration;
        const clampedInterpolation = Math.min(Math.max(linearInterpolation, 0), 1);
        const loopedInterpolation = ((linearInterpolation % 1) + 1) % 1;
        this.updateNode(this.loop ? loopedInterpolation : clampedInterpolation);
    }

    updateNode(interpolation) {
        const transform = this.node.getComponentOfType(Transform);
        if (!transform) {
            return;
        }
        
        if (!this.loop && vec3.equals(vec3.fromValues(0,0,0), vec3.sub(new vec3.create(), transform.translation, this.endPosition)))
            this.node.removeComponentsOfType(LinearAnimator)
        else
            vec3.lerp(transform.translation, this.startPosition, this.endPosition, interpolation);
    }

}
