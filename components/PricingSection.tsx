"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Découverte",
    price: "Gratuit",
    period: "",
    description: "Parfait pour découvrir la plateforme",
    features: [
      "Accès à 3 cours d'introduction",
      "1 session en direct par mois",
      "Bibliothèque limitée",
      "Communauté d'apprentissage",
      "Application mobile",
    ],
    cta: "Commencer gratuitement",
    popular: false,
    color: "bg-gray-50",
    buttonColor: "bg-gray-900 hover:bg-gray-800",
  },
  {
    name: "Étudiant",
    price: "29",
    period: "/mois",
    description: "Le choix idéal pour progresser sereinement",
    features: [
      "Accès illimité à tous les cours",
      "4 sessions en direct par mois",
      "Bibliothèque complète",
      "Suivi de progression avancé",
      "Certificats de réussite",
      "Assistant IA inclus",
      "Support prioritaire",
    ],
    cta: "S'abonner maintenant",
    popular: true,
    color: "bg-emerald-50",
    buttonColor: "bg-emerald-700 hover:bg-emerald-800",
  },
  {
    name: "Famille",
    price: "49",
    period: "/mois",
    description: "Pour toute la famille, jusqu'à 5 membres",
    features: [
      "Tout du plan Étudiant",
      "Jusqu'à 5 profils famille",
      "Sessions familiales groupées",
      "Plan d'étude personnalisé",
      "Rapports hebdomadaires parents",
      "Accès à vie aux ressources",
      "Coaching mensuel privé",
    ],
    cta: "Choisir le plan Famille",
    popular: false,
    color: "bg-gold-50",
    buttonColor: "bg-gold-600 hover:bg-gold-700",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
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
            Tarifs
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-4">
            Choisissez votre <span className="text-gradient">parcours</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des tarifs transparents et adaptés à vos besoins. 
            Commencez gratuitement et évoluez à votre rythme.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className={`relative ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 text-white rounded-full text-xs font-bold shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    Le plus populaire
                  </div>
                </div>
              )}

              <div className={`relative h-full rounded-3xl p-8 ${plan.color} border-2 ${plan.popular ? "border-emerald-300 shadow-2xl shadow-emerald-900/10" : "border-gray-100 shadow-lg"} transition-all duration-300`}>
                {/* Plan name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-lg text-gray-500">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? "bg-emerald-200" : "bg-gray-200"}`}>
                        <Check className={`w-3 h-3 ${plan.popular ? "text-emerald-700" : "text-gray-600"}`} />
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 rounded-full font-semibold text-white transition-colors shadow-lg ${plan.buttonColor}`}
                >
                  {plan.cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Annulation possible à tout moment. Aucun engagement requis.
        </motion.p>
      </div>
    </section>
  );
}
