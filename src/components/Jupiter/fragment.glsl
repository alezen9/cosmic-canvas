#include ../../utils/shaders/simplexNoise3d.glsl

#define PI 3.14159265359

uniform float uTime;
uniform float uAnimationSpeed;
uniform float uTurbulenceNoiseFrequency;
uniform float uBeltZoneNoiseFrequency;
uniform float uBeltZoneNoiseAmplitude;
uniform float uBeltZoneOuterEdgeSoftness;
uniform float uBeltZoneInnerEdgeSoftness;
uniform float uBoundaryNoiseFrequency;
uniform float uBoundaryNoiseAmplitude;

varying vec2 vUv;

vec3 calculateBlendedBeltZoneColor(vec3 pos, float from, float to, vec3 beltZoneColor, float turbulenceIntensity) {
    float yPos = pos.y;

    // Primary noise-based offset for the base wavy effect within each belt/zone
    float noise = simplexNoise3d(vec3(pos.x, yPos, pos.z * 0.1) * uBeltZoneNoiseFrequency) * uBeltZoneNoiseAmplitude;

    // Add secondary turbulence noise for additional swirling within each belt/zone
    float turbulenceNoise = simplexNoise3d(vec3(pos.x, yPos, pos.z * 0.1) * uTurbulenceNoiseFrequency) * turbulenceIntensity;

    // Apply both noise layers to the y-position
    yPos += noise + turbulenceNoise;

    // Edge softness for smooth blending
    float blendFactor = smoothstep(from - uBeltZoneOuterEdgeSoftness, from + uBeltZoneInnerEdgeSoftness, yPos) *
                        smoothstep(to + uBeltZoneOuterEdgeSoftness, to - uBeltZoneInnerEdgeSoftness, yPos);

    // Additional noise applied to blend transitions at belt/zone boundaries
    float boundaryNoise = simplexNoise3d(vec3(pos.x * uBoundaryNoiseFrequency, yPos, pos.z * 0.1)) * uBoundaryNoiseAmplitude;

    // Modulate the blend factor at the transition to create a soft, organic blend
    blendFactor = clamp(blendFactor * (0.5 + 0.5 * (noise + boundaryNoise)), 0.0, 1.0);

    // Return the blended color with enhanced transitions
    return beltZoneColor * blendFactor;
}

void main() {
    vec3 position = vec3(vUv, uTime * uAnimationSpeed);

    // Define colors for Jupiter-like zones and belts
    vec3 colorZone1 = vec3(0.85, 0.7, 0.5);  // Light cream for zones
    vec3 colorBelt1 = vec3(0.6, 0.3, 0.1);   // Dark reddish-brown for belts
    vec3 colorZone2 = vec3(0.9, 0.8, 0.6);   // Another light cream for zones
    vec3 colorBelt2 = vec3(0.55, 0.35, 0.15); // Orange-brown for belts

    vec3 color = vec3(0.0); // Start with a black base

    // Apply turbulent belt/zone colors with enhanced transition blending
    color += calculateBlendedBeltZoneColor(position, -0.1, 0.05, colorZone1, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.05, 0.1, colorBelt1, 0.06);
    color += calculateBlendedBeltZoneColor(position, 0.1, 0.15, colorZone2, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.15, 0.2, colorBelt2, 0.06);
    color += calculateBlendedBeltZoneColor(position, 0.2, 0.25, colorZone1, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.25, 0.3, colorBelt1, 0.06);
    color += calculateBlendedBeltZoneColor(position, 0.3, 0.35, colorZone2, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.35, 0.4, colorBelt2, 0.06);
    color += calculateBlendedBeltZoneColor(position, 0.4, 0.45, colorZone1, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.45, 0.5, colorBelt1, 0.06);
    color += calculateBlendedBeltZoneColor(position, 0.5, 0.55, colorZone2, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.55, 0.6, colorBelt2, 0.06);
    color += calculateBlendedBeltZoneColor(position, 0.6, 0.65, colorZone1, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.65, 0.7, colorBelt1, 0.06);
    color += calculateBlendedBeltZoneColor(position, 0.7, 0.75, colorZone2, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.75, 0.8, colorBelt2, 0.06);
    color += calculateBlendedBeltZoneColor(position, 0.8, 0.85, colorZone1, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.85, 0.9, colorBelt1, 0.06);
    color += calculateBlendedBeltZoneColor(position, 0.9, 0.95, colorZone2, 0.03);
    color += calculateBlendedBeltZoneColor(position, 0.95, 1.1, colorBelt2, 0.06);

    gl_FragColor = vec4(color, 1.0);

    // Apply tone mapping and color space adjustments
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}