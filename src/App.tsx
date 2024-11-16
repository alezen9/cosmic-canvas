import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Leva } from "leva";
import { useState } from "react";

const App = () => {
  const [isDebug] = useState(() => window.location.hash === "#debug");

  return (
    <>
      <div className="leva-wrapper">
        <Leva collapsed hidden={!isDebug} />
      </div>
      <Canvas
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [20, 7.5, 15],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
};

export default App;
