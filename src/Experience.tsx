import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Jupiter from "./components/Jupiter";
import { useControls } from "leva";

const Experience = () => {
  const { isPerformancePanelVisible } = useControls("Monitoring", {
    isPerformancePanelVisible: {
      value: false,
      label: "Show performance",
    },
  });

  return (
    <>
      {isPerformancePanelVisible && <Perf position="top-left" />}
      <OrbitControls
        makeDefault
        enableDamping
        maxDistance={80}
        minDistance={11}
        enablePan={false}
      />
      <Jupiter />
      <color attach="background" args={["black"]} />
    </>
  );
};

export default Experience;
