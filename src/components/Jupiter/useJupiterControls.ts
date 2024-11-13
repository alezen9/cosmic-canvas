import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { RefObject, useEffect } from "react";
import { ShaderMaterial } from "three";

export const uniforms = {
  uTime: 0,
  uAnimationSpeed: 1,
  uRadius: 5,
};

const useJupiterControls = (materialRef: RefObject<ShaderMaterial>) => {
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

export default useJupiterControls;
