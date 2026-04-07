import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { NeuralNetwork } from './NeuralNetwork';

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Use scroll data to glide camera deeply through vastly expanded network
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 20 - scroll.offset * 120, 0.05);
      state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, -scroll.offset * 0.2, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <NeuralNetwork />
    </group>
  );
};

export default function AppScene() {
    return (
        <ScrollControls pages={3} damping={0.3}>
            <Scene />
            <Scroll html>
                <div style={{ height: '100vh' }}></div>
                <div style={{ height: '100vh' }}></div>
                <div style={{ height: '100vh' }}></div>
            </Scroll>
        </ScrollControls>
    )
}

