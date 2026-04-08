import * as THREE from 'three';
import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { NeuralNetwork } from './NeuralNetwork';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';
import { ContactSection } from './ContactSection';

const SectionWrapper = ({ position, children, isActive }: { position: [number, number, number], children: React.ReactNode, isActive: boolean }) => {
  return (
    <group position={position}>
      <Html 
        fullscreen
        style={{
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? 'auto' : 'none',
          transition: 'opacity 0.45s ease-out',
        }}
        className="text-foreground" // Use Tailwind theme variables
      >
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-transparent px-4 sm:px-6 md:px-8">
          {children}
        </div>
      </Html>
    </group>
  );
};

const Scene = () => {
  const [activeSection, setActiveSection] = useState(0);
  const progress = useRef(0);
  const targetProgress = useRef(0);
  const targetSection = useRef(0);
  const lastWheelAt = useRef(0);
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);

  const sectionAnchors = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 2, -20),
    new THREE.Vector3(-12, -3, -50),
    new THREE.Vector3(8, -2, -80),
    new THREE.Vector3(0, 3, -110),
  ], []);

  // Keep camera in front of sections instead of flying through their centers.
  const cameraCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 20),
    ...sectionAnchors.map((anchor) => new THREE.Vector3(anchor.x, anchor.y, anchor.z + 12)),
    new THREE.Vector3(0, 3, -94),
  ], false, 'catmullrom', 0.5), [sectionAnchors]);

  // Separate look-at path keeps the UI centered while moving.
  const lookCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    ...sectionAnchors,
    new THREE.Vector3(0, 3, -110),
  ], false, 'catmullrom', 0.5), [sectionAnchors]);

  const sectionCheckpoints = useMemo(() => [0.0, 0.24, 0.48, 0.72, 0.9], []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelAt.current < 420) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      targetSection.current = THREE.MathUtils.clamp(
        targetSection.current + direction,
        0,
        sectionCheckpoints.length - 1,
      );

      targetProgress.current = sectionCheckpoints[targetSection.current];
      lastWheelAt.current = now;
    };

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [sectionCheckpoints]);

  useFrame((state) => {
    // Smooth the input to keep camera motion cinematic.
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress.current, 0.08);

    // Determine the active UI section from normalized scroll progress.
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < sectionCheckpoints.length; i += 1) {
      const d = Math.abs(progress.current - sectionCheckpoints[i]);
      if (d < nearestDistance) {
        nearestDistance = d;
        nearestIndex = i;
      }
    }
    setActiveSection((prev) => (prev === nearestIndex ? prev : nearestIndex));

    // Determine where we should be on the curve (0 to 1) based on wheel progress.
    const pathPosition = cameraCurve.getPoint(progress.current);
    
    // Look slightly ahead of us on the curve (5% ahead) avoiding bound crashes (0.99 max)
    const lookAhead = Math.min(0.995, progress.current + 0.02);
    const pathLookAt = lookCurve.getPoint(lookAhead);

    // Smoothly interpolate camera position directly along the 3D track
    state.camera.position.lerp(pathPosition, 0.12);
    
    // Smoothly move the target the camera is looking at
    lookAtTarget.lerp(pathLookAt, 0.1);
    state.camera.lookAt(lookAtTarget);
  });

  return (
    <group>
      <NeuralNetwork />
      
      {/* Embedded 3D Portfolios Anchors */}
      <SectionWrapper position={[0, 0, 0]} isActive={activeSection === 0}>
        <HeroSection />
      </SectionWrapper>
      
      <SectionWrapper position={[10, 2, -20]} isActive={activeSection === 1}>
        <AboutSection />
      </SectionWrapper>
      
      <SectionWrapper position={[-12, -3, -50]} isActive={activeSection === 2}>
        <ProjectsSection />
      </SectionWrapper>
      
      <SectionWrapper position={[8, -2, -80]} isActive={activeSection === 3}>
        <SkillsSection />
      </SectionWrapper>
      
      <SectionWrapper position={[0, 3, -110]} isActive={activeSection === 4}>
        <ContactSection />
      </SectionWrapper>
    </group>
  );
};

export default function AppScene() {
  return <Scene />;
}

