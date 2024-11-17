import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Jupiter from "./components/Jupiter";
import { useControls } from "leva";
import TestJupiter from "./components/TestJupiter";

const Experience = () => {
  const { isPerformancePanelVisible } = useControls("Monitoring", {
    isPerformancePanelVisible: {
      value: true,
      label: "Show performance",
    },
  });

  return (
    <>
      {isPerformancePanelVisible && <Perf position="top-left" />}
      <OrbitControls
        makeDefault
        enableDamping
        maxDistance={160}
        minDistance={11}
        enablePan={false}
      />
      {/* <Jupiter /> */}
      <TestJupiter />
      <color attach="background" args={["black"]} />
    </>
  );
};

export default Experience;
