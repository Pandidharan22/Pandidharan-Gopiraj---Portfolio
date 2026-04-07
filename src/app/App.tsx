import { Canvas } from '@react-three/fiber';
import AppScene from './components/Scene';

export default function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: 'black' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <AppScene />
      </Canvas>
    </div>
  );
}

