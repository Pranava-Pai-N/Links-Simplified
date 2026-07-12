import { NextResponse } from "next/server";
// import { Prisma } from "@/generated/prisma/client";
// import { nanoid } from "nanoid";

export async function GET() {
  return NextResponse.json({
    status: 200,
    message: "Backend is running correctly",
  });
}

// export async function POST(request: NextRequest) {
//     const body = await request.json();

//     const { originalURL, custom } = body;

//     if (!originalURL) {
//         return NextResponse.json({
//             "status": 400,
//             "success": false,
//             "message": "Please provide an url to shorten"
//         })
//     }

//     let shortId, customDomain, customId, redirectURL;

//     if (customId) {
//         customId = custom,
//         customDomain = true
//         redirectURL = `${process.env.REDIRECT_URL}/${customId}`
//     }
//     else {
//         shortId = nanoid(6);
//         customDomain = false
//         redirectURL = `${process.env.REDIRECT_URL}/${shortId}`
//     }

//     const storage = {
//         shortId,
//         customId,
//         customDomain,
//         originalURL,
//         redirectURL,
//         active : true,
//     }

//     const response = await Prisma.
// }
