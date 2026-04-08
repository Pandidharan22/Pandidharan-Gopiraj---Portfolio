import * as THREE from 'three';
import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { NeuralNetwork } from './NeuralNetwork';

interface SceneProps {
  onActiveSectionChange?: (sectionIndex: number) => void;
}

const Scene = ({ onActiveSectionChange }: SceneProps) => {
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

  const sectionCheckpoints = useMemo(() => [0, 0.25, 0.5, 0.75, 1], []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = performance.now();
      // Throttle wheel input and avoid jumping while a transition is still in-flight.
      if (now - lastWheelAt.current < 700 || Math.abs(progress.current - targetProgress.current) > 0.003) {
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

  useEffect(() => {
    onActiveSectionChange?.(activeSection);
  }, [activeSection, onActiveSectionChange]);

  useFrame((state) => {
    // Smooth the input to keep camera motion cinematic and breathable.
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress.current, 0.055);
    if (Math.abs(progress.current - targetProgress.current) < 0.0003) {
      progress.current = targetProgress.current;
    }

    // Switch visible section only near the end of travel to avoid hard snaps.
    if (Math.abs(progress.current - targetProgress.current) < 0.02) {
      setActiveSection((prev) => (prev === targetSection.current ? prev : targetSection.current));
    }

    // Determine where we should be on the curve (0 to 1) based on wheel progress.
    const pathPosition = cameraCurve.getPoint(progress.current);
    
    // Look slightly ahead of us on the curve (5% ahead) avoiding bound crashes (0.99 max)
    const lookAhead = Math.min(0.995, progress.current + 0.015);
    const pathLookAt = lookCurve.getPoint(lookAhead);

    // Smoothly interpolate camera position directly along the 3D track
    state.camera.position.lerp(pathPosition, 0.07);
    
    // Smoothly move the target the camera is looking at
    lookAtTarget.lerp(pathLookAt, 0.06);
    state.camera.lookAt(lookAtTarget);
  });

  return (
    <group>
      <NeuralNetwork />
    </group>
  );
};

export default function AppScene({ onActiveSectionChange }: SceneProps) {
  return <Scene onActiveSectionChange={onActiveSectionChange} />;
}

