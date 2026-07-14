"use client";

import React, { useEffect, useState } from "react";
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
  originalURL: string;
  redirectURL: string;
  customId: string | null;
  shortId: string | null;
  activeClicks: number;
  createdAt: string;
  active: boolean;
  customDomain: boolean;
}

export default function ShortenerDashboard() {
  const { data: session, status } = useSession();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [urlInput, setUrlInput] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const [links, setLinks] = useState<ShortLink[]>([]);

  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  const getUserLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/analytics");

      if (response.data && response.data.createdurls) {
        const allUrls = response.data.createdurls.flatMap(
          (item: any) => item.generatedUrls || []
        );
        console.log(allUrls)
        setLinks(allUrls);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
      toast.error("Failed to load your shortened URLs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLinks();
  }, []);

  const handleToggleCreateForm = () => {
    if (!isCreateOpen && links.length >= 1) {
      setShowPremiumPrompt(true);
      setIsCreateOpen(false);
    } else {
      setShowPremiumPrompt(false);
      setIsCreateOpen(!isCreateOpen);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput)
      return;

    if (links.length >= 1) {
      setShowPremiumPrompt(true);
      return;
    }

    setIsSubmitting(true);
    try {
      setLoading(true);
      await axios.post("/api/shortener", {
        originalURL: urlInput,
        custom: customDomain,
      });

      setUrlInput("");
      setCustomDomain("");
      setIsCreateOpen(false);
      toast.success("Link shortened successfully!");

      getUserLinks();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`${error?.response?.data?.message}`);
      }
      else {
        toast.error(`Failed to create short link.`);
      }

    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleUpgradeToPremium = () => {
    toast.info("Redirecting to billing provider portal...");
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

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
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
            onClick={handleToggleCreateForm}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            Shorten Link
          </Button>
        </div>

        {showPremiumPrompt && (
          <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-xl shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                Free Tier Reached
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                You have reached your tier usage restrictions. Upgrade to Premium Plan to build unlimited URLs, map brand domains, and access real-time geo-analytics tracking telemetry.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPremiumPrompt(false)}
                className="text-slate-500 text-xs w-1/2 sm:w-auto"
              >
                Dismiss
              </Button>
              <Link
                href={"/premium"}
                onClick={handleUpgradeToPremium}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5 font-medium shadow-sm w-1/2 sm:w-auto"
              >
                Upgrade for &#8377;500/mo
              </Link>
            </div>
          </div>
        )}

        {isCreateOpen && !showPremiumPrompt && (
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
                    placeholder="https://very-long-destination-url.com/path/slug"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Custom Alias / Slug (Optional)
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
          {loading && links.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : links.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center bg-white">
              <Link2 className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-medium text-slate-700">
                No shortened paths yet
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Click the button above to shorten your first long tracking link.
              </p>
            </div>
          ) : (
            links.map((link) => {
              const displaySlug = link.customId || link.shortId || "Default Alias";
              const formattedDate = new Date(link.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={link.id}
                  className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-blue-600 text-sm hover:underline cursor-pointer">
                        {displaySlug}
                      </span>
                      <span className="text-slate-300 text-xs">|</span>
                      <span
                        className="text-xs font-medium text-slate-400 truncate max-w-xs sm:max-w-md"
                        title={link.originalURL}
                      >
                        {link.originalURL}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {link.activeClicks} {link.activeClicks === 1 ? "click" : "clicks"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                      {!link.active && (
                        <span className="bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(link.redirectURL, link.id)}
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
                    <a href={link.redirectURL} target="_blank" rel="noreferrer">
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