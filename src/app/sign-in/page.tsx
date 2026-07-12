import SignInForm from "@/components/(auth)/signinForm";

export default function Page() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      <div className="relative w-full max-w-md space-y-6 z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500">
            Enter your credentials or use a provider to access your account
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm backdrop-blur-sm">
          <SignInForm />
        </div>

        <p className="text-center text-xs text-slate-400 px-4">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-slate-600 transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-slate-600 transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
