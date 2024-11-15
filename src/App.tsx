import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Leva } from "leva";

const App = () => {
  return (
    <>
      <Leva collapsed />
      <Canvas
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [10, 10, 10],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
};

export default App;
