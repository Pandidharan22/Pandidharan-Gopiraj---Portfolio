import * as THREE from 'three';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';


interface NodeData {
  id: number;
  basePosition: THREE.Vector3;
  timeOffset: number;
  opacity: number;
  scale: number;
}

interface EdgeData {
  source: number;
  target: number;
  distance: number;
}

export const NeuralNetwork = () => {
  const nodesRef = useRef<THREE.Group>(null);
  const linesGeoRef = useRef<THREE.BufferGeometry>(null);
  const hasPointerMovedRef = useRef(false);
  const pointerActiveRef = useRef(false);
  const pointerNdcRef = useRef(new THREE.Vector2(10, 10));
  const isDarkThemeRef = useRef(true);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerNdcRef.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
      hasPointerMovedRef.current = true;
      pointerActiveRef.current = true;
    };

    const onPointerLeave = () => {
      pointerActiveRef.current = false;
      pointerNdcRef.current.set(10, 10);
    };

    // On touch devices we avoid forcing a stale hover state.
    const onTouchStart = () => {
      pointerActiveRef.current = false;
      pointerNdcRef.current.set(10, 10);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => {
      isDarkThemeRef.current = root.classList.contains('dark');
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Precompute nodes and edges for performance
  const { nodes, edges } = useMemo(() => {
    // Keep the original core distribution, then add an outer shell so the model extends on all axes.
    const nodes: NodeData[] = [];
    const xSeg = 8, ySeg = 6, zSeg = 12; // Original core density
    const width = 120, height = 80, depth = 200; // Original core volume
    const shellXSeg = 7, shellYSeg = 6, shellZSeg = 12;
    const shellWidth = 220, shellHeight = 150, shellDepth = 420;
    const endCapXSeg = 5, endCapYSeg = 4, endCapZSeg = 6; // Dense bands at far ends
    let idCounter = 0;

    const addNode = (px: number, py: number, pz: number) => {
      nodes.push({
        id: idCounter++,
        basePosition: new THREE.Vector3(px, py, pz),
        timeOffset: Math.random() * 100,
        opacity: 0.4 + Math.random() * 0.6,
        scale: 0.05 + Math.random() * 0.03,
      });
    };

    // Original core field
    for (let ix = 0; ix < xSeg; ix++) {
      for (let iy = 0; iy < ySeg; iy++) {
        for (let iz = 0; iz < zSeg; iz++) {
          const px = -width / 2 + (ix + Math.random()) * (width / xSeg);
          const py = -height / 2 + (iy + Math.random()) * (height / ySeg);
          const pz = -depth / 2 + (iz + Math.random()) * (depth / zSeg);
          addNode(px, py, pz);
        }
      }
    }

    // Outer extension shell: adds new nodes at the ends of +X/-X, +Y/-Y, +Z/-Z.
    for (let ix = 0; ix < shellXSeg; ix++) {
      for (let iy = 0; iy < shellYSeg; iy++) {
        for (let iz = 0; iz < shellZSeg; iz++) {
          const px = -shellWidth / 2 + (ix + Math.random()) * (shellWidth / shellXSeg);
          const py = -shellHeight / 2 + (iy + Math.random()) * (shellHeight / shellYSeg);
          const pz = -shellDepth / 2 + (iz + Math.random()) * (shellDepth / shellZSeg);

          const outsideCore =
            Math.abs(px) > width / 2 + 4 ||
            Math.abs(py) > height / 2 + 4 ||
            Math.abs(pz) > depth / 2 + 6;

          if (outsideCore) {
            addNode(px, py, pz);
          }
        }
      }
    }

    // Extra dense end-caps on +/-Z so Skills/Contact regions remain richly connected.
    const zCapMin = depth / 2 + 6;
    const zCapSpan = shellDepth / 2 - zCapMin;
    for (const side of [-1, 1]) {
      for (let ix = 0; ix < endCapXSeg; ix++) {
        for (let iy = 0; iy < endCapYSeg; iy++) {
          for (let iz = 0; iz < endCapZSeg; iz++) {
            const px = -shellWidth / 2 + (ix + Math.random()) * (shellWidth / endCapXSeg);
            const py = -shellHeight / 2 + (iy + Math.random()) * (shellHeight / endCapYSeg);
            const pzAbs = zCapMin + (iz + Math.random()) * (zCapSpan / endCapZSeg);
            const pz = side * pzAbs;
            addNode(px, py, pz);
          }
        }
      }
    }

    // 1. Center the entire network perfectly on the origin (0,0,0)
    const centerPoint = new THREE.Vector3();
    nodes.forEach(node => centerPoint.add(node.basePosition));
    centerPoint.divideScalar(nodes.length);
    nodes.forEach(node => node.basePosition.sub(centerPoint));

    const edges: EdgeData[] = [];
    
    // 2. Build a Minimum Spanning Tree to guarantee the graph is fully connected (no islands)
    const connected = new Set([0]);
    const unconnected = new Set(nodes.map(n => n.id).slice(1));
    
    while (unconnected.size > 0) {
      let minDist = Infinity;
      let closestConnected = -1;
      let closestUnconnected = -1;
      
      for (const u of unconnected) {
        for (const c of connected) {
          const dist = nodes[u].basePosition.distanceTo(nodes[c].basePosition);
          if (dist < minDist) {
            minDist = dist;
            closestConnected = c;
            closestUnconnected = u;
          }
        }
      }
      
      edges.push({ source: closestUnconnected, target: closestConnected, distance: minDist });
      connected.add(closestUnconnected);
      unconnected.delete(closestUnconnected);
    }

    // 3. Add extra edges for a web-like look (nearest neighbors)
    nodes.forEach((nodeA, i) => {
      const distances = nodes
        .map((nodeB, j) => ({ idx: j, dist: nodeA.basePosition.distanceTo(nodeB.basePosition) }))
        .filter((d) => d.idx !== i)
        .sort((a, b) => a.dist - b.dist); // Sort by nearest

      const isOuterNode =
        Math.abs(nodeA.basePosition.x) > width / 2 + 10 ||
        Math.abs(nodeA.basePosition.y) > height / 2 + 10 ||
        Math.abs(nodeA.basePosition.z) > depth / 2 + 10;

      // Slightly denser connectivity in the outer shell/end-caps.
      const neighborsToConnect = isOuterNode ? 7 : 5;

      for (let k = 0; k < neighborsToConnect; k++) {
        const targetIdx = distances[k].idx;
        const edgeExists = edges.some(e => 
          (e.source === i && e.target === targetIdx) || 
          (e.source === targetIdx && e.target === i)
        );
        if (!edgeExists) {
          edges.push({ source: i, target: targetIdx, distance: distances[k].dist });
        }
      }
    });

    return { nodes, edges };
  }, []);

  const linePositions = useMemo(() => new Float32Array(edges.length * 6), [edges]); // 2 vertices per edge, 3 coords per vertex
  const currentPositions = useMemo(() => new Float32Array(nodes.length * 3), [nodes.length]);
  const nodeInfluence = useMemo(() => new Float32Array(nodes.length), [nodes.length]);
  const { lineColors, baseEdgeIntensity } = useMemo(() => {
    const colors = new Float32Array(edges.length * 6);
    const baseIntensity = new Float32Array(edges.length);
    edges.forEach((edge, i) => {
      // Base edge opacity/intensity on distance; mapped to new massive spreads
      const intensity = Math.max(0.08, 0.85 - (edge.distance / 30));
      baseIntensity[i] = intensity;
      // Set RGB values to fake opacity with vertex colors
      colors.set([intensity, intensity, intensity, intensity, intensity, intensity], i * 6);
    });
    return { lineColors: colors, baseEdgeIntensity: baseIntensity };
  }, [edges]);

  const rayOrigin = useMemo(() => new THREE.Vector3(), []);
  const rayDirection = useMemo(() => new THREE.Vector3(), []);
  const worldPointer = useMemo(() => new THREE.Vector3(), []);
  const toPoint = useMemo(() => new THREE.Vector3(), []);
  const closestOnRay = useMemo(() => new THREE.Vector3(), []);
  const pointPosition = useMemo(() => new THREE.Vector3(), []);
  const tmpNodeColor = useMemo(() => new THREE.Color(), []);
  const darkNodeBaseColor = useMemo(() => new THREE.Color(0xffffff), []);
  const darkNodeGlowColor = useMemo(() => new THREE.Color(0xffffff), []);
  const lightNodeBaseColor = useMemo(() => new THREE.Color(0x353943), []);
  const lightNodeGlowColor = useMemo(() => new THREE.Color(0x7a818f), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const isDarkTheme = isDarkThemeRef.current;
    const pointerX = pointerNdcRef.current.x;
    const pointerY = pointerNdcRef.current.y;
    const isPointerNearZero = Math.abs(pointerX) < 0.0008 && Math.abs(pointerY) < 0.0008;
    const enableCursorHighlight = hasPointerMovedRef.current && pointerActiveRef.current && !isPointerNearZero;

    if (enableCursorHighlight) {
      rayOrigin.copy(state.camera.position);
      worldPointer.set(pointerX, pointerY, 0.5).unproject(state.camera);
      rayDirection.copy(worldPointer).sub(rayOrigin).normalize();
    }

    const cursorRadius = 24; // Wider cursor influence so the effect is visible at this scene scale.
    const maxNodeOpacityBoost = isDarkTheme ? 0.42 : 0.18;
    const maxNodeScaleBoost = isDarkTheme ? 0.2 : 0.14;
    const maxEdgeBoost = isDarkTheme ? 0.34 : 0.22;

    // 1. Update individual nodes
    if (nodesRef.current) {
      nodes.forEach((node, i) => {
        // Floating math (X and Z only as requested)
        const t = time + node.timeOffset;
        const px = node.basePosition.x + Math.sin(t * 0.5) * 0.4;
        const py = node.basePosition.y; // Locked on Y axis
        const pz = node.basePosition.z + Math.sin(t * 0.7) * 0.4;

        let highlight = 0;
        if (enableCursorHighlight) {
          pointPosition.set(px, py, pz);
          toPoint.copy(pointPosition).sub(rayOrigin);
          const t = toPoint.dot(rayDirection);
          if (t > 0) {
            closestOnRay.copy(rayDirection).multiplyScalar(t).add(rayOrigin);
            const distanceToRay = closestOnRay.distanceTo(pointPosition);
            if (distanceToRay < cursorRadius) {
              const normalized = 1 - (distanceToRay / cursorRadius);
              // Square falloff keeps effect soft and local to cursor area.
              highlight = normalized * normalized;
            }
          }
        }
        nodeInfluence[i] = highlight;

        // Pulsing scale + subtle hover boost near cursor
        const scaleOffset = 1 + Math.sin(t * 2) * 0.15;
        const highlightScale = 1 + highlight * maxNodeScaleBoost;

        // Apply transforms directly to meshes for best performance without full re-renders
        const mesh = nodesRef.current!.children[i] as THREE.Mesh;
        mesh.position.set(px, py, pz);
        mesh.scale.setScalar(node.scale * scaleOffset * highlightScale);

        const material = mesh.material as THREE.MeshBasicMaterial;
        if (isDarkTheme) {
          tmpNodeColor.copy(darkNodeBaseColor).lerp(darkNodeGlowColor, highlight);
        } else {
          tmpNodeColor.copy(lightNodeBaseColor).lerp(lightNodeGlowColor, highlight * 0.9);
        }
        material.color.copy(tmpNodeColor);
        material.opacity = Math.min(1, node.opacity + highlight * maxNodeOpacityBoost);

        // Store positions for edges update
        currentPositions[i * 3] = px;
        currentPositions[i * 3 + 1] = py;
        currentPositions[i * 3 + 2] = pz;
      });
    }

    // 2. Dynamically update edges to follow moving nodes
    if (linesGeoRef.current) {
      edges.forEach((edge, i) => {
        const { source, target } = edge;
        const highlight = Math.max(nodeInfluence[source], nodeInfluence[target]);
        const intensity = Math.min(1, baseEdgeIntensity[i] + highlight * maxEdgeBoost);
        if (isDarkTheme) {
          lineColors[i * 6] = intensity;
          lineColors[i * 6 + 1] = intensity;
          lineColors[i * 6 + 2] = intensity;
          lineColors[i * 6 + 3] = intensity;
          lineColors[i * 6 + 4] = intensity;
          lineColors[i * 6 + 5] = intensity;
        } else {
          // In light theme keep highlights graphite instead of white flashlight-like bloom.
          const base = Math.min(0.48, intensity * 0.42 + 0.06);
          const glow = highlight * 0.24;
          const r = Math.min(0.68, base + glow * 0.92);
          const g = Math.min(0.7, base + glow * 0.96);
          const b = Math.min(0.74, base + glow);

          lineColors[i * 6] = r;
          lineColors[i * 6 + 1] = g;
          lineColors[i * 6 + 2] = b;
          lineColors[i * 6 + 3] = r;
          lineColors[i * 6 + 4] = g;
          lineColors[i * 6 + 5] = b;
        }
        
        // Point A
        linePositions[i * 6] = currentPositions[source * 3];
        linePositions[i * 6 + 1] = currentPositions[source * 3 + 1];
        linePositions[i * 6 + 2] = currentPositions[source * 3 + 2];
        
        // Point B
        linePositions[i * 6 + 3] = currentPositions[target * 3];
        linePositions[i * 6 + 4] = currentPositions[target * 3 + 1];
        linePositions[i * 6 + 5] = currentPositions[target * 3 + 2];
      });
      
      // Update BufferAttribute
      if (!linesGeoRef.current.attributes.position) {
        linesGeoRef.current.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
      } else {
        linesGeoRef.current.attributes.position.needsUpdate = true;
      }

      if (!linesGeoRef.current.attributes.color) {
        linesGeoRef.current.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
      } else {
        linesGeoRef.current.attributes.color.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* Edge System - single geometry draw call for all lines */}
      <lineSegments>
        <bufferGeometry ref={linesGeoRef}>
          <bufferAttribute 
            attach="attributes-color" 
            array={lineColors} 
            itemSize={3} 
            count={edges.length * 2} 
          />
        </bufferGeometry>
        {/* Uses vertex colors to simulate dynamic opacity per line segment */}
        <lineBasicMaterial vertexColors transparent opacity={0.58} />
      </lineSegments>

      {/* Node System */}
      <group ref={nodesRef}>
        {nodes.map((node) => (
          <mesh key={node.id}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="white" transparent opacity={node.opacity} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
