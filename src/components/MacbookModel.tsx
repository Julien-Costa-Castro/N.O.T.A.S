"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, createPortal } from "@react-three/fiber";
import { useGLTF, Html, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MotionValue } from "framer-motion";
import DashboardContent from "./DashboardContent";

// Component that displays the 3D model and manages scroll animations
function MacbookScene({ 
  rotateX, 
  smoothProgress 
}: { 
  rotateX: MotionValue<number>; 
  smoothProgress: MotionValue<number>; 
}) {
  // Load the glb file from public/models/Macbook.glb
  const { scene } = useGLTF("/models/Macbook.glb");
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Object3D | null>(null);
  const [hasLidNode, setHasLidNode] = useState(false);

  // Traverse the 3D scene graph, log node names to console, and locate the lid/screen node.
  useEffect(() => {
    if (scene) {
      console.log("=== START GLB HIERARCHY INSPECTION ===");
      console.log("[GLTF scene object]", scene);
      
      scene.traverse((child) => {
        console.log(`[GLB Node] Name: "${child.name}" | Type: ${child.type} | Position:`, child.position);
      });
      console.log("=== END GLB HIERARCHY INSPECTION ===");
    }
  }, [scene]);

  // Frame loop to synchronize Scroll progress and Three.js animations
  useFrame(() => {
    if (groupRef.current) {
      // Uniform scroll-triggered scale and opacity animation for the entire group
      // Progress 0 -> 0.4: scale goes from 0 to 1
      // Progress 0.4 -> 0.6: scale stays at 1 (dashboard readable)
      // Progress 0.6 -> 1.0: scale goes from 1 back to 0
      const p = smoothProgress.get();
      let scaleVal = 0;
      if (p < 0.4) {
        scaleVal = p / 0.4; // scale up to 1
      } else if (p < 0.6) {
        scaleVal = 1; // stay open
      } else {
        scaleVal = Math.max(0, 1 - (p - 0.6) / 0.4); // scale down to 0
      }
      groupRef.current.scale.set(scaleVal, scaleVal, scaleVal);
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Render the 3D MacBook model */}
      <primitive object={scene} />

      {/* Floating 3D dashboard screen positioned right above the keyboard base */}
      {/* This ensures the screen scales uniformly with the model, preserving aspect ratio. */}
      <group position={[0, 0.72, -0.22]} rotation={[-0.15, 0, 0]}>
        <mesh>
          <planeGeometry args={[2.7, 1.7]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
        </mesh>
        <Html
          transform
          occlude
          position={[0, 0, 0.01]}
          style={{
            width: "800px",
            height: "500px",
            background: "#fff",
            borderRadius: "6px",
            overflow: "hidden"
          }}
        >
          <DashboardContent className="w-full h-full text-[10px]" />
        </Html>
      </group>
    </group>
  );
}

// Main component holding the 3D Canvas
export default function MacbookModel({ 
  rotateX, 
  smoothProgress 
}: { 
  rotateX: MotionValue<number>; 
  smoothProgress: MotionValue<number>; 
}) {
  return (
    <div className="w-full h-[550px] relative bg-transparent rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 1.4, 3.2], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 3]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <pointLight position={[-10, 5, -5]} intensity={0.5} />
        
        {/* Environment preset for realistic B2B metal reflections */}
        <Environment preset="city" />

        <React.Suspense fallback={null}>
          <MacbookScene rotateX={rotateX} smoothProgress={smoothProgress} />
        </React.Suspense>

        {/* Standard controls allowing the user to rotate the camera around the model */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
