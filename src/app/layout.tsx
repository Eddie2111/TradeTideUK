import localFont from "next/font/local";
import NextHead from "@/components/common/metaData";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Providers } from "./providers";

import { APP_DESCRIPTION, APP_KEYWORDS } from "@/constants/app.constant";
import { ThemeProvider } from "@/components/common/theme-provider";

import SiteHeader from "@/components/common/site-header";
import SiteFooter from "@/components/common/site-footer";

import "./globals.css";
import type { Metadata } from "next";

export const revalidate = 60;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata: Metadata = NextHead({
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <SessionProvider>
        <Providers>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
            </ThemeProvider>
            <Toaster />
          </body>
        </Providers>
      </SessionProvider>
    </html>
  );
}
