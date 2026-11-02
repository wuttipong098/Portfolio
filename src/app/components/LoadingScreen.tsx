"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import loadingImg from "@/public/loading.jpg"; // ปรับ path ตามตำแหน่งจริงของคุณ

interface LoadingScreenProps {
  onFinish?: () => void;
}

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // สุ่มเพิ่มเปอร์เซ็นต์โหลด 0% -> 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 300); // เริ่ม fade out
          setTimeout(() => {
            setIsHidden(true);
            if (onFinish) onFinish();
          }, 800); // หายไปสมบูรณ์
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onFinish]);

  if (isHidden) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#ffffff", // พื้นหลังสีขาว
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease-in-out",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          maxWidth: "90%",
        }}
      >
        {/* รูปภาพโลโก้ Loading */}
        <Image
          src={loadingImg}
          alt="WUTTIPONG KRACHAN Loading"
          width={360}
          height={200}
          priority
          style={{
            width: "360px",
            maxWidth: "85vw",
            height: "auto",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(141, 0, 173, 0.15)",
            objectFit: "contain",
          }}
        />

        {/* หลอด Progress Bar พร้อมตัวเลขเปอร์เซ็นต์ */}
        <div
          style={{
            width: "300px",
            maxWidth: "85vw",
            backgroundColor: "#1E1E2E",
            borderRadius: "8px",
            padding: "16px",
            color: "#FFFFFF",
            fontFamily: "monospace",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: "13px",
              color: "#A7F3D0",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            <span>{progress}%</span>
          </div>

          {/* Progress Bar Container */}
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#313244",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* Progress Fill */}
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #F59E0B, #EAB308)",
                borderRadius: "4px",
                transition: "width 0.15s ease-out",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}