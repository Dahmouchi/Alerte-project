/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import QRCode from "qrcode";
import speakeasy from "speakeasy";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { saveQr, UserInfo } from "@/actions/alertActions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: any }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const user = await UserInfo(id);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // If the user already has a twoFactorSecret, return an error
    if (user.twoFactorSecret) {
      return new Response(JSON.stringify({ error: "2FA already enabled" }), {
        status: 400,
      });
    }

    const secret = user.qrSecret;
    let qrCodeData;

    if (secret) {
      // If qrSecret exists, generate QR from it
      const otpauth_url = `otpauth://totp/CompliRisk?secret=${secret}&issuer=CompliRisk`;
      qrCodeData = await QRCode.toDataURL(otpauth_url);
    } else {
      // If no qrSecret, generate a new one and store it

      const secret = speakeasy.generateSecret({
        name: "CompliRisk",
      });

      if (secret.otpauth_url) {
        qrCodeData = await QRCode.toDataURL(secret.otpauth_url);
        
        await saveQr(user.id, secret.base32);
      } else {
        return new Response(JSON.stringify({ error: "2FA already enabled" }), {
          status: 401,
        });
      }
    }

    return new Response(
      JSON.stringify({ data: qrCodeData, secret, status: 200 }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
