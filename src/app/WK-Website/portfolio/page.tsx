// "use client";

// import { Canvas, useFrame } from "@react-three/fiber";
// import { useTexture } from "@react-three/drei";
// import { useState, useRef } from "react";
// import * as THREE from "three";
// import img1 from "@/public/PF/1.png";
// import img2 from "@/public/PF/2.png";
// import img3 from "@/public/PF/3.png";
// import img4 from "@/public/PF/4.png";
// import img5 from "@/public/PF/5.png";
// import img6 from "@/public/PF/6.png";
// import img7 from "@/public/PF/7.png";
// import img8 from "@/public/PF/8.png";
// import img9 from "@/public/PF/9.png";
// import img10 from "@/public/PF/10.png";
// import img11 from "@/public/PF/11.png";
// import img12 from "@/public/PF/12.png";
// import img13 from "@/public/PF/13.png";
// import img14 from "@/public/PF/14.png";
// import img15 from "@/public/PF/15.png";
// import img16 from "@/public/PF/16.png";
// import img17 from "@/public/PF/17.png";
// import img18 from "@/public/PF/18.png";
// import img19 from "@/public/PF/19.png";
// import img20 from "@/public/PF/20.png";
// import img21 from "@/public/PF/21.png";
// import img22 from "@/public/PF/22.png";

// const images = [
//   img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
//   img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
//   img21, img22,
// ];

// function ImageCard({
//   url,
//   index,
//   activeIndex,
// }: {
//   url: any;
//   index: number;
//   activeIndex: number;
// }) {
//   const texture = useTexture(
//     typeof url === "string" ? url : url.src
//   ) as THREE.Texture;

//   texture.colorSpace = THREE.SRGBColorSpace;

//   const meshRef = useRef<THREE.Mesh>(null);

//   const offset = index - activeIndex;

//   const x = offset * 3.2;
//   const z = -Math.abs(offset) * 2.0;
//   const rotY = offset * -0.36;
//   const scale = offset === 0 ? 1.45 : 1 - Math.abs(offset) * 0.11;
//   const opacity = Math.max(0.25, 1 - Math.abs(offset) * 0.28);

//   useFrame(() => {
//     if (!meshRef.current) return;

//     meshRef.current.position.x = THREE.MathUtils.lerp(
//       meshRef.current.position.x,
//       x,
//       0.12
//     );
//     meshRef.current.position.z = THREE.MathUtils.lerp(
//       meshRef.current.position.z,
//       z,
//       0.12
//     );
//     meshRef.current.rotation.y = THREE.MathUtils.lerp(
//       meshRef.current.rotation.y,
//       rotY,
//       0.12
//     );
//     meshRef.current.scale.setScalar(
//       THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.12)
//     );

//     const mat = meshRef.current.material as THREE.MeshBasicMaterial;
//     mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity, 0.12);
//   });

//   return (
//     <mesh ref={meshRef} position={[x, 0, z]} rotation={[0, rotY, 0]}>
//       <planeGeometry args={[3.0, 4.0]} />
//       <meshBasicMaterial
//         map={texture}
//         transparent
//         opacity={opacity}
//         side={THREE.DoubleSide}
//         toneMapped={false}
//       />
//     </mesh>
//   );
// }

// function Scene({ activeIndex }: { activeIndex: number }) {
//   return (
//     <>
//       {images.map((url, i) => (
//         <ImageCard key={i} url={url} index={i} activeIndex={activeIndex} />
//       ))}
//     </>
//   );
// }

// export default function Travel3DPage() {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const prev = () => {
//     setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   const next = () => {
//     setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//   };

//   return (
//     <main className="relative h-screen w-full overflow-hidden">
//       <Canvas
//         camera={{ position: [0, 0, 9], fov: 45 }}
//         gl={{
//           toneMapping: THREE.NoToneMapping,
//           outputColorSpace: THREE.SRGBColorSpace,
//         }}
//       >
//         <Scene activeIndex={activeIndex} />
//       </Canvas>

//       {/* ปุ่มลูกศรซ้าย */}
//       <button
//         onClick={prev}
//         className="absolute left-6 top-1/2 -translate-y-1/2 z-10
//                    w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
//                    backdrop-blur-md border border-white/20
//                    flex items-center justify-center text-white text-2xl
//                    transition-all duration-200"
//       >
//         ‹
//       </button>

//       {/* ปุ่มลูกศรขวา */}
//       <button
//         onClick={next}
//         className="absolute right-6 top-1/2 -translate-y-1/2 z-10
//                    w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
//                    backdrop-blur-md border border-white/20
//                    flex items-center justify-center text-white text-2xl
//                    transition-all duration-200"
//       >
//         ›
//       </button>

