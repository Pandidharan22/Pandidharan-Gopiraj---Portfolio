import * as THREE from 'three';
import { useRef, useMemo } from 'react';
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

  // Precompute nodes and edges for performance
  const { nodes, edges } = useMemo(() => {
    const numNodes = 250; // Increased for higher density
    const numClusters = 7;
    
    // Create random cluster centers wide across the screen
    const clusters = Array.from({ length: numClusters }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 40, // Wide X spread to fill screen
      (Math.random() - 0.5) * 20, // Wide Y spread 
      (Math.random() - 0.5) * 30  // Deep Z spread
    ));

    // Generate nodes clustered around centers
    const nodes: NodeData[] = Array.from({ length: numNodes }, (_, i) => {
      const cluster = clusters[Math.floor(Math.random() * numClusters)];
      // Radial spread around cluster center
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
      
      return {
        id: i,
        basePosition: cluster.clone().add(offset),
        timeOffset: Math.random() * 100, // For desynchronized floating animations
        opacity: 0.4 + Math.random() * 0.6, // Opacity variation
        scale: 0.05 + Math.random() * 0.03  // Scale variation ~0.05 - 0.08
      };
    });

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

      // Connect to 5 nearest neighbors to create highly dense webbing
      for (let k = 0; k < 5; k++) {
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
  const lineColors = useMemo(() => {
    const colors = new Float32Array(edges.length * 6);
    edges.forEach((edge, i) => {
      // Base edge opacity/intensity on distance; mapped to new wider spread sizes
      const intensity = Math.max(0.1, 1.0 - (edge.distance / 15)); 
      // Set RGB values to fake opacity with vertex colors
      colors.set([intensity, intensity, intensity, intensity, intensity, intensity], i * 6);
    });
    return colors;
  }, [edges]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const currentPositions = new Float32Array(nodes.length * 3);

    // 1. Update individual nodes
    if (nodesRef.current) {
      nodes.forEach((node, i) => {
        // Floating math (X and Z only as requested)
        const t = time + node.timeOffset;
        const px = node.basePosition.x + Math.sin(t * 0.5) * 0.4;
        const py = node.basePosition.y; // Locked on Y axis
        const pz = node.basePosition.z + Math.sin(t * 0.7) * 0.4;

        // Pulsing scale
        const scaleOffset = 1 + Math.sin(t * 2) * 0.15;

        // Apply transforms directly to meshes for best performance without full re-renders
        const mesh = nodesRef.current!.children[i] as THREE.Mesh;
        mesh.position.set(px, py, pz);
        mesh.scale.setScalar(node.scale * scaleOffset);

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
        <lineBasicMaterial vertexColors transparent opacity={0.5} />
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
