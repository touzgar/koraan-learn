import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "KoraanLearn - Apprenez le Coran en ligne",
  description:
    "Plateforme e-learning pour apprendre, réciter, mémoriser et comprendre le Coran avec des enseignants qualifiés.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0d9488",
          colorBackground: "#ffffff",
          colorText: "#1e293b",
          colorInputBackground: "#ffffff",
          colorInputText: "#1e293b",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-white font-semibold",
          card: "shadow-2xl",
          headerTitle: "text-slate-900 font-bold",
          headerSubtitle: "text-slate-600",
          socialButtonsBlockButton: "border-2 border-slate-200 hover:border-teal-500",
          formFieldInput: "border-slate-200 focus:border-teal-500 focus:ring-teal-500",
          footerActionLink: "text-teal-600 hover:text-teal-700 font-semibold",
        },
      }}
    >
      <html lang="fr" className="scroll-smooth">
        <body className="overflow-x-hidden antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
