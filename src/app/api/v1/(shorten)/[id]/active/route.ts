import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { type routeParams } from "../route";

export async function PATCH(_request: NextRequest, { params }: routeParams) {
  try {
    const session = await getServerSession();
    const resolvedParams = await params;

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not permitted to aactivate or deactivate the url",
        },
        { status: 401 },
      );
    }

    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide an id to update the status of shortURL",
        },
        { status: 400 },
      );
    }

    const link = await prisma.urls.findFirst({
      where: { id: id },
      select: {
        active: true,
        user: {
          select: {
            emailId: true,
          },
        },
      },
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
          message:
            "Only authorized link creators hold the permissions required to update this resource",
        },
        { status: 403 },
      );
    }

    const updatedLink = await prisma.urls.update({
      where: { id: id },
      data: {
        active: !link.active,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Link successfully ${updatedLink.active ? "activated" : "deactivated"}.`,
        active: updatedLink.active,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(
      "Error changing the status of the URL. Please try again later",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Error changing the status of the URL. Please try again later",
      },
      {
        status: 500,
      },
    );
  }
}
