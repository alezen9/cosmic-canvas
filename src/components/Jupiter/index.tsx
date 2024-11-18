import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh, Points, SphereGeometry, Spherical, Vector3 } from "three";
import { useControls } from "leva";
import Atmosphere, { AtmosphereRef } from "./Atmosphere";
import Planet, { PlanetRef } from "./Planet";
import Io, { IoRef } from "./Io";
import Europa, { EuropaRef } from "./Europa";
import Ganymede, { GanymedeRef } from "./Ganymede";
import Callisto, { CallistoRef } from "./Callisto";

const PLANET_SCALE = 7;
const SPHERE_SUBDIVISION = 64;
const SUN_DISTANCE = 90;

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
  const ganymede = useRef<GanymedeRef>(null);
  const callisto = useRef<CallistoRef>(null);

  const starfield = useRef<Points>(null);
  const sun = useRef<Mesh>(null);
  const sunSpherical = useRef(
    new Spherical(SUN_DISTANCE, Math.PI / 2, Math.PI / 1.5),
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

  useFrame(({ clock }, delta) => {
    if (!jupiter.current || !starfield.current || !sun.current) return;
    const time = clock.getElapsedTime();

    // fake orbit
    sunSpherical.current.theta += delta * 0.01;
    starfield.current.rotation.y += delta * 0.01;

    // planet rotation
    jupiter.current.rotation.y = time * -0.15;

    // sunlight
    const sunPosition = new Vector3();
    sunPosition.setFromSpherical(sunSpherical.current);
    sun.current.position.copy(sunPosition.multiplyScalar(2));
    planet.current?.updateSunPositionUniform(sunPosition);
    atmosphere.current?.updateSunPositionUniform(sunPosition);
    io.current?.updateSunPositionUniform(sunPosition);
    europa.current?.updateSunPositionUniform(sunPosition);
    ganymede.current?.updateSunPositionUniform(sunPosition);
    callisto.current?.updateSunPositionUniform(sunPosition);
  });

  return (
    <group>
      <group ref={jupiter} name="jupiter" rotation-x={0.055}>
        <Planet ref={planet} geometry={sphereGeometry} scale={PLANET_SCALE} />
        <Atmosphere
          ref={atmosphere}
          geometry={sphereGeometry}
          scale={PLANET_SCALE + 0.15}
        />
      </group>
      <Io ref={io} geometry={sphereGeometry} />
      <Europa ref={europa} geometry={sphereGeometry} />
      <Ganymede ref={ganymede} geometry={sphereGeometry} />
      <Callisto ref={callisto} geometry={sphereGeometry} />
      <Stars
        ref={starfield}
        radius={SUN_DISTANCE - 10}
        depth={10}
        count={100}
        factor={10}
        fade
      />
      <mesh ref={sun} geometry={sphereGeometry}>
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
};

export default Jupiter;
