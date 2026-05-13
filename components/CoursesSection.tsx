"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Users, Star, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Course {
  id: string
  title: string
  description: string
  level: string
  duration: string
  students: number
  rating: number
  image: string
  price: string
  tags: string[]
  instructor: string
}

const levelColors: Record<string, string> = {
  "Débutant": "bg-emerald-100 text-emerald-700",
  "Intermédiaire": "bg-gold-100 text-gold-700",
  "Avancé": "bg-rose-100 text-rose-700",
  "Tous niveaux": "bg-blue-100 text-blue-700",
  "BEGINNER": "bg-emerald-100 text-emerald-700",
  "INTERMEDIATE": "bg-gold-100 text-gold-700",
  "ADVANCED": "bg-rose-100 text-rose-700",
};

export default function CoursesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/public/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section id="courses" className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Nos Cours
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-950 mb-3 sm:mb-4 px-4">
            Explorez nos <span className="text-gradient">programmes</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Des parcours structurés pour tous les niveaux, conçus par des enseignants qualifiés 
            pour vous accompagner dans votre voyage avec le Coran.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {/* Courses Grid - Responsive */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200">
                  {/* Image - Responsive Height */}
                  <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Level Badge - Responsive */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${levelColors[course.level] || levelColors["Tous niveaux"]}`}>
                        {course.level}
                      </span>
                    </div>

                    {/* Price - Responsive */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="px-2 sm:px-4 py-1 sm:py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-bold text-emerald-800">
                        {course.price}
                      </span>
                    </div>

                    {/* Tags - Responsive */}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex gap-1 sm:gap-2 flex-wrap">
                      {course.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-1.5 sm:px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-[10px] sm:text-xs text-white font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content - Responsive Padding */}
                  <div className="p-4 sm:p-5 lg:p-6">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Meta - Responsive */}
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{course.students}+</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-gold-400 text-gold-400" />
                        <span className="font-semibold text-gray-700">{course.rating}</span>
                      </div>
                    </div>

                    {/* CTA - Responsive */}
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-emerald-700 font-semibold text-xs sm:text-sm group/btn"
                    >
                      En savoir plus
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/btn:translate-x-1" />
                    </motion.button>
                  </div>

                  {/* Hover glow effect */}
                  <motion.div
                    animate={{
                      opacity: hoveredId === course.id ? 1 : 0,
                    }}
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-2 ring-emerald-400/50 pointer-events-none"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Aucun cours disponible pour le moment</p>
          </div>
        )}

        {/* View All Button - Responsive */}
        {!loading && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-700 text-white rounded-full font-semibold hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-700/20 text-sm sm:text-base"
            >
              Voir tous les cours
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
