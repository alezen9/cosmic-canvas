import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Leva } from "leva";

const App = () => {
  return (
    <>
      <Leva />
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [3, 3, 10],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
};

export default App;
