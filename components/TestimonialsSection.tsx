"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Samira Ben",
    location: "Paris, France",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Une plateforme exceptionnelle ! J'ai commencé sans aucune base et aujourd'hui je récite le Coran avec confiance. Les enseignants sont patients et très pédagogues.",
    course: "Tajwid Fondamental",
  },
  {
    id: 2,
    name: "Mohamed Al-Hassan",
    location: "Bruxelles, Belgique",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Mes enfants adorent leurs cours. L'approche ludique pour les enfants est vraiment bien pensée. Ils progressent vite et avec plaisir.",
    course: "Cours pour Enfants",
  },
  {
    id: 3,
    name: "Aïcha Diallo",
    location: "Lyon, France",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "J'ai obtenu mon Ijaza grâce à KoraanLearn. Le parcours était rigoureux et enrichissant. Je recommande vivement cette plateforme à tous ceux qui veulent approfondir leur récitation.",
    course: "Récitation avec Ijaza",
  },
  {
    id: 4,
    name: "Karim Boudali",
    location: "Genève, Suisse",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "La flexibilité des horaires est un vrai plus. Je peux apprendre le Coran entre deux réunions. Le suivi de progression me motive énormément.",
    course: "Arabe Coranique",
  },
  {
    id: 5,
    name: "Nadia Fassi",
    location: "Casablanca, Maroc",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "J'ai mémorisé le Juz' Amma en 3 mois grâce aux techniques enseignées ici. L'assistant IA pour réviser est une fonctionnalité géniale !",
    course: "Mémorisation Juz' Amma",
  },
  {
    id: 6,
    name: "Omar Chérif",
    location: "Montréal, Canada",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Le Tafsir des sourates courtes a transformé ma compréhension du Coran. Chaque verset prend un sens nouveau. Merci à toute l'équipe !",
    course: "Tafsir Sourates Courtes",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-cream-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-20 left-10 text-emerald-100 opacity-20">
        <Quote className="w-40 h-40" />
      </div>
      <div className="absolute bottom-20 right-10 text-emerald-100 opacity-20 rotate-180">
        <Quote className="w-40 h-40" />
      </div>

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
            Témoignages
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-4">
            Ce qu'ils disent de <span className="text-gradient-gold">nous</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants satisfaits qui ont transformé 
            leur relation avec le Coran grâce à notre plateforme.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                {/* Quote icon */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                  "{testimonial.text}"
                </p>

                {/* Course tag */}
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium mb-4">
                  {testimonial.course}
                </span>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
