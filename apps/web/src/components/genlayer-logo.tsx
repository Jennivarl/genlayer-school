"use client";

import { useEffect, useRef } from "react";

interface GenLayerLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export function GenLayerLogo({ size = 32, color = "#7c3aed", className }: GenLayerLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;

      // Parse the target color
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      for (let i = 0; i < data.length; i += 4) {
        const brightness = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        if (brightness > 200) {
          // White / near-white background → fully transparent
          data[i + 3] = 0;
        } else {
          // Logo shape → target color, fully opaque
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };
    img.src = "/genlayer.jpg";
  }, [size, color]);

  return <canvas ref={canvasRef} width={size} height={size} className={className} />;
}
