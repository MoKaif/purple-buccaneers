import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Purple Buccaneers - Admin Dashboard",
  description: "Admin dashboard for managing Purple Buccaneers fantasy league",
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  userScalable: true,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
