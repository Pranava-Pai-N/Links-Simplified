"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { type User } from "@/lib/types/user";

export default function Footer() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/me");
        console.log(response.data.user);
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-white py-6 mt-auto">
      <div className="max-w-7xl w-full mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-900">
          <span>Links Simplified</span>
          <span className="text-slate-200 font-normal" aria-hidden="true">
            |
          </span>
          <span className="text-xs font-normal text-slate-500">
            &copy; {currentYear} All Rights Reserved
          </span>
        </div>

        <div className="flex items-center gap-4 font-medium">
          <Link
            href="https://github.com/Pranava-Pai-N/Links-Simplified/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-800 transition-colors"
          >
            GitHub Support
          </Link>

          <span className="text-slate-300" aria-hidden="true">
            •
          </span>

          {(!user?.isPremium || user === null) && (
            <Link
              href="/premium"
              className="text-indigo-600 hover:text-indigo-700 transition-colors tracking-wide font-semibold"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
