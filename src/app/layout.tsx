import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import NextAuthProvider from "../../providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "CompliVox",
  description: "CompliVox - Votre Solution de Soumission / Gestion des Alertes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <NextAuthProvider >
          <div className="dark:bg-slate-800 bg-slate-100">{children}</div>
          <div className="w-full py-2 flex items-center justify-center text-slate-600 dark:text-slate-50">© Powered By CompliRisk</div>
        </NextAuthProvider>
      </ThemeProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </body>
  </html>
  );
}
