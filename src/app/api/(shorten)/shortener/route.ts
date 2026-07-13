import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid";

export async function GET() {
  return NextResponse.json({
    status: 200,
    message: "Backend is running correctly",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { originalURL, custom, userId } = body;

    if (!originalURL) {
      return NextResponse.json({
        "status": 400,
        "success": false,
        "message": "Please provide an url to shorten"
      })
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    let shortId: string | null = null;
    let customId: string | null = null;
    let customDomain: boolean = false;
    let redirectURL = "";

    if (custom && custom.trim() !== "") {
      customId = custom,
        customDomain = true
      redirectURL = `${process.env.REDIRECT_URL}/${customId}`

      const existingfirst = await prisma.urls.findFirst({
        where: { customId }
      });

      if (existingfirst) {
        return NextResponse.json(
          { success: false, message: "Custom domain is already taken. Please take a new domain" },
          { status: 400 }
        );
      }

    }
    else {
      shortId = nanoid(6);
      customDomain = false
      redirectURL = `${process.env.REDIRECT_URL}/${shortId}`
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
        createdBy: userId
      }
    });

    return NextResponse.json(
      { success: true, message: "Short URL generated successfully", data: response },
      { status: 201 }
    );

  } catch (error) {
    console.error("Failed to generate shortened URL:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred on the server", error },
      { status: 500 }
    );
  }
}
