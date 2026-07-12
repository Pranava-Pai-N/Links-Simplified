"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      variant="outline"
      className="relative w-full max-w-sm gap-2 font-medium border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
          Signing with Google.
        </>
      ) : (
        <>
          <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
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
          Continue with Google
        </>
      )}
    </Button>
  );
}
