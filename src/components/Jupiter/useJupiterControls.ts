import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { RefObject, useEffect } from "react";
import { ShaderMaterial } from "three";

export const uniforms = {
  uTime: 0,
  uAnimationSpeed: 1,
  uTurbulenceNoiseFrequency: 0,
  uBeltZoneNoiseFrequency: 0,
  uBeltZoneNoiseAmplitude: 0,
  uBeltZoneOuterEdgeSoftness: 0,
  uBeltZoneInnerEdgeSoftness: 0,
  uBoundaryNoiseFrequency: 0,
  uBoundaryNoiseAmplitude: 0,
};

const useJupiterControls = (materialRef: RefObject<ShaderMaterial>) => {
  const controls = useControls({
    uAnimationSpeed: {
      value: 1,
      min: 0.0,
      max: 1.0,
      step: 0.001,
    },
    uTurbulenceNoiseFrequency: {
      value: 10,
      min: 0.0,
      max: 100.0,
      step: 0.001,
    },
    uBeltZoneNoiseFrequency: {
      value: 5,
      min: 0.0,
      max: 50.0,
      step: 0.001,
    },
    uBeltZoneNoiseAmplitude: {
      value: 0.02,
      min: 0.0,
      max: 5.0,
      step: 0.001,
    },
    uBeltZoneOuterEdgeSoftness: {
      value: 0.04,
      min: 0.0,
      max: 1.0,
      step: 0.001,
    },
    uBeltZoneInnerEdgeSoftness: {
      value: 0.02,
      min: 0.0,
      max: 1.0,
      step: 0.001,
    },
    uBoundaryNoiseFrequency: {
      value: 15,
      min: 0.0,
      max: 50.0,
      step: 0.001,
    },
    uBoundaryNoiseAmplitude: {
      value: 0.03,
      min: 0.0,
      max: 5.0,
      step: 0.001,
    },
  });

  useEffect(() => {
    if (!materialRef.current) return;
    for (const [name, value] of Object.entries(controls)) {
      materialRef.current.uniforms[name].value = value;
    }
  }, [controls, materialRef]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });
};

export default useJupiterControls;
