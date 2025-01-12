struct VertexInput {
    @location(0) position: vec3f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
};

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
    @location(3) worldPosition: vec3f, 
};


struct FragmentInput {
    @location(1) texcoords: vec2f,
    @location(2) normal: vec3f,
    @location(3) worldPosition: vec3f, 
};

struct FragmentOutput {
    @location(0) color: vec4f,
}

struct CameraUniforms {
    viewMatrix: mat4x4f,
    projectionMatrix: mat4x4f,
};

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

struct Light {
    position: vec3f,
    color: vec3f,
    intensity: f32,
};



const lights: array<Light, 10> = array<Light, 10>(
    Light(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.8, 0.5), 1.0), 
    Light(vec3(70.0, 1.0, 35.0), vec3(0.8, 1.0, 0.8), 0.8),  
    Light(vec3(93.0, 1.0, 48.0), vec3(0.8, 1.0, 0.8), 0.8), 
    Light(vec3(97.0, 1.0, 103.0), vec3(0.8, 1.0, 0.8), 0.8),
    Light(vec3(151.0, 1.0, 19.0), vec3(0.8, 1.0, 0.8), 0.5),
    Light(vec3(153.0, 1.0, 36.0), vec3(0.8, 1.0, 0.8), 0.8), 
    Light(vec3(153.0, 1.0, 158.0), vec3(0.8, 1.0, 0.8), 0.8),  
    Light(vec3(47.0, 1.0, 148.0), vec3(0.8, 1.0, 0.8), 0.8), 
    Light(vec3(204.0, 1.0, 188.0), vec3(0.8, 1.0, 0.8), 0.8), 
    Light(vec3(1000.0, 1.0, 103.0), vec3(0.8, 1.0, 0.8), 0.8) 

);

@vertex
fn vertex(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    let worldPosition = model.modelMatrix * vec4(input.position, 1.0);
    output.position = camera.projectionMatrix * camera.viewMatrix * worldPosition;
    output.worldPosition = worldPosition.xyz; 
    output.texcoords = input.texcoords;
    output.normal = normalize(model.normalMatrix * input.normal);

    return output;
}


@fragment
fn fragment(input: FragmentInput) -> FragmentOutput {
    var output: FragmentOutput;

    let baseColor = textureSample(baseTexture, baseSampler, input.texcoords).rgb;

    let normal = normalize(input.normal);
    let fragPosition = input.worldPosition; 

    var finalColor = vec3(0.0);

    // calculate for every light
    for (var i = 0u; i < 10u; i++) {
        let light = lights[i];
        let lightDirection = normalize(light.position - fragPosition);
        let distance = length(light.position - fragPosition);

        // Diffuse NOT GOOD
        let diffuse = max(dot(normal, lightDirection), 0.0) + 0.45;

        // Specular NOT GOOD
        let viewPosition = vec3(1.0, 1.0, 1.0); // Camera position in world space
        let viewDirection = normalize(viewPosition - fragPosition);
        let halfVector = normalize(lightDirection + viewDirection);
        let specular = pow(max(dot(normal, halfVector), 0.0), 16.0) + 0.4;
        let attenuation = 1.0 / (1.0 + 0.005 * distance + 0.001 * distance * distance);
        let lightContribution = light.color * (specular + diffuse) * light.intensity * attenuation;
        finalColor += lightContribution;
    }

    let ambient = vec3(0.1, 0.1, 0.1);
    //finalColor += ambient;

    output.color = vec4(baseColor * finalColor, 1.0);
    //output.color = vec4(ambient, 1.0);
    return output;
}