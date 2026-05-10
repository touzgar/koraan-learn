"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Menu, X, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import AuthModal from "./AuthModal";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Cours", href: "#courses" },
  { name: "Enseignants", href: "#teachers" },
  { name: "À propos", href: "#about" },
  { name: "Tarifs", href: "#pricing" },
  { 
    name: "Ressources", 
    href: "#",
    dropdown: [
      { name: "Blog", href: "#" },
      { name: "Podcasts", href: "#" },
      { name: "Livres", href: "#" },
    ]
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-emerald-900/5" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-700 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                <div className="absolute inset-0 bg-emerald-600 rounded-xl" />
                <BookOpen className="relative w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-xl font-bold tracking-tight transition-colors",
                  scrolled ? "text-emerald-900" : "text-white"
                )}>
                  KoraanLearn
                </span>
                <span className={cn(
                  "text-[10px] -mt-1 font-medium tracking-wide transition-colors",
                  scrolled ? "text-emerald-600" : "text-emerald-200"
                )}>
                  Apprendre. Comprendre. Vivre le Coran.
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    scrolled
                      ? "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  )}
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      activeDropdown === link.name && "rotate-180"
                    )} />
                  )}
                </a>

                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden"
                    >
                      {link.dropdown.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          {item.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Side - Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <button className={cn(
              "p-2.5 rounded-full transition-all",
              scrolled ? "hover:bg-emerald-50 text-gray-600 hover:text-emerald-700" : "text-white hover:bg-white/20"
            )}>
              <Search className="w-5 h-5" />
            </button>

            {/* Show when user is NOT logged in */}
            {!isSignedIn && (
              <button
                onClick={() => setAuthModal("login")}
                className={cn(
                  "px-6 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
                  scrolled ? "text-emerald-800 hover:text-emerald-900" : "text-white hover:text-emerald-200"
                )}
              >
                Se connecter
              </button>
            )}

            {/* Show when user IS logged in */}
            {isSignedIn && (
              <>
                <Link href="/dashboard">
                  <span
                    className={cn(
                      "inline-block px-6 py-2.5 text-sm font-semibold transition-colors rounded-full cursor-pointer",
                      scrolled 
                        ? "text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50" 
                        : "text-white hover:text-emerald-200 hover:bg-white/20"
                    )}
                  >
                    Dashboard
                  </span>
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-full border-2 border-emerald-500",
                      userButtonPopoverCard: "shadow-2xl rounded-2xl",
                      userButtonPopoverActionButton: "hover:bg-emerald-50",
                    },
                  }}
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "lg:hidden p-2 rounded-xl transition-colors",
              scrolled ? "hover:bg-emerald-50 text-gray-700" : "text-white hover:bg-white/20"
            )}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-emerald-100 overflow-hidden"
          >
            <div className="section-padding py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="pt-4 flex flex-col gap-2">
                {!isSignedIn && (
                  <button
                    onClick={() => setAuthModal("login")}
                    className="w-full px-4 py-3 text-center text-emerald-800 font-semibold hover:bg-emerald-50 rounded-xl transition-colors"
                  >
                    Se connecter
                  </button>
                )}

                {isSignedIn && (
                  <>
                    <Link href="/dashboard" className="w-full">
                      <span className="block w-full px-4 py-3 bg-emerald-700 text-white text-center font-semibold rounded-full cursor-pointer hover:bg-emerald-800 transition-colors">
                        Dashboard
                      </span>
                    </Link>
                    <div className="flex items-center justify-center py-3">
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-12 h-12 rounded-full border-2 border-emerald-500",
                          },
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={!!authModal} 
        onClose={() => setAuthModal(null)} 
        type={authModal || "login"} 
      />
    </motion.nav>
  );
}
