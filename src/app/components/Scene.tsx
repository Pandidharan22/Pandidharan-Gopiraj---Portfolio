import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { width, height } = useThree((state) => state.viewport);
  const scroll = useScroll();

  const spheres = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 100; i++) {
      const time = Math.random() * 100;
      const factor = 2 + Math.random() * 5;
      const speed = 0.01 + Math.random() / 200;
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const r = Math.cos(state.clock.elapsedTime * 0.1) * Math.PI * 2;
      groupRef.current.rotation.set(0, r, 0);
      
      // Use scroll data to move camera
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5 - scroll.offset * 10, 0.05);
      state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, -scroll.offset * 0.2, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {spheres.map((props, i) => (
        <Sphere key={i} {...props} />
      ))}
    </group>
  );
};

const Sphere = ({ factor, speed, x, y, z }: { factor: number, speed: number, x: number, y: number, z: number }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed;
      ref.current.position.set(
        x + Math.cos(t) * factor,
        y + Math.sin(t) * factor,
        z + Math.sin(t) * factor
      );
    }
  });

  return (
    <mesh ref={ref} position={[x, y, z]} scale={[0.1, 0.1, 0.1]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="white" />
    </mesh>
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
