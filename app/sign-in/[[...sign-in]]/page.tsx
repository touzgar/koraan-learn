import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Bienvenue sur <span className="text-teal-600">KoraanLearn</span>
          </h1>
          <p className="text-slate-600">
            Connectez-vous pour continuer votre apprentissage
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl rounded-3xl border border-slate-100",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-slate-600",
              socialButtonsBlockButton: "rounded-xl border-2 hover:bg-slate-50 transition-all",
              formButtonPrimary: "bg-teal-600 hover:bg-teal-700 rounded-xl text-base font-semibold py-3",
              footerActionLink: "text-teal-600 hover:text-teal-700 font-semibold",
              formFieldInput: "rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500",
              dividerLine: "bg-slate-200",
              dividerText: "text-slate-500",
            },
          }}
        />
      </div>
    </div>
  );
}
