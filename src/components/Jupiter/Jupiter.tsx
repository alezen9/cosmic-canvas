import { shaderMaterial, useTexture } from "@react-three/drei";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh, ShaderMaterial, Uniform } from "three";
import usePatternControls, { uniforms } from "./useJupiterControls";

const JupiterMaterial = shaderMaterial(uniforms, vertexShader, fragmentShader);

extend({ JupiterMaterial });

const TestPlane = () => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const noiseTexture = useTexture("./noise_texture.jpg");

  useEffect(() => {
    if (!noiseTexture || !materialRef.current) return;
    materialRef.current.uniforms.uNoiseTexture = new Uniform(noiseTexture);
  }, [noiseTexture]);

  usePatternControls(materialRef);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * -0.1;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 64, 64]} />
      {/* <planeGeometry args={[11, 11]} /> */}
      <jupiterMaterial ref={materialRef} />
    </mesh>
  );
};

export default TestPlane;
