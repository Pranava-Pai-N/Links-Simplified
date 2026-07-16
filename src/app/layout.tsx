import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/footer";
import NavBar from "@/components/common/navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "URL Shortener",
  description:
    "Links Simplified is a production-style URL shortener built with Next.js, Prisma, NextAuth, and PostgreSQL. It is designed to feel like a real SaaS product with authentication, link management, premium upgrades, and payment integration.",
  icons: {
    icon: "/url.svg",
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
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Toaster
            richColors
            theme="dark"
            position="top-right"
            duration={3000}
          />
          <NavBar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
