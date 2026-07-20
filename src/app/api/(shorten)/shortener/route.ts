import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import inputValidation, { type userInput } from "@/lib/validations/customUrls";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  return NextResponse.json(
    {
      message: "Backend is running correctly",
    },
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);

    const result = inputValidation.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation errors",
          errors: result.error.flatten().formErrors,
        },
        { status: 400 },
      );
    }

    const validatedData: userInput = result.data;

    const { originalURL, custom } = validatedData;

    if (!originalURL) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide an url to shorten",
        },
        { status: 400 },
      );
    }

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { emailId: session?.user?.email },
      select: {
        id: true,
        isPremium: true,
        generatedUrls: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 },
      );
    }

    if (!user.isPremium && user.generatedUrls.length > 0) {
      // Free users can create only 1 link
      return NextResponse.json(
        {
          success: false,
          message:
            "Free limit reached. Upgrade to Premium for unlimited URL creation.",
        },
        { status: 402 },
      ); // Payment Required code
    }

    let shortId: string | null = null;
    let customId: string | null = null;
    let customDomain: boolean = false;
    let redirectURL = "";

    if (custom && custom.trim() !== "") {
      customId = custom;
      customDomain = true;
      redirectURL = `${process.env.REDIRECT_URL}/${customId}`;

      const existingfirst = await prisma.urls.findFirst({
        where: { customId },
      });

      if (existingfirst) {
        return NextResponse.json(
          {
            success: false,
            message: "Custom domain is already taken. Please take a new domain",
          },
          { status: 400 },
        );
      }
    } else {
      shortId = nanoid(6);
      customDomain = false;
      redirectURL = `${process.env.REDIRECT_URL}/${shortId}`;
    }

    const response = await prisma.urls.create({
      data: {
        id: nanoid(12),
        shortId,
        customId,
        customDomain,
        originalURL,
        redirectURL,
        active: true,
        createdBy: user?.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Short URL generated successfully",
        data: response,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to generate shortened URL:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred on the server",
        error,
      },
      { status: 500 },
    );
  }
}
