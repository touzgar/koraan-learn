"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, type: initialType }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialType);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (activeTab === "login" && signIn) {
        // Use signIn.sso() for OAuth in Clerk v7
        await signIn.sso({
          strategy: "oauth_google",
          redirectUrl: window.location.origin + "/dashboard",
          redirectCallbackUrl: window.location.origin + "/sso-callback",
        });
      } else if (activeTab === "signup" && signUp) {
        // Use signUp.sso() for OAuth in Clerk v7
        await signUp.sso({
          strategy: "oauth_google",
          redirectUrl: window.location.origin + "/dashboard",
          redirectCallbackUrl: window.location.origin + "/sso-callback",
        });
      } else {
        setError("Service d'authentification non disponible");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      setError(err.errors?.[0]?.message || err.message || "Erreur de connexion avec Google");
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    
    setLoading(true);
    setError("");

    try {
      // Use signIn.create() with identifier and password
      const result = await signIn.create({
        identifier: email,
        password,
      });

      // Check if sign-in is complete
      if (result.status === "complete") {
        // Session created successfully
        router.push("/dashboard");
        onClose();
      } else {
        // Handle other statuses if needed
        setError("Connexion incomplète. Veuillez réessayer.");
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.errors?.[0]?.message || err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setLoading(true);
    setError("");

    try {
      // Use signUp.create() with email, password, and name
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // Check the status
      if (result.status === "complete") {
        // Account created and session started
        router.push("/dashboard");
        onClose();
      } else if (result.status === "missing_requirements") {
        // Need email verification or other requirements
        setError("Veuillez vérifier votre email pour continuer");
      } else {
        setError("Inscription incomplète. Veuillez réessayer.");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.errors?.[0]?.message || err.message || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              <div className="grid lg:grid-cols-2 min-h-[600px]">
                {/* Left Side - Image */}
                <div className="relative hidden lg:block">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 z-10" />
                  <img
                    src="/kor2an.png"
                    alt="Apprentissage du Coran"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-4xl font-bold text-white mb-4">
                        Apprenez le Coran
                      </h3>
                      <p className="text-lg text-white/90 leading-relaxed">
                        Rejoignez des milliers d'étudiants dans leur voyage spirituel
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Right Side - Custom Forms */}
                <div className="flex flex-col p-8 lg:p-12">
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                      {activeTab === "login" ? "Bon retour !" : "Rejoignez-nous"}
                    </h2>
                    <p className="text-slate-600">
                      {activeTab === "login"
                        ? "Connectez-vous pour continuer"
                        : "Créez votre compte gratuitement"}
                    </p>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-4 mb-8">
                    <button
                      onClick={() => {
                        setActiveTab("login");
                        setError("");
                      }}
                      className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                        activeTab === "login"
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Connexion
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("signup");
                        setError("");
                      }}
                      className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                        activeTab === "signup"
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Inscription
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Forms */}
                  <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {activeTab === "login" ? (
                        <motion.form
                          key="login"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          onSubmit={handleSignIn}
                          className="space-y-5"
                        >
                          {/* Google Sign In Button */}
                          <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full py-3.5 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-semibold text-slate-700 transition-all flex items-center justify-center gap-3 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continuer avec Google
                          </button>

                          {/* Divider */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-4 bg-white text-slate-500 font-medium">Ou avec email</span>
                            </div>
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Email
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="votre@email.com"
                              />
                            </div>
                          </div>

                          {/* Password */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Mot de passe
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                          >
                            {loading ? "Connexion..." : "Se connecter"}
                          </motion.button>

                          {/* Footer */}
                          <p className="text-center text-sm text-slate-600">
                            Pas de compte ?{" "}
                            <button
                              type="button"
                              onClick={() => setActiveTab("signup")}
                              className="text-emerald-600 hover:text-emerald-700 font-semibold"
                            >
                              S'inscrire
                            </button>
                          </p>
                        </motion.form>
                      ) : (
                        <motion.form
                          key="signup"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleSignUp}
                          className="space-y-5"
                        >
                          {/* Google Sign Up Button */}
                          <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full py-3.5 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-semibold text-slate-700 transition-all flex items-center justify-center gap-3 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continuer avec Google
                          </button>

                          {/* Divider */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-4 bg-white text-slate-500 font-medium">Ou avec email</span>
                            </div>
                          </div>

                          {/* First Name & Last Name */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Prénom
                              </label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                  type="text"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  required
                                  disabled={loading}
                                  className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                  placeholder="Prénom"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Nom
                              </label>
                              <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Nom"
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Email
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="votre@email.com"
                              />
                            </div>
                          </div>

                          {/* Password */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Mot de passe
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                          >
                            {loading ? "Inscription..." : "Créer mon compte"}
                          </motion.button>

                          {/* Footer */}
                          <p className="text-center text-sm text-slate-600">
                            Déjà un compte ?{" "}
                            <button
                              type="button"
                              onClick={() => setActiveTab("login")}
                              className="text-emerald-600 hover:text-emerald-700 font-semibold"
                            >
                              Se connecter
                            </button>
                          </p>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
