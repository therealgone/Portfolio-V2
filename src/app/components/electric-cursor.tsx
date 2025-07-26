"use client";

import React, { useRef, useEffect, useState } from "react";

const NEON_CYAN = "#67e8f9"; // bright neon cyan
const NEON_CORE = "#e0f7fa"; // white-blue core for extra brightness
const MIN_TRAIL_POINTS = 4; // Shorter minimum trail

interface Props {
  color?: string;
  trailLength?: number; // ms
  thickness?: number; // px
  smoothness?: number; // px, distance between points
}

const POINTER_SIZE = 6; // px
const POINTER_BORDER = 3; // px

const TronCursor: React.FC<Props> = ({
  color = NEON_CYAN,
  trailLength = 100, // ms, shorter trail
  thickness = 5, // px
  smoothness = 5, // px
}) => {
  const points = useRef<{ x: number; y: number; time: number }[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const corePathRef = useRef<SVGPathElement | null>(null);
  const animFrame = useRef<number | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const gradientId = useRef(`neon-gradient-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const svgNS = "http://www.w3.org/2000/svg";
    // Create SVG
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.position = "fixed";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100vw";
    svg.style.height = "100vh";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "9999";
    document.body.appendChild(svg);
    svgRef.current = svg;

    // Add SVG filter for strong neon glow
    const defs = document.createElementNS(svgNS, "defs");
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", "neon-glow");
    filter.setAttribute("x", "-100%");
    filter.setAttribute("y", "-100%");
    filter.setAttribute("width", "300%");
    filter.setAttribute("height", "300%");
    // Even stronger blur for neon
    const feGaussian = document.createElementNS(svgNS, "feGaussianBlur");
    feGaussian.setAttribute("stdDeviation", "18");
    feGaussian.setAttribute("result", "blur");
    filter.appendChild(feGaussian);
    const feMerge = document.createElementNS(svgNS, "feMerge");
    const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
    feMergeNode1.setAttribute("in", "blur");
    const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);
    defs.appendChild(filter);

    // Add linear gradient for fading effect
    const grad = document.createElementNS(svgNS, "linearGradient");
    grad.setAttribute("id", gradientId.current);
    grad.setAttribute("x1", "0");
    grad.setAttribute("y1", "0");
    grad.setAttribute("x2", "1");
    grad.setAttribute("y2", "0");
    grad.innerHTML = `
      <stop offset="0%" stop-color="${color}" stop-opacity="1" />
      <stop offset="80%" stop-color="${color}" stop-opacity="0.7" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0" />
    `;
    defs.appendChild(grad);
    svg.appendChild(defs);

    // Neon outer path
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("stroke", `url(#${gradientId.current})`);
    path.setAttribute("stroke-width", `${thickness}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("filter", "url(#neon-glow)");
    path.setAttribute("opacity", "1"); // Always fully visible
    svg.appendChild(path);
    pathRef.current = path;

    // Neon core (white/blue, no filter, thinner)
    const corePath = document.createElementNS(svgNS, "path");
    corePath.setAttribute("stroke", NEON_CORE);
    corePath.setAttribute("stroke-width", `${Math.max(1, thickness * 0.45)}`);
    corePath.setAttribute("fill", "none");
    corePath.setAttribute("stroke-linecap", "round");
    corePath.setAttribute("stroke-linejoin", "round");
    corePath.setAttribute("opacity", "1"); // Always fully visible
    svg.appendChild(corePath);
    corePathRef.current = corePath;

    // Resize handler
    const resizeSvg = () => {
      svg.setAttribute("width", window.innerWidth.toString());
      svg.setAttribute("height", window.innerHeight.toString());
    };
    resizeSvg();
    window.addEventListener("resize", resizeSvg);

    // Mouse move handler
    let lastPoint: { x: number; y: number } | null = null;
    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      setPointer({ x, y });
      if (!lastPoint || Math.hypot(x - lastPoint.x, y - lastPoint.y) > smoothness) {
        points.current.push({ x, y, time: now });
        lastPoint = { x, y };
      } else {
        // Replace last point for smoother path
        points.current[points.current.length - 1] = { x, y, time: now };
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation loop to update path and fade
    const animate = () => {
      const now = performance.now();
      // Remove old points
      points.current = points.current.filter(p => now - p.time < trailLength);
      // Always show at least MIN_TRAIL_POINTS by repeating the last mouse position
      if (points.current.length > 0 && points.current.length < MIN_TRAIL_POINTS) {
        const last = points.current[points.current.length - 1];
        for (let i = points.current.length; i < MIN_TRAIL_POINTS; ++i) {
          points.current.push({ x: last.x, y: last.y, time: now - (MIN_TRAIL_POINTS - i) * 8 });
        }
      }
      // Build SVG path
      if (points.current.length > 1) {
        let d = `M${points.current[0].x},${points.current[0].y}`;
        for (let i = 1; i < points.current.length; ++i) {
          d += ` L${points.current[i].x},${points.current[i].y}`;
        }
        path.setAttribute("d", d);
        corePath.setAttribute("d", d);
        path.setAttribute("opacity", `1`);
        corePath.setAttribute("opacity", `1`);
      } else {
        path.setAttribute("d", "");
        corePath.setAttribute("d", "");
      }
      animFrame.current = requestAnimationFrame(animate);
    };
    animFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resizeSvg);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
      svg.remove();
    };
  }, [color, trailLength, thickness, smoothness]);

  // Render the neon pointer dot at the head of the trail
  return (
    <>
      <div className="relative overflow-hidden">
        {pointer && (
          <div
            style={{
              position: 'fixed',
              left: pointer.x - POINTER_SIZE / 2,
              top: pointer.y - POINTER_SIZE / 2,
              width: POINTER_SIZE,
              height: POINTER_SIZE,
              pointerEvents: 'none',
              zIndex: 10000,
            }}
          >
            <div
              style={{
                width: POINTER_SIZE,
                height: POINTER_SIZE,
                borderRadius: '50%',
                background: '#fff',
                border: `${POINTER_BORDER}px solid ${NEON_CYAN}`,
                boxShadow: `0 0 16px 4px ${NEON_CYAN}, 0 0 2px 1px #fff`,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TronCursor;
