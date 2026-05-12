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
  } else if (user.role === 'STUDENT') {
    redirect('/student');
  }

  // Fallback redirect
  redirect('/sign-in');
}
