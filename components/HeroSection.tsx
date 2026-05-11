"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/kor2an.png",
  "/picture1.png",
  "/picture2.png",
  "/picture3.png"
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  // Auto-play interval handling for the visual slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Transitions every 3 seconds for a smooth professional rhythm
    return () => clearInterval(timer);
  }, []);

  // Premium floating particles computation - only on client side
  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-emerald-950 flex items-center justify-center">
      {/* Background Geometric Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(20, 184, 166, 0.3) 2px, transparent 0)',
          backgroundSize: '30px 30px'
        }}
      />

      {/* Immersive Auto-Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={images[currentIndex]}
            alt="Islamic Premium Visual"
            className="w-full h-full object-cover object-center brightness-[0.85] contrast-105"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Gradient Overlays (Lightened for better visibility) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-emerald-950/80 via-transparent to-emerald-900/40 pointer-events-none" />
      
      {/* Premium Spotlights (Gold & Emerald) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/20 rounded-full blur-[130px] pointer-events-none z-10 mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400/20 rounded-full blur-[130px] pointer-events-none z-10 mix-blend-screen" />

      {/* Floating Magic Particles */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-amber-200 rounded-full shadow-[0_0_12px_3px_rgba(251,191,36,0.6)]"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -180, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 0.9, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Minimalist Indicators (Without Timer Loading Bar) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-2 rounded-full overflow-hidden transition-all duration-700 ease-in-out cursor-pointer ${
              index === currentIndex ? "w-10 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "w-2 bg-white/40 hover:bg-white/70 hover:w-4"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
