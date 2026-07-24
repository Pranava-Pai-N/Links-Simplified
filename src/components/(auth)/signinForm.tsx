"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type AuthProvider = "google" | "github";

export default function SignInForm() {
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(
    null,
  );

  const handleSignIn = async (provider: AuthProvider) => {
    try {
      setLoadingProvider(provider);
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(`Sign-in with ${provider} failed:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  const isAnyLoading = loadingProvider !== null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <Button
        onClick={() => handleSignIn("google")}
        disabled={isAnyLoading}
        variant="outline"
        className="relative w-full h-11 px-4 gap-2.5 font-medium border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all duration-150 rounded-xl"
      >
        {loadingProvider === "google" ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
            <span>Connecting to Google...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.95 11.95 0 0 0 12 0C7.023 0 2.743 2.857.655 7.018l4.61 2.747z"
              />
              <path
                fill="#4285F4"
                d="M23.455 12.273c0-.818-.073-1.609-.209-2.373H12v4.5h6.418a5.483 5.483 0 0 1-2.382 3.591v2.982h3.845c2.254-2.073 3.573-5.127 3.573-8.7z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235L.655 16.982A11.95 11.95 0 0 0 12 24c3.245 0 5.973-1.073 7.964-2.918l-3.845-2.982c-1.091.732-2.491 1.164-4.118 1.164-3.173 0-5.864-2.145-6.818-5.027z"
              />
              <path
                fill="#34A853"
                d="M12 4.909c-3.173 0-5.864 2.145-6.818 5.027l4.61 2.747a7.077 7.077 0 0 1 6.818-5.027z"
              />
            </svg>
            <span>Continue with Google</span>
          </div>
        )}
      </Button>

      <div className="relative flex items-center py-1">
        <div className="grow border-t border-slate-100"></div>
        <span className="shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
          or
        </span>
        <div className="grow border-t border-slate-100"></div>
      </div>

      <Button
        onClick={() => handleSignIn("github")}
        disabled={isAnyLoading}
        className="relative w-full h-11 px-4 gap-2.5 font-medium bg-[#181717] text-white hover:bg-[#2c2b2b] border border-transparent shadow-sm active:scale-[0.98] transition-all duration-150 rounded-xl"
      >
        {loadingProvider === "github" ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-white/70" />
            <span>Connecting to GitHub...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            <span>Continue with GitHub</span>
          </div>
        )}
      </Button>
    </div>
  );
}
