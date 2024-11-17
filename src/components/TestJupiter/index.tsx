import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

const TestJupiter = () => {
  const ref = useRef<Mesh>(null);

  // useFrame(({ clock }) => {
  //   if (!ref.current) return;
  //   ref.current.rotation.y = clock.getElapsedTime() * 0.75;
  // });

  return (
    <mesh ref={ref} scale={[10, 10, 10]}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default TestJupiter;
