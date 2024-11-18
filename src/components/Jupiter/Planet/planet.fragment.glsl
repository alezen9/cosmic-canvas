#include ../../../utils/shaders/simplexNoise/simplexNoise2d.glsl

#define PI 3.14159265359
// #define NOISE_DENSITY 0.5 // Vertical noise frequency; higher magnitude makes noise pattern denser vertically.
// #define NOISE_INTENSITY 0.1 // Overall noise strength; higher increases noise visibility.
// #define NOISE_SPREAD 50.5 // Noise spread; higher values make noise pattern broader.

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uSunPosition;
uniform float uTime;
uniform float uAnimationSpeed;
uniform float uNoiseDensity;
uniform float uNoiseIntensity;
uniform float uNoiseSpread;

float getNoiseValue() {
    float theta = vUv.x * 2.0 * PI; 
    float phi = vUv.y * PI;

    // Map UVs to spherical coordinates for seamless noise
    // - theta: Horizontal (azimuthal) angle, wraps around the sphere
    // - phi: Vertical (polar) angle, scales horizontal noise contribution
    // - cos(phi): Ensures uniform scaling of both X (sin(theta)) and Y (cos(theta)),
    //   shrinking contributions near the poles to avoid seams and distortions.
    vec2 periodicCoords = vec2(
        sin(theta) * cos(phi),
        cos(theta) * cos(phi)
    ) * uNoiseSpread;

    float offset = uTime * uAnimationSpeed * 0.5;
    float baseNoise = simplexNoise2d(periodicCoords + vUv.y * uNoiseDensity + offset);
    float finerNoise = simplexNoise2d(periodicCoords * 2.0 + vUv.y * uNoiseDensity + offset * 0.5);
    return (baseNoise + finerNoise * 0.5) * uNoiseIntensity;
}


vec3 drawStripe(vec3 color, float from, float to, float noise){
    float scaledNoise = noise * 0.1;
    return color * step(from + scaledNoise, vUv.y) * (1.0 - step(to + scaledNoise, vUv.y));
}

vec3 drawEllipse(vec3 baseColor, vec3 ellipseColor, vec2 position, float width, float height, float noise) {
    vec2 distanceToEllipseCenter = vUv - position;
    
    // Normalization scales the x and y distances by the ellipse's width and height,
    // transforming the ellipse into a unit circle for distance comparison
    // (xDist^2 / width^2) + (yDist^2 / height^2)
    float normalizedDistanceToEllipseCenter = (distanceToEllipseCenter.x * distanceToEllipseCenter.x) / (width * width) +
                                              (distanceToEllipseCenter.y * distanceToEllipseCenter.y) / (height * height);
    float scaledNoise = noise * 1.5;
    normalizedDistanceToEllipseCenter += scaledNoise;
    float isInsideTheEllipse = step(normalizedDistanceToEllipseCenter, 1.0);
    return mix(baseColor, ellipseColor, isInsideTheEllipse);
}

