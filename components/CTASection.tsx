"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950" />

      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-20 h-20 border border-emerald-400/20 rounded-full"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-32 h-32 border border-emerald-400/10 rounded-full"
      />

      <div className="max-w-4xl mx-auto section-padding relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-800/50 border border-emerald-400/20 mb-8"
          >
            <Sparkles className="w-8 h-8 text-gold-400" />
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Commencez votre voyage
            <br />
            <span className="text-gold-400">avec le Coran</span>
          </h2>

          <p className="text-lg text-emerald-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez plus de 10 000 étudiants qui ont déjà transformé leur relation 
            avec le Coran. Votre première leçon est gratuite.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-emerald-950 rounded-full font-bold text-lg transition-colors shadow-lg shadow-gold-500/25"
            >
              <BookOpen className="w-5 h-5" />
              Essai gratuit
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-emerald-400/50 text-emerald-100 hover:bg-emerald-800/50 rounded-full font-semibold transition-colors"
            >
              Voir la démo
            </motion.a>
          </div>

          <p className="text-sm text-emerald-400/60 mt-6">
            Aucune carte de crédit requise. Annulation à tout moment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
