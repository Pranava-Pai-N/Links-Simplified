import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface routeParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: routeParams) {
  try {
    const resolvedParams = await params;

    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide an id to redirect to large url",
        },
        { status: 400 },
      );
    }

    const urlId = Array.isArray(id) ? id[0] : id;

    const targetUrl = await prisma.$transaction(async (tx) => {
      const link = await tx.urls.findFirst({
        where: {
          OR: [{ customId: urlId }, { shortId: urlId }],
        },
      });

      if (!link) return null;

      const updated = await tx.urls.update({
        where: { id: link.id },
        data: {
          activeClicks: {
            increment: 1,
          },
        },
      });

      return updated.originalURL;
    });

    if (!targetUrl) {
      return NextResponse.json(
        {
          status: 404,
          success: false,
          message: "The link was not found. Please try with another link",
        },
        { status: 404 },
      );
    }

    let destinationUrl: URL;

    try {
      destinationUrl = new URL(targetUrl);
    } catch {
      destinationUrl = new URL(targetUrl, request.nextUrl.origin);
    }

    return NextResponse.json({ originalURL: destinationUrl });
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
