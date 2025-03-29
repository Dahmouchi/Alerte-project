import { UserInfo } from "@/actions/alertActions";
import { getServerSession } from "next-auth";
import QRCode from "qrcode";
import speakeasy from "speakeasy";

export async function GET() {
  try {
    const session = await getServerSession();

    if (session) {
      const userId = session.user.id;
      // Fetch user data
      const user = await UserInfo(userId);

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
        } else {
          return new Response(
            JSON.stringify({ error: "2FA already enabled" }),
            { status: 401 }
          );
        }
      }

      return new Response(
        JSON.stringify({ data: qrCodeData, secret, status: 200 }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error generating QR code:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
