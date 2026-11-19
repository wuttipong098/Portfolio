"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ======================================
// MOON TEXTURE
// ======================================

function createMoonTexture() {
  const width = 1024;
  const height = 512;
  const data = new Uint8Array(width * height * 4);

  const craters = Array.from({ length: 140 }, (_, i) => {
    const seed = Math.sin(i * 127.1) * 43758.5453;
    return {
      x: ((seed % 1) + 1) % 1,
      y: 0.08 + (((Math.sin(i * 311.7) * 12741.3) % 1 + 1) % 1) * 0.84,
      radius: 0.004 + ((i * 19) % 55) / 2200,
      depth: 0.18 + ((i * 7) % 20) / 100,
    };
  });

  const largeCraters = [
    { x: 0.32, y: 0.38, radius: 0.085, depth: 0.32 },
    { x: 0.68, y: 0.55, radius: 0.07, depth: 0.28 },
    { x: 0.48, y: 0.72, radius: 0.055, depth: 0.25 },
    { x: 0.22, y: 0.62, radius: 0.048, depth: 0.22 },
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;

      let surface =
        Math.sin(u * 68 + v * 41) * 0.07 +
        Math.sin(u * 132 - v * 79) * 0.04 +
        Math.sin(u * 265 + v * 171) * 0.022 +
        Math.sin(u * 410 - v * 245) * 0.012 +
        Math.sin(u * 680 + v * 390) * 0.006;

      for (const crater of craters) {
        let dx = Math.abs(u - crater.x);
        dx = Math.min(dx, 1 - dx);
        const dy = v - crater.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < crater.radius) {
          const edge = dist / crater.radius;
          surface -= (1 - edge) * crater.depth;
          surface += Math.exp(-Math.pow((edge - 0.82) * 14, 2)) * 0.11;
        }
      }

      for (const crater of largeCraters) {
        let dx = Math.abs(u - crater.x);
        dx = Math.min(dx, 1 - dx);
        const dy = v - crater.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < crater.radius) {
          const edge = dist / crater.radius;
          surface -= (1 - edge) * crater.depth;
          surface += Math.exp(-Math.pow((edge - 0.78) * 11, 2)) * 0.16;
        }
      }

      const maria =
        Math.sin(u * 14 + v * 11) * Math.sin(u * 27 - v * 8) * 0.045 +
        Math.sin(u * 9 + v * 19) * 0.025;

      surface += maria;

      const variation = THREE.MathUtils.clamp(0.62 + surface, 0.15, 1);
      const index = (y * width + x) * 4;

      data[index] = 155 + variation * 85;
      data[index + 1] = 145 + variation * 95;
      data[index + 2] = 210 + variation * 45;
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  return texture;
}

// ======================================
// ATMOSPHERIC SHADER
// ======================================

const atmosphereVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uScale;
  uniform float uSpeed;
  uniform float uThreshold;
  uniform float uSoftness;
  uniform float uFog;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p *= 2.05;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * uSpeed;

    vec2 warp = vec2(
      fbm(uv * 2.8 + time * 0.12),
      fbm(uv * 2.8 - time * 0.09 + 3.7)
    );

    vec2 p = uv * uScale + warp * 1.55;

    float cloudNoise = fbm(p + vec2(time * 0.06, time * 0.02));
    cloudNoise += fbm(p * 1.7 - vec2(time * 0.035, 0.15)) * 0.32;
    cloudNoise += fbm(p * 3.2 + vec2(time * 0.02, -time * 0.01)) * 0.12;

    float alpha = smoothstep(uThreshold, uThreshold + uSoftness, cloudNoise);

    float verticalFade = smoothstep(0.0, 0.18, uv.y) * (1.0 - smoothstep(0.68, 1.0, uv.y));

    if (uFog > 0.5) {
      float horizontalFade = smoothstep(0.0, 0.1, uv.x) * (1.0 - smoothstep(0.9, 1.0, uv.x));
      alpha *= horizontalFade;
      alpha *= 0.55 + cloudNoise * 0.45;
    } else {
      alpha *= verticalFade;
    }

    alpha = pow(alpha, 1.15);
    alpha *= uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ======================================
