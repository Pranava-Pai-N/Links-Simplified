"use client";
import {
  Check,
  ShieldCheck,
  ArrowLeft,
  Globe,
  BarChart,
  Infinity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PremiumPage() {

  const humanFeatures = [
    {
      icon: <Infinity className="h-5 w-5 text-indigo-500" />,
      title: "Create without limits",
      desc: "Shorten as many links as your campaigns demand."
    },
    {
      icon: <Globe className="h-5 w-5 text-emerald-500" />,
      title: "Look professional with your own domain",
      desc: "Replace our brand with yours (e.g., brand.link/slug) to build 34% more trust."
    },
    {
      icon: <BarChart className="h-5 w-5 text-blue-500" />,
      title: "See who's clicking & where",
      desc: "Deep-dive analytics showing countries, devices, and top-referring sites."
    }
  ];


  const handleUpgrade = () => {
    console.log("Initiating billing...");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between p-4 md:p-8 selection:bg-indigo-100 selection:text-indigo-900">

      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4">
        <Link
          href={"/dashboard"}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Safe & secure billing
        </span>
      </header>

      <main className="max-w-4xl w-full mx-auto my-auto py-8 grid md:grid-cols-12 gap-8 items-center">

        <div className="md:col-span-7 space-y-8 pr-0 md:pr-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
              You're growing!
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Ready to take your links to the next level?
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed">
              Hitting your free cap is a great sign - it means your audience is responding. Upgrade today to keep that momentum going strong.
            </p>
          </div>

          <div className="space-y-6">
            {humanFeatures.map((feat, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0 flex items-center justify-center">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 relative w-full">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-15"></div>

          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">
                Premium Monthly
              </h3>
              <p className="text-xs text-slate-400">
                Best for creators, side-hustlers, and growing teams.
              </p>
            </div>

            <div className="flex items-baseline gap-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-4xl font-extrabold text-slate-950">500</span>
              <span className="text-slate-500 text-sm font-medium">&#8377;month</span>
              <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full">
                Cancel Anytime
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                What's included:
              </p>
              <ul className="space-y-2.5">
                {[
                  "Unlimited Link Creational Power",
                  "Professional Custom Domains",
                  "Geographic & Device Analytics",
                  "Empathetic Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="h-4 w-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Check className="h-2.5 w-2.5 stroke-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={handleUpgrade}
                className="w-full py-6 rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Upgrade My Account
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                Secure payments verified by Razorpay
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default PremiumPage;