"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 tracking-tight text-sm">
            Links Simplified
          </span>
        </div>

        <p className="text-xs text-slate-400 flex items-center gap-1 order-3 md:order-2">
          &copy; {currentYear} Links Simplified. Built with
          <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline mx-0.5" />
          for a simplifying urls.
        </p>

        <div className="flex items-center gap-6 order-2 md:order-3">
          <div className="flex gap-4 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors">
              Privacy
            </Link>
            <Link href="/" className="hover:text-slate-800 transition-colors">
              Terms
            </Link>
            <Link
              href="/premium"
              className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              Premium
            </Link>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
        </div>
      </div>
    </footer>
  );
}
