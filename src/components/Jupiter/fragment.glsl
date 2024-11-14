#include ../../utils/shaders/simplexNoise2d.glsl

#define PI 3.14159265359
#define WAVE_AMPLITUDE_SCALE 0.2

uniform float uTime;            // Time variable to animate the wave motion
uniform float uAnimationSpeed;  // Controls the speed of wave and noise animation

varying vec2 vUv;

/**
 * Generates periodic simplex noise to avoid seams on the sphere
 * Maps `vUv.x` to circular coordinates and uses `vUv.y` for latitude
 * @returns a periodic noise value scaled to 0.35.
 */
float getPeriodicNoise() {
    float theta = vUv.x * 2.0 * PI; // Map `vUv.x` to a circular angle (0 to 2π)
    vec2 periodicCoords = vec2(sin(theta), cos(theta)) * 0.3; // Circular coordinates for seamless noise
    float offset = uTime * uAnimationSpeed * 0.005; // Time-based offset for animation
    return simplexNoise2d(periodicCoords + vUv.y * -35.0 + offset) * 0.35;
}

/**
 * Generates a seamless, organic wave pattern by combining multiple sine waves
 * Creates a primary wave, a secondary wave and adds noise to create organic variations
 * @param y Vertical position in the shader (latitude)
 * @param frequency Controls frequency of the wave
 * @param amplitude Controls amplitude of the wave
 * @returns Combined wave value with noise for seamless organic patterns
 */
float calculateSeamlessWave(float y, int frequency, float amplitude) {
    float phaseOffset = uTime * uAnimationSpeed * 2.0 * PI; // Time-based phase shift for animation

    // Primary sine wave based on `vUv.x` and frequency
    float primaryWaveFrequency = float(frequency) * 2.0 * PI;
    float primaryWave = sin((vUv.x * primaryWaveFrequency) + phaseOffset) * amplitude * WAVE_AMPLITUDE_SCALE;

    // Secondary sine wave with cosine for smoother transitions
    float theta = vUv.x * 2.0 * PI;
    float secondaryWaveFrequency = float(frequency) * 1.5;
    float secondaryWave = sin((cos(theta) * secondaryWaveFrequency) + phaseOffset * 0.005) * amplitude * 0.75 * WAVE_AMPLITUDE_SCALE;

    float combinedWave = primaryWave + secondaryWave;  // Combine primary and secondary waves

    // Add directional noise for organic irregularity in wave pattern
    float baseNoise = getPeriodicNoise();
    float directionalNoise = simplexNoise2d(vUv * 5.0); // Additional noise to vary the wave direction
    float directionalFactor = (directionalNoise * 2.0) - 1.0; // Map `directionalNoise` to range [-1, 1]
    float noise = baseNoise * directionalFactor;

    return combinedWave + baseNoise * 5.5 * amplitude * WAVE_AMPLITUDE_SCALE;
}

/**
 * Draws a single wavy stripe between two vertical positions, with specified color and wave properties
 * Each stripe has a different frequency and amplitude at its top and bottom edges
 * @param from Starting vertical position of the stripe
 * @param to Ending vertical position of the stripe
 * @param color Color of the stripe
 * @param bottomWaveFrequency Frequency of wave at the stripe's bottom edge
 * @param bottomWaveAmplitude Amplitude of wave at the stripe's bottom edge
 * @param topWaveFrequency Frequency of wave at the stripe's top edge
 * @param topWaveAmplitude Amplitude of wave at the stripe's top edge
 * @returns Color of the stripe, with wave-based transparency for blending
 */
vec3 drawHarmonicWavyStripe(
    float from, float to, vec3 color,
    int bottomWaveFrequency, float bottomWaveAmplitude,
    int topWaveFrequency, float topWaveAmplitude
) {
    float y = vUv.y;

    // Calculate wavy edges for the stripe using the wave function
    float bottomEdgeWave = calculateSeamlessWave(from, bottomWaveFrequency, bottomWaveAmplitude);
    float topEdgeWave = calculateSeamlessWave(to, topWaveFrequency, topWaveAmplitude);

    float wavyFrom = from + bottomEdgeWave;  // Bottom edge with wave effect
    float wavyTo = to + topEdgeWave;         // Top edge with wave effect

    // Blend factor to fill stripe area based on position within the wavy edges
    float stripeBlendFactor = step(wavyFrom, y) * (1.0 - step(wavyTo, y));

    return color * stripeBlendFactor;
}

void main() {
    vec3 color = vec3(0.03); // Brighter base color for tones with slightly higher exposure

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

    gl_FragColor = vec4(color, 1.0);
}
