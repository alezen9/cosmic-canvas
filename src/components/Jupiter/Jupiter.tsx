import { shaderMaterial } from "@react-three/drei";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import { RefObject, useEffect, useRef } from "react";
import { Mesh, ShaderMaterial } from "three";
import { useControls } from "leva";

const JupiterMaterial = shaderMaterial(
  {
    uTime: 0,
    uAnimationSpeed: 1,
  },
  vertexShader,
  fragmentShader,
);

extend({ JupiterMaterial });

const SCALE = 3.5;
const SUBDIVISION = 64;

const TestPlane = () => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  usePatternControls(materialRef);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * -0.1;
  });

  return (
    <mesh ref={meshRef} scale={[SCALE, SCALE, SCALE]}>
      <sphereGeometry args={[1, SUBDIVISION, SUBDIVISION]} />
      <jupiterMaterial ref={materialRef} />
    </mesh>
  );
};

export default TestPlane;

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
