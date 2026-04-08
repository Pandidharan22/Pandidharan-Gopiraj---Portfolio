import * as THREE from 'three';
import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { NeuralNetwork } from './NeuralNetwork';

interface NavigationRequest {
  sectionIndex: number;
  requestId: number;
}

interface SceneProps {
  onActiveSectionChange?: (sectionIndex: number) => void;
  navigationRequest?: NavigationRequest | null;
  interactionEnabled?: boolean;
}

const Scene = ({ onActiveSectionChange, navigationRequest, interactionEnabled = true }: SceneProps) => {
  const [activeSection, setActiveSection] = useState(0);
  const progress = useRef(0);
  const targetProgress = useRef(0);
  const targetSection = useRef(0);
  const lastWheelAt = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const touchStartedInScrollable = useRef(false);
  const isTransitioning = useRef(false);
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

  const requestSectionTransition = useCallback((nextSection: number) => {
    const clampedSection = THREE.MathUtils.clamp(nextSection, 0, sectionCheckpoints.length - 1);
    targetSection.current = clampedSection;
    targetProgress.current = sectionCheckpoints[clampedSection];
    isTransitioning.current = Math.abs(progress.current - targetProgress.current) > 0.0003;
  }, [sectionCheckpoints]);

  const isElementTouchScrollable = useCallback((target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      return false;
    }
    return !!target.closest('.allow-touch-scroll, .project-modal-overlay, input, textarea, select, [contenteditable="true"]');
  }, []);

  const shouldBypassWheelNavigation = useCallback((target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      return false;
    }
    return !!target.closest('.allow-touch-scroll, .project-modal-overlay, input, textarea, select, [contenteditable="true"]');
  }, []);

  const canNavigateByGesture = useCallback(() => {
    const now = performance.now();
    if (
      now - lastWheelAt.current < 700 ||
      isTransitioning.current ||
      Math.abs(progress.current - targetProgress.current) > 0.003
    ) {
      return false;
    }
    lastWheelAt.current = now;
    return true;
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!interactionEnabled) {
        return;
      }

      if (shouldBypassWheelNavigation(event.target)) {
        // Let native wheel/touchpad scrolling work inside modal and form controls.
        return;
      }

      event.preventDefault();

      // Throttle wheel input and avoid jumping while a transition is still in-flight.
      if (!canNavigateByGesture()) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      requestSectionTransition(targetSection.current + direction);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!interactionEnabled || event.touches.length !== 1) {
        touchStartY.current = null;
        touchStartedInScrollable.current = false;
        return;
      }

      touchStartedInScrollable.current = isElementTouchScrollable(event.target);
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!interactionEnabled || touchStartedInScrollable.current) {
        touchStartY.current = null;
        return;
      }

      if (event.changedTouches.length !== 1 || touchStartY.current === null) {
        touchStartY.current = null;
        return;
      }

      const endY = event.changedTouches[0]?.clientY;
      if (typeof endY !== 'number') {
        touchStartY.current = null;
        return;
      }

      const deltaY = endY - touchStartY.current;
      touchStartY.current = null;

      const swipeThreshold = 48;
      if (Math.abs(deltaY) < swipeThreshold) {
        return;
      }

      if (!canNavigateByGesture()) {
        return;
      }

      // Swipe up advances forward, swipe down goes back.
      const direction = deltaY < 0 ? 1 : -1;
      requestSectionTransition(targetSection.current + direction);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [canNavigateByGesture, interactionEnabled, isElementTouchScrollable, requestSectionTransition, shouldBypassWheelNavigation]);

  useEffect(() => {
    if (!navigationRequest) {
      return;
    }
    requestSectionTransition(navigationRequest.sectionIndex);
  }, [navigationRequest?.requestId, navigationRequest?.sectionIndex, requestSectionTransition]);

  useEffect(() => {
    onActiveSectionChange?.(activeSection);
  }, [activeSection, onActiveSectionChange]);

  useFrame((state) => {
    // Smooth the input to keep camera motion cinematic and breathable.
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress.current, 0.055);
    if (Math.abs(progress.current - targetProgress.current) < 0.0003) {
      progress.current = targetProgress.current;
      isTransitioning.current = false;
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

export default function AppScene({ onActiveSectionChange, navigationRequest, interactionEnabled }: SceneProps) {
  return (
    <Scene
      onActiveSectionChange={onActiveSectionChange}
      navigationRequest={navigationRequest}
      interactionEnabled={interactionEnabled}
    />
  );
}

