#include ../../utils/shaders/simplexNoise3d.glsl

#define PI 3.14159265359

uniform float uTime;
uniform float uAnimationSpeed;
uniform float uBeltFrequency;
uniform float uTurbulenceNoiseFrequency;
uniform float uBeltZoneNoiseFrequency;
uniform float uBeltZoneNoiseAmplitude;
uniform float uBeltZoneOuterEdgeSoftness;
uniform float uBeltZoneInnerEdgeSoftness;

varying vec2 vUv;

vec3 calculateTurbulentBeltZoneColor(vec3 pos, float from, float to, vec3 beltZoneColor, float turbulenceIntensity) {
    float yPos = pos.y;
    float distortedX = sin(pos.x * uBeltFrequency * 4.0) * 0.002;
    float distortedY = pos.y + distortedX + 1.2;
    float turbulenceNoise = simplexNoise3d(vec3(xDistortion, distortedY, pos.z) * uTurbulenceNoiseFrequency) * turbulenceIntensity * 0.5;
    yPos += turbulenceNoise;
    float blendFactor = smoothstep(from - uBeltZoneOuterEdgeSoftness, from + uBeltZoneInnerEdgeSoftness, yPos) *
                        smoothstep(to + uBeltZoneOuterEdgeSoftness, to - uBeltZoneInnerEdgeSoftness, yPos);
    blendFactor = clamp(blendFactor * (0.5 + 0.5 * turbulenceNoise), 0.0, 1.0);
    return beltZoneColor * blendFactor;
}

void main() {
    vec3 position = vec3(vUv, uTime * uAnimationSpeed);
    vec3 color = vec3(0.0);

    color += calculateTurbulentBeltZoneColor(position, -0.1, 0.1, vec3(0.11, 0.2, 0.2), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.1, 0.2, vec3(0.17, 0.27, 0.27), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.2, 0.24, vec3(0.19, 0.32, 0.32), 0.02);
    color += calculateTurbulentBeltZoneColor(position, 0.24, 0.27, vec3(0.39, 0.31, 0.19), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.27, 0.32, vec3(0.42, 0.26, 0.05), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.32, 0.36, vec3(0.89, 0.88, 0.88), 0.02);
    color += calculateTurbulentBeltZoneColor(position, 0.36, 0.47, vec3(0.63, 0.42, 0.23), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.47, 0.53, vec3(0.89, 0.88, 0.88), 0.02);
    color += calculateTurbulentBeltZoneColor(position, 0.53, 0.67, vec3(0.63, 0.42, 0.23), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.67, 0.69, vec3(0.89, 0.88, 0.88), 0.02);
    color += calculateTurbulentBeltZoneColor(position, 0.69, 0.71, vec3(0.83, 0.02, 0.02), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.71, 0.73, vec3(0.89, 0.88, 0.88), 0.02);
    color += calculateTurbulentBeltZoneColor(position, 0.73, 0.78, vec3(0.42, 0.26, 0.05), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.78, 0.81, vec3(0.39, 0.31, 0.19), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.81, 0.85, vec3(0.19, 0.32, 0.32), 0.02);
    color += calculateTurbulentBeltZoneColor(position, 0.85, 0.95, vec3(0.17, 0.27, 0.27), 0.01);
    color += calculateTurbulentBeltZoneColor(position, 0.95, 1.1, vec3(0.11, 0.2, 0.2), 0.01);

    gl_FragColor = vec4(color, 1.0);

    // #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}

