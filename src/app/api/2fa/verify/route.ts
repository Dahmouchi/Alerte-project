import { NextRequest } from "next/server";
import speakeasy from "speakeasy";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { secret, token, userId } = await req.json();

        if (!userId || !secret || !token) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }


        // If the user is logged in, get their ID from the session

        // Verify TOTP
        const isVerified = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token,
            window: 1, // Allow slight time drift
        });

        if (!isVerified) {
            return new Response(JSON.stringify({ error: "Invalid 2FA code" }), { status: 401 });
        }

        // Encrypt the secret before storing it (replace this with real encryption)
        const encryptedSecret = await encrypt(secret);

        // Update the user's 2FA secret
        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: encryptedSecret},
        });

        return new Response(JSON.stringify({ success: true, message: "2FA enabled successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error updating 2FA secret:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}


async function encrypt(secret: string): Promise<string> {
    return secret; // Implement actual encryption before storing in the database
}
