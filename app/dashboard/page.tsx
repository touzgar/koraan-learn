import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Redirect based on role
  if (user.role === 'ADMIN') {
    redirect('/admin');
  } else if (user.role === 'INSTRUCTOR') {
    redirect('/instructor');
  }

  // Student dashboard (to be implemented later)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Bienvenue, {user.firstName}!
        </h1>
        <p className="text-slate-600">
          Tableau de bord étudiant (à venir)
        </p>
      </div>
    </div>
  );
}
