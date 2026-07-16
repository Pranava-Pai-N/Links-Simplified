"use client";

import {
  Check,
  ShieldCheck,
  ArrowLeft,
  Globe,
  BarChart,
  Infinity,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Script from "next/script";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function PremiumPage() {
  const [amount, _setAmount] = useState<number>(500);
  const [sdkLoaded, setsdkLoaded] = useState<boolean>(false);
  const orderIdRef = useRef<string | null>(null);
  const [isPremium, setisPremium] = useState<boolean>(false);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userData = await axios.get("/api/me");
        const user = userData.data.user;

        if (user && user.isPremium) {
          const dateNow = new Date();
          const validTill = new Date(user.validTill);
          setisPremium(validTill >= dateNow);
        }
      } catch (error) {
        console.error("Error verifying current plan:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    getUserDetails();
  }, []);

  const humanFeatures = [
    {
      icon: <Infinity className="h-5 w-5 text-indigo-500" />,
      title: "Create without limits",
      desc: "Shorten as many links as your campaigns demand.",
    },
    {
      icon: <Globe className="h-5 w-5 text-emerald-500" />,
      title: "Look professional with your own domain",
      desc: "Replace our brand with yours (e.g., brand.link/slug) to build 34% more trust.",
    },
    {
      icon: <BarChart className="h-5 w-5 text-blue-500" />,
      title: "See who's clicking & where",
      desc: "Deep-dive analytics showing countries, devices, and top-referring sites.",
    },
  ];

  const createOrder = async () => {
    try {
      const orderObject = await axios.post("/api/checkout", {
        amount: amount * 100,
      });

      const id = orderObject.data.order.id;
      orderIdRef.current = id;
      return id;
    } catch (error) {
      console.error(
        "There was a problem creating the order. Try again later:",
        error,
      );
      return null;
    }
  };

  const handleUpgrade = async () => {
    if (!sdkLoaded || !window.Razorpay) {
      toast.info("Razorpay is still loading. Please wait a moment.");
      return;
    }

    if (isPremium) {
      toast.info("You already have an active premium membership!");
      return;
    }

    try {
      let orderId = orderIdRef.current;

      if (!orderId) {
        orderId = await createOrder(); // Create a orderId if not exists
      }

      if (!orderId) {
        toast.error("Failed to initialize transaction. Please try again.");
        return;
      }

      const paymentOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
        amount: amount * 100, // IN PAISE
        currency: "INR",
        name: "Links Simpified - Premium Subscription",
        description:
          "1 Month Premium Plan Upgrade for Links Simplified Service",
        order_id: orderId,

        handler: async function (response: any) {
          try {
            const verifyPayment = await axios.post("/api/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyPayment.data && verifyPayment.data.success) {
              toast.success("Payment has been submitted successfuly");
              orderIdRef.current = null;
              router.push("/dashboard");
            } else {
              toast.error(
                "Payment verification failed. Please check with your bank.",
              );
            }
          } catch (verifyError) {
            console.error("Verification endpoint error:", verifyError);
            toast.error(
              "Unable to verify payment status. Please contact support.",
            );
          }
        },

        prefill: {
          name: "Pranava Pai N",
          email: "pranavpai0309@gmail.com",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzpWindow = new window.Razorpay(paymentOptions);

      rzpWindow.on("payment.failed", function (response: any) {
        const err = response.error || [];

        if (err.reason === "payment_cancelled") {
          toast.warning(
            "Payment cancelled. You can try again whenever you're ready!",
          );
          return;
        }

        toast.error(
          `Payment failed: ${err.description || "Something went wrong"}`,
        );
      });

      rzpWindow.open();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between p-4 md:p-8 selection:bg-indigo-100 selection:text-indigo-900">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setsdkLoaded(true)}
        onError={() => console.log("Error loading the razorpay window.")}
      />
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
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

      <main className="max-w-6xl w-full mx-auto my-auto py-8 grid md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4 space-y-6 md:sticky md:top-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
              You're growing!
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Ready to take your links to the next level?
            </h1>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              Hitting your free cap is a great sign - it means your audience is
              responding. Upgrade today to keep that momentum going strong.
            </p>
          </div>

          <div className="space-y-4">
            {humanFeatures.map((feat, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="p-2 h-9 w-9 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0 flex items-center justify-center">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-6 w-full items-stretch">
          <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-slate-100 rounded-full blur-xl"></div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-lg">
                    Free Tier
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Current Plan
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Essential utilities for getting started.
                </p>
              </div>

              <div className="flex items-baseline gap-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-4xl font-extrabold text-slate-900">
                  &#8377;0
                </span>
                <span className="text-slate-500 text-sm font-medium">
                  /forever
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  What's included:
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Only 1 Link per account",
                    "Standard Custom Domain Support",
                    "Basic Total Click Counter",
                    "No analytics dashboard",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-600"
                    >
                      <div className="h-4 w-4 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 stroke-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Account Status:
              </span>
              {!isPremium ? (
                <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-xl">
                  Standard Tier Active
                </span>
              ) : (
                <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
                  You are our valued premiere customer
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-15"></div>

            <div className="relative h-full bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg">
                      Premium Monthly
                    </h3>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Upgrade Choice
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Best for creators, side-hustlers, and growing teams.
                  </p>
                </div>

                <div className="flex items-baseline gap-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-4xl font-extrabold text-slate-950">
                    &#8377;500
                  </span>
                  <span className="text-slate-500 text-sm font-medium">
                    /month
                  </span>
                  <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full">
                    No Refunds
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Everything in Free, plus:
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Unlimited Link Creational Power",
                      "Professional Custom Domains",
                      "Geographic & Device Analytics",
                      "Access to exclusive features before release",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-600"
                      >
                        <div className="h-4 w-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 stroke-3" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleUpgrade}
                  disabled={isPremium || isLoadingUser}
                  className={`w-full py-6 rounded-2xl font-semibold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${
                    isPremium
                      ? "bg-emerald-600 hover:bg-emerald-600 cursor-not-allowed text-white shadow-emerald-600/10"
                      : "bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-600/10 hover:shadow-indigo-600/20"
                  }`}
                >
                  {isLoadingUser ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying plan...
                    </>
                  ) : isPremium ? (
                    "Active Premium Member"
                  ) : (
                    "Upgrade My Account"
                  )}
                </Button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  Secure payments verified by Razorpay
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PremiumPage;
