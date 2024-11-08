import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Jupiter from "./components/Jupiter/Jupiter";

const Experience = () => {
  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      <Jupiter />
    </>
  );
};

export default Experience;
