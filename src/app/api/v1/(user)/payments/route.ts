import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not authenticated.",
        },
        { status: 401 },
      );
    }

    const paymentDetails = await prisma.user.findMany({
      where: { emailId: session.user.email },
      select: {
        payments: true,
      },
    });

    if (!paymentDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment details not found. Please try again later",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment details retrieved successfully",
        details: paymentDetails,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Error fetching users payment history", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error.",
      },
      { status: 500 },
    );
  }
}
