import type { Metadata } from "next";
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
    <html lang="fr" className="scroll-smooth">
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}