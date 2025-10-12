/**
 * TiltCard Component
 * 
 * Creates a 3D tilt effect for cards based on mouse position.
 * Features:
 * - Subtle 3D rotation effect following mouse movement
 * - Slight scaling on hover for depth perception
 * - Smooth transitions and animations
 * - Ignores tilt when hovering over interactive elements (buttons/links)
 * - Resets to neutral position when mouse leaves
 */

"use client";

import { useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Handle mouse movement to create tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    // Don't apply tilt if hovering over buttons or links
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    // Calculate mouse position relative to card center
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (reduced for subtle effect)
    const rotateX = (y - centerY) / 15; // Subtle vertical tilt
    const rotateY = (centerX - x) / 15; // Subtle horizontal tilt

    // Apply 3D transform with perspective
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  // Reset transform when mouse leaves
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-200 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}