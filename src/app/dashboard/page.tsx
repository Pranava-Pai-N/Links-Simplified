"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Link2,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  BarChart3,
  Calendar,
  Crown,
  IndianRupeeIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShortLink } from "@/lib/types/shortLink";
import { type User } from "@/lib/types/user";
import React, { useEffect, useState } from "react";

export default function ShortenerDashboard() {
  const { data: session, status } = useSession();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user_details, setUser_details] = useState<User | null>(null);
  const [isPremiumUser, setisPremiumUser] = useState<boolean>(false);

  const [urlInput, setUrlInput] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const [links, setLinks] = useState<ShortLink[]>([]);

  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  const fetchDashBoardData = async () => {
    try {
      setLoading(true);

      const [analyticsRes, userRes] = await Promise.all([
        axios.get("/api/links"),
        axios.get("/api/me"),
      ]);

      if (analyticsRes.data?.createdurls) {
        const allUrls = analyticsRes.data.createdurls.flatMap(
          (item: any) => item.generatedUrls || [],
        );
        setLinks(allUrls);
      }

      if (userRes.data?.user) {
        const user = userRes.data?.user;
        setUser_details(user);

        if (user && user.isPremium) {
          const today = new Date();
          const validTill = new Date(user.validTill);

          setisPremiumUser(validTill >= today);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashBoardData();
  }, []);

  const handleToggleCreateForm = () => {
    if (!isPremiumUser && !isCreateOpen && links.length >= 1) {
      setShowPremiumPrompt(true);
      setIsCreateOpen(false);
    } else {
      setShowPremiumPrompt(false);
      setIsCreateOpen(!isCreateOpen);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    if (!isPremiumUser && links.length >= 1) {
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

      fetchDashBoardData();
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`${error?.response?.data?.message}`);
      } else {
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

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Links
            </h1>
            {isPremiumUser && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                <Crown className="h-2.5 w-2.5 fill-amber-500/10 stroke-[2.5]" />
                Pro User
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 max-w-md leading-relaxed">
            Manage, track, and deploy your shortened routing rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!isPremiumUser && (
            <Link
              href="/premium"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border border-amber-200/60 dark:border-amber-500/20 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 text-amber-800 dark:text-amber-400 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-950/30 dark:hover:to-orange-950/30 hover:scale-[1.02] active:scale-[0.98] shadow-xs transition-all duration-200"
            >
              <Crown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 fill-amber-500/10 stroke-[2.5]" />
              Go Premium
            </Link>
          )}

          <Link
            href="/payments"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-[1.02] active:scale-[0.98] shadow-xs transition-all duration-200"
          >
            <IndianRupeeIcon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            View Payments
          </Link>

          <Button
            onClick={handleToggleCreateForm}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl shadow-xs hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Shorten Link
          </Button>
        </div>

        {!isPremiumUser && (
          <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-xl shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                Free Tier Reached
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                You have reached your tier usage restrictions. Upgrade to
                Premium Plan to build unlimited URLs, map brand domains, and
                access real-time geo-analytics tracking telemetry.
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
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5 font-medium shadow-sm w-1/2 sm:w-auto flex items-center justify-center py-2 px-3 rounded-md"
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
              const displaySlug =
                link.customId || link.shortId || "Default Alias";
              const formattedDate = new Date(link.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              );

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
                        {link.activeClicks}{" "}
                        {link.activeClicks === 1 ? "click" : "clicks"}
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
