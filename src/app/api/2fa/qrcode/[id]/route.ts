/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import QRCode from "qrcode";
import speakeasy from "speakeasy";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { saveQr } from "@/actions/alertActions";
import { UserInfo } from "@/actions/user";

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
  
    if (user.twoFactorSecret) {
      return new Response(JSON.stringify({ error: "2FA already enabled" }), {
        status: 400,
      });
    }
  
    let base32Secret = user.qrSecret;
    let qrCodeData;
  
    if (base32Secret) {
      // QR already stored
      const otpauth_url = `otpauth://totp/CompliRisk:${user.username}?secret=${base32Secret}&issuer=CompliRisk`;
      qrCodeData = await QRCode.toDataURL(otpauth_url);
    } else {
      // Generate new secret
      const secret = speakeasy.generateSecret({
        name: `CompliRisk:${user.username}`,
      });
  
      if (!secret.otpauth_url || !secret.base32) {
        return new Response(JSON.stringify({ error: "Failed to generate secret" }), {
          status: 500,
        });
      }
  
      qrCodeData = await QRCode.toDataURL(secret.otpauth_url);
      base32Secret = secret.base32;
      await saveQr(user.id, base32Secret);
    }
  
    return new Response(
      JSON.stringify({ data: qrCodeData, secret: base32Secret, status: 200 }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
  
}
