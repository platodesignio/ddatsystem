import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DDAT System — Decision Direction Audit Theory",
  description:
    "Zero-PII decision audit infrastructure for detecting whether AI-driven or institutional adverse decisions close future possibility without re-entry, contestability, or human review.",
  openGraph: {
    title: "DDAT System",
    description:
      "Evidence-first infrastructure for auditing the direction of AI and institutional decisions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a1628] text-white">
        {children}
      </body>
    </html>
  );
}
