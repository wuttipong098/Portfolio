"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ======================================
// RANDOM (ใช้สุ่มตำแหน่งดาว)
// ======================================

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ======================================
// NOISE
// ======================================

function hash3(x: number, y: number, z: number) {
  let h =
    Math.imul(x, 374761393) ^
    Math.imul(y, 668265263) ^
    Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  let xf = x - xi;
  let yf = y - yi;
  let zf = z - zi;
  xf = xf * xf * (3 - 2 * xf);
  yf = yf * yf * (3 - 2 * yf);
  zf = zf * zf * (3 - 2 * zf);

  const l = (a: number, b: number, t: number) => a + (b - a) * t;

  return l(
    l(
      l(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), xf),
      l(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), xf),
      yf
    ),
    l(
      l(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), xf),
      l(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), xf),
      yf
    ),
    zf
  );
}

function fbm3(x: number, y: number, z: number, octaves: number) {
  let value = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    value += amp * noise3(x * f, y * f, z * f);
    f *= 2.03;
    amp *= 0.5;
  }
  return value;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// แปลงตำแหน่งบน "หน้าจาน" ของดวงจันทร์ (sx, sy อยู่ในช่วง -1..1, ขวา/บนเป็นบวก)
// เป็นตำแหน่งบนพื้นผิว (lon, lat) ตอนเริ่มต้นหน้าที่หันเข้าหากล้องคือ u = 0.25
function discToSurface(sx: number, sy: number) {
  const z = Math.sqrt(Math.max(0, 1 - sx * sx - sy * sy));
  const lon = Math.PI / 2 + Math.atan2(sx, z);
  const lat = Math.asin(Math.max(-1, Math.min(1, sy)));
  return { lon, lat };
}

// ทะเลสีเข้มผืนใหญ่ วางตามลวดลายในภาพอ้างอิง (sx, sy, r)
// sx: ซ้าย(-) ขวา(+), sy: ล่าง(-) บน(+), r: ขนาด
const MARIA: Array<[number, number, number]> = [
  [-0.38, 0.22, 0.34],
  [-0.12, 0.4, 0.18],
  [0.12, 0.5, 0.15],
  [0.05, 0.12, 0.2],
  [0.3, 0.24, 0.12],
  [0.52, 0.42, 0.11],
  [-0.46, -0.2, 0.16],
  [-0.05, -0.2, 0.13],
  [0.18, -0.02, 0.1],
];

// ======================================
// สีของดวงจันทร์ (ปรับตรงนี้ได้เลย)
// ======================================
const HIGHLAND_COLOR: [number, number, number] = [1.0, 0.97, 0.94]; // ที่สูง: ขาวอมครีม
const MARE_COLOR: [number, number, number] = [0.6, 0.6, 0.64]; // ทะเล: เทาเย็นอ่อน (ไม่มีสีน้ำตาล)
// ตัวอย่างสีอื่น: น้ำตาลอำพัน [0.62, 0.40, 0.30] | เขียวหม่น [0.30, 0.52, 0.50] | โรสมอฟ [0.62, 0.34, 0.46] | เทาอุ่น [0.45, 0.42, 0.44]

// ======================================
// ใช้รูปถ่ายเป็นลายดวงจันทร์ (ไม่บังคับ)
// ======================================
// ใส่ไฟล์ไว้ใน public/ แล้วใส่ path ตรงนี้ เช่น "/textures/moon.jpg"
// ต้องเป็นรูปแบบ equirectangular (กว้าง:สูง = 2:1) ถ้าเป็น null จะใช้ลายที่โค้ดสร้างเอง
const MOON_IMAGE_URL: string | null = null;

// ======================================
// MOON TEXTURE
// ======================================

