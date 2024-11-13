#include ../../utils/shaders/simplexNoise2d.glsl

#define PI 3.14159265359
#define WAVE_AMPLITUDE_SCALE 0.2

uniform float uTime;
uniform float uAnimationSpeed;
uniform float uRadius;

varying vec2 vUv;

float getPeriodicNoise() {
    float theta = vUv.x * 2.0 * PI;
    vec2 periodicCoords = vec2(sin(theta), cos(theta)) * 0.3;
    return simplexNoise2d(periodicCoords + vUv.y * -35.0 + uTime * uAnimationSpeed * 0.005) * 0.35;
}


float calculateSeamlessWave(float y, int frequency, float amplitude){
    float phase = uTime * uAnimationSpeed * 2.0 * PI;
    
    float wave = sin((vUv.x * float(frequency) * 2.0 * PI) + phase) * amplitude * WAVE_AMPLITUDE_SCALE;

    float baseNoise = getPeriodicNoise();

    float directionalNoise = simplexNoise2d(vUv * 5.0);
    float directionalFactor = (directionalNoise * 2.0) - 1.0;

    float noise = baseNoise * directionalFactor;

    return wave + baseNoise * 5.5 * amplitude * WAVE_AMPLITUDE_SCALE;
}

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
    vec3 color = vec3(0.05);
    
    // Stripe 1 - #241927 (dark purple-brown)
    color += drawHarmonicWavyStripe(
        -0.1,
        0.2,
        vec3(0.141, 0.098, 0.153),
        0,
        0.0,
        2,
        0.07
    );

    // Stripe 2 - #401A19 (dark reddish-brown)
    color += drawHarmonicWavyStripe(
        0.2,
        0.375,
        vec3(0.251, 0.102, 0.098),
        2,
        0.07,
        2,
        0.03
    );

    // Stripe 3 - #75381E (warm brown)
    color += drawHarmonicWavyStripe(
        0.375,
        0.41,
        vec3(0.459, 0.220, 0.118),
        2,
        0.03,
        3,
        0.05
    );

    // Stripe 4 - #845036 (earthy brown)
    color += drawHarmonicWavyStripe(
        0.41,
        0.44,
        vec3(0.518, 0.314, 0.212),
        3,
        0.05,
        1,
        0.015
    );

    // Stripe 5 - #894121 (deep red-brown)
    color += drawHarmonicWavyStripe(
        0.44,
        0.46,
        vec3(0.537, 0.255, 0.129),
        1,
        0.015,
        4,
        0.005
    );

    // Stripe 6 - #9F3921 (vibrant red-brown)
    color += drawHarmonicWavyStripe(
        0.46,
        0.50,
        vec3(0.624, 0.224, 0.129),
        4,
        0.005,
        3,
        0.025
    );

    // Stripe 6.5 - #FFFFFF (white)
    color += drawHarmonicWavyStripe(
        0.50,
        0.52,
        vec3(0.816, 0.541, 0.357),
        3,
        0.025,
        3,
        0.025
    );

    // Stripe 7 - #B9683B (warm orange-brown)
    color += drawHarmonicWavyStripe(
        0.52,
        0.58,
        vec3(0.725, 0.408, 0.231),
        3,
        0.025,
        1,
        0.03
    );

    // Stripe 8 - #D08A5B (light orange-brown)
    color += drawHarmonicWavyStripe(
        0.58,
        0.59,
        vec3(0.816, 0.541, 0.357),
        1,
        0.03,
        1,
        0.02
    );

    // Stripe 9 - #EAA87C (pale orange)
    color += drawHarmonicWavyStripe(
        0.59,
        0.61,
        vec3(0.918, 0.659, 0.486),
        1,
        0.02,
        5,
        0.02
    );

    // Stripe 10 - #DA6329 (bright orange-brown)
    color += drawHarmonicWavyStripe(
        0.61,
        0.66,
        vec3(0.855, 0.388, 0.161),
        5,
        0.02,
        2,
        0.04
    );

    // Stripe 11 - #EE7F32 (light orange)
    color += drawHarmonicWavyStripe(
        0.66,
        0.71,
        vec3(0.933, 0.498, 0.196),
        2,
        0.04,
        3,
        0.06
    );

    // Stripe 12 - #F89C4B (vibrant light orange)
    color += drawHarmonicWavyStripe(
        0.71,
        0.75,
        vec3(0.973, 0.612, 0.294),
        3,
        0.06,
        2,
        0.04
    );

    // Stripe 13 - #DC5C37 (red-orange)
    color += drawHarmonicWavyStripe(
        0.75,
        0.77,
        vec3(0.863, 0.361, 0.216),
        2,
        0.04,
        4,
        0.015
    );

    // Stripe 14 - #FCB683 (light peach-orange)
    color += drawHarmonicWavyStripe(
        0.77,
        0.79,
        vec3(0.988, 0.714, 0.514),
        4,
        0.015,
        2,
        0.02
    );

    // Stripe 15 - #FCC59C (soft peach)
    color += drawHarmonicWavyStripe(
        0.79,
        0.82,
        vec3(0.988, 0.773, 0.612),
        2,
        0.02,
        3,
        0.05
    );

    // Stripe 16 - #F6BF74 (light golden)
    color += drawHarmonicWavyStripe(
        0.82,
        1.1,
        vec3(0.965, 0.749, 0.455),
        3,
        0.05,
        0,
        0.0
    );

    gl_FragColor = vec4(color, 1.0);

    // #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}