// ATMOSPHERIC LAYER
// ======================================

type AtmosphereProps = {
  position: [number, number, number];
  size: [number, number];
  color: string;
  opacity: number;
  scale: number;
  speed: number;
  threshold: number;
  softness: number;
  fog?: boolean;
  driftSpeed?: number;
  driftAmount?: number;
};

function AtmosphereLayer({
  position,
  size,
  color,
  opacity,
  scale,
  speed,
  threshold,
  softness,
  fog = false,
  driftSpeed = 0.08,
  driftAmount = 0.35,
}: AtmosphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: opacity },
          uScale: { value: scale },
          uSpeed: { value: speed },
          uThreshold: { value: threshold },
          uSoftness: { value: softness },
          uFog: { value: fog ? 1 : 0 },
        },
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
      }),
    [color, opacity, scale, speed, threshold, softness, fog]
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;

    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.position.x =
        position[0] + Math.sin(t * driftSpeed) * driftAmount;
      meshRef.current.position.y =
        position[1] + Math.cos(t * driftSpeed * 0.7) * (driftAmount * 0.4);
    }
  });

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return (
    <mesh ref={meshRef} position={position} renderOrder={fog ? 3 : 2}>
      <planeGeometry args={size} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ======================================
// MOON 3D
// ======================================

// ======================================
// MOON 3D
// ======================================

function Moon() {
  const groupRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const moonTexture = useMemo(() => createMoonTexture(), []);

  useEffect(() => {
    return () => moonTexture.dispose();
  }, [moonTexture]);

  useFrame((_, delta) => {
    // หมุนตัวเองเร็วขึ้น
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.045;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.35, 0]}>
      {/* Outer soft purple glow */}
      <mesh>
        <sphereGeometry args={[2.35, 64, 64]} />
        <meshBasicMaterial
          color="#8b6bff"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Mid glow */}
      <mesh>
        <sphereGeometry args={[1.95, 64, 64]} />
        <meshBasicMaterial
          color="#a78bff"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[1.68, 64, 64]} />
        <meshBasicMaterial
          color="#c4b0ff"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main Moon */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[1.52, 128, 128]} />
        <meshStandardMaterial
          map={moonTexture}
          color="#d8d0ff"
          roughness={0.92}
          metalness={0.02}
          emissive="#5a4299"
          emissiveIntensity={0.14}
        />
      </mesh>
    </group>
  );
}

// ======================================
// CLOUDS
// ======================================

function Clouds() {
  return (
    <>
      <AtmosphereLayer
        position={[0, -2.8, -3.2]}
        size={[24, 8]}
        color="#3d4fc9"
        opacity={0.85}
        scale={4.8}
        speed={0.09}
        threshold={0.41}
        softness={0.28}
        driftSpeed={0.06}
        driftAmount={0.25}
      />

      <AtmosphereLayer
        position={[0, -3.4, -1.6]}
        size={[23, 7.5]}
        color="#5c4fd4"
        opacity={0.78}
        scale={5.4}
        speed={0.075}
        threshold={0.43}
        softness={0.24}
        driftSpeed={0.07}
        driftAmount={0.3}
      />

      <AtmosphereLayer
        position={[0, -4.0, 0.2]}
        size={[22, 7]}
        color="#8b4fd9"
        opacity={0.72}
        scale={5.8}
        speed={0.065}
        threshold={0.44}
        softness={0.22}
        driftSpeed={0.08}
        driftAmount={0.35}
      />

      <AtmosphereLayer
        position={[0, -4.6, 1.8]}
        size={[22, 6.5]}
        color="#c45be0"
        opacity={0.58}
        scale={5.5}
        speed={0.055}
        threshold={0.46}
        softness={0.2}
        driftSpeed={0.09}
        driftAmount={0.4}
      />

      <AtmosphereLayer
        position={[0, -5.1, 3.0]}
        size={[21, 5.8]}
        color="#e070f0"
        opacity={0.38}
        scale={5.2}
        speed={0.045}
        threshold={0.48}
        softness={0.18}
        driftSpeed={0.1}
        driftAmount={0.45}
      />
    </>
  );
}

