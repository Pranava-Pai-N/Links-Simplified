"use client";

import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LinkAnalytics() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!id || id === "undefined") return;

      try {
        setLoading(true);
        const response = await axios.post(`/api/${id}`);

        if (response.data?.originalURL) {
          window.location.href = response.data.originalURL;
        } else {
          setError("Destination URL not found.");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Redirect failed:", err);
        setError(
          err.response?.data?.error || "This link is broken or has expired.",
        );
        setLoading(false);
      }
    };

    handleRedirect();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Redirecting you...
          </h2>
          <p className="text-sm text-slate-500">
            Hold tight, we are routing to your destination safely.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Link Unavailable
            </h2>
            <p className="text-sm text-slate-500 mt-2">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition-all"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
