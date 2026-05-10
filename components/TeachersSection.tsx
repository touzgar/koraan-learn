"use client";

import { motion } from "framer-motion";
import { Star, Award, BookOpen, Users } from "lucide-react";

const teachers = [
  {
    id: 1,
    name: "Cheikh Ahmad Al-Farsi",
    role: "Expert en Tajwid",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    rating: 4.9,
    students: 1250,
    courses: 12,
    badges: ["Ijaza", "Docteur"],
    bio: "Plus de 15 ans d'expérience dans l'enseignement du Tajwid et de la récitation coranique.",
  },
  {
    id: 2,
    name: "Ustadha Fatima Zahra",
    role: "Spécialiste Hifz",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    rating: 5.0,
    students: 980,
    courses: 8,
    badges: ["Hafiza", "Master"],
    bio: "Hafiza du Coran avec une approche pédagogique innovante pour la mémorisation.",
  },
  {
    id: 3,
    name: "Dr. Youssef Benali",
    role: "Professeur de Tafsir",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    rating: 4.8,
    students: 1560,
    courses: 15,
    badges: ["PhD", "Chercheur"],
    bio: "Docteur en sciences coraniques de l'Université Al-Azhar, auteur de plusieurs ouvrages.",
  },
  {
    id: 4,
    name: "Ustadha Amina Khadir",
    role: "Enseignante Arabe",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    rating: 4.9,
    students: 2100,
    courses: 10,
    badges: ["Native", "Certifiée"],
    bio: "Arabisante native avec une expertise dans l'enseignement de l'arabe coranique aux francophones.",
  },
];

export default function TeachersSection() {
  return (
    <section id="teachers" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

      <div className="max-w-7xl mx-auto section-padding">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            Nos Enseignants
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-4">
            Apprenez avec les <span className="text-gradient">meilleurs</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nos enseignants sont soigneusement sélectionnés pour leur expertise, 
            leur pédagogie et leur engagement envers l'enseignement du Coran.
          </p>
        </motion.div>

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {teacher.badges.map((badge) => (
                      <span key={badge} className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-emerald-800">
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gold-400/90 backdrop-blur-sm rounded-lg">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span className="text-xs font-bold text-white">{teacher.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{teacher.name}</h3>
                  <p className="text-sm text-emerald-600 font-medium mb-3">{teacher.role}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{teacher.bio}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{teacher.students}+</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{teacher.courses} cours</span>
                    </div>
                  </div>
                </div>

                {/* Hover action */}
                <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/5 transition-colors pointer-events-none rounded-3xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
