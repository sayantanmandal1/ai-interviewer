import React, { useEffect, useRef } from "react";
import NET from "vanta/dist/vanta.net.min";

export default function VantaBackground() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = NET({
        el: vantaRef.current,
        color: 0x4f46e5,
        backgroundColor: 0xffffff,
        points: 15,
        maxDistance: 20,
        spacing: 15,
      });
    }
    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    />
  );
}
