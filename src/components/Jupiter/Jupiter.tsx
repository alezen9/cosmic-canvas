import { shaderMaterial } from "@react-three/drei";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { extend } from "@react-three/fiber";
import { useRef } from "react";
import { ShaderMaterial } from "three";
import usePatternControls, { uniforms } from "./useJupiterControls";

const JupiterMaterial = shaderMaterial(uniforms, vertexShader, fragmentShader);

extend({ JupiterMaterial });

const TestPlane = () => {
  // const texture = useTexture("./noise_texture.jpg");
  const materialRef = useRef<ShaderMaterial>(null);

  // useEffect(() => {
  //   if (!texture || !materialRef.current) return;
  //   materialRef.current.uniforms.uNoiseTexture = new Uniform(texture);
  // }, [texture]);

  usePatternControls(materialRef);

  return (
    <mesh>
      <sphereGeometry args={[5, 32, 32]} />
      {/* <planeGeometry args={[11, 11]} /> */}
      <jupiterMaterial ref={materialRef} />
    </mesh>
  );
};

export default TestPlane;
