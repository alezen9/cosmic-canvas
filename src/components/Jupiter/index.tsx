import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Points, SphereGeometry, Spherical, Vector3 } from "three";
import Io, { IoRef } from "./Io";
import Atmosphere, { AtmosphereRef } from "./Atmosphere";
import Planet, { PlanetRef } from "./Planet";
import { useControls } from "leva";
import Europa, { EuropaRef } from "./Europa";

const PLANET_SCALE = 4;
const SPHERE_SUBDIVISION = 64;
const PLANET_ORBIT_RADIUS = 85;

const sphereGeometry = new SphereGeometry(
  1,
  SPHERE_SUBDIVISION,
  SPHERE_SUBDIVISION,
);

const Jupiter = () => {
  const jupiter = useRef<Group>(null);
  const planet = useRef<PlanetRef>(null);
  const atmosphere = useRef<AtmosphereRef>(null);
  const io = useRef<IoRef>(null);
  const europa = useRef<EuropaRef>(null);

  const starfieldRef = useRef<Points>(null);
  const sunSpherical = useRef(
    new Spherical(PLANET_ORBIT_RADIUS, Math.PI / 2, 0),
  );

  useControls("Sun", {
    phi: {
      value: Math.PI / 2,
      min: 0,
      max: Math.PI,
      label: "Phi",
      onChange: (phi) => {
        sunSpherical.current.phi = phi;
      },
    },
  });

  useFrame(({ clock }) => {
    if (!jupiter.current || !starfieldRef.current) return;
    const time = clock.getElapsedTime();

    // fake orbit
    const planetRevolution = time * 0.01;
    sunSpherical.current.theta = planetRevolution;
    starfieldRef.current.rotation.y = planetRevolution;

    // planet rotation
    jupiter.current.rotation.y = time * -0.15;

    // sunlight
    const sunPosition = new Vector3();
    sunPosition.setFromSpherical(sunSpherical.current);
    planet.current?.updateSunPositionUniform(sunPosition);
    atmosphere.current?.updateSunPositionUniform(sunPosition);
    io.current?.updateSunPositionUniform(sunPosition);
    europa.current?.updateSunPositionUniform(sunPosition);
  });

  return (
    <group rotation-x={0.055}>
      <group ref={jupiter} name="jupiter">
        <Planet ref={planet} geometry={sphereGeometry} scale={PLANET_SCALE} />
        <Atmosphere
          ref={atmosphere}
          geometry={sphereGeometry}
          scale={PLANET_SCALE + 0.15}
        />
      </group>
      <Io ref={io} geometry={sphereGeometry} />
      <Europa ref={europa} geometry={sphereGeometry} />
      <Stars
        ref={starfieldRef}
        radius={35}
        depth={10}
        count={200}
        factor={2.75}
        fade
      />
    </group>
  );
};

export default Jupiter;
