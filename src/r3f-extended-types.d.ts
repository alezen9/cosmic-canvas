import { ReactThreeFiber } from "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      jupiterMaterial: ReactThreeFiber.Object3DNode<
        JupiterMaterial,
        typeof JupiterMaterial
      >;
      atmosphereMaterial: ReactThreeFiber.Object3DNode<
        AtmosphereMaterial,
        typeof AtmosphereMaterial
      >;
    }
  }
}
