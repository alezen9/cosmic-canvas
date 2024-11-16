import {
  BackSide,
  Color,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Uniform,
  Vector3,
} from "three";
import vertexShader from "./atmosphere.vertex.glsl";
import fragmentShader from "./atmosphere.fragment.glsl";
import { forwardRef, useImperativeHandle, useRef } from "react";

const uniforms = {
  uSunPosition: new Uniform(new Vector3(0)),
  uAtmosphereDayColor: new Uniform(new Color("#d4c6bc")),
  uAtmosphereTwilightColor: new Uniform(new Color("#ed6509")),
};

type Props = {
  geometry: SphereGeometry;
  scale: number;
};

export type AtmosphereRef = {
  updateSunPositionUniform: (sunPosition: Vector3) => void;
};

const Atmosphere = forwardRef<AtmosphereRef, Props>((props, outerRef) => {
  const { geometry, scale } = props;
  const ref = useRef<Mesh<SphereGeometry, ShaderMaterial>>(null);

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

  return (
    <mesh
      name="atmosphere"
      ref={ref}
      geometry={geometry}
      scale={[scale, scale, scale]}
    >
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={BackSide}
        transparent
      />
    </mesh>
  );
});

export default Atmosphere;
