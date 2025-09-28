"use client";

import React, { useEffect, useRef, useState } from "react";

const POINTER_SIZE = 6;

const ElectricCursor: React.FC = () => {
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPointer({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      {pointer && (
          <div
            style={{
              position: "fixed",
              left: pointer.x - POINTER_SIZE / 2,
              top: pointer.y - POINTER_SIZE / 2,
              width: POINTER_SIZE,
              height: POINTER_SIZE,
              pointerEvents: "none",
              zIndex: 10000,
              transition: "transform 0.1s ease-out",
              transform: "translate3d(0, 0, 0)",
            }}
          >
            <div
              style={{
                width: POINTER_SIZE,
                height: POINTER_SIZE,
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 0 12px 4px rgba(255,255,255,0.85)",
                willChange: "transform",
              }}
            />
          </div>
      )}
    </>
  );
};

export default ElectricCursor;
