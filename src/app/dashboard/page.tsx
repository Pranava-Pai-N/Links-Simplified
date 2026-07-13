"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Link2,
  Plus,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  Loader2,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";

interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

export default function ShortenerDashboard() {
  const { data: session, status } = useSession();
  console.log(session)

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [urlInput, setUrlInput] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const [links, setLinks] = useState<ShortLink[]>([
    {
      id: "1",
      originalUrl: "https://github.com/pranava-pai-n/nextjs-starter",
      shortCode: "git-start",
      clicks: 142,
      createdAt: "2026-07-10",
    },
  ]);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) 
      return;

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/shortener", {
        originalURL: urlInput,
        custom: customDomain,
        userId: session?.user?.email
      }, { withCredentials: true });
      console.log(response);

      setUrlInput("");
      setCustomDomain("");
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Failed to shorten link:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard successfully");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const user = session?.user;
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "p.ai";

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={"/"}
            className="font-semibold text-slate-900 tracking-tight"
          >
            Links Simplified
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">
                {user.name || "Developer"}
              </p>
              <p className="text-xs text-slate-500 truncate max-w-45">
                {user.email}
              </p>
            </div>
            {user.image ? (
              <img
                src={user.image}
                alt="User Avatar"
                className="h-8 w-8 rounded-full border border-slate-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
            )}
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
                toast.success("Logged out successfully. See you soon.");
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Your Links
            </h1>
            <p className="text-sm text-slate-500">
              Manage, track, and deploy your shortened routing rules.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            Shorten Link
          </Button>
        </div>

        {isCreateOpen && (
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Shorten a new destination URL
            </h3>
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Destination URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://very-long-destination-url.com/path/slug?param=true"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Custom Domain (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="promo-2026"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-slate-500"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Generate Link"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {links?.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center bg-white">
              <Link2 className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-medium text-slate-700">
                No shortened paths yet
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Click the button above to shorten your first long tracking link
                parameters.
              </p>
            </div>
          ) : (
            links?.map((link) => {
              const fullShortUrl = `${baseUrl}/${link.shortCode}`;
              return (
                <div
                  key={link.id}
                  className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-blue-600 text-sm hover:underline cursor-pointer">
                        {link.shortCode}
                      </span>
                      <span className="text-slate-300 text-xs">|</span>
                      <span
                        className="text-xs font-medium text-slate-400 truncate max-w-xs sm:max-w-md"
                        title={link.originalUrl}
                      >
                        {link.originalUrl}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {link.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(fullShortUrl, link.id)}
                      className="h-8 gap-1.5 text-slate-600 hover:text-slate-900 border-slate-200 active:scale-[0.97] transition-all"
                    >
                      {copiedId === link.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                    <a href={link.originalUrl} target="_blank" rel="noreferrer">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-600 border-slate-200"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
