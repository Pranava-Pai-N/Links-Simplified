import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const createdurls = await prisma.user.findMany({
            where: {
                emailId: session.user.email
            },
            select: {
                generatedUrls: true
            }
        })

        if (!createdurls || createdurls.length === 0) {
            return NextResponse.json(
                { success: false, message: "No active urls found. Please create a short url first" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Urls retrieved successfully", createdurls },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to fetch user analytics:", error);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred on the server", error },
            { status: 500 }
        );
    }
}