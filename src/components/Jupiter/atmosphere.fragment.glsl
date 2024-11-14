uniform vec3 uSunPosition;              // Position of the light source
uniform vec3 uAtmosphereDayColor;       // Color of atmosphere on the day side
uniform vec3 uAtmosphereTwilightColor;  // Color of atmosphere during twilight

varying vec3 vNormal;
varying vec3 vPosition;

void main(){
    vec3 fromCameraDirection = normalize(vPosition - cameraPosition);
    vec3 sunDirection = normalize(uSunPosition - vPosition);

    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // How directly light hits the surface
    float sunIntensity = dot(sunDirection, normal);

    float dayFactor = smoothstep(-0.3, 0.7, sunIntensity); // Controls transition zone
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, dayFactor);

    // Edge fade effect based on viewing angle
    float edgeFade = dot(fromCameraDirection, normal);
    edgeFade = smoothstep(0.0, 0.5, edgeFade); // Controls transparency near edges
    atmosphereColor *= edgeFade;

    // Calculate alpha to control atmosphere transparency
    float alpha = smoothstep(-0.5, 0.5, sunIntensity) * edgeFade;

    gl_FragColor = vec4(atmosphereColor, alpha);

    #include <tonemapping_fragment>
}
