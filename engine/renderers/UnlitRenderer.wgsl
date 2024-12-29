struct VertexInput {
    @location(0) position: vec3f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f, // Add this
};

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f, // Add this
};

struct FragmentInput {
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,  // Add normal data here
}
struct FragmentOutput {
    @location(0) color: vec4f,
}

struct CameraUniforms {
    viewMatrix: mat4x4f,
    projectionMatrix: mat4x4f,
}

struct ModelUniforms {
    modelMatrix: mat4x4f,
    normalMatrix: mat3x3f,
}

struct MaterialUniforms {
    baseFactor: vec4f,
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(1) @binding(0) var<uniform> model: ModelUniforms;
@group(2) @binding(0) var<uniform> material: MaterialUniforms;
@group(2) @binding(1) var baseTexture: texture_2d<f32>;
@group(2) @binding(2) var baseSampler: sampler;


@vertex
fn vertex(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    output.position = camera.projectionMatrix * camera.viewMatrix * model.modelMatrix * vec4(input.position, 1.0);
    output.texcoords = input.texcoords;
    output.normal = normalize(model.normalMatrix * input.normal);  

    return output;
}

@fragment
fn fragment(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;

    let baseColor = textureSample(baseTexture, baseSampler, input.texcoords).rgb;

    // Use the normal from the vertex shader
    let normal = normalize(input.normal);
    let lightPosition = vec3(1.0, 1.0, 1.0); // light position
    let lightColor = vec3(1.0, 1.0, 1.0); // White light
    let lightIntensity = 1.0;

    let fragPosition = vec3(input.texcoords, 0.0); 
    let lightDirection = normalize(lightPosition - fragPosition);
    let diffuse = max(dot(normal, lightDirection), 0.0);

    let viewPosition = vec3(0.0, 0.0, 5.0); // camera position
    let viewDirection = normalize(viewPosition - fragPosition);
    let halfVector = normalize(lightDirection + viewDirection);
    let specular = pow(max(dot(normal, halfVector), 0.0), 16.0); 

    let lighting = lightColor * (diffuse + specular) * lightIntensity;

    let finalColor = baseColor * lighting;

    output.color = vec4(finalColor, 1.0);

    return output;
}
