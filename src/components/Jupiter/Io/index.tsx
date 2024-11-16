import {
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  Uniform,
  Vector3,
} from "three";
import vertexShader from "./io.vertex.glsl";
import fragmentShader from "./io.fragment.glsl";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";

const uniforms = {
  uTime: new Uniform(0),
  uAnimationSpeed: new Uniform(2.1),
  uSunPosition: new Uniform(new Vector3(0)),
};

const SCALE = 0.1;
const ORBIT_RADIUS = 8;

type Props = {
  geometry: SphereGeometry;
  position?: Mesh["position"];
};

export type IoRef = {
  updateSunPositionUniform: (sunPosition: Vector3) => void;
};

const Io = forwardRef<IoRef, Props>((props, outerRef) => {
  const { geometry, position } = props;
  const ref = useRef<Mesh<SphereGeometry, ShaderMaterial>>(null);
  const orbit = useRef(new Spherical(ORBIT_RADIUS, Math.PI / 2, 0));

  useImperativeHandle(
    outerRef,
    () => ({
      updateSunPositionUniform: (sunPosition: Vector3) => {
        if (!ref.current) return;
        ref.current.material.uniforms.uSunPosition.value = sunPosition;
      },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.getElapsedTime();
    const revolution = time * 0.5;
    orbit.current.theta = revolution;
    ref.current.material.uniforms.uTime.value = time;
    ref.current.position.setFromSpherical(orbit.current);
  });

  return (
    <mesh
      name="io"
      ref={ref}
      geometry={geometry}
      position={position}
      scale={[SCALE, SCALE, SCALE]}
    >
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});

export default Io;
