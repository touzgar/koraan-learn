"use client";

import { motion } from "framer-motion";
import { Video, MessageCircle, Calendar, Trophy, Headphones, BookMarked, Sparkles, Shield } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Cours en direct HD",
    description: "Sessions interactives en haute définition avec partage d'écran et tableau blanc numérique.",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: MessageCircle,
    title: "Chat en temps réel",
    description: "Posez vos questions instantanément et recevez des réponses personnalisées de votre enseignant.",
    color: "from-gold-500 to-gold-600",
    bgColor: "bg-gold-50",
  },
  {
    icon: Calendar,
    title: "Planning flexible",
    description: "Réservez vos cours selon votre emploi du temps avec un système de calendrier intuitif.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Trophy,
    title: "Système de récompenses",
    description: "Gagnez des badges et des certificats à chaque étape franchie de votre parcours.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Headphones,
    title: "Audio coranique HD",
    description: "Écoutez des récitations de qualité studio par des qaris renommés du monde entier.",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    icon: BookMarked,
    title: "Bibliothèque de ressources",
    description: "Accédez à des centaines de livres, PDF et supports pédagogiques exclusifs.",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: Sparkles,
    title: "IA Assistant",
    description: "Un assistant intelligent pour vous aider à réviser et pratiquer à tout moment.",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Shield,
    title: "Contenu vérifié",
    description: "Tous nos enseignants sont certifiés et nos contenus validés par des savants.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
  },
];

export default function FeaturesSection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-cream-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto section-padding relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-4">
            Pourquoi nous choisir
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-4">
            Une expérience <span className="text-gradient-gold">unique</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Notre plateforme combine technologie de pointe et savoir-faire pédagogique 
            pour offrir la meilleure expérience d'apprentissage du Coran.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: 'inherit' }} />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-10`} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-gold-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
