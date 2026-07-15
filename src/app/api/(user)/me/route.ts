import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const userEmail = session?.user?.email;

    if (!session || !userEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated user",
        },
        { status: 401 },
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { emailId: userEmail },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exists",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: existingUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error fetching user");
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching the current user",
      },
      { status: 500 },
    );
  }
}
