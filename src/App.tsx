import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Leva } from "leva";

const App = () => {
  return (
    <>
      <Leva />
      <Canvas
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 0, 15],
        }}
      >
        <color attach="background" args={["black"]} />
        <Experience />
      </Canvas>
    </>
  );
};

export default App;
