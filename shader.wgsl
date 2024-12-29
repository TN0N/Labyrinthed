struct VertexInput {
    @location(0) position: vec3f,
    @location(1) texcoords: vec2f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(1) texcoords: vec2f,
}

struct FragmentInput {
    @location(1) texcoords: vec2f,
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

    output.position = camera.projectionMatrix * camera.viewMatrix * model.modelMatrix * vec4(input.position, 1);
    output.texcoords = input.texcoords;

    return output;
}

@fragment
fn fragment(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;

    // Diffuse shading (Lambertian reflection)
    let lightPosition = vec3(1.0, 2.0, 3.0); // Example light position
    let cameraPosition = vec3(0.0, 0.0, 5.0); // Example camera position
    let lightColor = vec3(1.0, 1.0, 1.0); // White light color
    let lightIntensity = 1.0; // Light intensity

    let texcoordsWithZ = vec3(input.texcoords, 0.0); // If you need to use texcoords with a z-value
    let lightDirection = normalize(lightPosition - texcoordsWithZ); // Light direction
    let viewDirection = normalize(cameraPosition - texcoordsWithZ); // View direction

    // Diffuse shading (Lambertian reflection)
    let diffuse = max(dot(normalize(texcoordsWithZ), lightDirection), 0.0);

    // Blinn-Phong specular reflection
    let halfVector = normalize(lightDirection + viewDirection);
    let specular = pow(max(dot(normalize(texcoordsWithZ), halfVector), 0.0), 16.0); // Shininess factor

    // Combine the diffuse and specular lighting components
    let color = (lightColor * diffuse * lightIntensity) + (lightColor * specular * lightIntensity);

    // Final color output
    output.color = vec4(color, 1.0);

    return output;
}
