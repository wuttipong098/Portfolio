// "use client";

// import { Canvas, useFrame } from "@react-three/fiber";
// import { Float, MeshDistortMaterial } from "@react-three/drei";
// import { useRef } from "react";
// import * as THREE from "three";

// function FloatingShape() {
//   const groupRef = useRef<THREE.Group>(null);

//   useFrame((state, delta) => {
//     if (!groupRef.current) return;

//     const scrollProgress =
//       typeof window !== "undefined"
//         ? window.scrollY / window.innerHeight
//         : 0;

//     groupRef.current.rotation.x += delta * 0.15;
//     groupRef.current.rotation.y += delta * 0.2;
//     groupRef.current.rotation.z = scrollProgress * 0.25;
//   });

//   return (
//     <group ref={groupRef}>
//       <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
//         <mesh position={[2.5, 0.5, 0]}>
//           <icosahedronGeometry args={[1.2, 1]} />
//           <MeshDistortMaterial
//             color="#D8B4FE"
//             emissive="#8D00AD"
//             emissiveIntensity={0.3}
//             roughness={0.2}
//             metalness={0.6}
//             distort={0.25}
//             speed={2}
//           />
//         </mesh>
//       </Float>

//       <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
//         <mesh position={[-3, -1, -1]}>
//           <torusGeometry args={[0.8, 0.2, 16, 100]} />
//           <meshStandardMaterial
//             color="#FFFFFF"
//             metalness={0.7}
//             roughness={0.2}
//           />
//         </mesh>
//       </Float>

//       <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>
//         <mesh position={[0, 2, -2]}>
//           <sphereGeometry args={[0.45, 32, 32]} />
//           <meshStandardMaterial
//             color="#A855F7"
//             metalness={0.5}
//             roughness={0.2}
//           />
//         </mesh>
//       </Float>
//     </group>
//   );
// }

// export default function Portfolio3D() {
//   return (
//     <div
//       aria-hidden="true"
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 0,
//         pointerEvents: "none",
//       }}
//     >
//       <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
//         <ambientLight intensity={1.5} />

//         <directionalLight
//           position={[5, 5, 5]}
//           intensity={2}
//         />

//         <pointLight
//           position={[-5, -3, 3]}
//           intensity={2}
//           color="#D8B4FE"
//         />

//         <FloatingShape />
//       </Canvas>
//     </div>
//   );
// }