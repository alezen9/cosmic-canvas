import {
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  Uniform,
  Vector3,
} from "three";
import vertexShader from "./europa.vertex.glsl";
import fragmentShader from "./europa.fragment.glsl";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";

const uniforms = {
  uTime: new Uniform(0),
  uAnimationSpeed: new Uniform(0.1),
  uSunPosition: new Uniform(new Vector3(0)),
};

const SCALE = 0.2;
const ORBIT_RADIUS = 30;

type Props = {
  geometry: SphereGeometry;
  position?: Mesh["position"];
};

export type EuropaRef = {
  updateSunPositionUniform: (sunPosition: Vector3) => void;
};

const Europa = forwardRef<EuropaRef, Props>((props, outerRef) => {
  const { geometry, position } = props;
  const ref = useRef<Mesh<SphereGeometry, ShaderMaterial>>(null);
  const orbit = useRef(new Spherical(ORBIT_RADIUS, Math.PI / 2, Math.PI));

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

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const time = clock.getElapsedTime();
    orbit.current.theta += delta * 0.1;
    ref.current.material.uniforms.uTime.value = time;
    ref.current.position.setFromSpherical(orbit.current);
  });

  return (
    <mesh
      name="europa"
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

export default Europa;
