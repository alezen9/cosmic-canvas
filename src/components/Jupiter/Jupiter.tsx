import { shaderMaterial } from "@react-three/drei";
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
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  Vector3,
} from "three";

const PLANET_SCALE = 3.5;
const ATMOSPHERE_SCALE = PLANET_SCALE + 0.15;
const PLANET_SUBDIVISION = 64;
const LIGHT_ORBIT_RADIUS = 25;

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
  const sunRef = useRef<Mesh>(null);
  const sphericalRef = useRef(
    new Spherical(LIGHT_ORBIT_RADIUS, Math.PI / 2.25, 0),
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (
      !planetMaterialRef.current ||
      !atmosphereMaterialRef.current ||
      !groupRef.current ||
      !sunRef.current
    )
      return;
    // planet rotation
    groupRef.current.rotation.y = time * -0.2;

    // light position
    sphericalRef.current.theta = time * 0.1;
    planetMaterialRef.current.uniforms.uSunPosition.value.setFromSpherical(
      sphericalRef.current,
    );
    atmosphereMaterialRef.current.uniforms.uSunPosition.value.setFromSpherical(
      sphericalRef.current,
    );
    sunRef.current.position.setFromSpherical(sphericalRef.current);
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh
          geometry={sphereGeometry}
          scale={[PLANET_SCALE, PLANET_SCALE, PLANET_SCALE]}
        >
          <jupiterMaterial ref={planetMaterialRef} />
        </mesh>
        <mesh
          geometry={sphereGeometry}
          scale={[ATMOSPHERE_SCALE, ATMOSPHERE_SCALE, ATMOSPHERE_SCALE]}
        >
          <atmosphereMaterial ref={atmosphereMaterialRef} />
        </mesh>
      </group>
      <mesh ref={sunRef} scale={0.3}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial color="white" />
        <ambientLight />
      </mesh>
    </>
  );
};

export default Jupiter;

// const usePatternControls = (materialRef: RefObject<ShaderMaterial>) => {
//   const controls = useControls({
//     uAnimationSpeed: {
//       value: 0.03,
//       min: 0.0,
//       max: 1.0,
//       step: 0.001,
//     },
//   });

//   useEffect(() => {
//     if (!materialRef.current) return;
//     for (const [name, value] of Object.entries(controls)) {
//       materialRef.current.uniforms[name].value = value;
//     }
//   }, [controls, materialRef]);

//   useFrame(({ clock }) => {
//     if (!materialRef.current) return;
//     materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
//   });
// };
