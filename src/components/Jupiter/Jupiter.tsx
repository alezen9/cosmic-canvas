import { shaderMaterial } from "@react-three/drei";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import { RefObject, useEffect, useRef } from "react";
import { Mesh, ShaderMaterial, Vector3 } from "three";
import { useControls } from "leva";

const PLANET_SCALE = 3.5;
const PLANET_SUBDIVISION = 64;
const LIGHT_ORBIT_RADIUS = 50;

const JupiterMaterial = shaderMaterial(
  {
    uTime: 0,
    uAnimationSpeed: 1,
    uLightPosition: new Vector3(0, 0, LIGHT_ORBIT_RADIUS),
  },
  vertexShader,
  fragmentShader,
);

extend({ JupiterMaterial });

const Jupiter = () => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  usePatternControls(materialRef);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!meshRef.current) return;
    meshRef.current.rotation.y = time * -0.1;
    if (!materialRef.current) return;
    const angle = -time * 0.3;
    const x = Math.cos(angle) * LIGHT_ORBIT_RADIUS;
    const y = 0;
    const z = Math.sin(angle) * LIGHT_ORBIT_RADIUS;
    materialRef.current.uniforms.uLightPosition.value.set(x, y, z);
  });

  return (
    <mesh ref={meshRef} scale={[PLANET_SCALE, PLANET_SCALE, PLANET_SCALE]}>
      <sphereGeometry args={[1, PLANET_SUBDIVISION, PLANET_SUBDIVISION]} />
      <jupiterMaterial ref={materialRef} />
    </mesh>
  );
};

export default Jupiter;

const usePatternControls = (materialRef: RefObject<ShaderMaterial>) => {
  const controls = useControls({
    uAnimationSpeed: {
      value: 0.03,
      min: 0.0,
      max: 1.0,
      step: 0.001,
    },
  });

  useEffect(() => {
    if (!materialRef.current) return;
    for (const [name, value] of Object.entries(controls)) {
      materialRef.current.uniforms[name].value = value;
    }
  }, [controls, materialRef]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });
};
