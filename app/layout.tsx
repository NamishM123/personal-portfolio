import type { Metadata } from "next";
import { Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Namish Mannepalli — An essay in code",
  description:
    "The portfolio of Namish Mannepalli: a full-stack developer and cybersecurity researcher at Cal Poly SLO, writing software like a long letter.",
  keywords: ["Namish Mannepalli", "portfolio", "developer", "Cal Poly", "React", "Next.js", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
