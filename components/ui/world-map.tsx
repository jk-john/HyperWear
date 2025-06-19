"use client";

import DottedMap from "dotted-map";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRef } from "react";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

const defaultDots = [
  // Americas
  {
    start: { lat: 34.0522, lng: -118.2437 },
    end: { lat: 40.7128, lng: -74.006 },
  }, // LA to NY
  {
    start: { lat: 49.2827, lng: -123.1207 },
    end: { lat: 45.4215, lng: -75.6972 },
  }, // Vancouver to Ottawa
  {
    start: { lat: 19.4326, lng: -99.1332 },
    end: { lat: -34.6037, lng: -58.3816 },
  }, // Mexico City to Buenos Aires
  {
    start: { lat: -23.5505, lng: -46.6333 },
    end: { lat: 4.711, lng: -74.0721 },
  }, // São Paulo to Bogotá

  // Europe
  { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 48.8566, lng: 2.3522 } }, // London to Paris
  { start: { lat: 52.52, lng: 13.405 }, end: { lat: 41.9028, lng: 12.4964 } }, // Berlin to Rome
  {
    start: { lat: 55.7558, lng: 37.6173 },
    end: { lat: 40.4168, lng: -3.7038 },
  }, // Moscow to Madrid

  // Asia
  {
    start: { lat: 35.6895, lng: 139.6917 },
    end: { lat: 39.9042, lng: 116.4074 },
  }, // Tokyo to Beijing
  { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 1.3521, lng: 103.8198 } }, // New Delhi to Singapore
  {
    start: { lat: 31.2304, lng: 121.4737 },
    end: { lat: 22.3193, lng: 114.1694 },
  }, // Shanghai to Hong Kong

  // Africa & Middle East
  {
    start: { lat: 30.0444, lng: 31.2357 },
    end: { lat: -26.2041, lng: 28.0473 },
  }, // Cairo to Johannesburg
  { start: { lat: 6.5244, lng: 3.3792 }, end: { lat: 9.0765, lng: 7.3986 } }, // Lagos to Abuja
  {
    start: { lat: 24.4539, lng: 54.3773 },
    end: { lat: 25.276987, lng: 55.296249 },
  }, // Abu Dhabi to Dubai

  // Oceania
  {
    start: { lat: -33.8688, lng: 151.2093 },
    end: { lat: -37.8136, lng: 144.9631 },
  }, // Sydney to Melbourne
  {
    start: { lat: -36.8485, lng: 174.7633 },
    end: { lat: -41.2865, lng: 174.7762 },
  }, // Auckland to Wellington

  // Transcontinental
  {
    start: { lat: 40.7128, lng: -74.006 },
    end: { lat: 51.5074, lng: -0.1278 },
  }, // New York to London
  {
    start: { lat: 34.0522, lng: -118.2437 },
    end: { lat: 35.6895, lng: 139.6917 },
  }, // Los Angeles to Tokyo
  {
    start: { lat: -33.8688, lng: 151.2093 },
    end: { lat: 37.7749, lng: -122.4194 },
  }, // Sydney to San Francisco
];

export function WorldMap({
  dots = defaultDots,
  lineColor = "#0ea5e9",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  const { theme } = useTheme();

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    backgroundColor: theme === "dark" ? "black" : "white",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="relative aspect-[2/1] w-full rounded-lg bg-white font-sans dark:bg-black">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              ></motion.path>
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
