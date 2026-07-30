import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next"

export interface routeParams {
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

      if (!link)
        return null;

      const updated = await tx.urls.update({
        where: { id: link.id },
        data: {
          activeClicks: {
            increment: 1,
          },
        },
      });

      return {
          originalURL : updated.originalURL,
          active : updated.active
      };
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
      destinationUrl = new URL(targetUrl.originalURL);
    } catch {
      destinationUrl = new URL(targetUrl.originalURL, request.nextUrl.origin);
    }

    return NextResponse.json({ originalURL: destinationUrl.toString(), active : targetUrl.active });
  } catch (error: any) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}


export async function DELETE(_request : NextRequest, { params }: routeParams) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not permitted to delete the url",
        },
        { status: 401 },
      );
    }


    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide an id to delete the shortURl",
        },
        { status: 400 },
      );
    }

    const link = await prisma.urls.findFirst({
      where: { id: id },
      select: {
        user: true
      }
    });

    if (!link) {
      return NextResponse.json(
        {
          success: false,
          message: "The link does not exists or has been removed.",
        },
        { status: 400 },
      );
    }

    if (link.user.emailId !== session.user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Only authorized link creators hold the permissions required to delete this resource",
        },
        { status: 403 },
      );
    }

    await prisma.urls.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: "Url deleted successfully"
    }, {
      status: 200
    });

  } catch (error) {
    console.log("Error eleting the URL. Please try again later", error);

    return NextResponse.json({
      success: false,
      message: "Error eleting the URL. Please try again later"
    }, {
      status: 500
    })
  }

}