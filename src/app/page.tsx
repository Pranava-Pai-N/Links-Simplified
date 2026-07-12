"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Link2,
  Sparkles,
  Copy,
  Check,
  LogOut,
  LogIn,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function SimpleShortener() {
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!session) {
      router.push("/sign-in");
      toast.info("Please login to your account to create short links");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setShortened(
        `${process.env.NEXT_PUBLIC_REDIRECT_URL}/${Math.random().toString(36).substring(2, 7)}`,
      );
      setLoading(false);
    }, 700);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortened);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50/60 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      <header className="z-10 sticky top-0 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={"/"}
            className="font-semibold text-slate-900 tracking-tight"
          >
            Links Simplified
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                {session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="h-8 gap-1.5 text-slate-600 hover:text-rose-600 border-slate-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => router.push("/sign-in")}
              className="h-8 bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm active:scale-[0.98] transition-all"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Button>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-slate-900">
          Short links,{" "}
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            powerful analytics.
          </span>
        </h1>

        <p className="text-slate-500 text-base max-w-md mx-auto mb-10 leading-relaxed">
          A minimalist URL shortener built for developers and fast-moving teams.
          Fast routing, instant setups.
        </p>

        <div className="w-full bg-white border border-slate-200 p-4 rounded-2xl shadow-sm backdrop-blur-sm text-left mb-8">
          <form
            onSubmit={handleShorten}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="url"
              required
              placeholder="Paste your long link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3 h-auto rounded-xl shadow-sm shadow-blue-500/10 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Shortening...
                </>
              ) : (
                "Shorten URL"
              )}
            </Button>
          </form>

          {shortened && (
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="font-mono text-sm font-medium text-blue-600 truncate pr-4">
                {shortened}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8 gap-1.5 text-slate-600 hover:text-slate-900 border-slate-200 bg-white shadow-xs active:scale-[0.97] transition-all whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {session && (
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 group transition-colors"
          >
            Go to dashboard
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </main>
    </div>
  );
}
