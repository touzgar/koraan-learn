import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, BarChart3, Award, Clock, TrendingUp, Star } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const stats = [
    { icon: BookOpen, label: "Cours en cours", value: "3", color: "bg-teal-100 text-teal-700" },
    { icon: BarChart3, label: "Progression", value: "67%", color: "bg-blue-100 text-blue-700" },
    { icon: Award, label: "Certificats", value: "2", color: "bg-amber-100 text-amber-700" },
    { icon: Clock, label: "Heures d'étude", value: "24h", color: "bg-purple-100 text-purple-700" },
  ];

  const recentCourses = [
    { title: "Sourate Al-Mulk", progress: 75, lessons: "20/27" },
    { title: "Tajwid Avancé", progress: 45, lessons: "12/30" },
    { title: "Mémorisation Juz' 30", progress: 90, lessons: "27/30" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Bienvenue, {user.firstName || "Étudiant"}! 👋
              </h1>
              <p className="text-slate-600">
                Continuez votre voyage d'apprentissage du Coran
              </p>
            </div>
            <a
              href="/"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Mes Cours</h2>
                <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
                  Voir tout →
                </button>
              </div>
              <div className="space-y-4">
                {recentCourses.map((course, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl border-2 border-slate-100 hover:border-teal-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                      <span className="text-sm font-semibold text-teal-600">{course.lessons}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-600 mt-2 font-medium">{course.progress}% complété</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-8 shadow-lg text-white">
              <TrendingUp className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Continuez votre progression!</h3>
              <p className="text-teal-100 mb-6">
                Vous êtes à 67% de votre objectif mensuel
              </p>
              <button className="w-full px-6 py-3 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors">
                Reprendre le cours
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900">Prochaine leçon</h3>
              </div>
              <p className="text-slate-600 mb-2">Aujourd'hui - 18:00</p>
              <p className="text-sm font-semibold text-slate-900 mb-1">Récitation & Tajwid</p>
              <p className="text-sm text-teal-600">avec Ustadh Ahmed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