void main(){
    vec3 color = vec3(0.0);
    float noise = getNoiseValue();

    // Stripes
    color += drawStripe(vec3(0.67, 0.71, 0.73), -0.1, 0.1, noise);
    color += drawStripe(vec3(0.13), 0.1, 0.13, noise);
    color += drawStripe(vec3(0.494,0.302,0.204), 0.13, 0.18, noise);
    color += drawStripe(vec3(0.13), 0.18, 0.185, noise);
    color += drawStripe(vec3(0.74, 0.79, 0.81), 0.185, 0.24, noise);
    color += drawStripe(vec3(0.596,0.459,0.353), 0.24, 0.26, noise);
    color += drawStripe(vec3(0.74, 0.79, 0.81), 0.26, 0.29, noise);

    // Stripe containing ellipses
    color += drawStripe(vec3(0.749,0.722,0.612), 0.29, 0.335, noise);
    color += drawStripe(vec3(0.659,0.557,0.408), 0.335, 0.38, noise);
    color += drawStripe(vec3(0.749,0.722,0.612), 0.38, 0.425, noise);

    // Ellipses
    color = drawEllipse(color, vec3(0.659, 0.557, 0.408), vec2(0.75, 0.357), 0.05, 0.05, noise);
    color = drawEllipse(color, vec3(0.786, 0.456, 0.230), vec2(0.75, 0.357), 0.039, 0.039, noise);
    color = drawEllipse(color, vec3(0.740, 0.354, 0.173), vec2(0.75, 0.357), 0.034, 0.034, noise);
    color = drawEllipse(color, vec3(0.595, 0.247, 0.077), vec2(0.75, 0.357), 0.0125, 0.010, noise);

    // Rest of the stripes
    color += drawStripe(vec3(0.827,0.839,0.796), 0.425, 0.455, noise);
    color += drawStripe(vec3(0.945,0.941,0.867), 0.455, 0.51, noise);
    color += drawStripe(vec3(0.89,0.588,0.345), 0.51, 0.525, noise);
    color += drawStripe(vec3(0.663,0.361,0.2), 0.525, 0.54, noise);
    color += drawStripe(vec3(0.933,0.78,0.576), 0.54, 0.555, noise);
    color += drawStripe(vec3(0.576,0.353,0.275), 0.555, 0.58, noise);
    color += drawStripe(vec3(0.69,0.239,0.11), 0.58, 0.595, noise);
    color += drawStripe(vec3(0.784,0.478,0.286), 0.595, 0.61, noise);
    color += drawStripe(vec3(0.91,0.843,0.718), 0.61, 0.62, noise);
    color += drawStripe(vec3(0.694,0.553,0.408), 0.62, 0.625, noise);
    color += drawStripe(vec3(0.973,0.925,0.808), 0.625, 0.63, noise);
    color += drawStripe(vec3(0.957,0.71,0.486), 0.63, 0.635, noise);
    color += drawStripe(vec3(0.561,0.251,0.153), 0.635, 0.645, noise);
    color += drawStripe(vec3(0.82,0.89,0.851), 0.645, 0.665, noise);
    color += drawStripe(vec3(0.784,0.478,0.286), 0.665, 0.68, noise);
    color += drawStripe(vec3(0.945,0.941,0.867), 0.68, 0.69, noise);
    color += drawStripe(vec3(0.827,0.671,0.506), 0.69, 0.72, noise);
    color += drawStripe(vec3(0.914,0.647,0.404), 0.72, 0.755, noise);
    color += drawStripe(vec3(0.843,0.259,0.149), 0.755, 0.77, noise);
    color += drawStripe(vec3(0.961,0.878,0.725), 0.77, 0.785, noise);
    color += drawStripe(vec3(0.98,0.957,0.863), 0.785, 0.795, noise);
    color += drawStripe(vec3(0.945,0.792,0.624), 0.795, 0.815, noise);
    color += drawStripe(vec3(0.89,0.631,0.42), 0.815, 0.835, noise);
    color += drawStripe(vec3(0.914,0.769,0.6), 0.835, 0.87, noise);
    color += drawStripe(vec3(0.835,0.553,0.376), 0.87, 0.92, noise);
    color += drawStripe(vec3(0.686,0.412,0.314), 0.92, 1.1, noise);


    // Normalize the normal and view direction
    vec3 normal = normalize(vNormal);
    vec3 toCameraDirection = normalize(cameraPosition - vPosition);
    vec3 toLightDirection = normalize(uSunPosition - vPosition);
    float sunFacingDirection = dot(uSunPosition, normal);

    // Ambient light
    vec3 ambientColor = vec3(1.0);
    float ambientIntensity = 0.075;
    vec3 ambientLight = ambientColor * ambientIntensity;
    
    // Point lighting
    vec3 pointLightColor = vec3(1.0);
    float pointLightIntensity = 0.75;
    float diffuseFactor = max(dot(normal, toLightDirection), 0.0);
    vec3 pointLight = pointLightColor * diffuseFactor * pointLightIntensity;
    
    // Apply Ambient and Point lights
    color *= ambientLight + pointLight;

    // Specular highlight (Blinn-Phong)
    vec3 specularColor = vec3(0.67, 0.54, 0.38);
    float shininessFactor = 16.0;
    float specularIntensity = 0.3;
    vec3 halfVector = normalize(toLightDirection + toCameraDirection);
    float specularFactor = pow(max(dot(normal, halfVector), 0.0), shininessFactor);
    vec3 specular = specularColor * specularFactor * specularIntensity;
    color += specular;

    // Calculate Fresnel effect
    vec3 fresnelColor = vec3(0.2, 0.13, 0.07);
    float fresnelStrength = 2.5;
    float fresnelFactor = pow(1.0 - dot(normal, toCameraDirection), fresnelStrength);
    vec3 fresnel = fresnelColor * fresnelFactor * 0.75;
    color += fresnel;

    // Darken a bit the whole color
    color = mix(color, vec3(0.0), 0.35);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
}
