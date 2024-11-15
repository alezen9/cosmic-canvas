import { OrbitControls, Stars } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Jupiter from "./components/Jupiter/Jupiter";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const Experience = () => {
  const camera = useThree(({ camera }) => camera);
  useEffect(() => {
    console.log(camera);
  }, [camera]);

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      <color attach="background" args={["black"]} />
      <Stars
        radius={20}
        depth={20}
        count={500}
        factor={3}
        saturation={0}
        fade
        speed={1}
      />
      <Jupiter />
    </>
  );
};

export default Experience;
