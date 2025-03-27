import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { secret, token, userId } = await req.json();

        if (!userId || !secret || !token) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

       
        // Update the user's 2FA secret
        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: "encryptedSecret", twoFactorEnabled: true },
        });

        return new Response(JSON.stringify({ success: true, message: "2FA enabled successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error updating 2FA secret:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}


