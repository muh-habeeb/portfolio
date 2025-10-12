"use client";

import { useEffect, useState } from "react";

/**
 * CustomCursor Component
 * 
 * Creates a custom circular cursor that replaces the default browser cursor.
 * Features:
 * - Circular design with outer ring and inner dot
 * - Scales up when hovering over interactive elements (buttons, links)
 * - Mix-blend-mode for visibility on all backgrounds
 * - Smooth animations and transitions
 */
export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Update cursor position on mouse movement
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Detect when hovering over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Outer cursor ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-6 h-6 rounded-full border-2 border-white transition-all duration-150 ${
            isHovering ? 'scale-150 bg-white/20' : ''
          }`}
        />
      </div>
      
      {/* Inner cursor dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-1 h-1 rounded-full bg-white transition-all duration-75 ${
            isHovering ? 'scale-0' : ''
          }`}
        />
      </div>
    </>
  );
}