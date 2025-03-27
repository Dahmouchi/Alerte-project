/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupTwoFactor() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch QR code on component mount
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const res = await fetch("/api/2fa/setup", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          setQrCode(data.qrCodeDataUrl);
        } else {
          setError(data.error || "Failed to load QR code.");
        }
      } catch (err) {
        setError("An error occurred while fetching QR code.");
      }
    };
    fetchQRCode();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to verify token.");
      } else {
        // Successful verification; redirect user (or update session as needed)
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4">Enable Two-Factor Authentication</h1>
      {qrCode ? (
        <img src={qrCode} alt="2FA QR Code" className="mb-4" />
      ) : (
        <p>Loading QR Code...</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block font-medium">
            Enter the 6-digit code from your authenticator:
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="123456"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Verifying..." : "Verify & Enable 2FA"}
        </button>
      </form>
    </div>
  );
}
