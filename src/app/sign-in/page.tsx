import SignInForm from "@/components/(auth)/signinForm";

export default function Page() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)'
        }}
      />

      <div className="relative w-full max-w-100 space-y-6 z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 max-w-[320px]">
            Sign in with your preferred provider to access your workspace.
          </p>
        </div>

        <div className="bg-white/80 p-8 rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
          <SignInForm />
        </div>

        <p className="text-center text-xs text-slate-400 leading-relaxed max-w-[320px] mx-auto px-4">
          By clicking continue, you authorize sharing your account profile information.
        </p>
      </div>
    </div>
  );
}