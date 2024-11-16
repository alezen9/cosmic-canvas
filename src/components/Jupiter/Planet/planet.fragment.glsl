#include ../../../utils/shaders/simplexNoise2d.glsl

#define PI 3.14159265359
// #define PRIMARY_WAVE_AMPLITUDE_SCALE 0.2 // Primary wave height; higher makes oscillations stronger.
// #define SECONDARY_WAVE_FREQUENCY_SCALE 1.5 // Secondary wave frequency; higher adds finer detail.
// #define SECONDARY_WAVE_AMPLITUDE_SCALE 0.15 // Secondary wave height; higher makes secondary wave more noticeable.
// #define DIRECTIONAL_NOISE_GRANULARITY 5.5 // Detail of directional noise; higher gives finer noise texture.
// #define NOISE_DENSITY -40.0 // Vertical noise frequency; higher magnitude makes noise pattern denser vertically.
// #define NOISE_INTENSITY 0.35 // Overall noise strength; higher increases noise visibility.
// #define NOISE_SPREAD 1.0 // Noise spread; higher values make noise pattern broader.


uniform float uPrimaryWaveAmplitudeScale;
uniform float uSecondaryWaveFrequencyScale;
uniform float uSecondaryWaveAmplitudeScale;
uniform float uDirectionalNoiseGranularity;
uniform float uNoiseDensity;
uniform float uNoiseIntensity;
uniform float uNoiseSpread;


uniform float uTime;            // Time variable to animate the wave motion
uniform float uAnimationSpeed;  // Controls the speed of wave and noise animation
uniform vec3 uSunPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

/**
 * Generates seamless simplex noise for the sphere by mapping `vUv.x` to circular coordinates and `vUv.y` to latitude
 * @returns periodic noise scaled by uNoiseIntensity.
 */
float getPeriodicNoise() {
    float theta = vUv.x * 2.0 * PI; // Map `vUv.x` to a circular angle (0 to 2π)
    vec2 periodicCoords = vec2(sin(theta), cos(theta)) * uNoiseSpread; // Circular coordinates for seamless noise
    float offset = uTime * uAnimationSpeed * 0.005; // Time-based offset for animation
    return simplexNoise2d(periodicCoords + vUv.y * uNoiseDensity + offset) * uNoiseIntensity;
}

/**
 * Generates a seamless, organic wave by combining primary and secondary sine waves with noise
 * @param y Vertical position (latitude)
 * @param frequency Wave frequency
 * @param amplitude Wave amplitude
 * @returns Combined wave with noise for organic variation
 */
float calculateSeamlessWave(float y, int frequency, float amplitude) {
    float phaseOffset = uTime * uAnimationSpeed * 2.0 * PI; // Time-based phase shift for animation

    // Primary sine wave based on `vUv.x` and frequency
    float primaryWaveFrequency = float(frequency) * 2.0 * PI;
    float primaryWave = sin((vUv.x * primaryWaveFrequency) + phaseOffset) * amplitude * uPrimaryWaveAmplitudeScale;

    // Secondary sine wave with cosine for smoother transitions
    float theta = vUv.x * 2.0 * PI;
    float secondaryWaveFrequency = float(frequency) * uSecondaryWaveFrequencyScale;
    float secondaryWave = sin((cos(theta) * secondaryWaveFrequency) + phaseOffset * 0.005) * amplitude * uSecondaryWaveAmplitudeScale;

    float combinedWave = primaryWave + secondaryWave;

    // Add directional noise for organic irregularity in wave pattern
    float baseNoise = getPeriodicNoise() * y;
    float directionalNoise = simplexNoise2d(vUv * 5.0); // Additional noise to vary the wave direction
    float directionalFactor = (directionalNoise * 2.0) - 1.0; // Map `directionalNoise` to range [-1, 1]
    float noise = baseNoise * directionalFactor;

    return combinedWave + baseNoise * uDirectionalNoiseGranularity * amplitude * uPrimaryWaveAmplitudeScale;
}

