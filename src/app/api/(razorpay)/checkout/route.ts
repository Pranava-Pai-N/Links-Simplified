import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import razorpay from "razorpay";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

const instance = new razorpay({
  key_id: process.env.TEST_RAZORPAY_API_KEY!,
  key_secret: process.env.TEST_RAZORPAY_KEY_SECRET!,
});

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Razorpay routes will be added here",
    },
    {
      status: 200,
    },
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not authenticated. Orders cannot be created",
        },
        {
          status: 401,
        },
      );
    }

    const { amount } = body;

    if (!amount || Number(amount) <= 0 || isNaN(Number(amount))) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid amount",
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findFirst({
      where: { emailId: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    const receipt_id = `Receipt-${nanoid(10)}`;

    const razorpayOrder = await instance.orders.create({
      amount: Number(amount),
      currency: "INR",
      receipt: receipt_id,
    });

    await prisma.payments.create({
      data: {
        orderId: razorpayOrder.id,
        amount: Number(amount),
        status: "PENDING",
        receipt: receipt_id,
        paidBy: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          receipt: razorpayOrder.receipt,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Razorpay Order Creation Failed:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize payment order.",
          error: error?.message || "Internal Server Error",
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize payment order.",
          error: "Internal Server Error",
        },
        { status: 500 },
      );
    }
  }
}