// ======================================
// FOG → เปลี่ยนเป็นเมฆมากขึ้น
// ======================================

function Fog() {
  return (
    <>
      <AtmosphereLayer
        position={[0, -1.2, -2.2]}
        size={[24, 5.5]}
        color="#4a5cc8"
        opacity={0.42}
        scale={3.2}
        speed={0.035}
        threshold={0.38}
        softness={0.28}
        fog={false}
        driftSpeed={0.05}
        driftAmount={0.5}
      />

      <AtmosphereLayer
        position={[0, -2.3, 0.5]}
        size={[23, 4.8]}
        color="#8b6be8"
        opacity={0.38}
        scale={3.6}
        speed={0.045}
        threshold={0.4}
        softness={0.26}
        fog={false}
        driftSpeed={0.065}
        driftAmount={0.55}
      />

      <AtmosphereLayer
        position={[0, -3.5, 2.6]}
        size={[22, 4.5]}
        color="#c070e8"
        opacity={0.32}
        scale={4.0}
        speed={0.04}
        threshold={0.42}
        softness={0.24}
        fog={false}
        driftSpeed={0.08}
        driftAmount={0.6}
      />
    </>
  );
}

// ======================================
// STARS
// ======================================

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 2200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 127.1) * 43758.5;
      const seed2 = Math.sin(i * 311.7) * 12741.3;
      const seed3 = Math.sin(i * 74.7) * 31821.7;

      const r1 = seed1 - Math.floor(seed1);
      const r2 = seed2 - Math.floor(seed2);
      const r3 = seed3 - Math.floor(seed3);

      positions[i * 3] = (r1 - 0.5) * 38;
      positions[i * 3 + 1] = (r2 - 0.5) * 24;
      positions[i * 3 + 2] = -4 - r3 * 14;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      const t = state.clock.elapsedTime;
      starsRef.current.rotation.y = Math.sin(t * 0.018) * 0.02;
      starsRef.current.rotation.x = Math.sin(t * 0.014) * 0.012;
    }
  });

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial
        color="#e0dcff"
        size={0.032}
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}


// ======================================
// MAIN SCENE
// ======================================

function Scene() {
  const sceneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!sceneRef.current) return;

    const targetX = state.pointer.x * 0.18;
    const targetY = state.pointer.y * 0.1;

    sceneRef.current.rotation.y = THREE.MathUtils.lerp(
      sceneRef.current.rotation.y,
      targetX,
      0.022
    );
    sceneRef.current.rotation.x = THREE.MathUtils.lerp(
      sceneRef.current.rotation.x,
      -targetY,
      0.022
    );
  });

  return (
    <>
      <color attach="background" args={["#02091d"]} />
      <fog attach="fog" args={["#0a1240", 14, 32]} />

      <group ref={sceneRef}>
        <ambientLight intensity={0.5} color="#7a8cff" />

        <directionalLight
          position={[-3.5, 4.5, 6]}
          intensity={1.2}
          color="#c4b0ff"
        />

        <directionalLight
          position={[2, -1, 4]}
          intensity={0.4}
          color="#b06bff"
        />

        <Stars />
        <Moon />
        <Fog />
        <Clouds />
      </group>
    </>
  );
}

// ======================================
// BACKGROUND 3D COMPONENT
// ======================================

export default function Background3D() {
  return (
    <div className="background3d" aria-hidden="true">
      <Canvas
        camera={{
          position: [0, 0.2, 10.5],
          fov: 48,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}