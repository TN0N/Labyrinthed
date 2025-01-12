import { mat4 } from 'glm';

import * as WebGPU from '../WebGPU.js';

import { Camera } from '../core.js';

import {
    getLocalModelMatrix,
    getGlobalViewMatrix,
    getProjectionMatrix,
    getModels,
} from '../core/SceneUtils.js';

import { BaseRenderer } from './BaseRenderer.js';

const vertexBufferLayout = {
    arrayStride: 32,
    attributes: [
        {
            name: 'position',
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3',
        },
        {
            name: 'texcoords',
            shaderLocation: 1,
            offset: 12,
            format: 'float32x2',
        },
        {
            name: 'normal', 
            shaderLocation: 2,
            offset: 20,  
            format: 'float32x3',
        }
    ],
};

export class MihaUnlitRenderer extends BaseRenderer {
    constructor(canvas) {
        super(canvas);
        this.renderPrimitive = this.renderPrimitive.bind(this);
        this.renderModel = this.renderModel.bind(this);
        this.renderNode = this.renderNode.bind(this);
    }

    async initialize() {
        await super.initialize();
        const code = await fetch(new URL('MihaUnlitRenderer.wgsl', import.meta.url))
            .then(response => response.text());
        const module = this.device.createShaderModule({ code });
       
        this.pipeline = await this.device.createRenderPipelineAsync({
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this.device.createBindGroupLayout({
                        entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
                    }), // Camera
                    this.device.createBindGroupLayout({
                        entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
                    }), // Model
                    this.device.createBindGroupLayout({
                        entries: [
                            { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }, // Material
                            { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { viewDimension: '2d' } }, // Texture
                            { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {} }, // Sampler
                        ],
                    }), // Material
                ],
            }),
            vertex: {
                module,
                entryPoint: 'vertex',
                buffers: [vertexBufferLayout],
            },
            fragment: {
                module,
                entryPoint: 'fragment',
                targets: [{ format: this.format }],
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
        });
        this.recreateDepthTexture();
    }
    recreateDepthTexture() {
        this.depthTexture?.destroy();
        this.depthTexture = this.device.createTexture({
            format: 'depth24plus',
            size: [this.canvas.width, this.canvas.height],
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
    }

    prepareNode(node) {
        if (this.gpuObjects.has(node)) {
            return this.gpuObjects.get(node);
        }
    
        const modelUniformBuffer = this.device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    
        const modelBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(1),
            entries: [{ binding: 0, resource: { buffer: modelUniformBuffer } }],
        });
    
        const gpuObjects = { modelUniformBuffer, modelBindGroup };
        this.gpuObjects.set(node, gpuObjects);
        return gpuObjects;
    }

    prepareCamera(camera) {
        if (this.gpuObjects.has(camera)) {
            return this.gpuObjects.get(camera);
        }
    
        const cameraUniformBuffer = this.device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    
        const cameraBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{ binding: 0, resource: { buffer: cameraUniformBuffer } }],
        });
    
        const gpuObjects = { cameraUniformBuffer, cameraBindGroup };
        this.gpuObjects.set(camera, gpuObjects);
        return gpuObjects;
    }


    prepareTexture(texture) {
        if (this.gpuObjects.has(texture)) {
            return this.gpuObjects.get(texture);
        }
        const { gpuTexture } = this.prepareImage(texture.image, texture.isSRGB);
        const { gpuSampler } = this.prepareSampler(texture.sampler);
 
        const gpuObjects = { gpuTexture, gpuSampler };
        this.gpuObjects.set(texture, gpuObjects);
        return gpuObjects;
    }
    
    prepareMaterial(material) {
        if (this.gpuObjects.has(material)) {
            return this.gpuObjects.get(material);
        }
        const baseTexture = this.prepareTexture(material.baseTexture);
    
        const materialUniformBuffer = this.device.createBuffer({
            size: 16, 
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    
        const materialBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(2), // group 2 matches pipeline
            entries: [
                { binding: 0, resource: { buffer: materialUniformBuffer } },
                { binding: 1, resource: baseTexture.gpuTexture.createView() },
                { binding: 2, resource: baseTexture.gpuSampler },
            ],
        });
        const gpuObjects = { materialUniformBuffer, materialBindGroup };
        this.gpuObjects.set(material, gpuObjects);
    
        return gpuObjects;
    }

    render(scene, camera) {
        if (this.depthTexture.width !== this.canvas.width || this.depthTexture.height !== this.canvas.height) {
            this.recreateDepthTexture();
        }
        const encoder = this.device.createCommandEncoder();
        const renderPass = encoder.beginRenderPass({
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    clearValue: [1, 1, 1, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        });
        renderPass.setPipeline(this.pipeline);
    
        // Camera setup
        const cameraComponent = camera.getComponentOfType(Camera);
        const viewMatrix = getGlobalViewMatrix(camera);
        const projectionMatrix = getProjectionMatrix(camera);
        const { cameraUniformBuffer, cameraBindGroup } = this.prepareCamera(cameraComponent);
    
        if (cameraBindGroup) {
            this.device.queue.writeBuffer(cameraUniformBuffer, 0, viewMatrix);
            this.device.queue.writeBuffer(cameraUniformBuffer, 64, projectionMatrix);
            renderPass.setBindGroup(0, cameraBindGroup);
        } else {
            console.error("Camera bind group is undefined!");
        }
        
        this.renderNode(scene, renderPass);
    
        renderPass.end();
        this.device.queue.submit([encoder.finish()]);
    }

    renderNode(node, renderPass, modelMatrix = mat4.create()) {
        const localMatrix = getLocalModelMatrix(node);
        modelMatrix = mat4.multiply(mat4.create(), modelMatrix, localMatrix);

        const { modelUniformBuffer, modelBindGroup } = this.prepareNode(node);
        const normalMatrix = mat4.normalFromMat4(mat4.create(), modelMatrix);
        this.device.queue.writeBuffer(modelUniformBuffer, 0, modelMatrix);
        this.device.queue.writeBuffer(modelUniformBuffer, 64, normalMatrix);
        renderPass.setBindGroup(1, modelBindGroup);

        for (const model of getModels(node)) {
            this.renderModel(model, renderPass);
        }

        for (const child of node.children) {
            this.renderNode(child, renderPass, modelMatrix);
        }
    }

    renderModel(model, renderPass) {
        for (const primitive of model.primitives) {
            this.renderPrimitive(primitive, renderPass);
        }
    }

    renderPrimitive(primitive, renderPass) {
        const { materialUniformBuffer, materialBindGroup } = this.prepareMaterial(primitive.material);
        this.device.queue.writeBuffer(materialUniformBuffer, 0, new Float32Array(primitive.material.baseFactor));
        renderPass.setBindGroup(2, materialBindGroup);

        const { vertexBuffer, indexBuffer } = this.prepareMesh(primitive.mesh, vertexBufferLayout);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setIndexBuffer(indexBuffer, 'uint32');

        renderPass.drawIndexed(primitive.mesh.indices.length);
    }
}