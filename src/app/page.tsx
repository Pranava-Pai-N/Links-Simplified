"use client";

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SimpleShortener() {
  const [url, setUrl] = useState('');
  const [shortened, setShortened] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!session) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setShortened(`lnkr.io/${Math.random().toString(36).substring(2, 7)}`);
      setLoading(false);
    }, 700);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortened);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a2540] text-white font-sans antialiased selection:bg-[#635bff]">

      <div className="absolute inset-x-0 top-0 z-0 h-125 -skew-y-6 origin-top-left overflow-hidden bg-linear-to-br from-[#635bff] to-[#0a2540] opacity-20" />

      <div className="absolute top-6 right-6 z-20 flex items-center gap-4 text-xs">
        {status === "loading" ? (
          <span className="text-slate-400">···</span>
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-mono hidden sm:inline">{session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-3 py-1.5 rounded transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/sign-in")}
            className="bg-[#635bff] hover:bg-[#7a73ff] font-medium text-white px-3.5 py-1.5 rounded transition-colors shadow-sm"
          >
            Login
          </button>
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 pt-28 pb-16 text-center">

        <div className="inline-flex items-center gap-2 mb-8 font-semibold text-lg tracking-tight">
          <span className="h-4 w-4 rounded-sm bg-linear-to-tr from-[#00d4ff] to-[#635bff]" />
          <span>linkr</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-white">
          Short links, <span className="text-[#00d4ff]">powerful analytics.</span>
        </h1>
        <p className="text-[#adbdcc] text-base max-w-md mx-auto mb-10 leading-relaxed">
          A minimalist URL shortener built for developers and fast-moving teams. Fast routing, instant setups.
        </p>

        <div className="bg-[#102a43] border border-[#243b53] rounded-xl p-4 shadow-2xl text-left mb-16">
          <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              required
              placeholder="Paste your long link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-[#07192e] border border-[#243b53] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#635bff] transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#635bff] hover:bg-[#7a73ff] active:scale-[0.98] text-white font-medium text-sm px-6 py-3 rounded-lg transition-all whitespace-nowrap disabled:opacity-50"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          {shortened && (
            <div className="mt-3 bg-[#07192e] border border-[#1b365d] rounded-lg p-3 flex items-center justify-between animate-fadeIn">
              <span className="font-mono text-sm text-[#00d4ff] truncate pr-4">{shortened}</span>
              <button
                onClick={handleCopy}
                className="text-xs font-semibold bg-[#243b53] hover:bg-[#334e68] text-white px-3 py-1.5 rounded transition-colors whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}