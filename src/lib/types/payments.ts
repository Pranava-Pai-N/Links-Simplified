export interface Payment {
  orderId: string;
  gatewayPaymentId: string;
  provider: string;
  amount: number;
  currency: string;
  status: "SUCCESS" | "PENDING" | "FAILED" | string;
  hostedInvoiceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string;
  validtill: string;
  receipt: string;
  paidBy: string;
}
