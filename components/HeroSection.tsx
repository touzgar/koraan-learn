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
    }, 3000);
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
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-emerald-950 flex items-center justify-center">
      {/* Background Geometric Pattern - Responsive */}
      <div 
        className="absolute inset-0 z-0 opacity-10 sm:opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(20, 184, 166, 0.3) 2px, transparent 0)',
          backgroundSize: '20px 20px sm:30px sm:30px'
        }}
      />

      {/* Immersive Auto-Slider - Responsive */}
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
            className="w-full h-full object-cover object-center brightness-[0.75] sm:brightness-[0.85] contrast-105"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Gradient Overlays - Responsive */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-emerald-950/90 via-transparent to-emerald-900/50 sm:from-emerald-950/80 sm:to-emerald-900/40 pointer-events-none" />
      
      {/* Premium Spotlights - Responsive */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[50%] h-[60%] sm:h-[50%] bg-amber-500/15 sm:bg-amber-500/20 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-10 mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[50%] h-[60%] sm:h-[50%] bg-teal-400/15 sm:bg-teal-400/20 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-10 mix-blend-screen" />

      {/* Floating Magic Particles - Hidden on mobile for performance */}
      <div className="hidden sm:block absolute inset-0 z-20 pointer-events-none overflow-hidden">
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

      {/* Content Overlay - Responsive */}
      <div className="relative z-30 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Apprenez le Coran
            <br />
            <span className="text-amber-400">avec Excellence</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Des cours en ligne de qualité avec des enseignants qualifiés pour tous les niveaux
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <motion.a
              href="#courses"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-lg text-sm sm:text-base"
            >
              Découvrir les cours
            </motion.a>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-colors border border-white/30 text-sm sm:text-base"
            >
              En savoir plus
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Minimalist Indicators - Responsive */}
      <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 sm:gap-3 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-1.5 sm:h-2 rounded-full overflow-hidden transition-all duration-700 ease-in-out cursor-pointer ${
              index === currentIndex 
                ? "w-8 sm:w-10 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" 
                : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70 hover:w-3 sm:hover:w-4"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
