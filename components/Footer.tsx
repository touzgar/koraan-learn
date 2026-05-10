"use client";

import { motion } from "framer-motion";
import { BookOpen, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";

const footerLinks = {
  "Apprendre": [
    { name: "Cours de Tajwid", href: "#" },
    { name: "Mémorisation", href: "#" },
    { name: "Tafsir", href: "#" },
    { name: "Arabe Coranique", href: "#" },
    { name: "Cours pour enfants", href: "#" },
  ],
  "Ressources": [
    { name: "Blog", href: "#" },
    { name: "Podcasts", href: "#" },
    { name: "Livres recommandés", href: "#" },
    { name: "Applications", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  "Entreprise": [
    { name: "À propos", href: "#" },
    { name: "Carrières", href: "#" },
    { name: "Enseignants", href: "#" },
    { name: "Partenaires", href: "#" },
    { name: "Presse", href: "#" },
  ],
  "Légal": [
    { name: "Confidentialité", href: "#" },
    { name: "Conditions d'utilisation", href: "#" },
    { name: "Cookies", href: "#" },
    { name: "Mentions légales", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 relative overflow-hidden">
      {/* Top border gradient */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-gold-500 to-emerald-600" />

      <div className="max-w-7xl mx-auto section-padding py-16">
        <div className="grid lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.a 
              href="#" 
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-600 rounded-xl rotate-3" />
                <div className="absolute inset-0 bg-emerald-500 rounded-xl" />
                <BookOpen className="relative w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">
                  KoraanLearn
                </span>
                <span className="text-[10px] -mt-1 text-emerald-400 font-medium tracking-wide">
                  Apprendre. Comprendre. Vivre le Coran.
                </span>
              </div>
            </motion.a>

            <p className="text-sm text-emerald-300/80 leading-relaxed mb-6 max-w-xs">
              La première plateforme e-learning dédiée à l'enseignement du Coran, 
              avec des enseignants qualifiés et des outils innovants.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-emerald-300/80">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>contact@koraanlearn.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-300/80">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-300/80">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-emerald-300/70 hover:text-gold-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-emerald-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-emerald-400/60 flex items-center gap-1">
              Fait avec <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> par KoraanLearn © 2026
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-emerald-900/50 border border-emerald-700/30 flex items-center justify-center text-emerald-400 hover:text-gold-400 hover:border-gold-400/30 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
