import { vec3 ,mat4 } from 'glm';

import { Camera } from './Camera.js';
import { Model } from './Model.js';
import { Transform } from './Transform.js';

export function getLocalModelMatrix(node) {
    const matrix = mat4.create();
    for (const transform of node.getComponentsOfType(Transform)) {
        mat4.mul(matrix, matrix, transform.matrix);
    }
    return matrix;
}

export function getGlobalModelMatrix(node) {
    if (node.parent) {
        const parentMatrix = getGlobalModelMatrix(node.parent);
        const modelMatrix = getLocalModelMatrix(node);
        return mat4.multiply(parentMatrix, parentMatrix, modelMatrix);
    } else {
        return getLocalModelMatrix(node);
    }
}

export function getLocalViewMatrix(node) {
    const matrix = getLocalModelMatrix(node);
    return mat4.invert(matrix, matrix);
}

export function getGlobalViewMatrix(node) {
    const matrix = getGlobalModelMatrix(node);
    return mat4.invert(matrix, matrix);
}

export function getProjectionMatrix(node) {
    const camera = node.getComponentOfType(Camera);
    return camera ? camera.projectionMatrix : mat4.create();
}

export function getModels(node) {
    return node.getComponentsOfType(Model);
}

export function getTransformedAABB(node) {
    // Transform all vertices of the AABB from local to global space.
    const matrix = getGlobalModelMatrix(node);
    if (node.aabb == null)
        return;

    // Apply the transformation to the AABB vertices.
    const { min, max } = node.aabb;
    const vertices = [
        [min[0], min[1], min[2]],
        [min[0], min[1], max[2]],
        [min[0], max[1], min[2]],
        [min[0], max[1], max[2]],
        [max[0], min[1], min[2]],
        [max[0], min[1], max[2]],
        [max[0], max[1], min[2]],
        [max[0], max[1], max[2]],
    ].map(v => vec3.transformMat4(v, v, matrix));
    // Find new min and max by component.
    const xs = vertices.map(v => v[0]);
    const ys = vertices.map(v => v[1]);
    const zs = vertices.map(v => v[2]);
    const newmin = [Math.min(...xs), Math.min(...ys), Math.min(...zs)];
    const newmax = [Math.max(...xs), Math.max(...ys), Math.max(...zs)];
    return { min: newmin, max: newmax };
}

export function intervalIntersection(min1, max1, min2, max2) {
    return !(min1 > max2 || min2 > max1);
}

export function aabbIntersection(aabb1, aabb2) {
    return intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0])
        && intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1])
        && intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2]);
}

export function calculatePenetration(aabb1, aabb2)
{
    const min1 = aabb1.min;
    const min2 = aabb2.min;
    const max1 = aabb1.max;
    const max2 = aabb2.max;
    const penetration_x = Math.min(max1[0] - min2[0], max2[0] - min1[0])
    const penetration_y = Math.min(max1[1] - min2[1], max2[1] - min1[1])
    const penetration_z = Math.min(max1[2] - min2[2], max2[2] - min1[2])
    return [penetration_x, penetration_y, penetration_z]
}