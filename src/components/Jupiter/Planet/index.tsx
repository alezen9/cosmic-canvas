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
  uNoiseDensity: new Uniform(0.5),
  uNoiseIntensity: new Uniform(0.1),
  uNoiseSpread: new Uniform(10.5),
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
    uNoiseDensity: {
      value: 0.5,
      min: -5,
      max: 5,
      step: 0.01,
      label: "Noise density",
    },
    uNoiseIntensity: {
      value: 0.1,
      min: -1,
      max: 1,
      step: 0.01,
      label: "Noise intensity",
    },
    uNoiseSpread: {
      value: 50.5,
      min: 0,
      max: 100,
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
