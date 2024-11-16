import { Mesh, ShaderMaterial, SphereGeometry, Uniform, Vector3 } from "three";
import vertexShader from "./planet.vertex.glsl";
import fragmentShader from "./planet.fragment.glsl";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

const uniforms = {
  uTime: new Uniform(0),
  uAnimationSpeed: new Uniform(0.01),
  uSunPosition: new Uniform(new Vector3(0)),
  // =======================================
  uPrimaryWaveAmplitudeScale: new Uniform(0.2),
  uSecondaryWaveFrequencyScale: new Uniform(1.5),
  uSecondaryWaveAmplitudeScale: new Uniform(0.15),
  uDirectionalNoiseGranularity: new Uniform(5.5),
  uNoiseDensity: new Uniform(-40),
  uNoiseIntensity: new Uniform(0.35),
  uNoiseSpread: new Uniform(1),
};

type Props = {
  geometry: SphereGeometry;
  scale: number;
};

export type PlanetRef = {
  updateSunPositionUniform: (sunPosition: Vector3) => void;
};

const Planet = forwardRef<PlanetRef, Props>((props, outerRef) => {
  const { geometry, scale } = props;
  const ref = useRef<Mesh<SphereGeometry, ShaderMaterial>>(null);

  useImperativeHandle(
    outerRef,
    () => ({
      updateSunPositionUniform: (sunPosition: Vector3) => {
        if (!ref.current) return;
        ref.current.material.uniforms.uSunPosition.value = sunPosition;
      },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.material.uniforms.uTime.value = clock.getElapsedTime();
  });

  const controls = useControls("Planet", {
    uAnimationSpeed: {
      value: 0.01,
      min: -3,
      max: 3,
      step: 0.001,
      label: "Noise animation speed",
    },
    uPrimaryWaveAmplitudeScale: {
      value: 0.2,
      min: -0.5,
      max: 0.5,
      step: 0.01,
      label: "Primary wave amplitude",
    },
    uSecondaryWaveFrequencyScale: {
      value: 1.5,
      min: 0,
      max: 100,
      step: 0.01,
      label: "Secondary wave frequency",
    },
    uSecondaryWaveAmplitudeScale: {
      value: 0.15,
      min: -0.5,
      max: 0.5,
      step: 0.01,
      label: "Secondary wave amplitude",
    },
    uDirectionalNoiseGranularity: {
      value: 5.5,
      min: -10,
      max: 10,
      step: 0.01,
      label: "Noise directional granularity",
    },
    uNoiseDensity: {
      value: -40,
      min: -100,
      max: 100,
      step: 0.01,
      label: "Noise density",
    },
    uNoiseIntensity: {
      value: 0.35,
      min: -1,
      max: 1,
      step: 0.01,
      label: "Noise intensity",
    },
    uNoiseSpread: {
      value: 1,
      min: 0,
      max: 50,
      step: 0.01,
      label: "Noise spread",
    },
  });

  useEffect(() => {
    if (!ref.current) return;
    for (const [name, value] of Object.entries(controls)) {
      ref.current.material.uniforms[name].value = value;
    }
  }, [controls]);

  return (
    <mesh
      name="planet"
      ref={ref}
      geometry={geometry}
      scale={[scale, scale, scale]}
    >
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});

export default Planet;
