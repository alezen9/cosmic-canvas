import { Environment, OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Jupiter from "./components/Jupiter/Jupiter";
import { Suspense } from "react";

const Experience = () => {
  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      <color attach="background" args={["black"]} />
      <Suspense>
        <Environment background files="./outer-space.jpg" />
      </Suspense>
      <Jupiter />
    </>
  );
};

export default Experience;