/**
 * Draws a wavy stripe between two vertical positions with specified color and wave properties.
 * @param from Start vertical position
 * @param to End vertical position
 * @param color Stripe color
 * @param bottomWaveFrequency Wave frequency at bottom edge
 * @param bottomWaveAmplitude Wave amplitude at bottom edge
 * @param topWaveFrequency Wave frequency at top edge
 * @param topWaveAmplitude Wave amplitude at top edge
 * @returns Stripe color with wave-based transparency for blending
 */
vec3 drawHarmonicWavyStripe(
    float from, float to, vec3 color,
    int bottomWaveFrequency, float bottomWaveAmplitude,
    int topWaveFrequency, float topWaveAmplitude
) {
    float y = vUv.y;

    float bottomEdgeWave = calculateSeamlessWave(from, bottomWaveFrequency, bottomWaveAmplitude);
    float topEdgeWave = calculateSeamlessWave(to, topWaveFrequency, topWaveAmplitude);

    float wavyFrom = from + bottomEdgeWave;
    float wavyTo = to + topEdgeWave;

    float stripeBlendFactor = step(wavyFrom, y) * (1.0 - step(wavyTo, y));

    return color * stripeBlendFactor;
}


void main() {
    vec3 color = vec3(0.0);

    // Series of stripes with unique colors, frequencies, and amplitudes for each stripe's edge
    color += drawHarmonicWavyStripe(-0.1, 0.2, vec3(0.141, 0.098, 0.153), 0, 0.0, 2, 0.07); // Dark purple-brown
    color += drawHarmonicWavyStripe(0.2, 0.375, vec3(0.251, 0.102, 0.098), 2, 0.07, 2, 0.03); // Dark reddish-brown
    color += drawHarmonicWavyStripe(0.375, 0.41, vec3(0.459, 0.220, 0.118), 2, 0.03, 3, 0.05); // Warm brown
    color += drawHarmonicWavyStripe(0.41, 0.44, vec3(0.518, 0.314, 0.212), 3, 0.05, 1, 0.015); // Earthy brown
    color += drawHarmonicWavyStripe(0.44, 0.46, vec3(0.537, 0.255, 0.129), 1, 0.015, 4, 0.005); // Deep red-brown
    color += drawHarmonicWavyStripe(0.46, 0.50, vec3(0.624, 0.224, 0.129), 4, 0.005, 3, 0.025); // Vibrant red-brown
    color += drawHarmonicWavyStripe(0.50, 0.52, vec3(0.816, 0.541, 0.357) * 0.9, 3, 0.025, 3, 0.025); // Thin orange
    color += drawHarmonicWavyStripe(0.52, 0.58, vec3(0.725, 0.408, 0.231), 3, 0.025, 1, 0.03); // Warm orange-brown
    color += drawHarmonicWavyStripe(0.58, 0.59, vec3(0.816, 0.541, 0.357), 1, 0.03, 1, 0.02); // Light orange-brown
    color += drawHarmonicWavyStripe(0.59, 0.61, vec3(0.918, 0.659, 0.486), 1, 0.02, 5, 0.02); // Pale orange
    color += drawHarmonicWavyStripe(0.61, 0.66, vec3(0.855, 0.388, 0.161), 5, 0.02, 2, 0.04); // Bright orange-brown
    color += drawHarmonicWavyStripe(0.66, 0.71, vec3(0.933, 0.498, 0.196), 2, 0.04, 3, 0.06); // Light orange
    color += drawHarmonicWavyStripe(0.71, 0.75, vec3(0.973, 0.612, 0.294), 3, 0.06, 2, 0.04); // Vibrant light orange
    color += drawHarmonicWavyStripe(0.75, 0.77, vec3(0.863, 0.361, 0.216), 2, 0.04, 4, 0.015); // Red-orange
    color += drawHarmonicWavyStripe(0.77, 0.79, vec3(0.988, 0.714, 0.514), 4, 0.015, 2, 0.02); // Light peach-orange
    color += drawHarmonicWavyStripe(0.79, 0.82, vec3(0.988, 0.773, 0.612), 2, 0.02, 3, 0.05); // Soft peach
    color += drawHarmonicWavyStripe(0.82, 1.1, vec3(0.965, 0.749, 0.455), 3, 0.05, 0, 0.0); // Light golden

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
    float pointLightIntensity = 1.0;
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
    vec3 fresnel = fresnelColor * fresnelFactor * 0.5;
    color += fresnel;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
}