function createMoonTexture() {
  const W = 1024;
  const H = 512;
  const data = new Uint8Array(W * H * 4);
  const hdata = new Uint8Array(W * H * 4); // height map (ขาว = สูง, ดำ = ต่ำ)

  const cosLon = new Float32Array(W);
  const sinLon = new Float32Array(W);
  for (let x = 0; x < W; x++) {
    const lon = ((x + 0.5) / W) * Math.PI * 2;
    cosLon[x] = Math.cos(lon);
    sinLon[x] = Math.sin(lon);
  }

  const blobs = MARIA.map(([sx, sy, r]) => {
    const s = discToSurface(sx, sy);
    const rr = r * 1.15; // รัศมีเชิงมุม (เรเดียน)
    return {
      bx: Math.cos(s.lat) * Math.cos(s.lon),
      by: Math.sin(s.lat),
      bz: Math.cos(s.lat) * Math.sin(s.lon),
      rr,
      cutoff: Math.cos(rr * 1.8),
    };
  });

  const mix = (a: number, b: number, t: number) => a + (b - a) * t;

  for (let y = 0; y < H; y++) {
    const lat = ((y + 0.5) / H - 0.5) * Math.PI;
    const cl = Math.cos(lat);
    const sy = Math.sin(lat);

    for (let x = 0; x < W; x++) {
      const px = cl * cosLon[x];
      const py = sy;
      const pz = cl * sinLon[x];

      const terrain = fbm3(px * 3.2 + 11, py * 3.2 + 7, pz * 3.2 + 3, 5);
      const fine = fbm3(px * 14 + 5, py * 14 + 9, pz * 14 + 1, 3);

      // ทะเลสีเข้ม (ขอบขรุขระด้วย noise)
      let m = 0;
      for (const b of blobs) {
        const dot = px * b.bx + py * b.by + pz * b.bz;
        if (dot < b.cutoff) continue;
        const ang = Math.sqrt(Math.max(0, 2 * (1 - dot)));
        const edge = ang / b.rr + (terrain - 0.5) * 1.1 + (fine - 0.5) * 0.4;
        const v = smoothstep(1.0, 0.72, edge);
        if (v > m) m = v;
      }

      let shade = 0.74 + (terrain - 0.5) * 0.28 + (fine - 0.5) * 0.08;
      shade *= 1 - 0.35 * m;

      // สันเขาบนทะเล (wrinkle ridges)
      const ridge =
        1 - Math.abs(fbm3(px * 6 + 20, py * 6 + 4, pz * 6 + 9, 3) - 0.5) * 2;
      shade += m * Math.pow(Math.max(0, ridge), 6) * 0.06;

      // ลายหมุนวนนุ่ม ๆ (domain warping ให้เป็นลายคล้ายหินอ่อน)
      const wx = fbm3(px * 2.2 + 31, py * 2.2 + 17, pz * 2.2 + 5, 3);
      const wy = fbm3(px * 2.2 + 7, py * 2.2 + 43, pz * 2.2 + 19, 3);
      const swirl = fbm3(px * 3 + wx * 2.2, py * 3 + wy * 2.2, pz * 3 + 9, 4);
      shade += (swirl - 0.5) * 0.34;

      // เส้นสายยาวสีเข้ม (veins) และเส้นสว่าง (streaks)
      const vn = fbm3(px * 4.5 + wx * 1.8 + 50, py * 4.5 + wy * 1.8, pz * 4.5 + 2, 3);
      const vein = Math.pow(Math.max(0, 1 - Math.abs(vn - 0.5) * 2), 14);
      shade -= vein * 0.14;
      const vn2 = fbm3(px * 5.5 + wy * 2 + 90, py * 5.5 + 13, pz * 5.5 + wx * 2, 3);
      const streak = Math.pow(Math.max(0, 1 - Math.abs(vn2 - 0.5) * 2), 18);
      shade += streak * 0.1;

      // ปื้นสีใหญ่ ๆ ให้โทนสีเปลี่ยนไปมาทั่วดวง
      const patch = fbm3(px * 1.6 + 70, py * 1.6 + 5, pz * 1.6 + 30, 3);

      // ปื้นกระจายหลายขนาด (ใหญ่/กลาง/เล็ก) ขอบนุ่ม วางสุ่มทั่วดวง
      // ปรับจำนวน: ลดค่า threshold (ตัวเลขแรกใน smoothstep) = ปื้นเยอะขึ้น, เพิ่ม = น้อยลง
      const bigBlot = smoothstep(0.57, 0.70, fbm3(px * 1.5 + 120, py * 1.5 + 60, pz * 1.5 + 10, 3));
      const midBlot = smoothstep(0.59, 0.72, fbm3(px * 3.4 + 200, py * 3.4 + 80, pz * 3.4 + 40, 3));
      const smallBlot = smoothstep(0.61, 0.74, fbm3(px * 7.5 + 300, py * 7.5 + 20, pz * 7.5 + 90, 2));
      const darkBlot = Math.min(1, bigBlot * 0.9 + midBlot * 0.65 + smallBlot * 0.45);
      const lightBlot = smoothstep(0.60, 0.73, fbm3(px * 2.6 + 400, py * 2.6 + 33, pz * 2.6 + 71, 3));
      shade -= darkBlot * 0.17;
      shade += lightBlot * 0.09;

      // ความสูงของพื้นผิว: 0.5 = ระดับปกติ
      let h = 0.5 + (terrain - 0.5) * 0.1 + (fine - 0.5) * 0.03;
      h += m * Math.pow(Math.max(0, ridge), 6) * 0.04 - m * 0.02;
      h += (swirl - 0.5) * 0.05 - vein * 0.04 + streak * 0.02;
      h -= darkBlot * 0.03;

      shade = Math.min(1.15, Math.max(0.06, shade));

      // ผสมสีที่สูง/ทะเล + ปื้นสีอุ่น-เย็นจาง ๆ ให้ผิวไม่แบน
      const tint = (terrain - 0.5) * 0.08 + (patch - 0.5) * 0.14;
      const r = (mix(HIGHLAND_COLOR[0], MARE_COLOR[0], m) + tint) * shade;
      const g = mix(HIGHLAND_COLOR[1], MARE_COLOR[1], m) * shade;
      const b = (mix(HIGHLAND_COLOR[2], MARE_COLOR[2], m) - tint) * shade;

      const i = (y * W + x) * 4;
      data[i] = Math.min(255, Math.max(0, r * 255));
      data[i + 1] = Math.min(255, Math.max(0, g * 255));
      data[i + 2] = Math.min(255, Math.max(0, b * 255));
      data[i + 3] = 255;

      const hv = Math.min(255, Math.max(0, h * 255));
      hdata[i] = hv;
      hdata[i + 1] = hv;
      hdata[i + 2] = hv;
      hdata[i + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 8;
  tex.needsUpdate = true;

  const height = new THREE.DataTexture(hdata, W, H, THREE.RGBAFormat);
  height.colorSpace = THREE.NoColorSpace; // ข้อมูลความสูง ไม่ใช่สี
  height.wrapS = THREE.RepeatWrapping;
  height.wrapT = THREE.ClampToEdgeWrapping;
  height.minFilter = THREE.LinearMipmapLinearFilter;
  height.magFilter = THREE.LinearFilter;
  height.generateMipmaps = true;
  height.anisotropy = 8;
  height.needsUpdate = true;

  return { map: tex, height };
}

// ======================================
// SKY (ดำสนิท)
// ======================================

const skyVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = `
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;
  uniform vec3 uC4;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float y = vUv.y;
    vec3 c = mix(uC0, uC1, smoothstep(0.14, 0.38, y));
    c = mix(c, uC2, smoothstep(0.38, 0.56, y));
    c = mix(c, uC3, smoothstep(0.56, 0.72, y));
    c = mix(c, uC4, smoothstep(0.72, 0.88, y));
    c += (hash(gl_FragCoord.xy) - 0.5) / 255.0; // กัน banding
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`;

// อยากได้สีไล่เฉด (เช่น ดำด้านบน → น้ำเงินเข้มด้านล่าง) แก้ค่าสีตรงนี้ได้
// uC0 = ล่างสุด ... uC4 = บนสุด
const SKY_COLORS = ["#3a1a8a", "#1a1a78", "#07124a", "#02061a", "#000000"];

function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uC0: { value: new THREE.Color(SKY_COLORS[0]) },
          uC1: { value: new THREE.Color(SKY_COLORS[1]) },
          uC2: { value: new THREE.Color(SKY_COLORS[2]) },
          uC3: { value: new THREE.Color(SKY_COLORS[3]) },
          uC4: { value: new THREE.Color(SKY_COLORS[4]) },
        },
        vertexShader: skyVertexShader,
        fragmentShader: skyFragmentShader,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh position={[0, 0.2, -22]} renderOrder={-10}>
      <planeGeometry args={[80, 40]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ======================================
// MOON HALO (แสงฟุ้งรอบดวงจันทร์ ฟ้า → ม่วงชมพู)
// ======================================

const haloFragmentShader = `
  uniform vec3 uL;
  uniform vec3 uR;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float g = exp(-r * r * 6.0) * 0.55 + exp(-r * r * 1.8) * 0.18;
    vec3 col = mix(uL, uR, smoothstep(0.25, 0.8, vUv.x));
    float a = g * (1.0 - smoothstep(0.85, 1.0, r));
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

function MoonHalo() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uL: { value: new THREE.Color("#3f86ff") },
          uR: { value: new THREE.Color("#c77bff") },
        },
        vertexShader: skyVertexShader,
        fragmentShader: haloFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh position={[0, 0, -1.2]} renderOrder={-4}>
      <planeGeometry args={[18, 18]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ======================================
// MOON RIM GLOW (Fresnel: ซ้ายฟ้า / ขวาชมพู)
// ======================================

const glowVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  uniform vec3 uColorL;
  uniform vec3 uColorR;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormal;
  void main() {
    // เรนเดอร์ด้านหลังของทรงกลม: -nz = 1 ตรงกลาง, 0 ที่ขอบนอกสุด → จางหายนุ่มๆ
    float f = clamp(-vNormal.z, 0.0, 1.0);
    float glow = pow(f, uPower) * uIntensity;
    vec3 col = mix(uColorL, uColorR, smoothstep(-0.6, 0.8, vNormal.x));
    gl_FragColor = vec4(col, clamp(glow, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

function MoonGlow({
  radius,
  colorL,
  colorR,
  intensity,
  power,
}: {
  radius: number;
  colorL: string;
  colorR: string;
  intensity: number;
  power: number;
}) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColorL: { value: new THREE.Color(colorL) },
          uColorR: { value: new THREE.Color(colorR) },
          uIntensity: { value: intensity },
          uPower: { value: power },
        },
        vertexShader: glowVertexShader,
        fragmentShader: glowFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    [colorL, colorR, intensity, power]
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh renderOrder={-3}>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ======================================
// MOON 3D
// ======================================

function Moon() {
  const groupRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const { map, height } = useMemo(() => createMoonTexture(), []);
  const [imageMap, setImageMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    return () => {
      map.dispose();
      height.dispose();
    };
  }, [map, height]);

  // โหลดรูปถ่าย (ถ้าตั้ง MOON_IMAGE_URL ไว้)
  useEffect(() => {
    if (!MOON_IMAGE_URL) return;
    let cancelled = false;
    let loaded: THREE.Texture | null = null;
    new THREE.TextureLoader().load(MOON_IMAGE_URL, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.anisotropy = 8;
      if (cancelled) {
        t.dispose();
        return;
      }
      loaded = t;
      setImageMap(t);
    });
    return () => {
      cancelled = true;
      loaded?.dispose();
    };
  }, []);

  const activeMap = imageMap ?? map;

  useFrame((state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.025;
    }
    if (groupRef.current) {
      groupRef.current.position.y =
        1.35 + Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.35, 0]} rotation={[0.1, 0, -0.14]}>
      <MoonHalo />

      {/* ออร่าชั้นนอก → ชั้นใน (ขอบขวาออกชมพู) */}
      <MoonGlow
        radius={2.6}
        colorL="#5b8cff"
        colorR="#d070ff"
        intensity={0.85}
        power={2.8}
      />
      <MoonGlow
        radius={1.9}
        colorL="#a9c2ff"
        colorR="#ff8ae6"
        intensity={0.75}
        power={1.7}
      />
      <MoonGlow
        radius={1.62}
        colorL="#dfe6ff"
        colorR="#ffb0f0"
        intensity={1.0}
        power={1.2}
      />

      <mesh ref={moonRef}>
        <sphereGeometry args={[1.52, 192, 192]} />
        <meshStandardMaterial
          map={activeMap}
          color="#fff6ee"
          roughness={0.95}
          metalness={0}
          emissive="#d8c8ff"
          emissiveMap={activeMap}
          emissiveIntensity={0.3}
          bumpMap={imageMap ?? height}
          bumpScale={imageMap ? 1.2 : 2.5}
          displacementMap={imageMap ? null : height}
          displacementScale={0.12}
          displacementBias={-0.06}
        />
      </mesh>
    </group>
  );
}

// ======================================
// BILLOWY CLOUDS (เมฆก้อนนูน มีแสงชมพู/ฟ้าที่ขอบ)
// ======================================

const cloudVertexShader = `
  varying vec2 vP;
  void main() {
    vP = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragmentShader = `
  uniform float uTime;
  uniform vec3 uShadow;
  uniform vec3 uMid;
  uniform vec3 uLitL;
  uniform vec3 uLitR;
  uniform float uScale;
  uniform float uAmp;
  uniform float uSlope;
  uniform float uThresh;
  uniform float uSoft;
  uniform float uOpacity;
  uniform float uLit;
  uniform float uDepth;
  uniform float uSeed;

  varying vec2 vP;

  float hash(vec2 p) {
    p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
    return fract(p.x * p.y * (p.x + p.y));
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

  float fbm5(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  float fbm3(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(3.1, 4.7);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vP;

    // ข้ามพิกเซลที่สูงเกินกว่าเมฆจะขึ้นไปถึง (ประหยัด GPU)
    if (uAmp * 0.9 - p.y * uSlope < uThresh) discard;

    vec2 off = vec2(uSeed, uSeed * 0.37);
    vec2 q = p / uScale + off;
    q.x += uTime * 0.03;

    vec2 w = vec2(
      fbm3(q * 0.6 + vec2(1.7, 9.2) + uTime * 0.01),
      fbm3(q * 0.6 + vec2(8.3, 2.8) - uTime * 0.008)
    );
    vec2 warp = (w - 0.5) * 1.6;

    float f0 = fbm5(q + warp) * uAmp - p.y * uSlope;
    float a = smoothstep(uThresh, uThresh + uSoft, f0);
    if (a < 0.003) discard;

    // แสงตกจากขวาบน: เทียบความหนาแน่นในทิศทางแสง
    vec2 L = normalize(vec2(0.6, 0.8));
    float e = 0.3;
    vec2 p1 = p + L * e;
    vec2 q1 = p1 / uScale + off;
    q1.x += uTime * 0.03;
    float f1 = fbm5(q1 + warp) * uAmp - p1.y * uSlope;

    float lit = smoothstep(0.10, 0.5, f0 - f1);

    float inner = f0 - uThresh;
    float rim = 1.0 - smoothstep(0.0, 1.0, inner);

    vec3 col = mix(uMid, uShadow, smoothstep(0.0, 1.2, inner));
    float depthFade = smoothstep(0.0, uDepth, -p.y);
    col = mix(col, uShadow * 0.6, depthFade * 0.6);

    vec3 litCol = mix(uLitL, uLitR, smoothstep(-4.0, 7.0, p.x));
    col += litCol * lit * mix(0.35, 1.0, rim) * uLit;

    gl_FragColor = vec4(col, a * uOpacity);
    #include <colorspace_fragment>
  }
`;

type CloudLayerProps = {
  z: number;
  top: number;
  scale: number;
  seed: number;
  shadow: string;
  mid: string;
  litL: string;
  litR: string;
  opacity: number;
  lit: number;
  order: number;
  amp?: number;
  slope?: number;
  thresh?: number;
  soft?: number;
};

function CloudLayer({
  z,
  top,
  scale,
  seed,
  shadow,
  mid,
  litL,
  litR,
  opacity,
  lit,
  order,
  amp = 1.4,
  slope = 0.5,
  thresh = 0.75,
  soft = 0.35,
}: CloudLayerProps) {
  const W = 44;
  const H = 14;

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(W, H);
    g.translate(0, -H / 2 + 2, 0); // ขอบบนของเมฆอยู่ที่ y = 0 (local)
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uShadow: { value: new THREE.Color(shadow) },
          uMid: { value: new THREE.Color(mid) },
          uLitL: { value: new THREE.Color(litL) },
          uLitR: { value: new THREE.Color(litR) },
          uScale: { value: scale },
          uAmp: { value: amp },
          uSlope: { value: slope },
          uThresh: { value: thresh },
          uSoft: { value: soft },
          uOpacity: { value: opacity },
          uLit: { value: lit },
          uDepth: { value: 5 },
          uSeed: { value: seed },
        },
        vertexShader: cloudVertexShader,
        fragmentShader: cloudFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [shadow, mid, litL, litR, scale, amp, slope, thresh, soft, opacity, lit, seed]
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => {
    return () => {
      material.dispose();
      geometry.dispose();
    };
  }, [material, geometry]);

  return (
    <mesh position={[0, top, z]} renderOrder={order}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function CloudSea() {
  return (
    <>
      {/* ชั้นไกลสุด: อยู่หลังดวงจันทร์ สีฟ้าอ่อน */}
      <CloudLayer
        z={-2.5}
        top={0.45}
        scale={2.0}
        seed={3.1}
        shadow="#3a40b4"
        mid="#6a78e6"
        litL="#a9c0ff"
        litR="#ff8ae6"
        opacity={0.85}
        lit={0.8}
        order={1}
      />

      {/* ชั้นกลาง: บังขอบล่างดวงจันทร์ */}
      <CloudLayer
        z={1.8}
        top={-0.21}
        scale={2.3}
        seed={11.7}
        shadow="#2a2fa0"
        mid="#4d56d4"
        litL="#9bb2ff"
        litR="#ff6fe0"
        opacity={0.95}
        lit={1.0}
        order={2}
      />

      {/* ชั้นหน้า: ก้อนใหญ่ สีเข้มขึ้น */}
      <CloudLayer
        z={3.2}
        top={-0.77}
        scale={2.5}
        seed={5.3}
        shadow="#1c2174"
        mid="#3a3fb8"
        litL="#7f95f5"
        litR="#ff4fd0"
        opacity={1}
        lit={1.1}
        order={3}
      />

      {/* ชั้นหน้าสุด: เข้มสุด ใหญ่สุด */}
      <CloudLayer
        z={4.6}
        top={-1.26}
        scale={2.7}
        seed={19.9}
        shadow="#0f1250"
        mid="#262a8c"
        litL="#6a7be0"
        litR="#f03cc8"
        opacity={1}
        lit={1.0}
        order={4}
      />
    </>
  );
}

// ======================================
// STARS (เบาบางเหมือนในภาพ)
// ======================================

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const rand = mulberry32(7);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 50;
      positions[i * 3 + 1] = (rand() - 0.5) * 26 + 1;
      positions[i * 3 + 2] = -5 - rand() * 14;
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
    <points ref={starsRef} geometry={geometry} renderOrder={-5}>
      <pointsMaterial
        color="#e0e6ff"
        size={0.034}
        transparent
        opacity={0.9}
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
      <color attach="background" args={["#000000"]} />

      <Sky />

      <group ref={sceneRef}>
        <ambientLight intensity={0.35} color="#8a98ff" />

        {/* แสงหลักจากด้านหน้า-ซ้ายบน ให้เห็นเต็มดวงเหมือนพระจันทร์เต็มดวง */}
        <directionalLight
          position={[-1.5, 2.5, 7]}
          intensity={1.5}
          color="#e4dcff"
        />

        {/* แสงชมพูจากด้านขวา ให้ขอบขวาของดวงจันทร์อมชมพู */}
        <directionalLight
          position={[6, 0, 2]}
          intensity={0.8}
          color="#ff6ae0"
        />

        <Stars />
        <Moon />
        <CloudSea />
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
        flat
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