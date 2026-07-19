import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  secret_key: string,
) => {
  return crypto
    .createHmac("sha256", secret_key)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not authorized to undertake payments",
        },
        {
          status: 401,
        },
      );
    }
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await request.json();

    const secret_key = process.env.TEST_RAZORPAY_KEY_SECRET;

    if (!secret_key) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please configure your razorpay secret key in the environment",
        },
        {
          status: 404,
        },
      );
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, message: "Missing required payment fields" },
        { status: 400 },
      );
    }

    const signature = generatedSignature(
      razorpayOrderId,
      razorpayPaymentId,
      secret_key,
    );

    if (signature !== razorpaySignature) {
      const _paymentOrder = await prisma.payments.update({
        where: { orderId: razorpayOrderId },
        data: {
          status: "FAILED",
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed, Invalid payment signature",
        },
        { status: 400 },
      );
    }

    const validtillDate = new Date();
    validtillDate.setMonth(validtillDate.getMonth() + 1);

    const paymentOrder = await prisma.payments.update({
      where: { orderId: razorpayOrderId },
      data: {
        status: "SUCCESS",
        gatewayPaymentId: razorpayPaymentId,
        paidAt: new Date(),
        validtill: validtillDate,
      },
    });

    const updateUser = await prisma.user.update({
      where: { emailId: session.user.email },
      data: {
        isPremium: true,
        validTill: validtillDate,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        details: paymentOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error verifying payment details", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error verifying the payment details",
      },
      { status: 500 },
    );
  }
}