//       {/* จุดบอกตำแหน่ง */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
//         {images.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setActiveIndex(i)}
//             className={`w-2 h-2 rounded-full transition-all duration-300 ${
//               i === activeIndex ? "bg-white w-6" : "bg-white/40"
//             }`}
//           />
//         ))}
//       </div>
//     </main>
//   );
// }

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import img1 from "@/public/PF/1.png";
import img2 from "@/public/PF/2.png";
import img3 from "@/public/PF/3.png";
import img4 from "@/public/PF/4.png";
import img5 from "@/public/PF/5.png";
import img6 from "@/public/PF/6.png";
import img7 from "@/public/PF/7.png";
import img8 from "@/public/PF/8.png";
import img9 from "@/public/PF/9.png";
import img10 from "@/public/PF/10.png";
import img11 from "@/public/PF/11.png";
import img12 from "@/public/PF/12.png";
import img13 from "@/public/PF/13.png";
import img14 from "@/public/PF/14.png";
import img15 from "@/public/PF/15.png";
import img16 from "@/public/PF/16.png";
import img17 from "@/public/PF/17.png";
import img18 from "@/public/PF/18.png";
import img19 from "@/public/PF/19.png";
import img20 from "@/public/PF/20.png";
import img21 from "@/public/PF/21.png";
import img22 from "@/public/PF/22.png";

const images = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22,
];

// ฟังก์ชันสร้าง Geometry มุมโค้ง (Rounded Rectangle)
function createRoundedRectGeometry(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();

  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);

  return new THREE.ShapeGeometry(shape);
}

function ImageCard({
  url,
  index,
  activeIndex,
}: {
  url: any;
  index: number;
  activeIndex: number;
}) {
  const texture = useTexture(
    typeof url === "string" ? url : url.src
  ) as THREE.Texture;

  texture.colorSpace = THREE.SRGBColorSpace;

  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const frameMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const roundedRectGeo = useMemo(() => {
    return createRoundedRectGeometry(3.2, 4.2, 0.15);
  }, []);

  const offset = index - activeIndex;

  const x = offset * 3.2;
  const y = -0.3;
  const z = -Math.abs(offset) * 2.0;
  const rotY = offset * -0.36;
  const scale = offset === 0 ? 1.45 : 1 - Math.abs(offset) * 0.11;
  const opacity = Math.max(0.25, 1 - Math.abs(offset) * 0.28);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      x,
      0.12
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      y,
      0.12
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      z,
      0.12
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotY,
      0.12
    );
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.12)
    );

    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        opacity,
        0.12
      );
    }
    if (frameMatRef.current) {
      frameMatRef.current.opacity = THREE.MathUtils.lerp(
        frameMatRef.current.opacity,
        opacity * 0.3,
        0.12
      );
    }
  });

  return (
    <group ref={groupRef} position={[x, y, z]} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0, -0.02]} geometry={roundedRectGeo}>
        <meshBasicMaterial
          ref={frameMatRef}
          color="#ffffff"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[3.0, 4.0]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Scene({ activeIndex }: { activeIndex: number }) {
  return (
    <>
      {images.map((url, i) => (
        <ImageCard key={i} url={url} index={i} activeIndex={activeIndex} />
      ))}
    </>
  );
}

export default function Travel3DPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const prev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // ดักจับการเลื่อน Scroll เมาส์เฉพาะตอนอยู่ที่รูปแรกสุดแล้วเลื่อนขึ้นเพื่อกลับ Main
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollTimeout.current) return;

      if (e.deltaY > 0) {
        next();
      } else {
        if (activeIndex === 0) {
          router.push("/WK-Website/main");
        } else {
          prev();
        }
      }

      scrollTimeout.current = setTimeout(() => {
        scrollTimeout.current = null;
      }, 300);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [activeIndex, router]);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Scene activeIndex={activeIndex} />
      </Canvas>

      {/* ปุ่มลูกศรซ้าย */}
      <button
        onClick={() => {
          if (activeIndex === 0) {
            router.push("/WK-Website/main");
          } else {
            prev();
          }
        }}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10
                   w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                   backdrop-blur-md border border-white/20
                   flex items-center justify-center text-white text-2xl
                   transition-all duration-200"
      >
        ‹
      </button>

      {/* ปุ่มลูกศรขวา */}
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10
                   w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                   backdrop-blur-md border border-white/20
                   flex items-center justify-center text-white text-2xl
                   transition-all duration-200"
      >
        ›
      </button>

      {/* จุดบอกตำแหน่ง */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-white w-6" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </main>
  );
}