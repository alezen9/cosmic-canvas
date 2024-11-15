import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Leva } from "leva";

const App = () => {
  return (
    <>
      <div className="leva-wrapper">
        <Leva />
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
