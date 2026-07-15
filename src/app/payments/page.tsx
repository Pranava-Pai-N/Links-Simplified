"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Loader2,
  MoveLeftIcon,
} from "lucide-react";
import { type Payment } from "@/lib/types/payments";
import Link from "next/link";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const handleUserPaymentDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/payments");

        if (response.data?.success && response.data?.details) {
          const extractedPayments = response.data.details.flatMap(
            (item: { payments: Payment[] }) => item.payments || [],
          );
          setPayments(extractedPayments);
        }
      } catch (error) {
        console.error("Error fetching user payment details:", error);
        toast.error(
          "Error fetching user payment details. Please try again later",
        );
      } finally {
        setLoading(false);
      }
    };

    handleUserPaymentDetails();
  }, []);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.receipt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatCurrency = (amount: number, currency: string) => {
    const divisor = currency.toUpperCase() === "INR" ? 100 : 100;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount / divisor);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Success
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard"
              className="group flex items-center justify-center p-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              aria-label="Back to dashboard"
            >
              <MoveLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Payment History
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                View, search, and manage your billing transactions.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 w-40 shadow-sm">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                Total Paid
              </span>
              <span className="text-2xl font-bold mt-1 block text-slate-900 dark:text-slate-50 tracking-tight">
                {formatCurrency(
                  payments.reduce(
                    (acc, p) => (p.status === "SUCCESS" ? acc + p.amount : acc),
                    0,
                  ),
                  payments[0]?.currency || "INR",
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by receipt or Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="text-xs text-slate-500">
            Showing {filteredPayments.length} of {payments.length} transactions
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center min-h-75 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm text-slate-500">
                Fetching your transaction details...
              </p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-75">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <CreditCard className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-lg">No payments found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? "No transactions match your search filter."
                  : "You haven't made any transactions yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 font-medium">
                    <th className="px-6 py-4">Receipt & Order</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4">Paid On</th>
                    <th className="px-6 py-4">Valid Until</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPayments.map((payment, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {payment.receipt}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                          Order: {payment.orderId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {payment.provider}
                        <span className="block text-xs font-mono text-slate-400">
                          {payment.gatewayPaymentId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {new Date(payment.paidAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {new Date(payment.validtill).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(payment.amount, payment.currency)}
                        </div>
                        {payment.hostedInvoiceUrl && (
                          <a
                            href={payment.hostedInvoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 font-medium mt-1"
                          >
                            Invoice <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
