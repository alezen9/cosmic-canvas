import { shaderMaterial, Stars } from "@react-three/drei";
import jupiterVertexShader from "./jupiter.vertex.glsl";
import jupiterFragmentShader from "./jupiter.fragment.glsl";
import atmosphereVertexShader from "./atmosphere.vertex.glsl";
import atmosphereFragmentShader from "./atmosphere.fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  BackSide,
  Color,
  Group,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  Vector3,
} from "three";

const PLANET_SCALE = 4;
const ATMOSPHERE_SCALE = PLANET_SCALE + 0.15;
const PLANET_SUBDIVISION = 64;
const PLANET_ORBIT_RADIUS = 85;

const JupiterMaterial = shaderMaterial(
  {
    uTime: 0,
    uAnimationSpeed: 1,
    uSunPosition: new Vector3(0),
  },
  jupiterVertexShader,
  jupiterFragmentShader,
);

const AtmosphereMaterial = shaderMaterial(
  {
    uSunPosition: new Vector3(0),
    uAtmosphereDayColor: new Color("#d4c6bc"),
    uAtmosphereTwilightColor: new Color("#ed6509"),
  },
  atmosphereVertexShader,
  atmosphereFragmentShader,
  (material) => {
    if (!material) return;
    material.side = BackSide;
    material.transparent = true;
  },
);

extend({ JupiterMaterial, AtmosphereMaterial });

const sphereGeometry = new SphereGeometry(
  1,
  PLANET_SUBDIVISION,
  PLANET_SUBDIVISION,
);

const Jupiter = () => {
  const groupRef = useRef<Group>(null);
  const planetMaterialRef = useRef<ShaderMaterial>(null);
  const atmosphereMaterialRef = useRef<ShaderMaterial>(null);
  const starfieldRef = useRef<Points>(null);
  const sphericalRef = useRef(
    new Spherical(PLANET_ORBIT_RADIUS, Math.PI / 2, 0),
  );

  useFrame(({ clock }) => {
    if (
      !groupRef.current ||
      !planetMaterialRef.current ||
      !atmosphereMaterialRef.current ||
      !starfieldRef.current
    )
      return;
    const time = clock.getElapsedTime();
    const planetRevolution = time * 0.01;
    sphericalRef.current.theta = planetRevolution;
    starfieldRef.current.rotation.y = planetRevolution;

    const planetRotation = time * -0.15;
    groupRef.current.rotation.y = planetRotation;
    planetMaterialRef.current.uniforms.uSunPosition.value.setFromSpherical(
      sphericalRef.current,
    );
    atmosphereMaterialRef.current.uniforms.uSunPosition.value.setFromSpherical(
      sphericalRef.current,
    );
  });

  return (
    <group>
      <group ref={groupRef} name="jupiter">
        <mesh
          name="planet"
          geometry={sphereGeometry}
          scale={[PLANET_SCALE, PLANET_SCALE, PLANET_SCALE]}
        >
          <jupiterMaterial ref={planetMaterialRef} />
        </mesh>
        <mesh
          name="atmosphere"
          geometry={sphereGeometry}
          scale={[ATMOSPHERE_SCALE, ATMOSPHERE_SCALE, ATMOSPHERE_SCALE]}
        >
          <atmosphereMaterial ref={atmosphereMaterialRef} />
        </mesh>
      </group>
      <Stars
        ref={starfieldRef}
        radius={15}
        depth={10}
        count={200}
        factor={2.75}
        fade
      />
    </group>
  );
};

export default Jupiter;
