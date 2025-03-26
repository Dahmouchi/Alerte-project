// lib/2fa.ts
import { authenticator } from "otplib";
import QRCode from "qrcode";

export function generateTwoFactorSecret(email: string) {
  const secret = authenticator.generateSecret();
  const serviceName = "YourAppName";
  const otpAuthUrl = authenticator.keyuri(email, serviceName, secret);
  return { secret, otpAuthUrl };
}

export async function generateQRCode(otpAuthUrl: string) {
  try {
    return await QRCode.toDataURL(otpAuthUrl);
  } catch (err) {
    console.error("Error generating QR code", err);
    throw err;
  }
}

export function verifyToken(token: string, secret: string) {
  return authenticator.verify({ token, secret });
}
