import { OrbitControls } from "@react-three/drei";
// import { Perf } from "r3f-perf";
import Jupiter from "./components/Jupiter/Jupiter";

const Experience = () => {
  return (
    <>
      {/* <Perf position="top-left" /> */}
      <OrbitControls
        makeDefault
        enableDamping
        maxDistance={40}
        minDistance={11}
        enablePan={false}
      />
      <Jupiter />
      <color attach="background" args={["black"]} />
    </>
  );
};

export default Experience;
