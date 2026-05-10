"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Users, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

const courses = [
  {
    id: 1,
    title: "Tajwid Fondamental",
    description: "Maîtrisez les règles de prononciation correcte du Coran avec des exercices pratiques.",
    level: "Débutant",
    duration: "8 semaines",
    students: 2340,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=250&fit=crop",
    price: "49€",
    tags: ["Tajwid", "Récitation"],
  },
  {
    id: 2,
    title: "Mémorisation du Juz' Amma",
    description: "Apprenez à mémoriser les 37 sourates courtes avec des techniques de mémorisation éprouvées.",
    level: "Intermédiaire",
    duration: "12 semaines",
    students: 1856,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=400&h=250&fit=crop",
    price: "69€",
    tags: ["Hifz", "Mémorisation"],
  },
  {
    id: 3,
    title: "Tafsir des Sourates Courtes",
    description: "Comprenez la signification profonde des sourates courtes avec des explications détaillées.",
    level: "Avancé",
    duration: "16 semaines",
    students: 1234,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1575106568363-8a6c7c4b6e0c?w=400&h=250&fit=crop",
    price: "89€",
    tags: ["Tafsir", "Compréhension"],
  },
  {
    id: 4,
    title: "Arabe Coranique pour Débutants",
    description: "Apprenez les bases de la grammaire arabe pour comprendre le Coran dans sa langue originale.",
    level: "Débutant",
    duration: "10 semaines",
    students: 3102,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=250&fit=crop",
    price: "59€",
    tags: ["Arabe", "Grammaire"],
  },
  {
    id: 5,
    title: "Récitation avec Ijaza",
    description: "Perfectionnez votre récitation et obtenez une chaîne de transmission authentique.",
    level: "Avancé",
    duration: "24 semaines",
    students: 567,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=250&fit=crop",
    price: "149€",
    tags: ["Ijaza", "Récitation"],
  },
  {
    id: 6,
    title: "Cours pour Enfants",
    description: "Une approche ludique et adaptée pour initier les enfants à l'apprentissage du Coran.",
    level: "Tous niveaux",
    duration: "Flexible",
    students: 4520,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
    price: "39€",
    tags: ["Enfants", "Éducatif"],
  },
];

const levelColors: Record<string, string> = {
  "Débutant": "bg-emerald-100 text-emerald-700",
  "Intermédiaire": "bg-gold-100 text-gold-700",
  "Avancé": "bg-rose-100 text-rose-700",
  "Tous niveaux": "bg-blue-100 text-blue-700",
};

export default function CoursesSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto section-padding relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            Nos Cours
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-4">
            Explorez nos <span className="text-gradient">programmes</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des parcours structurés pour tous les niveaux, conçus par des enseignants qualifiés 
            pour vous accompagner dans votre voyage avec le Coran.
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredId(course.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative"
            >
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Level Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[course.level]}`}>
                      {course.level}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-emerald-800">
                      {course.price}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {course.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs text-white font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}+</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                      <span className="font-semibold text-gray-700">{course.rating}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-emerald-700 font-semibold text-sm group/btn"
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </motion.button>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  animate={{
                    opacity: hoveredId === course.id ? 1 : 0,
                  }}
                  className="absolute inset-0 rounded-3xl ring-2 ring-emerald-400/50 pointer-events-none"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700 text-white rounded-full font-semibold hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-700/20"
          >
            Voir tous les cours
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
