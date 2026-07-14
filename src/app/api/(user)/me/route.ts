import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        const userEmail = session?.user?.email;

        if (!session || !userEmail) {
            return NextResponse.json({
                success: false,
                status: 401,
                message: "Unauthenticated user"
            })
        }

        const existingUser = await prisma.user.findFirst({
            where: { emailId: userEmail }
        });

        if (!existingUser) {
            return NextResponse.json({
                success: false,
                status: 404,
                message: "User does not exists"
            });
        }

        return NextResponse.json({
            success: true,
            status: 200,
            user: existingUser
        })

    } catch (error) {
        console.log("Error fetching user");
        return NextResponse.json({
            success: false,
            status: 500,
            message: "Error fetching the current user"
        })
    }
}   