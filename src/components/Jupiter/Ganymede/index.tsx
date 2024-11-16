import {
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  Uniform,
  Vector3,
} from "three";
import vertexShader from "./ganymede.vertex.glsl";
import fragmentShader from "./ganymede.fragment.glsl";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Trail } from "@react-three/drei";

const uniforms = {
  uTime: new Uniform(0),
  uAnimationSpeed: new Uniform(0.03),
  uSunPosition: new Uniform(new Vector3(0)),
};

const SCALE = 0.3;
const ORBIT_RADIUS = 50;

type Props = {
  geometry: SphereGeometry;
};

export type GanymedeRef = {
  updateSunPositionUniform: (sunPosition: Vector3) => void;
};

const Ganymede = forwardRef<GanymedeRef, Props>((props, outerRef) => {
  const { geometry } = props;
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

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const time = clock.getElapsedTime();
    orbit.current.theta += delta * 0.1;
    ref.current.material.uniforms.uTime.value = time;
    ref.current.position.setFromSpherical(orbit.current);
  });

  return (
    <Trail color="white" width={1} length={100} attenuation={(w) => w * w}>
      <mesh
        name="ganymede"
        ref={ref}
        geometry={geometry}
        scale={[SCALE, SCALE, SCALE]}
      >
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </Trail>
  );
});

export default Ganymede;
